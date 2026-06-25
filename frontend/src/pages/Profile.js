import React, { useState } from 'react';
import { Calendar, Pencil, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }
    if (form.password && form.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }
    try {
      setLoading(true);
      const updates = { name: form.name };
      if (form.password) updates.password = form.password;
      await authService.updateProfile(updates);
      setSuccess('Profil berhasil diperbarui!');
      setForm({ ...form, password: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profil Saya</h1>
        <p>Kelola informasi akun dan keamanan kamu.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Info Card */}
        <div className="card" style={{ minWidth: '240px' }}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '72px', height: '72px', background: 'var(--ink)', color: 'white',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: '700', margin: '0 auto 1rem'
            }}>
              {initials}
            </div>
            <h3 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user?.email}</p>
            <span className="badge badge-info" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
              {user?.role || 'user'}
            </span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={14} /> Bergabung</p>
            <p style={{ fontWeight: '600', color: 'var(--text)', marginTop: '0.3rem' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Pencil size={16} /> Edit Profil
          </h2>

          {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}
          {success && <div className="alert alert-success"><CheckCircle2 size={16} /> {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email} disabled style={{ background: '#F3F4F6', cursor: 'not-allowed' }} />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Email tidak dapat diubah</small>
            </div>

            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap" />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.25rem 0' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} /> Kosongkan jika tidak ingin mengubah password
            </p>

            <div className="form-group">
              <label>Password Baru</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password baru (opsional)" />
            </div>

            <div className="form-group">
              <label>Konfirmasi Password Baru</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Ulangi password baru" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'auto', minWidth: '180px' }}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
