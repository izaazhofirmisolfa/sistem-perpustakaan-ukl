import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreatePeminjamanDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID student (opsional, jika tidak diisi akan pakai ID dari token JWT)',
  })
  @IsInt()
  @IsOptional()
  studentId?: number;

  @ApiProperty({ example: 1, description: 'ID buku yang dipinjam' })
  @IsInt()
  @IsNotEmpty()
  bukuId: number;

  @ApiPropertyOptional({
    example: '2026-05-30',
    description: 'Tanggal pinjam (default: hari ini)',
  })
  @IsDateString()
  @IsOptional()
  borrowDate?: string;

  @ApiProperty({ example: '2026-06-13', description: 'Tanggal wajib kembali' })
  @IsDateString()
  @IsNotEmpty()
  returnDate: string;
}
