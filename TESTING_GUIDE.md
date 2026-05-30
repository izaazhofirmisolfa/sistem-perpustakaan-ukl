# 📚 Panduan Pengujian Authentication & Authorization - Library API

## 🎯 Informasi Login

Tiga user telah dibuat dengan kredensial berikut:

| Username | Password     | Role    | Keterangan                  |
|----------|--------------|---------|----------------------------|
| admin    | password123  | ADMIN   | Akses penuh ke semua fitur |
| petugas  | password123  | PETUGAS | Dapat mengelola data       |
| member   | password123  | MEMBER  | Dapat meminjam buku        |

## 🔐 Hak Akses Berdasarkan Role

### 📖 Endpoint Buku (`/buku`)
| Method | Endpoint | ADMIN | PETUGAS | MEMBER |
|--------|----------|-------|---------|--------|
| GET    | `/buku`  | ✅    | ✅      | ✅     |
| GET    | `/buku/:id` | ✅ | ✅      | ✅     |
| GET    | `/buku/search?title=` | ✅ | ✅ | ✅ |
| POST   | `/buku`  | ✅    | ✅      | ❌     |
| PUT    | `/buku/:id` | ✅ | ✅      | ❌     |
| DELETE | `/buku/:id` | ✅ | ❌      | ❌     |

### 👨‍🎓 Endpoint Students (`/students`)
| Method | Endpoint | ADMIN | PETUGAS | MEMBER |
|--------|----------|-------|---------|--------|
| GET    | `/students` | ✅ | ✅      | ✅     |
| GET    | `/students/:id` | ✅ | ✅   | ✅     |
| POST   | `/students` | ✅ | ✅      | ❌     |
| PUT    | `/students/:id` | ✅ | ✅  | ❌     |
| DELETE | `/students/:id` | ✅ | ❌  | ❌     |

### 📚 Endpoint Peminjaman (`/peminjaman`)
| Method | Endpoint | ADMIN | PETUGAS | MEMBER |
|--------|----------|-------|---------|--------|
| GET    | `/peminjaman` | ✅ | ✅     | ✅     |
| GET    | `/peminjaman/:id` | ✅ | ✅ | ✅     |
| POST   | `/peminjaman` | ✅ | ✅     | ✅     |
| PUT    | `/peminjaman/:id/return` | ✅ | ✅ | ✅ |
| DELETE | `/peminjaman/:id` | ✅ | ✅ | ❌     |

## 📝 Langkah Pengujian di Postman

### 1️⃣ Login dan Mendapatkan Token

#### Login sebagai ADMIN
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login sebagai PETUGAS
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "petugas",
  "password": "password123"
}
```

#### Login sebagai MEMBER
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "member",
  "password": "password123"
}
```

### 2️⃣ Menggunakan Token di Request

Setelah login, copy `access_token` dan gunakan di header setiap request:

**Header:**
```
Authorization: Bearer <access_token>
```

**Contoh di Postman:**
1. Buka tab **Headers**
2. Tambahkan key: `Authorization`
3. Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3️⃣ Testing Endpoint Buku

#### ✅ Test 1: ADMIN bisa membuat buku
```http
POST http://localhost:3000/buku
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```
**Expected:** ✅ Success (201 Created)

#### ✅ Test 2: PETUGAS bisa membuat buku
```http
POST http://localhost:3000/buku
Authorization: Bearer <petugas_token>
Content-Type: application/json

{
  "title": "Design Patterns",
  "author": "Gang of Four",
  "year": 1994
}
```
**Expected:** ✅ Success (201 Created)

#### ❌ Test 3: MEMBER tidak bisa membuat buku
```http
POST http://localhost:3000/buku
Authorization: Bearer <member_token>
Content-Type: application/json

{
  "title": "Refactoring",
  "author": "Martin Fowler",
  "year": 1999
}
```
**Expected:** ❌ Forbidden (403)

#### ✅ Test 4: ADMIN bisa menghapus buku
```http
DELETE http://localhost:3000/buku/1
Authorization: Bearer <admin_token>
```
**Expected:** ✅ Success (200 OK)

#### ❌ Test 5: PETUGAS tidak bisa menghapus buku
```http
DELETE http://localhost:3000/buku/1
Authorization: Bearer <petugas_token>
```
**Expected:** ❌ Forbidden (403)

#### ✅ Test 6: Semua role bisa melihat daftar buku (tanpa guard)
```http
GET http://localhost:3000/buku
```
**Expected:** ✅ Success (200 OK) - Tidak perlu token

### 4️⃣ Testing Endpoint Students

#### ✅ Test 7: ADMIN bisa membuat student
```http
POST http://localhost:3000/students
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nis": "67890",
  "email": "student@example.com",
  "kelas": "XII RPL 2",
  "jurusan": "Rekayasa Perangkat Lunak"
}
```
**Expected:** ✅ Success (201 Created)

#### ❌ Test 8: MEMBER tidak bisa membuat student
```http
POST http://localhost:3000/students
Authorization: Bearer <member_token>
Content-Type: application/json

{
  "nis": "11111",
  "email": "test@example.com",
  "kelas": "XII RPL 3",
  "jurusan": "RPL"
}
```
**Expected:** ❌ Forbidden (403)

#### ❌ Test 9: PETUGAS tidak bisa menghapus student
```http
DELETE http://localhost:3000/students/1
Authorization: Bearer <petugas_token>
```
**Expected:** ❌ Forbidden (403)

