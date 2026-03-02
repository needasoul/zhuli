-- 助力功能数据库表结构

-- ----------------------------
-- Table structure for boost_category
-- ----------------------------
DROP TABLE IF EXISTS `fa_boost_category`;
CREATE TABLE `fa_boost_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '分类名称',
  `weigh` int(10) NOT NULL DEFAULT '0' COMMENT '权重',
  `status` enum('normal','hidden') NOT NULL DEFAULT 'normal' COMMENT '状态',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `weigh` (`weigh`,`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='助力分类表';

-- ----------------------------
-- Records of fa_boost_category
-- ----------------------------
BEGIN;
INSERT INTO `fa_boost_category` VALUES (1, '电商购物', 1, 'normal', 1700000000, 1700000000);
INSERT INTO `fa_boost_category` VALUES (2, '生活服务', 2, 'normal', 1700000000, 1700000000);
INSERT INTO `fa_boost_category` VALUES (3, '游戏娱乐', 3, 'normal', 1700000000, 1700000000);
INSERT INTO `fa_boost_category` VALUES (4, '金融理财', 4, 'normal', 1700000000, 1700000000);
INSERT INTO `fa_boost_category` VALUES (5, '其他', 5, 'normal', 1700000000, 1700000000);
COMMIT;

-- ----------------------------
-- Table structure for boost_task
-- ----------------------------
DROP TABLE IF EXISTS `fa_boost_task`;
CREATE TABLE `fa_boost_task` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
  `category_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '分类ID',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '任务标题',
  `description` text COMMENT '任务描述',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '助力单价',
  `total` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '总需助力数',
  `completed` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '已完成助力数',
  `platform` varchar(50) NOT NULL DEFAULT '' COMMENT '平台名称',
  `link` varchar(500) NOT NULL DEFAULT '' COMMENT '助力链接',
  `notes` text COMMENT '注意事项',
  `status` enum('active','completed','cancelled','expired') NOT NULL DEFAULT 'active' COMMENT '任务状态',
  `deposit` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '押金金额',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '总金额',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `completetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '完成时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  KEY `status` (`status`),
  KEY `createtime` (`createtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='助力任务表';

-- ----------------------------
-- Table structure for boost_order
-- ----------------------------
DROP TABLE IF EXISTS `fa_boost_order`;
CREATE TABLE `fa_boost_order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
  `task_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '任务ID',
  `order_no` varchar(32) NOT NULL DEFAULT '' COMMENT '订单号',
  `type` enum('publish','assist') NOT NULL DEFAULT 'publish' COMMENT '订单类型',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '订单金额',
  `status` enum('pending','paid','completed','cancelled','refunded') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  `paytime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '支付时间',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `task_id` (`task_id`),
  KEY `order_no` (`order_no`),
  KEY `status` (`status`),
  KEY `createtime` (`createtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='助力订单表';

-- ----------------------------
-- Table structure for boost_record
-- ----------------------------
DROP TABLE IF EXISTS `fa_boost_record`;
CREATE TABLE `fa_boost_record` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '助力用户ID',
  `task_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '任务ID',
  `assist_count` int(10) unsigned NOT NULL DEFAULT '1' COMMENT '助力次数',
  `status` enum('pending','confirmed','completed','rejected') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `screenshot` varchar(500) NOT NULL DEFAULT '' COMMENT '截图凭证',
  `rating` tinyint(1) NOT NULL DEFAULT '0' COMMENT '评分',
  `comment` varchar(500) NOT NULL DEFAULT '' COMMENT '评价内容',
  `earn_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '获得金额',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `completetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '完成时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `task_id` (`task_id`),
  KEY `status` (`status`),
  KEY `createtime` (`createtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='助力记录表';