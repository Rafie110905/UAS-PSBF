import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, BarChart3, AlertTriangle, Wallet, ClipboardList, Inbox, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll()
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter(p => p.stock <= 5).length;

  const stats = [
    { icon: <Package size={20} />, label: 'Total Produk', value: products.length, bg: '#E4F2EF', fg: '#0F6B5C' },
    { icon: <BarChart3 size={20} />, label: 'Total Stok', value: totalStock, bg: '#E7F5EE', fg: '#0C6B47' },
    { icon: <AlertTriangle size={20} />, label: 'Stok Menipis', value: lowStock, bg: '#FCF1E3', fg: '#92400E' },
    { icon: <Wallet size={20} />, label: 'Nilai Inventori', value: `Rp ${totalValue.toLocaleString('id-ID')}`, bg: '#EFEAF8', fg: '#5B3FA8' },
  ];

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Halo, {user?.name?.split(' ')[0]}</h1>
        <p>Selamat datang di dashboard. Berikut ringkasan data kamu.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: stat.bg, color: stat.fg }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{loading ? '—' : stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="table-container">
        <div className="table-header">
          <h2><ClipboardList size={16} style={{ marginRight: '0.4rem', verticalAlign: '-3px' }} />Produk Terbaru</h2>
          <Link to="/products" className="btn btn-secondary btn-sm">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Memuat data...
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Inbox size={22} /></div>
            <h3>Belum ada produk</h3>
            <p>Tambahkan produk pertama kamu!</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem', width: 'auto' }}>
              <Plus size={16} /> Tambah Produk
            </Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {product.description?.slice(0, 40) || '-'}
                    </span>
                  </td>
                  <td><span className="badge badge-info">{product.category}</span></td>
                  <td>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${product.stock === 0 ? 'badge-danger' : product.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                      {product.stock === 0 ? 'Habis' : product.stock <= 5 ? 'Menipis' : 'Tersedia'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
