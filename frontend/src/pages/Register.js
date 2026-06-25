import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Semua field harus diisi!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }
    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
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
          <p>Buat akun baru</p>
        </div>

        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              name="name"
              placeholder="Nama lengkap kamu"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Ulangi password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {!loading && <UserPlus size={16} />}
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
