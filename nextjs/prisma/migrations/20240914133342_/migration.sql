-- AlterTable
ALTER TABLE `post` ADD COLUMN `isPublic` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `_PostViewers` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PostViewers_AB_unique`(`A`, `B`),
    INDEX `_PostViewers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PostViewers` ADD CONSTRAINT `_PostViewers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostViewers` ADD CONSTRAINT `_PostViewers_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
