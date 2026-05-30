import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Sistem Perpustakaan API')
    .setDescription(
      `## API Sistem Perpustakaan Sekolah\n\n` +
      `### Fitur:\n` +
      `- **Auth**: Register, Login (JWT)\n` +
      `- **Buku**: CRUD buku + pencarian\n` +
      `- **Students**: Manajemen siswa\n` +
      `- **Peminjaman**: Pinjam, kembalikan, denda otomatis\n\n` +
      `### Cara pakai:\n` +
      `1. Login via \`/api/auth/login\`\n` +
      `2. Copy \`access_token\` dari response\n` +
      `3. Klik tombol **Authorize** di atas, paste token\n` +
      `4. Semua endpoint yang butuh auth akan otomatis terisi`
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 App running on port ${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
