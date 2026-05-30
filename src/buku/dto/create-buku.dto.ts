import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBukuDto {
  @ApiProperty({ example: 'Laskar Pelangi', description: 'Judul buku' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Andrea Hirata' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ example: 2005 })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ example: 'Fiksi', description: 'Kategori buku' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 5, description: 'Jumlah stok (default: 1)' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : 1))
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'Novel tentang persahabatan anak Belitung' })
  @IsOptional()
  @IsString()
  description?: string;
}
