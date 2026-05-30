# 🚀 Quick Start - Authentication Testing

## 📝 Login Credentials

```
Username: admin     | Password: password123 | Role: ADMIN
Username: petugas   | Password: password123 | Role: PETUGAS
Username: member    | Password: password123 | Role: MEMBER
```

## 🔐 1. Login (Get Token)

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

Copy the `access_token` from response!

## 🎫 2. Use Token in Requests

Add this header to all protected endpoints:
```
Authorization: Bearer <your_access_token>
```

## 🧪 Quick Test Cases

### ✅ Test 1: ADMIN can create book
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
Expected: **201 Created** ✅

### ✅ Test 2: ADMIN can delete book
```http
DELETE http://localhost:3000/buku/1
Authorization: Bearer <admin_token>
```
Expected: **200 OK** ✅

### ❌ Test 3: PETUGAS cannot delete book
```http
DELETE http://localhost:3000/buku/1
Authorization: Bearer <petugas_token>
```
Expected: **403 Forbidden** ❌

### ❌ Test 4: MEMBER cannot create book
```http
POST http://localhost:3000/buku
Authorization: Bearer <member_token>
Content-Type: application/json

{
  "title": "Test Book"
}
```
Expected: **403 Forbidden** ❌

### ✅ Test 5: MEMBER can borrow book
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
Expected: **201 Created** ✅

### ❌ Test 6: No token = Unauthorized
```http
POST http://localhost:3000/buku
Content-Type: application/json

{
  "title": "Test"
}
```
Expected: **401 Unauthorized** ❌

## 📊 Permission Matrix

| Action | Endpoint | ADMIN | PETUGAS | MEMBER |
|--------|----------|-------|---------|--------|
| Create Book | POST /buku | ✅ | ✅ | ❌ |
| Update Book | PUT /buku/:id | ✅ | ✅ | ❌ |
| Delete Book | DELETE /buku/:id | ✅ | ❌ | ❌ |
| Create Student | POST /students | ✅ | ✅ | ❌ |
| Delete Student | DELETE /students/:id | ✅ | ❌ | ❌ |
| Borrow Book | POST /peminjaman | ✅ | ✅ | ✅ |
| Return Book | PUT /peminjaman/:id/return | ✅ | ✅ | ✅ |
| Delete Peminjaman | DELETE /peminjaman/:id | ✅ | ✅ | ❌ |

## 🎯 Success Criteria

- [ ] All 3 users can login successfully
- [ ] ADMIN has full access
- [ ] PETUGAS cannot delete
- [ ] MEMBER only access peminjaman
- [ ] Requests without token get 401
- [ ] Unauthorized actions get 403

## 🔧 Start Server

```bash
npm run start:dev
```

Server runs at: http://localhost:3000

---
For detailed guide, see **TESTING_GUIDE.md**
