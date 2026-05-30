import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tambah student baru (ADMIN)' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Ambil semua student' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('search/nama')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Cari student berdasarkan nama' })
  @ApiQuery({ name: 'nama', required: true, example: 'Budi' })
  findByNama(@Query('nama') nama: string) {
    return this.studentsService.findByNama(nama);
  }

  @Get('search/nis')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Cari student berdasarkan NIS' })
  @ApiQuery({ name: 'nis', required: true, example: '12345' })
  findByNis(@Query('nis') nis: string) {
    return this.studentsService.findByNis(nis);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Ambil student berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  @Get(':id/peminjaman')
  @Roles(UserRole.ADMIN, UserRole.PETUGAS, UserRole.MEMBER)
  @ApiOperation({ summary: 'Riwayat peminjaman + denda student tertentu' })
  getPeminjaman(@Param('id') id: string) {
    return this.studentsService.getPeminjamanByStudent(Number(id));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update data student (ADMIN)' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Hapus student (ADMIN)' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
