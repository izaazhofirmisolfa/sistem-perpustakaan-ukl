# 📚 Sistem Perpustakaan API

Backend REST API sistem perpustakaan sekolah, dibangun dengan **NestJS + Prisma + MySQL**.

---

## 🚀 Deploy ke Railway (Step by Step)

### 1. Buat akun Railway
Buka [railway.app](https://railway.app) → Sign up dengan GitHub

### 2. Buat project baru
- Klik **New Project**
- Pilih **Deploy from GitHub repo** → pilih repo project ini

### 3. Tambah MySQL database
- Di dashboard project → klik **New** → **Database** → **MySQL**
- Setelah MySQL selesai dibuat, klik MySQL service → tab **Variables**
- Copy nilai `MYSQL_URL` (formatnya: `mysql://...`)

### 4. Set environment variables di app
- Klik service app kamu → tab **Variables** → **New Variable**
- Tambahkan:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (paste MYSQL_URL dari langkah 3) |
| `JWT_SECRET` | (string acak panjang, misal: `perpustakaan-secret-2026-xyzabc`) |

### 5. Deploy!
Railway otomatis build dan deploy. Tunggu beberapa menit.

### 6. Akses Swagger
Setelah deploy berhasil, buka:
```
https://[nama-app].railway.app/docs
```

### 7. Seed data awal (optional)
Di Railway → klik service app → **Settings** → **Deploy** → jalankan command:
```
npx ts-node prisma/seed.ts
```

---

## 🧪 Testing via Swagger

### Urutan testing yang benar:

1. **Login** dulu di `POST /api/auth/login`
   ```json
   { "username": "admin", "password": "admin123" }
   ```

2. **Copy** nilai `access_token` dari response

3. Klik tombol **Authorize** 🔒 di pojok kanan atas Swagger

4. Paste token → klik **Authorize**

5. Sekarang semua endpoint yang butuh auth sudah bisa dipakai!

---

## 👤 Akun Default (setelah seed)

| Role | Username | Password |
|------|----------|----------|
| ADMIN | `admin` | `admin123` |
| PETUGAS | `petugas` | `petugas123` |
| MEMBER | `budi` | `member123` |

---

## 📋 Fitur

### Auth
- `POST /api/auth/login` - Login, dapat JWT token
- `POST /api/auth/register` - Register (otomatis MEMBER)
- `POST /api/auth/register-admin` - Buat user dengan role tertentu (ADMIN only)

### Buku
- `GET /api/buku` - Daftar semua buku
- `GET /api/buku/:id` - Detail buku
- `GET /api/buku/search?title=...` - Cari buku
- `POST /api/buku` - Tambah buku (ADMIN/PETUGAS)
- `PUT /api/buku/:id` - Edit buku (ADMIN/PETUGAS)
- `DELETE /api/buku/:id` - Hapus buku (ADMIN)

### Students
- `GET /api/students` - Daftar siswa (ADMIN/PETUGAS)
- `GET /api/students/:id` - Detail siswa
- `GET /api/students/:id/peminjaman` - Riwayat pinjam + denda
- `GET /api/students/search/nama?nama=...` - Cari by nama
- `GET /api/students/search/nis?nis=...` - Cari by NIS
- `PUT /api/students/:id` - Update siswa (ADMIN)
- `DELETE /api/students/:id` - Hapus siswa (ADMIN)

### Peminjaman
- `GET /api/peminjaman` - Semua peminjaman (ADMIN/PETUGAS)
- `GET /api/peminjaman/statistik` - Statistik + daftar yang terlambat
- `GET /api/peminjaman/search?startDate=...&endDate=...` - Cari by tanggal
- `POST /api/peminjaman` - Pinjam buku
- `PUT /api/peminjaman/:id/pengembalian` - Kembalikan buku (+ hitung denda)
- `DELETE /api/peminjaman/:id` - Hapus data (ADMIN/PETUGAS)

---

## ⚙️ Aturan Bisnis

- **Denda**: Rp 1.000 per hari keterlambatan
- **Batas pinjam**: Maksimal 3 buku per siswa
- **MEMBER**: Hanya bisa pinjam atas nama diri sendiri
- **Stok**: Otomatis berkurang saat dipinjam, bertambah saat dikembalikan

---

## 💻 Jalankan Lokal

```bash
# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit .env: isi DATABASE_URL dan JWT_SECRET

# Migrasi database
npx prisma migrate dev

# Seed data awal
npm run seed

# Jalankan dev server
npm run start:dev
```

Buka Swagger: http://localhost:3000/docs
