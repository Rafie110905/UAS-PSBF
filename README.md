# Inventaris App — Single Server

Backend (Express) dan Frontend (React) berjalan dalam **satu server**, satu port.

## Struktur Folder

```
inventaris-app/
├── server.js              ← Entry point utama
├── package.json           ← Dependencies backend + scripts
├── .env                   ← Konfigurasi environment
├── backend/
│   ├── routes/            ← auth.js, products.js, upload.js
│   ├── middleware/        ← auth.js (JWT)
│   └── models/            ← db.js (JSON file DB)
├── frontend/
│   ├── package.json       ← Dependencies React
│   ├── src/               ← Source code React
│   └── build/             ← Hasil build (di-generate otomatis)
└── uploads/               ← File gambar yang diupload user
```

## Cara Menjalankan

### 1. Install semua dependencies + build frontend
```bash
npm run setup
```

### 2. Jalankan server
```bash
npm start
```

Akses di: **http://localhost:5000**

---

### Mode Development (opsional)
Jalankan backend saja dengan auto-reload:
```bash
npm run dev
```

Untuk live-reload frontend (terpisah di port 3000):
```bash
cd frontend && npm start
```

---

## Environment Variables (`.env`)

| Variable    | Default | Keterangan               |
|-------------|---------|--------------------------|
| PORT        | 5000    | Port server              |
| JWT_SECRET  | —       | Secret key JWT (ganti!)  |
| NODE_ENV    | production | Mode environment      |

## API Endpoints

| Method | Endpoint              | Keterangan           | Auth |
|--------|-----------------------|----------------------|------|
| POST   | /api/auth/register    | Daftar akun baru     | ✗    |
| POST   | /api/auth/login       | Login                | ✗    |
| GET    | /api/auth/me          | Data user sendiri    | ✓    |
| PUT    | /api/auth/profile     | Update profil        | ✓    |
| GET    | /api/products         | Semua produk         | ✓    |
| POST   | /api/products         | Tambah produk        | ✓    |
| PUT    | /api/products/:id     | Update produk        | ✓    |
| DELETE | /api/products/:id     | Hapus produk         | ✓    |
| POST   | /api/upload/image     | Upload gambar        | ✓    |
| GET    | /api/health           | Health check         | ✗    |
