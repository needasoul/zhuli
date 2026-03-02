# 🚀 快速上手指南 - 5 分钟开始使用

## 📍 一、访问地址汇总

### 1. 管理员后台登录
```
地址：http://你的域名/admin
示例：http://localhost/admin
示例：https://zl.nankeyimeng.xyz/admin
```

### 2. 用户端小程序
```
在微信中打开小程序
```

### 3. API 接口地址
```
基础地址：https://zl.nankeyimeng.xyz/api/
```

## 🔑 二、立即开始（3 步）

### 第 1 步：登录后台
1. 访问：`http://你的域名/admin`
2. 输入管理员账号密码
3. 点击登录

### 第 2 步：添加助力管理菜单
如果登录后看不到"助力管理"，按以下步骤添加：

#### 快速 SQL 添加（推荐）
```sql
-- 添加助力管理菜单（需要在后台菜单管理界面手动添加，或使用以下 SQL）
-- 注意：建议通过后台界面添加，以下 SQL 仅供参考

-- 1. 添加父级菜单
INSERT INTO `fa_auth_rule` (`pid`, `name`, `title`, `icon`, `url`, `ismenu`, `status`) 
VALUES (0, 'boost', '助力管理', 'fa fa-handshake-o', '', 1, 'normal');

-- 获取刚插入的 ID（假设为 100）
SET @boost_id = LAST_INSERT_ID();

-- 2. 添加助力任务子菜单
INSERT INTO `fa_auth_rule` (`pid`, `name`, `title`, `icon`, `url`, `ismenu`, `status`) 
VALUES (@boost_id, 'boost/task', '助力任务', 'fa fa-list', 'boost/task/index', 1, 'normal');

-- 3. 添加任务分类子菜单
INSERT INTO `fa_auth_rule` (`pid`, `name`, `title`, `icon`, `url`, `ismenu`, `status`) 
VALUES (@boost_id, 'boost/category', '任务分类', 'fa fa-th-list', 'boost/category/index', 1, 'normal');

-- 4. 添加助力订单子菜单
INSERT INTO `fa_auth_rule` (`pid`, `name`, `title`, `icon`, `url`, `ismenu`, `status`) 
VALUES (@boost_id, 'boost/order', '助力订单', 'fa fa-file-text', 'boost/order/index', 1, 'normal');
```

#### 手动添加（推荐新手）
1. 后台 → 系统管理 → 菜单管理 → 添加
2. 按照第一部分的说明逐个添加菜单
3. 保存并刷新权限

### 第 3 步：开始审核任务
1. 点击左侧菜单"助力管理" → "助力任务"
2. 查看待审核的任务列表
3. 勾选任务，点击"审核通过"或"审核拒绝"
4. 完成！

## 📊 三、数据库检查清单

### 执行以下 SQL 检查数据库
```sql
-- 1. 检查助力功能表是否存在
SHOW TABLES LIKE 'fa_boost_%';

-- 应该看到：
-- fa_boost_task
-- fa_boost_order
-- fa_boost_category
-- fa_boost_record

-- 2. 检查任务表结构
DESC fa_boost_task;

-- 应该包含 audit_status 字段

-- 3. 检查用户表是否有冻结金额字段
DESC fa_user;

-- 应该包含 freeze_money 字段

-- 4. 查看待审核任务
SELECT * FROM fa_boost_task WHERE audit_status = 'pending';

-- 5. 查看所有任务
SELECT * FROM fa_boost_task ORDER BY createtime DESC LIMIT 10;
```

## 🔧 四、快速配置检查

### 检查 1：后端文件是否存在
```bash
# 检查控制器
ls application/api/controller/Boost.php
ls application/admin/controller/boost/Task.php

# 检查模型
ls application/common/model/boost/Task.php

# 检查视图
ls application/admin/view/boost/task/index.html
```

