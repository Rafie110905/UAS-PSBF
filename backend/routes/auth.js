const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users } = require('../models/db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi!' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter!' });
    }

    // Cek email sudah ada
    const existingUser = Users.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = Users.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    // Buat token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi!' });
    }

    // Cari user
    const user = Users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah!' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah!' });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// GET /api/auth/me (protected)
router.get('/me', authenticate, (req, res) => {
  const user = Users.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// PUT /api/auth/profile (protected)
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password minimal 6 karakter!' });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = Users.update(req.user.id, updates);
    res.json({
      message: 'Profil berhasil diperbarui!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

module.exports = router;
