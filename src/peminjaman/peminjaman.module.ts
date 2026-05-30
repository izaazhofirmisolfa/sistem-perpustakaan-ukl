import { Module} from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { PeminjamanController } from './peminjaman.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PeminjamanService],
  controllers: [PeminjamanController]
})
export class PeminjamanModule {}
