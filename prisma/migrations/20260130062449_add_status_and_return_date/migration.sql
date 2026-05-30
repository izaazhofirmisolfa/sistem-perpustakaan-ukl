-- AlterTable
ALTER TABLE `Peminjaman` ADD COLUMN `actualReturnDate` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'dipinjam';
