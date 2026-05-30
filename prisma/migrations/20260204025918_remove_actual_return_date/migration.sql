/*
  Warnings:

  - You are about to drop the column `actualReturnDate` on the `Peminjaman` table. All the data in the column will be lost.
  - You are about to alter the column `borrowDate` on the `Peminjaman` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `returnDate` on the `Peminjaman` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `Peminjaman` DROP COLUMN `actualReturnDate`,
    MODIFY `borrowDate` DATETIME(3) NOT NULL,
    MODIFY `returnDate` DATETIME(3) NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;
