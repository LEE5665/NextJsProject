/*
  Warnings:

  - You are about to drop the column `userId` on the `pm` table. All the data in the column will be lost.
  - Added the required column `reciverId` to the `Pm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Pm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pm` DROP FOREIGN KEY `Pm_userId_fkey`;

-- AlterTable
ALTER TABLE `pm` DROP COLUMN `userId`,
    ADD COLUMN `reciverId` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Pm` ADD CONSTRAINT `Pm_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pm` ADD CONSTRAINT `Pm_reciverId_fkey` FOREIGN KEY (`reciverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
