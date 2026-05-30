import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { PeminjamanService } from './peminjaman.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Peminjaman')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('peminjaman')
export class PeminjamanController {
  constructor(private readonly peminjamanService: PeminjamanService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PETUGAS, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Buat peminjaman buku',
    description:
      'MEMBER otomatis pakai ID dirinya sendiri dari token. ADMIN/PETUGAS harus isi `studentId`.',
  })
  async create(@Body() dto: CreatePeminjamanDto, @Request() req: any) {
    return this.peminjamanService.create(dto, req.user);
  }

  @Get('statistik')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Statistik perpustakaan + daftar yang terlambat (ADMIN/PETUGAS)' })
  async getStatistik() {
    return this.peminjamanService.getStatistik();
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS, UserRole.MEMBER)
  @ApiOperation({ summary: 'Cari peminjaman berdasarkan rentang tanggal pinjam' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-05-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-05-31' })
  async findByDate(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.peminjamanService.findByDate(start, end);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Ambil semua data peminjaman (ADMIN/PETUGAS)' })
  async findAll() {
    return this.peminjamanService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS, UserRole.MEMBER)
  @ApiOperation({ summary: 'Ambil detail peminjaman berdasarkan ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peminjamanService.findOne(id);
  }

  @Put(':id/pengembalian')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Kembalikan buku',
    description: 'Jika terlambat, response akan include info denda (Rp 1.000/hari)',
  })
  async returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.peminjamanService.returnBook(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Hapus data peminjaman (ADMIN/PETUGAS)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.peminjamanService.remove(id);
  }
}
