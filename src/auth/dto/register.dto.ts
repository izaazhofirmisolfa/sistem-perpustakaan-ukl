import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiPropertyOptional({ example: '12345', description: 'NIS siswa' })
  @IsOptional()
  @IsString()
  nis?: string;

  @ApiPropertyOptional({ example: 'Budi Santoso', description: 'Nama lengkap' })
  @IsOptional()
  @IsString()
  nama?: string;

  @ApiPropertyOptional({ example: 'budi@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'XI-A' })
  @IsOptional()
  @IsString()
  kelas?: string;

  @ApiPropertyOptional({ example: 'IPA' })
  @IsOptional()
  @IsString()
  jurusan?: string;

  @ApiProperty({ example: 'budi123', description: 'Username unik' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Minimal 6 karakter' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Hanya untuk admin' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