### 检查 2：数据库是否更新
```sql
-- 执行更新 SQL
source boost_audit_update.sql;

-- 或手动执行
ALTER TABLE `fa_boost_task` 
ADD COLUMN `audit_status` enum('pending','passed','rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态' AFTER `status`;
```

### 检查 3：用户表字段
```sql
-- 添加冻结金额字段（如果不存在）
ALTER TABLE `fa_user` 
ADD COLUMN `freeze_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '冻结金额' AFTER `money`;
```

## 🎯 五、完整测试流程

### 测试 1：用户发布任务
1. 打开小程序 → 发布助力
2. 填写任务信息并提交
3. 提示"提交成功，请等待审核"

### 测试 2：后台审核任务
1. 登录后台 → 助力管理 → 助力任务
2. 看到刚才发布的任务（状态：待审核）
3. 勾选任务 → 点击"审核通过"
4. 任务状态变为"进行中"

### 测试 3：查看任务列表
1. 在小程序中刷新助力列表
2. 应该能看到已审核通过的任务

### 测试 4：资金检查
```sql
-- 查看用户资金变化
SELECT id, username, money, freeze_money 
FROM fa_user 
WHERE id = [用户 ID];

-- 查看任务状态
SELECT id, title, status, audit_status, deposit, total_amount 
FROM fa_boost_task 
WHERE id = [任务 ID];
```

## 📱 六、小程序端配置

### 检查小程序配置
```javascript
// uniapp/config.js
export default {
    serverIp: 'https://zl.nankeyimeng.xyz/api/',  // ✅ 确保地址正确
    uploadImgUrl: 'https://zl.nankeyimeng.xyz'
}
```

### 检查 API 调用
```javascript
// 发布任务 API
import { publishBoostTask } from '@/api/comm.js'

publishBoostTask({
    title: '测试任务',
    // ...其他参数
}).then(res => {
    console.log(res); // 应该返回"提交成功，请等待审核"
})
```

## 🔍 七、常见问题快速排查

### 问题 1：后台登录不上
```bash
# 检查域名配置
# 访问：http://你的域名/admin
# 如果 404，检查服务器配置
# 如果空白，检查 PHP 版本（建议 7.2+）
```

### 问题 2：看不到助力管理菜单
```sql
-- 方法 1：在后台菜单管理中添加（推荐）
-- 方法 2：执行上面的 SQL 添加菜单

-- 检查菜单是否存在
SELECT * FROM fa_auth_rule WHERE name LIKE 'boost%';
```

### 问题 3：发布任务报错
```bash
# 检查后端日志
tail -f runtime/log/*.log

# 检查数据库连接
# 检查 API 地址配置
```

### 问题 4：审核功能不可用
```sql
-- 检查是否有 audit_status 字段
DESC fa_boost_task;

-- 如果没有，执行更新 SQL
source boost_audit_update.sql;
```

## 📞 八、获取帮助

### 查看日志
```bash
# 查看应用日志
tail -f runtime/log/error.log

# 查看访问日志
tail -f runtime/log/access.log
```

### 调试模式
```php
// application/config.php
'app_debug' => true,  // 开启调试模式
```

### 官方文档
- FastAdmin: https://doc.fastadmin.net
- 助力功能：查看 BOOST_ADMIN_GUIDE.md

## ✅ 九、检查清单

完成以下检查，确保系统正常运行：

- [ ] 后台可以正常登录
- [ ] 添加了助力管理菜单
- [ ] 可以看到任务列表
- [ ] 数据库表结构完整
- [ ] 用户表有 freeze_money 字段
- [ ] 任务表有 audit_status 字段
- [ ] 小程序配置正确
- [ ] 可以发布任务
- [ ] 可以审核任务
- [ ] 资金变动正常

## 🎉 十、开始使用

现在你已经准备好了！

1. **登录后台**: `http://你的域名/admin`
2. **进入助力管理**: 左侧菜单 → 助力管理 → 助力任务
3. **开始审核**: 查看待审核任务，点击"审核通过"或"审核拒绝"

祝你使用愉快！🚀