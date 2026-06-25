import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email dan password harus diisi!');
      return;
    }
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-mark"><Boxes size={20} /></span>
          <h1>Inventaris</h1>
          <p>Selamat datang kembali</p>
        </div>

        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {!loading && <LogIn size={16} />}
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
