-- DropIndex
DROP INDEX `Student_username_key` ON `Student`;

-- AlterTable
ALTER TABLE `Peminjaman` ALTER COLUMN `updatedAt` DROP DEFAULT;
