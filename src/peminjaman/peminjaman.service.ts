import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { PrismaService } from '../../prisma/prisma.service';

const DENDA_PER_HARI = 1000; // Rp 1.000 per hari
const MAX_PINJAM = 3;        // Maksimal 3 buku sekaligus

function hitungDenda(peminjaman: any): number {
  if (peminjaman.status !== 'dipinjam') return 0;
  const now = new Date();
  const returnDate = new Date(peminjaman.returnDate);
  if (now <= returnDate) return 0;
  const hariTerlambat = Math.floor(
    (now.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return hariTerlambat * DENDA_PER_HARI;
}

function enrichPeminjaman(p: any) {
  const now = new Date();
  const returnDate = new Date(p.returnDate);
  const terlambat = p.status === 'dipinjam' && now > returnDate;
  const hariTerlambat = terlambat
    ? Math.floor((now.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const denda = hariTerlambat * DENDA_PER_HARI;
  return { ...p, terlambat, hariTerlambat, denda };
}

@Injectable()
export class PeminjamanService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePeminjamanDto, userFromToken: any) {
    // MEMBER hanya bisa pinjam atas nama dirinya sendiri
    let studentId = dto.studentId;
    if (userFromToken.role === 'MEMBER') {
      studentId = userFromToken.sub;
    } else if (!studentId) {
      throw new BadRequestException('studentId wajib diisi oleh ADMIN/PETUGAS');
    }

    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException(`Student dengan ID ${studentId} tidak ditemukan`);

    const buku = await this.prisma.buku.findUnique({ where: { id: dto.bukuId } });
    if (!buku) throw new NotFoundException(`Buku dengan ID ${dto.bukuId} tidak ditemukan`);

    if (buku.stock <= 0) {
      throw new BadRequestException(`Buku "${buku.title}" sedang tidak tersedia / stok habis`);
    }

    // Cek limit maksimal peminjaman
    const aktivCount = await this.prisma.peminjaman.count({
      where: { studentId, status: 'dipinjam' },
    });
    if (aktivCount >= MAX_PINJAM) {
      throw new BadRequestException(
        `Student sudah meminjam ${aktivCount} buku. Maksimal ${MAX_PINJAM} buku sekaligus`,
      );
    }

    // Cek student sudah pinjam buku yang sama
    const sudahPinjam = await this.prisma.peminjaman.findFirst({
      where: { studentId, bukuId: dto.bukuId, status: 'dipinjam' },
    });
    if (sudahPinjam) {
      throw new BadRequestException(`Student sudah meminjam buku "${buku.title}"`);
    }

    const borrowDate = dto.borrowDate ? new Date(dto.borrowDate) : new Date();
    const returnDate = new Date(dto.returnDate);

    if (returnDate <= borrowDate) {
      throw new BadRequestException('Tanggal kembali harus setelah tanggal pinjam');
    }

    const [peminjaman] = await this.prisma.$transaction([
      this.prisma.peminjaman.create({
        data: {
          student: { connect: { id: studentId } },
          buku: { connect: { id: dto.bukuId } },
          borrowDate,
          returnDate,
          status: 'dipinjam',
        },
        include: { student: { select: { id: true, nama: true, nis: true, kelas: true } }, buku: true },
      }),
      this.prisma.buku.update({
        where: { id: dto.bukuId },
        data: { stock: { decrement: 1 } },
      }),
    ]);

    return {
      status: 'success',
      message: 'Peminjaman berhasil dibuat',
      data: enrichPeminjaman(peminjaman),
    };
  }

  async findAll() {
    const peminjaman = await this.prisma.peminjaman.findMany({
      include: {
        student: { select: { id: true, nama: true, nis: true, kelas: true } },
        buku: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      status: 'success',
      message: 'Data peminjaman berhasil diambil',
      data: peminjaman.map(enrichPeminjaman),
    };
  }

  async findOne(id: number) {
    const peminjaman = await this.prisma.peminjaman.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, nama: true, nis: true, kelas: true } },
        buku: true,
      },
    });
    if (!peminjaman) throw new NotFoundException(`Peminjaman dengan ID ${id} tidak ditemukan`);
    return {
      status: 'success',
      message: `Data peminjaman ID ${id} berhasil diambil`,
      data: enrichPeminjaman(peminjaman),
    };
  }

  async returnBook(id: number) {
    const peminjaman = await this.prisma.peminjaman.findUnique({ where: { id } });
    if (!peminjaman) throw new NotFoundException(`Peminjaman dengan ID ${id} tidak ditemukan`);
    if (peminjaman.status === 'dikembalikan') {
      throw new BadRequestException('Buku sudah dikembalikan sebelumnya');
    }

    const denda = hitungDenda(peminjaman);

    const [updated] = await this.prisma.$transaction([
      this.prisma.peminjaman.update({
        where: { id },
        data: { status: 'dikembalikan' },
        include: {
          student: { select: { id: true, nama: true, nis: true, kelas: true } },
          buku: true,
        },
      }),
      this.prisma.buku.update({
        where: { id: peminjaman.bukuId },
        data: { stock: { increment: 1 } },
      }),
    ]);

    return {
      status: 'success',
      message: denda > 0
        ? `Buku dikembalikan terlambat. Denda: Rp ${denda.toLocaleString('id-ID')}`
        : 'Buku berhasil dikembalikan tepat waktu',
      data: { ...updated, denda, terlambat: denda > 0 },
    };
  }

  async findByDate(startDate?: Date, endDate?: Date) {
    const peminjaman = await this.prisma.peminjaman.findMany({
      where: {
        borrowDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        student: { select: { id: true, nama: true, nis: true, kelas: true } },
        buku: true,
      },
      orderBy: { borrowDate: 'desc' },
    });
    if (!peminjaman || peminjaman.length === 0) {
      throw new NotFoundException('Tidak ada peminjaman pada rentang tanggal tersebut');
    }
    return {
      status: 'success',
      message: 'Data peminjaman berhasil ditemukan',
      data: peminjaman.map(enrichPeminjaman),
    };
  }

  // Statistik ringkasan
  async getStatistik() {
    const [totalBuku, totalStudent, totalPeminjaman, aktif, terlambat] = await Promise.all([
      this.prisma.buku.count(),
      this.prisma.student.count(),
      this.prisma.peminjaman.count(),
      this.prisma.peminjaman.count({ where: { status: 'dipinjam' } }),
      this.prisma.peminjaman.findMany({
        where: { status: 'dipinjam', returnDate: { lt: new Date() } },
        include: { student: { select: { id: true, nama: true, nis: true } }, buku: { select: { id: true, title: true } } },
      }),
    ]);

    const totalDendaBerjalan = terlambat.reduce((acc, p) => acc + hitungDenda(p), 0);

    return {
      status: 'success',
      message: 'Statistik perpustakaan',
      data: {
        totalBuku,
        totalStudent,
        totalPeminjaman,
        peminjamanAktif: aktif,
        peminjamanTerlambat: terlambat.length,
        totalDendaBerjalan: `Rp ${totalDendaBerjalan.toLocaleString('id-ID')}`,
        detailTerlambat: terlambat.map((p) => ({
          ...p,
          hariTerlambat: Math.floor(
            (new Date().getTime() - new Date(p.returnDate).getTime()) / (1000 * 60 * 60 * 24),
          ),
          denda: `Rp ${hitungDenda(p).toLocaleString('id-ID')}`,
        })),
      },
    };
  }

  async remove(id: number) {
    const peminjaman = await this.prisma.peminjaman.findUnique({ where: { id } });
    if (!peminjaman) throw new NotFoundException(`Peminjaman dengan ID ${id} tidak ditemukan`);

    if (peminjaman.status === 'dipinjam') {
      await this.prisma.buku.update({
        where: { id: peminjaman.bukuId },
        data: { stock: { increment: 1 } },
      });
    }

    await this.prisma.peminjaman.delete({ where: { id } });
    return {
      status: 'success',
      message: `Peminjaman dengan ID ${id} berhasil dihapus`,
      data: peminjaman,
    };
  }
}