### 5️⃣ Testing Endpoint Peminjaman

#### ✅ Test 10: MEMBER bisa meminjam buku
```http
POST http://localhost:3000/peminjaman
Authorization: Bearer <member_token>
Content-Type: application/json

{
  "bukuId": 1,
  "studentId": 1,
  "returnDate": "2026-02-13T10:00:00.000Z"
}
```
**Expected:** ✅ Success (201 Created)

#### ✅ Test 11: MEMBER bisa mengembalikan buku
```http
PUT http://localhost:3000/peminjaman/1/return
Authorization: Bearer <member_token>
```
**Expected:** ✅ Success (200 OK)

#### ❌ Test 12: MEMBER tidak bisa menghapus peminjaman
```http
DELETE http://localhost:3000/peminjaman/1
Authorization: Bearer <member_token>
```
**Expected:** ❌ Forbidden (403)

#### ✅ Test 13: ADMIN bisa menghapus peminjaman
```http
DELETE http://localhost:3000/peminjaman/1
Authorization: Bearer <admin_token>
```
**Expected:** ✅ Success (200 OK)

### 6️⃣ Testing Error Cases

#### ❌ Test 14: Login dengan username salah
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "wrong_user",
  "password": "password123"
}
```
**Expected:** ❌ Unauthorized (401) - "Username tidak ditemukan"

#### ❌ Test 15: Login dengan password salah
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "wrong_password"
}
```
**Expected:** ❌ Unauthorized (401) - "Password salah"

#### ❌ Test 16: Akses endpoint tanpa token
```http
POST http://localhost:3000/buku
Content-Type: application/json

{
  "title": "Test Book",
  "author": "Test Author",
  "year": 2025
}
```
**Expected:** ❌ Unauthorized (401)

#### ❌ Test 17: Akses endpoint dengan token invalid
```http
POST http://localhost:3000/buku
Authorization: Bearer invalid_token_here
Content-Type: application/json

{
  "title": "Test Book"
}
```
**Expected:** ❌ Unauthorized (401)

## 📊 Tabel Hasil Testing

Gunakan tabel ini untuk mencatat hasil pengujian:

| No | Test Case | Role | Expected | Actual | Status |
|----|-----------|------|----------|--------|--------|
| 1  | Create Buku | ADMIN | 201 | | |
| 2  | Create Buku | PETUGAS | 201 | | |
| 3  | Create Buku | MEMBER | 403 | | |
| 4  | Delete Buku | ADMIN | 200 | | |
| 5  | Delete Buku | PETUGAS | 403 | | |
| 6  | View All Buku | Public | 200 | | |
| 7  | Create Student | ADMIN | 201 | | |
| 8  | Create Student | MEMBER | 403 | | |
| 9  | Delete Student | PETUGAS | 403 | | |
| 10 | Create Peminjaman | MEMBER | 201 | | |
| 11 | Return Buku | MEMBER | 200 | | |
| 12 | Delete Peminjaman | MEMBER | 403 | | |
| 13 | Delete Peminjaman | ADMIN | 200 | | |
| 14 | Login - Wrong Username | - | 401 | | |
| 15 | Login - Wrong Password | - | 401 | | |
| 16 | No Token | - | 401 | | |
| 17 | Invalid Token | - | 401 | | |

## 🚀 Cara Menjalankan Server

```bash
# Start development server
npm run start:dev
```

Server akan berjalan di: `http://localhost:3000`

## 🔍 Tips Debugging

1. **Cek Token JWT**: Gunakan [jwt.io](https://jwt.io) untuk decode token dan lihat payload
2. **Postman Console**: Lihat response lengkap di Postman Console (View → Show Postman Console)
3. **Server Logs**: Perhatikan log di terminal untuk melihat error
4. **Database Check**: Gunakan Prisma Studio untuk cek data
   ```bash
   npx prisma studio
   ```

## 📝 Catatan Penting

1. **Token Expiry**: Token berlaku selama 1 jam. Setelah itu harus login ulang.
2. **Secret Key**: Di production, ganti `SECRET_KEY` dengan environment variable yang aman.
3. **Password Hashing**: Semua password di-hash menggunakan bcrypt (salt rounds: 10).
4. **Role Validation**: Guard memvalidasi role berdasarkan JWT payload.
5. **Member Relationship**: User MEMBER terhubung dengan Student, sementara ADMIN dan PETUGAS tidak.

## ✅ Checklist Pengujian

- [ ] Semua user berhasil login
- [ ] Token JWT valid dan dapat digunakan
- [ ] ADMIN dapat mengakses semua endpoint
- [ ] PETUGAS tidak dapat delete (buku/student)
- [ ] MEMBER hanya dapat akses endpoint peminjaman
- [ ] Endpoint public (GET list) dapat diakses tanpa token
- [ ] Error handling untuk login salah berfungsi
- [ ] Error handling untuk token invalid berfungsi
- [ ] Error handling untuk akses tanpa autoritas berfungsi

## 🎓 Kesimpulan

Implementasi Authentication & Authorization telah berhasil dengan:
- ✅ JWT-based authentication
- ✅ Role-based authorization (ADMIN, PETUGAS, MEMBER)
- ✅ Secure password hashing
- ✅ Protected endpoints dengan Guards
- ✅ Separation of concerns (User vs Member)

---
**Good luck with your testing! 🚀**
