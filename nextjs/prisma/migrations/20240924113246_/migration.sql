/*
  Warnings:

  - You are about to drop the column `reciverId` on the `pm` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Pm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pm` DROP FOREIGN KEY `Pm_reciverId_fkey`;

-- AlterTable
ALTER TABLE `pm` DROP COLUMN `reciverId`,
    ADD COLUMN `receiverId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Pm` ADD CONSTRAINT `Pm_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
