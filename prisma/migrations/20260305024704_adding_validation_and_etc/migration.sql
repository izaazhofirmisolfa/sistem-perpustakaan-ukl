/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `Buku` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Buku` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'Umum',
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `isbn` VARCHAR(191) NULL,
    ADD COLUMN `publisher` VARCHAR(191) NULL,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Peminjaman` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Buku_isbn_key` ON `Buku`(`isbn`);
