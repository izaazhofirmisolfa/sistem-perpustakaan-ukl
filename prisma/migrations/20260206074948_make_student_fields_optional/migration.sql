-- AlterTable
ALTER TABLE `Peminjaman` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Student` MODIFY `nis` VARCHAR(191) NULL,
    MODIFY `kelas` VARCHAR(191) NULL,
    MODIFY `jurusan` VARCHAR(191) NULL;
