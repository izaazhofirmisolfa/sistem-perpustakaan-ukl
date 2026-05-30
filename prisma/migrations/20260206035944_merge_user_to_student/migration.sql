/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_memberId_fkey`;

-- AlterTable
ALTER TABLE `Peminjaman` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('ADMIN', 'PETUGAS', 'MEMBER') NULL,
    ADD COLUMN `username` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `User`;

-- CreateIndex
CREATE UNIQUE INDEX `Student_username_key` ON `Student`(`username`);
