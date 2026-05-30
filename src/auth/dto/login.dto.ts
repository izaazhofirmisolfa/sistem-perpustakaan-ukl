import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin123', description: 'Password' })
  @IsString()
  password: string;
}
