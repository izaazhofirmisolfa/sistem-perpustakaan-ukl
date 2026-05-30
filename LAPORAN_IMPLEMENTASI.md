# 📋 LAPORAN IMPLEMENTASI MODUL 6
## Authentication & Authorization - NestJS Library API

---

## 📌 Informasi Praktikum
- **Modul**: 6 - Authentication & Authorization
- **Framework**: NestJS
- **ORM**: Prisma v5
- **Database**: MySQL
- **Tanggal**: 6 Februari 2026

---

## ✅ Tujuan Praktikum yang Dicapai

1. ✅ **Menjelaskan konsep authentication dan authorization**
   - Authentication: Proses verifikasi identitas user (login)
   - Authorization: Proses menentukan hak akses berdasarkan role

2. ✅ **Menjelaskan pemisahan User dan Member**
   - User: Akun untuk login & keamanan sistem
   - Member: Data anggota perpustakaan
   - Relasi: User dapat memiliki Member (optional), tidak semua User adalah Member

3. ✅ **Mengimplementasikan login menggunakan JWT**
   - JWT Token dengan masa berlaku 1 jam
   - Password di-hash menggunakan bcrypt
   - Token payload berisi: user id, username, role, memberId

4. ✅ **Mengamankan endpoint menggunakan Guard**
   - JwtAuthGuard: Memverifikasi token JWT
   - RolesGuard: Memvalidasi hak akses berdasarkan role

5. ✅ **Mengatur hak akses berdasarkan role**
   - ADMIN: Akses penuh (create, read, update, delete)
   - PETUGAS: Akses terbatas (tidak dapat delete)
   - MEMBER: Akses minimal (hanya peminjaman)

6. ✅ **Menguji autentikasi dan otorisasi menggunakan Postman**
   - Testing guide lengkap tersedia di TESTING_GUIDE.md

---

## 🏗️ Struktur Implementasi

### 1. Database Schema (Prisma)

```prisma
enum UserRole {
  ADMIN
  PETUGAS
  MEMBER
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  role      UserRole
  memberId  Int?
  member    Student? @relation(fields: [memberId], references: [id])
  createdAt DateTime @default(now())
}

model Student {
  id         Int          @id @default(autoincrement())
  nis        String       @unique
  email      String?      @unique
  kelas      String
  jurusan    String
  users      User[]
  peminjaman Peminjaman[]
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

**Penjelasan:**
- `UserRole` enum membatasi role agar konsisten
- `memberId` optional → Admin/Petugas tidak harus anggota
- Relasi User → Student bersifat optional (one-to-one)

### 2. Auth Module Structure

```
src/auth/
├── decorators/
│   └── roles.decorator.ts       # Custom decorator untuk role
├── dto/
│   └── login.dto.ts             # DTO validasi login
├── guards/
│   ├── jwt-auth.guard.ts        # Guard untuk autentikasi JWT
│   └── roles.guard.ts           # Guard untuk otorisasi role
├── strategies/
│   └── jwt.strategy.ts          # Passport JWT strategy
├── auth.controller.ts           # Controller untuk login
├── auth.service.ts              # Service untuk logika auth
└── auth.module.ts               # Module configuration
```

### 3. Komponen Utama

#### a. Login DTO (`dto/login.dto.ts`)
```typescript
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

#### b. Auth Service (`auth.service.ts`)
**Fungsi:**
- Mencari user berdasarkan username
- Memverifikasi password dengan bcrypt.compare()
- Membuat JWT token dengan payload user

**Endpoints:**
- `POST /auth/login` - Login dan mendapatkan JWT token

#### c. JWT Strategy (`strategies/jwt.strategy.ts`)
**Fungsi:**
- Mengekstrak token dari header `Authorization: Bearer <token>`
- Memverifikasi token menggunakan secret key
- Mengembalikan payload sebagai `req.user`

#### d. Guards

**JwtAuthGuard:**
```typescript
export class JwtAuthGuard extends AuthGuard('jwt') {}
```
- Memblokir request tanpa/dengan token invalid

**RolesGuard:**
```typescript
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', ...);
    return requiredRoles.includes(user.role);
  }
}
```
- Membandingkan role user dengan role yang diperlukan

#### e. Roles Decorator (`decorators/roles.decorator.ts`)
```typescript
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```
- Menandai endpoint dengan role yang diizinkan

---

## 🔐 Implementasi pada Endpoints

### Buku Controller
```typescript
@Controller('buku')
export class BukuController {
  // ADMIN & PETUGAS bisa create
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Post()
  create(@Body() dto: CreateBukuDto) { }

  // ADMIN & PETUGAS bisa update
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBukuDto) { }

  // HANYA ADMIN bisa delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) { }

  // Public access (no guards)
  @Get()
  findAll() { }
}
```

