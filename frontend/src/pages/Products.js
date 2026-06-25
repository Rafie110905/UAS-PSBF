import React, { useState, useEffect, useRef } from 'react';
import { productService, uploadService } from '../services/api';
import {
  Package, Plus, Search, Pencil, Trash2, ImagePlus, AlertCircle,
  CheckCircle2, X, Inbox, SearchX, Star, ShoppingBag, Filter
} from 'lucide-react';

const CATEGORIES = [
  'Semua', 'Wajan & Frypan', 'Panci & Presto', 'Penggorengan', 'Set Peralatan', 'Peralatan Dapur', 'Aksesoris'
];
const FORM_CATEGORIES = CATEGORIES.filter(c => c !== 'Semua');

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

const emptyForm = { name: '', description: '', price: '', category: 'Peralatan Dapur', stock: '', image: null };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const fileRef = useRef();

  const fetchProducts = async () => {
    try {
      const res = await productService.getAll();
      setProducts(res.data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setImagePreview(null);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || null
    });
    setImagePreview(product.image ? `${BACKEND_URL}${product.image}` : null);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm(emptyForm);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadService.uploadImage(file);
      setForm({ ...form, image: res.data.url });
      setImagePreview(`${BACKEND_URL}${res.data.url}`);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal upload gambar');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setFormError('Nama dan harga harus diisi!');
      return;
    }
    try {
      setFormLoading(true);
      if (editProduct) {
        await productService.update(editProduct.id, form);
        setSuccess('Produk berhasil diperbarui!');
      } else {
        await productService.create(form);
        setSuccess('Produk berhasil ditambahkan!');
      }
      closeModal();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
      setSuccess('Produk berhasil dihapus!');
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.78rem', color: '#f59e0b' }}>
        <Star size={12} fill="#f59e0b" />
        {r.toFixed(1)}
      </span>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><Package size={22} /> Manajemen Produk</h1>
        <p>Dataset Panci & Wajan — {products.length} produk tersedia</p>
      </div>

      {success && <div className="alert alert-success"><CheckCircle2 size={16} /> {success}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>Daftar Produk ({filtered.length})</h2>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <div className="search-input">
              <Search size={14} />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ width: 'auto' }}>
              <Plus size={15} /> Tambah Produk
            </button>
          </div>
        </div>

        {/* Filter Kategori */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1.25rem 1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                border: '1px solid',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: activeCategory === cat ? 600 : 400,
                background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{search ? <SearchX size={22} /> : <Inbox size={22} />}</div>
            <h3>{search ? 'Produk tidak ditemukan' : 'Belum ada produk'}</h3>
            <p>{search ? 'Coba kata kunci lain' : 'Klik tombol "Tambah Produk" untuk mulai'}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Rating</th>
                <th>Terjual</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image
                      ? <img src={`${BACKEND_URL}${product.image}`} alt={product.name} className="product-img" />
                      : <div className="product-img-placeholder"><Package size={18} /></div>
                    }
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.88rem' }}>{product.name}</strong>
                    {product.description && (
                      <><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {product.description.slice(0, 60)}{product.description.length > 60 ? '...' : ''}
                      </span></>
                    )}
                  </td>
                  <td><span className="badge badge-info">{product.category}</span></td>
                  <td><strong>Rp {Number(product.price).toLocaleString('id-ID')}</strong></td>
                  <td style={{ textAlign: 'center' }}>{product.stock}</td>
                  <td>{product.rating ? renderStars(product.rating) : '-'}</td>
                  <td>
                    {product.sold ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <ShoppingBag size={12} /> {Number(product.sold).toLocaleString('id-ID')}
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <span className={`badge ${product.stock === 0 ? 'badge-danger' : product.stock <= 10 ? 'badge-warning' : 'badge-success'}`}>
                      {product.stock === 0 ? 'Habis' : product.stock <= 10 ? 'Menipis' : 'Tersedia'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(product)}><Pencil size={13} /> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(product)}><Trash2 size={13} /> Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editProduct ? <><Pencil size={16} /> Edit Produk</> : <><Plus size={16} /> Tambah Produk</>}</h2>
              <button className="modal-close" onClick={closeModal}><X size={18} /></button>
            </div>

            {formError && <div className="alert alert-error"><AlertCircle size={16} /> {formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Gambar Produk (opsional)</label>
                <div className="upload-area" onClick={() => fileRef.current.click()}>
                  {uploadingImage ? (
                    <p style={{ color: 'var(--primary)', fontSize: '0.88rem' }}>Mengupload...</p>
                  ) : imagePreview ? (
                    <img src={imagePreview} alt="preview" />
                  ) : (
                    <div className="upload-hint">
                      <ImagePlus size={20} />
                      <span>Klik untuk upload gambar</span>
                      <small>JPG, PNG, GIF, WebP — maks 5MB</small>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>

              <div className="form-group">
                <label>Nama Produk *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama produk" />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi produk (opsional)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Harga (Rp) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0" min="0" />
                </div>
                <div className="form-group">
                  <label>Stok</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" min="0" />
                </div>
              </div>

              <div className="form-group">
                <label>Kategori</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {FORM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading || uploadingImage} style={{ width: 'auto', flex: 1 }}>
                  {formLoading ? 'Menyimpan...' : editProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: '380px' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', background: '#FCEEEE', color: 'var(--danger)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
              }}>
                <Trash2 size={22} />
              </div>
              <h2 style={{ marginBottom: '0.5rem' }}>Hapus Produk?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Yakin ingin menghapus <strong>"{deleteConfirm.name}"</strong>? Tindakan ini tidak bisa dibatalkan.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Batal</button>
              <button className="btn btn-danger btn-solid" onClick={() => handleDelete(deleteConfirm.id)} style={{ width: 'auto', flex: 1 }}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
