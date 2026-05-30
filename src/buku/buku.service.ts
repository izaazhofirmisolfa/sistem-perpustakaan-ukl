import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateBukuDto } from './dto/update-buku.dto';
import { CreateBukuDto } from './dto/create-buku.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BukuService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBukuDto) {
    const buku = await this.prisma.buku.create({ data: dto });
    return {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: buku,
    };
  }

  async findAll() {
    const bukuList = await this.prisma.buku.findMany({ orderBy: { id: 'desc' } });
    return {
      status: 'success',
      message: 'Data buku berhasil diambil',
      data: bukuList,
    };
  }

  async searchByTitle(title: string) {
    const bukuList = await this.prisma.buku.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      orderBy: { id: 'desc' },
    });
    return {
      status: 'success',
      message: `Hasil pencarian buku dengan judul "${title}"`,
      data: bukuList,
    };
  }

  async findOne(id: number) {
    const buku = await this.prisma.buku.findUnique({ where: { id } });
    if (!buku) throw new NotFoundException('Buku tidak ditemukan');
    return {
      status: 'success',
      message: `Data buku ID ${id} berhasil diambil`,
      data: buku,
    };
  }

  async update(id: number, dto: UpdateBukuDto) {
    await this.prisma.buku.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException('Buku tidak ditemukan');
    });
    const buku = await this.prisma.buku.update({
      where: { id },
      data: dto,
    });
    return {
      status: 'success',
      message: `Buku ID ${id} berhasil diupdate`,
      data: buku,
    };
  }

  async remove(id: number) {
    const buku = await this.prisma.buku.findUnique({ where: { id } });
    if (!buku) throw new NotFoundException('Buku tidak ditemukan');
    await this.prisma.buku.delete({ where: { id } });
    return {
      status: 'success',
      message: `Buku ID ${id} berhasil dihapus`,
      data: buku,
    };
  }
}
