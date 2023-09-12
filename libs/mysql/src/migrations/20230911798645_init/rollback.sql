DROP TABLE IF EXISTS `migrations`;

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

DROP TABLE IF EXISTS `permissions`;

DROP TABLE IF EXISTS `roles`;

DROP TABLE IF EXISTS `_permissions_to_roles`;

DROP TABLE IF EXISTS `_roles_to_users`;
