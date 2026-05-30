import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class BorrowFilterDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}