### Students Controller
```typescript
@Controller('students')
export class StudentsController {
  // ADMIN & PETUGAS bisa create
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Post()
  create(@Body() dto: CreateStudentDto) { }

  // ADMIN & PETUGAS bisa update
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) { }

  // HANYA ADMIN bisa delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) { }
}
```

### Peminjaman Controller
```typescript
@Controller('peminjaman')
export class PeminjamanController {
  // SEMUA ROLE bisa borrow
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS, UserRole.MEMBER)
  @Post()
  async create(@Body() dto: CreatePeminjamanDto) { }

  // SEMUA ROLE bisa return
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS, UserRole.MEMBER)
  @Put(':id/return')
  async returnBook(@Param('id', ParseIntPipe) id: number) { }

  // ADMIN & PETUGAS bisa delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) { }
}
```

---

## 👥 Data User Testing

### User yang Telah Dibuat

| ID | Username | Password     | Role    | Member ID | Keterangan           |
|----|----------|--------------|---------|-----------|----------------------|
| 1  | admin    | password123  | ADMIN   | null      | Admin sistem         |
| 2  | petugas  | password123  | PETUGAS | null      | Petugas perpustakaan |
| 3  | member   | password123  | MEMBER  | 1         | Anggota (Student #1) |

### Student yang Terkait

| ID | NIS   | Email               | Kelas      | Jurusan                    |
|----|-------|---------------------|------------|----------------------------|
| 1  | 12345 | member@example.com  | XII RPL 1  | Rekayasa Perangkat Lunak   |

---

## 📊 Matriks Hak Akses

### Endpoint Buku

| Endpoint              | Method | ADMIN | PETUGAS | MEMBER | Public |
|-----------------------|--------|-------|---------|--------|--------|
| `/buku`               | GET    | ✅    | ✅      | ✅     | ✅     |
| `/buku/:id`           | GET    | ✅    | ✅      | ✅     | ✅     |
| `/buku/search`        | GET    | ✅    | ✅      | ✅     | ✅     |
| `/buku`               | POST   | ✅    | ✅      | ❌     | ❌     |
| `/buku/:id`           | PUT    | ✅    | ✅      | ❌     | ❌     |
| `/buku/:id`           | DELETE | ✅    | ❌      | ❌     | ❌     |

### Endpoint Students

| Endpoint              | Method | ADMIN | PETUGAS | MEMBER | Public |
|-----------------------|--------|-------|---------|--------|--------|
| `/students`           | GET    | ✅    | ✅      | ✅     | ✅     |
| `/students/:id`       | GET    | ✅    | ✅      | ✅     | ✅     |
| `/students`           | POST   | ✅    | ✅      | ❌     | ❌     |
| `/students/:id`       | PUT    | ✅    | ✅      | ❌     | ❌     |
| `/students/:id`       | DELETE | ✅    | ❌      | ❌     | ❌     |

### Endpoint Peminjaman

| Endpoint                  | Method | ADMIN | PETUGAS | MEMBER | Public |
|---------------------------|--------|-------|---------|--------|--------|
| `/peminjaman`             | GET    | ✅    | ✅      | ✅     | ✅     |
| `/peminjaman/:id`         | GET    | ✅    | ✅      | ✅     | ✅     |
| `/peminjaman`             | POST   | ✅    | ✅      | ✅     | ❌     |
| `/peminjaman/:id/return`  | PUT    | ✅    | ✅      | ✅     | ❌     |
| `/peminjaman/:id`         | DELETE | ✅    | ✅      | ❌     | ❌     |

---

## 🔧 Dependencies yang Diinstall

```json
{
  "dependencies": {
    "@nestjs/jwt": "^11.0.2",
    "@nestjs/passport": "^11.0.5",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^6.0.0",
    "@types/bcrypt": "^6.0.0",
    "@types/passport-jwt": "^4.0.1"
  }
}
```

**Fungsi masing-masing:**
- `@nestjs/jwt`: Membuat dan memverifikasi JWT token
- `@nestjs/passport`: Integrasi Passport.js dengan NestJS
- `passport`: Framework autentikasi untuk Node.js
- `passport-jwt`: Strategy JWT untuk Passport
- `bcrypt`: Hashing password
- `@types/*`: Type definitions untuk TypeScript

---

## 🧪 Cara Testing

### 1. Jalankan Server
```bash
npm run start:dev
```

### 2. Login untuk Mendapatkan Token
**Request:**
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

### 3. Gunakan Token di Request Berikutnya
```http
POST http://localhost:3000/buku
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```

### 4. Testing Skenario

#### ✅ Skenario Success:
1. ADMIN login → Create buku → **Success**
2. PETUGAS login → Create buku → **Success**
3. ADMIN login → Delete buku → **Success**
4. MEMBER login → Create peminjaman → **Success**

#### ❌ Skenario Forbidden:
1. MEMBER login → Create buku → **403 Forbidden**
2. PETUGAS login → Delete buku → **403 Forbidden**
3. MEMBER login → Delete peminjaman → **403 Forbidden**

#### ❌ Skenario Unauthorized:
1. Request tanpa token → **401 Unauthorized**
2. Request dengan token invalid → **401 Unauthorized**
3. Login dengan password salah → **401 Unauthorized**

---

## 📁 File-file yang Dibuat

### Auth Module
1. `src/auth/auth.module.ts` - Module configuration
2. `src/auth/auth.controller.ts` - Login endpoint
3. `src/auth/auth.service.ts` - Login logic
4. `src/auth/dto/login.dto.ts` - Login DTO
5. `src/auth/strategies/jwt.strategy.ts` - JWT strategy
6. `src/auth/guards/jwt-auth.guard.ts` - JWT guard
7. `src/auth/guards/roles.guard.ts` - Roles guard
8. `src/auth/decorators/roles.decorator.ts` - Roles decorator

### Database
9. `prisma/schema.prisma` - Updated with User model
10. `prisma/seed.ts` - Seed file untuk test users
11. `prisma/migrations/20260206032315_add_user_auth/` - Migration file

### Documentation
12. `TESTING_GUIDE.md` - Panduan testing lengkap
13. `LAPORAN_IMPLEMENTASI.md` - Laporan ini

---

## 🔒 Fitur Keamanan

1. **Password Hashing**: Menggunakan bcrypt dengan salt rounds 10
2. **JWT Token**: Expire dalam 1 jam
3. **Secret Key**: Harus diganti dengan environment variable di production
4. **Guard Layers**: Dua layer (Authentication + Authorization)
5. **Role Validation**: Strict role checking menggunakan enum

---

## 💡 Konsep Penting

### 1. Perbedaan User vs Member
```
┌─────────────────────────────────────┐
│         USER (Authentication)        │
├─────────────────────────────────────┤
│ • Akun untuk login sistem           │
│ • Memiliki username & password       │
│ • Memiliki role (ADMIN/PETUGAS/MEMBER)│
└─────────────────────────────────────┘
              ↓ (Optional)
┌─────────────────────────────────────┐
│      MEMBER (Data Anggota)          │
├─────────────────────────────────────┤
│ • Data anggota perpustakaan         │
│ • Memiliki NIS, kelas, jurusan       │
│ • Dapat meminjam buku                │
└─────────────────────────────────────┘
```

**Contoh:**
- **Admin** → User tanpa Member (tidak perlu pinjam buku)
- **Petugas** → User tanpa Member (mengelola data)
- **Anggota** → User + Member (dapat login dan pinjam buku)

### 2. Flow Authentication & Authorization

```
1. User Login
   ↓
2. Backend verify username & password
   ↓
3. Generate JWT token (berisi: id, username, role)
   ↓
4. Client simpan token
   ↓
5. Setiap request, client kirim token di header
   ↓
6. JwtAuthGuard verify token
   ↓
7. RolesGuard check role
   ↓
8. Jika valid & authorized → Access granted
   Jika tidak → 401/403
```

### 3. JWT Token Payload
```json
{
  "sub": 1,                    // User ID
  "username": "admin",         // Username
  "role": "ADMIN",             // Role
  "memberId": null,            // Member ID (optional)
  "iat": 1738811234,           // Issued at
  "exp": 1738814834            // Expires at (1h)
}
```

---

## 🎯 Kesimpulan

Implementasi Authentication & Authorization pada Library API telah **berhasil** dengan fitur:

✅ **Authentication**
- JWT-based login system
- Secure password hashing dengan bcrypt
- Token-based session management

✅ **Authorization**
- Role-based access control (RBAC)
- Three roles: ADMIN, PETUGAS, MEMBER
- Fine-grained permissions per endpoint

✅ **Security**
- Protected endpoints dengan Guards
- Validation dengan class-validator
- Proper error handling

✅ **Architecture**
- Clean separation of concerns
- Reusable guards dan decorators
- Scalable module structure

---

## 📚 Referensi

1. NestJS Documentation: https://docs.nestjs.com/security/authentication
2. Passport JWT Strategy: http://www.passportjs.org/packages/passport-jwt/
3. Prisma Documentation: https://www.prisma.io/docs
4. JWT.io: https://jwt.io
5. bcrypt: https://github.com/kelektiv/node.bcrypt.js

---

## 👨‍💻 Dibuat oleh

**Praktikum Web Backend - Fase 4**
Modul 6: Authentication & Authorization

---

**Status**: ✅ **SELESAI & SIAP TESTING**

Untuk panduan testing lengkap, lihat file `TESTING_GUIDE.md`.
