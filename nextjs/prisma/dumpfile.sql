/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.5.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: model
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `_posttotag`
--

DROP TABLE IF EXISTS `_posttotag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_posttotag` (
  `A` int(11) NOT NULL,
  `B` int(11) NOT NULL,
  UNIQUE KEY `_PostToTag_AB_unique` (`A`,`B`),
  KEY `_PostToTag_B_index` (`B`),
  CONSTRAINT `_PostToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_PostToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_posttotag`
--

LOCK TABLES `_posttotag` WRITE;
/*!40000 ALTER TABLE `_posttotag` DISABLE KEYS */;
INSERT INTO `_posttotag` VALUES
(4,1),
(7,1),
(8,1),
(9,1),
(10,1),
(11,1),
(16,1),
(3,2),
(6,3),
(12,4),
(15,6),
(19,6),
(18,7),
(18,8),
(18,9),
(18,10),
(20,11);
/*!40000 ALTER TABLE `_posttotag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_postviewers`
--

DROP TABLE IF EXISTS `_postviewers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_postviewers` (
  `A` int(11) NOT NULL,
  `B` varchar(191) NOT NULL,
  UNIQUE KEY `_PostViewers_AB_unique` (`A`,`B`),
  KEY `_PostViewers_B_index` (`B`),
  CONSTRAINT `_PostViewers_A_fkey` FOREIGN KEY (`A`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_PostViewers_B_fkey` FOREIGN KEY (`B`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_postviewers`
--

LOCK TABLES `_postviewers` WRITE;
/*!40000 ALTER TABLE `_postviewers` DISABLE KEYS */;
INSERT INTO `_postviewers` VALUES
(19,'test');
/*!40000 ALTER TABLE `_postviewers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES
('0bf60572-29d2-48db-bdd2-e3163b5715d6','b50cabc8ceb30fc8127102c20cf3fa89b9f20b3dc15e7abddf068a787b71cb4e','2024-09-17 11:23:42.692','20240917112342_',NULL,NULL,'2024-09-17 11:23:42.570',1),
('31efe096-bbf7-4795-aaac-cf0dec9e60cb','109f3a4c70ba817d1161bb632f84284dd8a8e7875bd44306fe3675001242b084','2024-09-24 11:24:13.768','20240924112413_',NULL,NULL,'2024-09-24 11:24:13.667',1),
('372f6d21-afe6-422f-b44c-54cc443af60e','68aeddba2929b9ce80dbc26dffccfabeb48b2fd3f6bfc7eb3b9c4eb607be59dc','2024-09-24 11:32:47.019','20240924113246_',NULL,NULL,'2024-09-24 11:32:46.948',1),
('4dd98630-8b3c-4611-9702-d7aa0c4161b0','572c431d6f1f6b0ea6df2defe0147e2cca27a9cfb97972e40d15086c81ebb598','2024-09-21 09:11:45.508','20240921091145_',NULL,NULL,'2024-09-21 09:11:45.466',1),
('59baa5ae-b18f-449b-8012-53ad602af55b','5f93ed3e65107aa0e2b879611c42630687e1d3fee10a819cf77d75880c600fa4','2024-09-17 11:41:04.112','20240917114103_',NULL,NULL,'2024-09-17 11:41:03.993',1),
('6ab172d6-896f-4057-9694-309940444a10','abc7d52cac3574955f5472477f7688ed332b4719e3de164df9d2bfbe9c978630','2024-09-24 09:03:03.184','20240924015156_',NULL,NULL,'2024-09-24 09:03:03.129',1),
('6de982b6-3ff8-44e3-8d1a-7b8fd4f3078c','3d3e0574840c9ce69af212a98c3684a9bad155a8b628165aa1ed2062fda376b0','2024-09-24 09:03:03.453','20240924025808_',NULL,NULL,'2024-09-24 09:03:03.431',1),
('6f70050c-c492-4fd4-a4fb-9c73f955d173','fdddbd513beeba3921845128d4a0d50a09d1586d65e6cfce1b3522d237cc4a4c','2024-09-24 11:47:32.462','20240924114732_',NULL,NULL,'2024-09-24 11:47:32.441',1),
('73aa6f90-b084-48dc-b095-aba4b3c1e12b','b43e8badbf041d66e29983c738a66ed6730975e89206f7ee0f168c4a00ca1e39','2024-09-24 09:03:03.346','20240924021032_',NULL,NULL,'2024-09-24 09:03:03.185',1),
('7445de2d-831f-4721-b3aa-8118a464ccb5','cd6d1589309f58f051338ea2c692f20649597a3401bf64b207cc8a83436b9bbd','2024-09-17 11:21:44.418','20240917112144_',NULL,NULL,'2024-09-17 11:21:44.298',1),
('7c5c66b9-33ed-4234-b245-e601a8cba022','0b3f89c5ddc38205bd0b5e7862d7d9f96b4c7e98256d02d6ed2e5449e4c89b26','2024-09-19 03:07:45.002','20240919030744_',NULL,NULL,'2024-09-19 03:07:44.977',1),
('7cd6dbb6-b173-426a-897c-bc6ebbb00d83','8c90a33bd4561e4fce0d028470246a97359090466584b7364206a0e92bf70e2b','2024-09-24 11:30:37.444','20240924113037_',NULL,NULL,'2024-09-24 11:30:37.421',1),
('7e0f4e01-b85d-4a17-9f8b-97bf4706ae82','0c17a642961f80d984024ccdc11afec0ea8bf07c2cea6d57b20cec77eb2c4a5d','2024-09-24 09:03:03.429','20240924025016_',NULL,NULL,'2024-09-24 09:03:03.348',1),
('94bb8656-4166-4ddd-99ea-ba3165f1fab2','0d4623b53181dfae0c1642a3074d0ce8a5e14d6946da40cf62f516500607d370','2024-09-17 11:19:40.651','20240917111940_',NULL,NULL,'2024-09-17 11:19:40.339',1),
('c0606276-fd81-4a1e-84f2-c9b68c1d5a6a','6d18d077a6cc8dce4bbb4ebcc8eba52ce4b0197d6c600552c08e5c614f78a64e','2024-09-17 11:38:24.177','20240917113824_',NULL,NULL,'2024-09-17 11:38:24.057',1),
('c3f181e1-842f-4da8-bc2b-49614a1a74c1','cd6d1589309f58f051338ea2c692f20649597a3401bf64b207cc8a83436b9bbd','2024-09-17 11:30:36.224','20240917113036_',NULL,NULL,'2024-09-17 11:30:36.103',1),
('de1c3994-629c-43e2-9ddd-dfbd1d15547d','3830dbe815c521574b287b4f16beeb94f424202d7f6f7508ac3e67d5d81b275d','2024-09-20 10:21:17.739','20240920102117_',NULL,NULL,'2024-09-20 10:21:17.717',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alarm`
--

DROP TABLE IF EXISTS `alarm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `userId` varchar(191) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Alarm_userId_fkey` (`userId`),
  CONSTRAINT `Alarm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarm`
--

LOCK TABLES `alarm` WRITE;
/*!40000 ALTER TABLE `alarm` DISABLE KEYS */;
/*!40000 ALTER TABLE `alarm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` mediumtext NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  `authorId` varchar(191) DEFAULT NULL,
  `postId` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Comment_postId_fkey` (`postId`),
  KEY `Comment_authorId_fkey` (`authorId`),
  KEY `Comment_parentId_fkey` (`parentId`),
  CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `comment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES
(1,'13242134','2024-09-17 11:24:30.000',NULL,NULL,1,NULL,'1234'),
(2,'312132312','2024-09-17 11:24:39.000',NULL,NULL,1,NULL,'123321132'),
(3,'123','2024-09-17 11:25:11.000',NULL,NULL,1,NULL,'123'),
(4,'123321','2024-09-17 11:36:05.000',NULL,'yttr',1,1,NULL),
(5,'123','2024-09-18 15:35:31.000',NULL,'yttr',16,NULL,''),
(6,'321132','2024-09-18 16:09:35.000',NULL,'yttr',16,NULL,''),
(7,'14324321143','2024-09-18 16:09:35.000',NULL,'yttr',16,NULL,''),
(8,'싫다','2024-09-18 17:07:37.000',NULL,'yttr',18,NULL,''),
(9,'빨리 만들어봐 해보게','2024-09-19 05:12:20.000',NULL,NULL,18,NULL,'111');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pm`
--

DROP TABLE IF EXISTS `pm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `senderId` varchar(191) NOT NULL,
  `receiverId` varchar(191) NOT NULL,
  `isDeletedByReceiver` tinyint(1) NOT NULL DEFAULT 0,
  `isDeletedBySender` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `Pm_senderId_fkey` (`senderId`),
  KEY `Pm_receiverId_fkey` (`receiverId`),
  CONSTRAINT `Pm_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Pm_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pm`
--

LOCK TABLES `pm` WRITE;
/*!40000 ALTER TABLE `pm` DISABLE KEYS */;
INSERT INTO `pm` VALUES
(5,'11','123','2024-09-24 11:33:12.000','yttr','yttr',1,1),
(6,'11','12322','2024-09-24 11:33:15.000','yttr','yttr',1,1),
(7,'113123','213312321','2024-09-24 12:00:29.000','yttr','yttr',1,1),
(8,'113123','2133123211324','2024-09-24 12:00:31.000','yttr','yttr',1,1),
(9,'113123','213312321132412321213','2024-09-24 12:00:32.000','yttr','yttr',1,1),
(10,'113123','121221312323132131233123','2024-09-24 12:00:35.000','yttr','yttr',1,1),
(11,'113123','345','2024-09-24 12:59:44.000','yttr','yttr',0,0);
/*!40000 ALTER TABLE `pm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `content` mediumtext NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `authorId` varchar(191) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `isPrivate` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `Post_authorId_fkey` (`authorId`),
  CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES
(1,'123','<p>123</p>','2024-09-17 11:24:24.000',NULL,26,NULL,'333',0),
(3,'111','<p>111</p>','2024-09-17 16:16:40.000',NULL,1,'123',NULL,0),
(4,'123','<p>123<img src=\"/uploads/b05d9f81-250b-4ac2-91de-993f02748e93-image.png\"></p>','2024-09-17 16:16:53.000',NULL,3,'123',NULL,0),
(6,'3','<p>3<img src=\"/uploads/40c579ef-b0bc-4f7f-b487-013737850b87-image.png\"></p>','2024-09-17 16:48:42.000',NULL,2,NULL,'3',0),
(7,'123','<p><img src=\"/uploads/2191359c-e998-4dd3-9950-a32415740362-image.png\"></p>','2024-09-17 16:54:44.000',NULL,0,NULL,'123',0),
(8,'123','<p><img src=\"/uploads/e77fa803-d101-48b1-9fc0-9bd7d83b1920-image.png\"></p>','2024-09-17 16:56:01.000',NULL,2,NULL,'123',0),
(9,'123','<p>123<img src=\"/uploads/c1d2bba7-821e-40cb-bb3c-1ae7a58d48d5-image.png\"></p>','2024-09-17 17:01:08.000',NULL,2,NULL,'123',0),
(10,'123','<p>123<img src=\"/api/public/uploads/61ba7229-84ce-449d-9f73-c1b7a87aed48-image.png\"></p>','2024-09-17 18:00:08.000',NULL,3,NULL,'123',0),
(11,'123','<p><img src=\"/api/public/uploads/9a270a78-c18f-408a-b6c4-327ac1bb7f48-image.png\"></p>','2024-09-17 18:01:50.000',NULL,5,NULL,'123',0),
(12,'33','<p>33</p>','2024-09-18 11:57:36.000',NULL,2,'yttr',NULL,0),
(15,'33','<p>33</p>','2024-09-18 15:30:08.000',NULL,3,'yttr',NULL,0),
(16,'123','<p><img src=\"/api/public/uploads/b0482b08-bec2-422b-93c3-6f3fdc4e3017-image.png\"></p>','2024-09-18 15:30:17.000',NULL,20,'yttr',NULL,0),
(18,'관리자는 \"석유가 되기 싫은 옌룡\" 게임을 만들어라','<p class=\"ql-align-center\"><img src=\"https://yt3.googleusercontent.com/TICv4zs_Q8j6sPBlHsS97MpLsusKv09_orejWb2Hs06QKRtyx4zs3D-7PJBf6OJOK5hzAXb3Hg=s900-c-k-c0x00ffffff-no-rj\" alt=\"옌룡 다시보기 - YouTube\"></p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\"><strong class=\"ql-size-huge\">만들어라!!!!!!!!!</strong></p>','2024-09-18 16:35:22.000',NULL,21,NULL,'1234',0),
(19,'11','<p>11</p>','2024-09-18 17:39:35.000',NULL,17,'yttr',NULL,1),
(20,'프로그래밍이란..','<p><img src=\"/api/public/uploads/6559fc39-752e-4cb1-812c-89463a436294-image.png\"></p>','2024-09-19 01:18:25.000',NULL,65,'yttr',NULL,0);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES
(2,'111'),
(4,'112'),
(1,'123'),
(5,'2'),
(3,'3'),
(6,'33'),
(8,'관리자'),
(7,'옌룡'),
(11,'이런 것..?'),
(9,'추가 하라고'),
(10,'키에에엑');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todo`
--

DROP TABLE IF EXISTS `todo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `isCompleted` tinyint(1) NOT NULL DEFAULT 0,
  `date` datetime(3) NOT NULL,
  `userId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ToDo_userId_fkey` (`userId`),
  CONSTRAINT `ToDo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todo`
--

LOCK TABLES `todo` WRITE;
/*!40000 ALTER TABLE `todo` DISABLE KEYS */;
INSERT INTO `todo` VALUES
(63,'할 일','[{\"text\":\"등운동\",\"checked\":true},{\"text\":\"기타치기\",\"checked\":true}]',0,'2024-09-22 09:00:00.000','yttr'),
(64,'할 일','[{\"text\":\"가슴운동\",\"checked\":false},{\"text\":\"기타치기\",\"checked\":false},{\"text\":\"영어공부\",\"checked\":false}]',0,'2024-09-23 09:00:00.000','yttr');
/*!40000 ALTER TABLE `todo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `nickname` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `verificationExpires` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_nickname_key` (`nickname`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
('123','123','123','123@123','$2a$10$Hz6nMg5c9bV7PTjBKjkGCukWoMbECrIN02QgIwv/8oOYZiQhbpW3a','2024-09-17 16:11:01.000',NULL,0,'2024-09-20 19:21:17.719'),
('das','asd','dsa','afsd@gmail.com','$2a$10$2JfDLFIhxMIYAg6M8AamG.DN2ov8mp6DqgicAf3aG3/kLnIgFSE9i','2024-09-20 11:49:20.000',NULL,0,'2024-09-20 12:49:20.000'),
('onitra3','이정재','릐정재','onitra3@naver.com','$2a$10$pi1NMvOaziq57juPATvFWOnLPzJntYNEkKuFlm89N6lClNpyDPhFG','2024-09-20 14:29:34.000',NULL,1,'2024-09-20 15:29:34.000'),
('test','test','테스트닉네임','test@test','$2a$10$B.JQj/AKtxTr7j49fxcBq.v54I/XmRlS0w7d9osczBLzcx7lq85p6','2024-09-18 16:27:28.000',NULL,0,'2024-09-20 19:21:17.719'),
('test3','test3','테스트','test3@test','$2a$10$IodxcmpwCw880rmZh0vTUegIxpjcau8LDE.1y88td0UpDC5yhhToi','2024-09-19 03:02:21.000',NULL,0,'2024-09-20 19:21:17.719'),
('test5','test5','test5','test5@test','$2a$10$09jZeKirkuqtrmSRil4O6.F6FWc65CNdpHdojcqwMa8LEXLiMLMrG','2024-09-19 07:05:09.000',NULL,0,'2024-09-20 19:21:17.719'),
('testtest','123','1231','123@gmail.com','$2a$10$dWJAZrOqLAmMxqtX9Cn6W.gw63xKgxJEGh9FjRw6oVkp7vlzxgnI6','2024-09-20 11:47:40.000',NULL,0,'2024-09-20 12:47:40.000'),
('yttr','yttr','나다','yttr309@naver.com','$2a$10$pt9.TSr83ZP8LGCnpJJ.pezvoRo8dTwTFj/P4WKeWls2y9aV5CFEm','2024-09-17 11:25:05.000','2024-09-21 06:42:47.000',1,'2024-09-20 19:21:17.719');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-09-24 22:27:00
