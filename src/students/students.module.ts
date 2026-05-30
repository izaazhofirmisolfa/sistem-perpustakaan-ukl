import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  providers: [StudentsService, PrismaService],
  controllers: [StudentsController]
})
export class StudentsModule {}
