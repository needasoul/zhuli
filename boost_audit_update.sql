-- 助力功能数据库表结构更新 - 添加审核状态支持

-- 修改助力任务表，添加审核相关字段
ALTER TABLE `fa_boost_task` 
ADD COLUMN `audit_status` enum('pending','passed','rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态' AFTER `status`,
ADD COLUMN `audit_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '审核时间' AFTER `audit_status`,
ADD COLUMN `audit_remark` varchar(500) NOT NULL DEFAULT '' COMMENT '审核备注' AFTER `audit_time`,
ADD COLUMN `admin_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '审核管理员 ID' AFTER `audit_remark`;

-- 更新现有任务状态
UPDATE `fa_boost_task` SET `audit_status` = 'passed' WHERE `status` = 'active';
UPDATE `fa_boost_task` SET `audit_status` = 'rejected' WHERE `status` = 'cancelled';

-- 创建索引
ALTER TABLE `fa_boost_task` 
ADD INDEX `audit_status` (`audit_status`),
ADD INDEX `admin_id` (`admin_id`);