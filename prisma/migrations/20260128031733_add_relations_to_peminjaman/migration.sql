/*
  Warnings:

  - Added the required column `bukuId` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Peminjaman_borrowDate_key` ON `Peminjaman`;

-- AlterTable
ALTER TABLE `Peminjaman` ADD COLUMN `bukuId` INTEGER NOT NULL,
    ADD COLUMN `studentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_bukuId_fkey` FOREIGN KEY (`bukuId`) REFERENCES `Buku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
