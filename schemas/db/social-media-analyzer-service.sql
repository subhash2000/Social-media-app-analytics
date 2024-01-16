CREATE DATABASE IF NOT EXISTS social_media_analytics CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `health`;
CREATE TABLE `health` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `Posts`;
CREATE TABLE Posts (
    uniqueIdentifier VARCHAR(255) PRIMARY KEY,
    wordCount INTEGER,
    averageWordLength FLOAT,
    createdAt DATETIME,
    updatedAt DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

