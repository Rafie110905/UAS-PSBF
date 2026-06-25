const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./backend/routes/auth');
const productRoutes = require('./backend/routes/products');
const uploadRoutes = require('./backend/routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk file yang diupload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server berjalan dengan baik!' });
});

// Serve React frontend (hasil build)
const frontendBuild = path.join(__dirname, 'frontend', 'build');
app.use(express.static(frontendBuild));

// Semua route non-API diarahkan ke React
app.get('*', (req, res) => {
  const indexFile = path.join(frontendBuild, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(404).json({
        message: 'Frontend belum di-build. Jalankan: npm run build'
      });
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📦 API tersedia di http://localhost:${PORT}/api`);
  console.log(`🖥️  Frontend tersedia di http://localhost:${PORT}`);
});

module.exports = app;
