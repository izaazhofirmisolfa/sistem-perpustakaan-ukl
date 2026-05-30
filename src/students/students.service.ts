import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../../prisma/prisma.service';

// Helper to strip password from student object
function omitPassword(student: any) {
  if (!student) return student;
  const { password, ...rest } = student;
  return rest;
}

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const student = await this.prisma.student.create({ data: dto });
    return {
      status: 'success',
      message: 'Student berhasil ditambahkan',
      data: omitPassword(student),
    };
  }

  async findAll() {
    const students = await this.prisma.student.findMany({ orderBy: { id: 'desc' } });
    return {
      status: 'success',
      message: 'Data student berhasil diambil',
      data: students.map(omitPassword),
    };
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student tidak ditemukan');
    return {
      status: 'success',
      message: `Data student ID ${id} berhasil diambil`,
      data: omitPassword(student),
    };
  }

  async findByNis(nis: string) {
    const students = await this.prisma.student.findMany({ where: { nis } });
    if (!students || students.length === 0) throw new NotFoundException('Student tidak ditemukan');
    return {
      status: 'success',
      message: `Data student dengan NIS "${nis}" berhasil diambil`,
      data: students.map(omitPassword),
    };
  }

  async findByNama(nama: string) {
    const students = await this.prisma.student.findMany({
      where: { nama: { contains: nama } },
    });
    if (!students || students.length === 0) throw new NotFoundException('Student tidak ditemukan');
    return {
      status: 'success',
      message: `Data student dengan nama "${nama}" berhasil diambil`,
      data: students.map(omitPassword),
    };
  }

  // Riwayat peminjaman per siswa
  async getPeminjamanByStudent(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student tidak ditemukan');

    const peminjaman = await this.prisma.peminjaman.findMany({
      where: { studentId: id },
      include: { buku: true },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const data = peminjaman.map((p) => {
      const terlambat = p.status === 'dipinjam' && now > p.returnDate;
      const hariTerlambat = terlambat
        ? Math.floor((now.getTime() - p.returnDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      const denda = hariTerlambat * 1000;
      return { ...p, terlambat, hariTerlambat, denda };
    });

    return {
      status: 'success',
      message: `Riwayat peminjaman student ID ${id}`,
      data: { student: omitPassword(student), peminjaman: data },
    };
  }

  async update(id: number, dto: UpdateStudentDto) {
    const existing = await this.prisma.student.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Student tidak ditemukan');
    const student = await this.prisma.student.update({ where: { id }, data: dto });
    return {
      status: 'success',
      message: `Student ID ${id} berhasil diupdate`,
      data: omitPassword(student),
    };
  }

  async remove(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student tidak ditemukan');
    await this.prisma.student.delete({ where: { id } });
    return {
      status: 'success',
      message: `Student ID ${id} berhasil dihapus`,
      data: omitPassword(student),
    };
  }
}
