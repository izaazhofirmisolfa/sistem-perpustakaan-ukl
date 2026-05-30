import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateStudentDto {
  @ApiPropertyOptional({ example: '12345' })
  @IsOptional()
  @IsString()
  nis?: string;

  @ApiPropertyOptional({ example: 'Budi Santoso' })
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
}
