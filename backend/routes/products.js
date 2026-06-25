const express = require('express');
const { Products } = require('../models/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Ambil semua produk (inventaris bersama)
router.get('/', authenticate, (req, res) => {
  try {
    const products = Products.findAll(); // semua produk, tidak filter per-user
    res.json({ products, total: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk', error: error.message });
  }
});

// GET /api/products/:id - Ambil satu produk
router.get('/:id', authenticate, (req, res) => {
  try {
    const product = Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk', error: error.message });
  }
});

// POST /api/products - Tambah produk baru
router.post('/', authenticate, (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Nama dan harga produk harus diisi!' });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({ message: 'Harga harus berupa angka positif!' });
    }

    const newProduct = Products.create({
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || 'Umum',
      stock: parseInt(stock) || 0,
      image: image || null,
      userId: req.user.id,
      userName: req.user.name
    });

    res.status(201).json({
      message: 'Produk berhasil ditambahkan!',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambah produk', error: error.message });
  }
});

// PUT /api/products/:id - Update produk
router.put('/:id', authenticate, (req, res) => {
  try {
    const product = Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const { name, description, price, category, stock, image } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        return res.status(400).json({ message: 'Harga harus berupa angka positif!' });
      }
      updates.price = parseFloat(price);
    }
    if (category) updates.category = category;
    if (stock !== undefined) updates.stock = parseInt(stock);
    if (image !== undefined) updates.image = image;

    const updatedProduct = Products.update(req.params.id, updates);
    res.json({
      message: 'Produk berhasil diperbarui!',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui produk', error: error.message });
  }
});

// DELETE /api/products/:id - Hapus produk
router.delete('/:id', authenticate, (req, res) => {
  try {
    const product = Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    Products.delete(req.params.id);
    res.json({ message: 'Produk berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk', error: error.message });
  }
});

module.exports = router;
