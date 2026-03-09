-- =================================================================
-- Personal Finance Dashboard — Database Schema
-- =================================================================
-- Import: mysql -u <user> -p <your_database_name> < docs/schema.sql
-- =================================================================

-- Users
CREATE TABLE `users` (
  `id`            int(11)      NOT NULL AUTO_INCREMENT,
  `username`      varchar(255) NOT NULL,
  `email`         varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at`    timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Categories
CREATE TABLE `categories` (
  `id`         int(11)                  NOT NULL AUTO_INCREMENT,
  `user_id`    int(11)                  DEFAULT NULL,
  `name`       varchar(100)             NOT NULL,
  `type`       enum('income','expense') NOT NULL,
  `is_deleted` tinyint(1)               DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Transactions
CREATE TABLE `transactions` (
  `id`          int(11)                  NOT NULL AUTO_INCREMENT,
  `user_id`     int(11)                  DEFAULT NULL,
  `category_id` int(11)                  DEFAULT NULL,
  `title`       varchar(255)             NOT NULL,
  `amount`      decimal(10,2)            NOT NULL,
  `type`        enum('income','expense') NOT NULL,
  `date`        date                     NOT NULL,
  `note`        text                     DEFAULT NULL,
  `is_deleted`  tinyint(1)               DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`)     REFERENCES `users` (`id`)      ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Budgets
CREATE TABLE `budgets` (
  `id`          int(11)       NOT NULL AUTO_INCREMENT,
  `user_id`     int(11)       DEFAULT NULL,
  `category_id` int(11)       DEFAULT NULL,
  `amount`      decimal(10,2) NOT NULL,
  `month`       tinyint(4)    NOT NULL,
  `year`        smallint(6)   NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_budget_period` (`user_id`,`category_id`,`month`,`year`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`user_id`)     REFERENCES `users` (`id`)      ON DELETE CASCADE,
  CONSTRAINT `budgets_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
