DROP TABLE IF EXISTS `migrations`;
-- 创建迁移表
CREATE TABLE `migrations`
(
    `id`         INTEGER     NOT NULL AUTO_INCREMENT,
    `version`    VARCHAR(64) NOT NULL COMMENT '版本标识',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `migrations_version_unique` (`version`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

DELIMITER //

CREATE PROCEDURE dropForeignKey()
BEGIN
    DECLARE tableExists INT;
    DECLARE table2Exists INT;

    SELECT COUNT(*)
    INTO tableExists
    FROM information_schema.tables
    WHERE table_name = '_roles_to_users';

    SELECT COUNT(*)
    INTO table2Exists
    FROM information_schema.tables
    WHERE table_name = '_permissions_to_roles';

    IF tableExists > 0 THEN
        ALTER TABLE _roles_to_users
            DROP FOREIGN KEY _roles_to_users_A_fkey;
        ALTER TABLE _roles_to_users
            DROP FOREIGN KEY _roles_to_users_B_fkey;
    END IF;

    IF table2Exists > 0 THEN
        ALTER TABLE _permissions_to_roles
            DROP FOREIGN KEY _permissions_to_roles_A_fkey;
        ALTER TABLE _permissions_to_roles
            DROP FOREIGN KEY _permissions_to_roles_B_fkey;
    END IF;
END //

DELIMITER ;

-- 移除外键关联
CALL dropForeignKey();
DROP PROCEDURE IF EXISTS dropForeignKey; -- 使用完成后删除该存储过程

DROP TABLE IF EXISTS `users`;
-- 创建用户表
CREATE TABLE `users`
(
    `id`         INTEGER      NOT NULL AUTO_INCREMENT,
    `uid`        VARCHAR(128) NOT NULL COMMENT '用户唯一uid',
    `enabled`    BOOLEAN      NOT NULL DEFAULT true COMMENT '是否启用',
    `telephone`  VARCHAR(20)  NULL COMMENT '手机号码',
    `password`   VARCHAR(255) NULL COMMENT '登录密码',
    `email`      VARCHAR(255) NULL COMMENT '邮箱',
    `name`       VARCHAR(50)  NULL COMMENT '真实姓名',
    `nickname`   VARCHAR(24)  NULL COMMENT '昵称',
    `gender`     INTEGER      NULL COMMENT '性别',
    `birthday`   DATE         NULL COMMENT '出生日期',
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_uid_unique` (`uid`),
    UNIQUE INDEX `users_telephone_unique` (`telephone`),
    UNIQUE INDEX `users_email_unique` (`email`),
    INDEX `users_uid_telephone_email_password_index` (`uid`, `telephone`, `email`, `password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `permissions`;
-- 创建权限表
CREATE TABLE `permissions`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `key`         VARCHAR(128) NOT NULL COMMENT '权限的唯一key',
    `name`        VARCHAR(24)  NOT NULL COMMENT '权限名称',
    `description` VARCHAR(255) NULL COMMENT '权限详细描述',
    `created_at`  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at`  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `permissions_key_unique` (`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `roles`;
-- 创建角色表
CREATE TABLE `roles`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(24)  NOT NULL COMMENT '角色名称',
    `is_system`   BOOLEAN      NOT NULL DEFAULT false COMMENT '是否为系统角色',
    `description` VARCHAR(255) NULL COMMENT '角色详细描述',
    `created_at`  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at`  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `roles_name_index` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `_permissions_to_roles`;
-- 创建中间表 权限角色 多对多
CREATE TABLE `_permissions_to_roles`
(
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_permissions_to_roles_AB_unique` (`A`, `B`),
    INDEX `_permissions_to_roles_B_index` (B)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `_roles_to_users`;
-- 创建中间表 角色用户 多对多
CREATE TABLE `_roles_to_users`
(
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_roles_to_users_AB_unique` (`A`, `B`),
    INDEX `_roles_to_users_B_index` (B)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 外键关联
-- 添加外键约束,声明外键为A,引用自permissions表的id字段,在删除或更新时级联
ALTER TABLE `_permissions_to_roles`
    ADD CONSTRAINT `_permissions_to_roles_A_fkey` FOREIGN KEY (`A`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `_permissions_to_roles`
    ADD CONSTRAINT `_permissions_to_roles_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_roles_to_users`
    ADD CONSTRAINT `_roles_to_users_A_fkey` FOREIGN KEY (`A`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `_roles_to_users`
    ADD CONSTRAINT `_roles_to_users_B_fkey` FOREIGN KEY (`B`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO `migrations` (`version`)
VALUES ('0.0.1');

INSERT INTO `permissions` (`key`, `name`, `description`)
VALUES ('permissions_create', '创建权限', NULL),
       ('permissions_delete', '删除权限', NULL),
       ('permissions_update', '修改权限', NULL),
       ('permissions_query', '查询权限', NULL),
       ('roles_create', '创建角色', NULL),
       ('roles_delete', '删除角色', NULL),
       ('roles_update', '修改角色', NULL),
       ('roles_query', '查询角色', NULL),
       ('users_create', '创建用户', NULL),
       ('users_delete', '删除用户', NULL),
       ('users_update', '修改用户', NULL),
       ('users_query', '查询用户', NULL);

INSERT INTO `roles` (name, is_system, description) VALUES ('administrator', true, '管理员');

INSERT INTO `users` (uid, password, email) VALUES ('29dfgb35-2hac-hehe-8309-fa232f687eb0', 'e6d4625ec09d7839749b70f303ffd204b1a7fed4', 'admin@system.com');

INSERT INTO `_permissions_to_roles` (`A`, `B`) SELECT p.id, r.id FROM permissions p, roles r WHERE r.name = 'administrator';
INSERT INTO `_roles_to_users` (`A`, `B`) SELECT r.id, u.id FROM roles r, users u WHERE r.name = 'administrator' AND u.email = 'admin@system.com';

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
