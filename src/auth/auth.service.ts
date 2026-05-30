import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register public - auto jadi MEMBER
  async register(dto: RegisterDto) {
    // Check username atau nis sudah ada
    const existingUser = await this.prisma.student.findFirst({
      where: {
        OR: [{ username: dto.username }, { nis: dto.nis }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username atau NIS sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const student = await this.prisma.student.create({
      data: {
        nis: dto.nis,
        nama : dto.nama,
        email: dto.email,
        kelas: dto.kelas,
        jurusan: dto.jurusan,
        username: dto.username,
        password: hashedPassword,
        role: UserRole.MEMBER, // Default MEMBER untuk public register
      },
    });

    return {
      status: 'success',
      message: 'Register berhasil',
      data: {
        id: student.id,
        username: student.username,
        role: student.role,
      },
    };
  }

  // Register by Admin - bisa set role apapun
  async registerByAdmin(dto: RegisterDto, requestedRole: UserRole) {
    const existingUser = await this.prisma.student.findFirst({
      where: {
        OR: [{ username: dto.username }, { nis: dto.nis }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username atau NIS sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const student = await this.prisma.student.create({
      data: {
        nis: dto.nis,
        nama: dto.nama,
        email: dto.email,
        kelas: dto.kelas,
        jurusan: dto.jurusan,
        username: dto.username,
        password: hashedPassword,
        role: requestedRole, // ADMIN bisa set role
      },
    });

    return {
      status: 'success',
      message: `User ${requestedRole} berhasil dibuat`,
      data: {
        id: student.id,
        username: student.username,
        role: student.role,
      },
    };
  }

  async login(username: string, password: string) {
    const user = await this.prisma.student.findFirst({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Username tidak ditemukan');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      nis: user.nis,
    };

    return {
      status: 'success',
      message: 'Login berhasil',
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
