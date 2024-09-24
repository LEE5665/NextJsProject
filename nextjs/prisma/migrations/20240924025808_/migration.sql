/*
  Warnings:

  - Added the required column `count` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alarm` ADD COLUMN `count` INTEGER NOT NULL;
