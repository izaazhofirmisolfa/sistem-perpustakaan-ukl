/*
  Warnings:

  - You are about to drop the column `isbn` on the `Buku` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `Buku` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Buku_isbn_key` ON `Buku`;

-- AlterTable
ALTER TABLE `Buku` DROP COLUMN `isbn`,
    DROP COLUMN `publisher`;

-- AlterTable
ALTER TABLE `Peminjaman` ALTER COLUMN `updatedAt` DROP DEFAULT;
