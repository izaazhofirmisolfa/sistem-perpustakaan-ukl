import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.student.upsert({
    where: { email: 'admin@perpustakaan.com' },
    update: {},
    create: {
      nama: 'Administrator',
      email: 'admin@perpustakaan.com',
      username: 'admin',
      password: adminPass,
      role: UserRole.ADMIN,
    },
  });

  // Petugas
  const petugasPass = await bcrypt.hash('petugas123', 10);
  await prisma.student.upsert({
    where: { email: 'petugas@perpustakaan.com' },
    update: {},
    create: {
      nama: 'Petugas Perpustakaan',
      email: 'petugas@perpustakaan.com',
      username: 'petugas',
      password: petugasPass,
      role: UserRole.PETUGAS,
    },
  });

  // Member contoh
  const memberPass = await bcrypt.hash('member123', 10);
  await prisma.student.upsert({
    where: { email: 'budi@siswa.com' },
    update: {},
    create: {
      nis: '2024001',
      nama: 'Budi Santoso',
      email: 'budi@siswa.com',
      kelas: 'XI-IPA-1',
      jurusan: 'IPA',
      username: 'budi',
      password: memberPass,
      role: UserRole.MEMBER,
    },
  });

  // Buku contoh
  const buku = [
    { title: 'Laskar Pelangi', author: 'Andrea Hirata', year: 2005, category: 'Fiksi', stock: 5, description: 'Novel tentang persahabatan anak Belitung' },
    { title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', year: 1980, category: 'Fiksi Sejarah', stock: 3, description: 'Tetralogi Buru bagian pertama' },
    { title: 'Matematika Kelas XI', author: 'Kemendikbud', year: 2022, category: 'Pelajaran', stock: 10, description: 'Buku pelajaran matematika SMA' },
    { title: 'Fisika Dasar', author: 'Halliday & Resnick', year: 2020, category: 'Sains', stock: 4, description: 'Buku fisika dasar universitas' },
    { title: 'Harry Potter dan Batu Bertuah', author: 'J.K. Rowling', year: 1997, category: 'Fiksi', stock: 2, description: 'Petualangan penyihir muda Harry Potter' },
  ];

  for (const b of buku) {
    await prisma.buku.upsert({
      where: { id: buku.indexOf(b) + 1 },
      update: {},
      create: b,
    });
  }

  console.log('✅ Seed berhasil!');
  console.log('👤 Akun default:');
  console.log('   Admin    → username: admin    | password: admin123');
  console.log('   Petugas  → username: petugas  | password: petugas123');
  console.log('   Member   → username: budi     | password: member123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
