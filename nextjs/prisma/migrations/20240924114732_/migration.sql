-- AlterTable
ALTER TABLE `pm` ADD COLUMN `isDeletedByReceiver` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isDeletedBySender` BOOLEAN NOT NULL DEFAULT false;
