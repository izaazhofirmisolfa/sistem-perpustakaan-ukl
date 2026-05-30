import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { BukuModule } from './buku/buku.module';
import { PeminjamanModule } from './peminjaman/peminjaman.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, StudentsModule, BukuModule, PeminjamanModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
