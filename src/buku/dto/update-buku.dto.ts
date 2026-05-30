import { PartialType } from '@nestjs/mapped-types';
import { CreateBukuDto } from './create-buku.dto';

export class UpdateBukuDto extends PartialType(CreateBukuDto) {
    title?: string;
    author?: string;
    year?: number;
}