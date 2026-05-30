import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BukuService } from './buku.service';
import { BukuController } from './buku.controller';

@Module({
  providers: [BukuService, PrismaService],
  controllers: [BukuController]
})
export class BukuModule {}
