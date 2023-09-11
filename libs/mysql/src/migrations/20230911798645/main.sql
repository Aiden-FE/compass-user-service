DROP TABLE IF EXISTS `migrations`;
-- 创建迁移表
CREATE TABLE `migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `version` VARCHAR(64) NOT NULL COMMENT '版本标识',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `migrations_version_key` (`version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
-- 创建用户表
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(20) NULL COMMENT '手机号码',
    `email` VARCHAR(255) NULL COMMENT '邮箱',
    `name` VARCHAR(255) NULL COMMENT '真实姓名',
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# DROP TRIGGER IF EXISTS generate_user_uid_trigger;
-- 通过触发器自动生成uid 使用应用程序来保障此逻辑而不是触发器
# DELIMITER $$
# CREATE TRIGGER generate_user_uid_trigger
#     BEFORE INSERT ON `users`
#     FOR EACH ROW
# BEGIN
#     SET NEW.uid = UUID();
# END$$
# DELIMITER ;
