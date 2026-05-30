import { Controller, Param, Post, Body, Get, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BukuService } from './buku.service';
import { CreateBukuDto } from './dto/create-buku.dto';
import { UpdateBukuDto } from './dto/update-buku.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Buku')
@Controller('buku')
export class BukuController {
  constructor(private readonly bukuService: BukuService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tambah buku baru (ADMIN / PETUGAS)' })
  create(@Body() dto: CreateBukuDto) {
    return this.bukuService.create(dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Cari buku berdasarkan judul' })
  @ApiQuery({ name: 'title', required: true, example: 'Laskar' })
  searchByTitle(@Query('title') title: string) {
    return this.bukuService.searchByTitle(title);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua buku' })
  findAll() {
    return this.bukuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil buku berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.bukuService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update buku (ADMIN / PETUGAS)' })
  update(@Param('id') id: string, @Body() dto: UpdateBukuDto) {
    return this.bukuService.update(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Hapus buku (ADMIN)' })
  remove(@Param('id') id: string) {
    return this.bukuService.remove(Number(id));
  }
}
