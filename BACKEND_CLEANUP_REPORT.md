# 后端文件使用情况分析报告

## 一、前端实际调用的 API 列表

### 1. 用户相关 (user/)
- ✅ `user/login` - 微信登录
- ✅ `user/getUserInfo` - 获取用户信息
- ✅ `user/profile` - 修改用户信息
- ✅ `user/logout` - 退出登录
- ✅ `user/binding` - 绑定微信
- ✅ `user/getopenid` - 获取 openid
- ✅ `user/getjmlogin` - 加密登录

### 2. 短信验证码 (sms/)
- ✅ `sms/send` - 发送验证码
- ✅ `sms/check` - 校验验证码

### 3. 场馆相关 (venue/)
- ✅ `venue/getType` - 获取场馆分类
- ✅ `venue/getPrices` - 获取价格区间
- ✅ `venue/getVenue` - 获取场馆列表
- ✅ `venue/getVenueDetail` - 获取场馆详情
- ✅ `venue/getArea` - 获取场地信息
- ✅ `venue/getVenueType` - 获取场馆类型
- ✅ `venue/times` - 获取场地时间
- ✅ `venue/getRmVenue` - 获取热门场馆

### 4. 订单相关 (order/)
- ✅ `order/before` - 预申请
- ✅ `order/create` - 创建订单
- ✅ `order/pay` - 发起支付
- ✅ `order/list` - 订单列表
- ✅ `order/detail` - 订单详情
- ✅ `order/recharge` - 充值优惠列表
- ✅ `order/walletList` - 钱包列表
- ✅ `order/rechargeList` - 充值订单列表
- ✅ `order/refund` - 退款申请
- ✅ `order/cancel` - 取消订单

### 5. 优惠券相关 (coupon/)
- ✅ `coupon/list` - 优惠券列表
- ✅ `coupon/couponList` - 优惠券列表
- ✅ `coupon/draw` - 领取优惠券
- ✅ `coupon/usable` - 可用优惠券

### 6. 活动相关 (activity/)
- ✅ `activity/list` - 活动列表
- ✅ `activity/detail` - 活动详情
- ✅ `activity/time` - 活动时间

### 7. 资讯相关 (infor/)
- ✅ `infor/list` - 资讯列表
- ✅ `infor/detail` - 资讯详情
- ✅ `infor/dz` - 资讯点赞
- ✅ `infor/comment` - 资讯评论

### 8. 课程相关 (lesson/)
- ✅ `lesson/list` - 课程列表
- ✅ `lesson/detail` - 课程详情

### 9. 商品相关 (goods/)
- ✅ `goods/getType` - 商品分类
- ✅ `goods/getGoods` - 商品列表
- ✅ `goods/getGoodsDetail` - 商品详情

### 10. 商家相关 (businuss/)
- ✅ `businuss/add_log` - 记录请求
- ✅ `businuss/store_info` - 商家信息
- ✅ `businuss/balance` - 余额明细
- ✅ `businuss/hx_code` - 核销二维码

### 11. 公共接口 (common/)
- ✅ `common/pact` - 获取协议
- ✅ `common/common` - 公共参数

### 12. 其他
- ✅ `client/find-device` - 请求页面数据
- ✅ `rotation/list` - 轮播图
- ✅ `feedback/add` - 意见反馈
- ✅ `get/openid` - 获取 openid

### 13. 助力功能 (boost/) - 新增
- ✅ `boost/tasks` - 助力任务列表
- ✅ `boost/taskDetail` - 助力任务详情
- ✅ `boost/publish` - 发布助力任务
- ✅ `boost/join` - 参与助力任务
- ✅ `boost/myTasks` - 我的助力任务
- ✅ `boost/orders` - 助力订单列表
- ✅ `boost/orderDetail` - 助力订单详情
- ✅ `boost/earnings` - 助力收益统计
- ✅ `boost/categories` - 助力分类
- ✅ `boost/search` - 搜索助力任务
- ✅ `boost/progress` - 任务进度
- ✅ `boost/rate` - 评价任务
- ✅ `boost/stats` - 统计数据

## 二、后端现有控制器分析

### application/api/controller/ 目录下：

1. **Boost.php** - ✅ 正在使用（助力功能）
2. **Common.php** - ✅ 正在使用（公共接口）
3. **Demo.php** - ❌ 演示功能，生产环境可删除
4. **Ems.php** - ❌ 邮箱验证码，前端未调用
5. **Index.php** - ⚠️ 基础接口，可保留
6. **Sms.php** - ❌ 短信接口，但前端直接调用的是 sms/send 和 sms/check
7. **Token.php** - ❌ Token 管理，前端未直接调用
8. **User.php** - ✅ 正在使用（用户相关）
9. **Validate.php** - ❌ 验证接口，前端未调用

## 三、后端现有模型分析

### application/common/model/ 目录下：

### 正在使用的模型：
1. **User.php** - ✅ 用户模型
2. **Area.php** - ✅ 地区模型
3. **Category.php** - ✅ 分类模型
4. **Config.php** - ✅ 配置模型
5. **Ems.php** - ⚠️ 邮箱验证码记录
6. **Sms.php** - ⚠️ 短信验证码记录
7. **MoneyLog.php** - ⚠️ 资金日志
8. **ScoreLog.php** - ⚠️ 积分日志
9. **Version.php** - ✅ 版本管理
10. **Attachment.php** - ⚠️ 附件模型

### boost 模块模型（新增）：
1. **boost/Task.php** - ✅ 助力任务模型
2. **boost/Order.php** - ✅ 助力订单模型
3. **boost/Category.php** - ✅ 助力分类模型
4. **boost/Record.php** - ✅ 助力记录模型

### venue 模块模型：
1. **venue/Activity.php** - ⚠️ 活动模型
2. **venue/Recharge.php** - ⚠️ 充值模型
3. **venue/activity/Cc.php** - ❓ 活动相关
4. **venue/information/Comment.php** - ❓ 评论模型

## 四、建议删除的文件

### 可以安全删除的控制器：
1. `application/api/controller/Demo.php` - 演示功能
2. `application/api/controller/Ems.php` - 邮箱验证码（前端未使用）
3. `application/api/controller/Token.php` - Token 管理（未使用）
4. `application/api/controller/Validate.php` - 验证接口（未使用）

### 可以删除的模型（如果确认未使用）：
1. `application/common/model/UserGroup.php` - 用户组（前端未调用）
2. `application/common/model/UserRule.php` - 用户规则（前端未调用）

### 后台管理相关（如果不使用后台管理可删除）：
- `application/admin/` 整个目录（如果只使用 API 功能）

## 五、建议保留的文件

### 必须保留的核心文件：
1. `application/api/controller/Boost.php` - 助力功能
2. `application/api/controller/Common.php` - 公共接口
3. `application/api/controller/User.php` - 用户功能
4. `application/api/controller/Index.php` - 基础接口
5. `application/api/controller/Sms.php` - 短信功能（可能需要）

### 核心模型：
1. `application/common/model/User.php`
2. `application/common/model/Area.php`
3. `application/common/model/Config.php`
4. `application/common/model/Version.php`
5. `application/common/model/Attachment.php`
6. `application/common/model/MoneyLog.php`
7. 所有 boost 模块模型
8. venue 模块模型（如果场馆功能在使用）

## 六、数据库表清理建议

### 可以删除的表（如果确认未使用）：
- `fa_user_group` - 用户组
- `fa_user_rule` - 用户规则
- `fa_ems` - 邮箱验证码记录
- `fa_test` - 测试表

### 必须保留的表：
- `fa_user` - 用户表
- `fa_area` - 地区表
- `fa_config` - 配置表
- `fa_version` - 版本表
- `fa_attachment` - 附件表
- `fa_user_money_log` - 资金日志
- `fa_user_score_log` - 积分日志
- `fa_sms` - 短信记录
- `fa_boost_*` - 助力功能相关表
- `fa_venue_*` - 场馆功能相关表

## 七、清理步骤

1. **备份数据库和代码**
2. **删除不用的控制器文件**
3. **删除不用的模型文件**
4. **清理数据库表**
5. **测试所有功能**
6. **更新文档**

## 八、注意事项

1. 删除前务必备份所有数据
2. 某些模型可能被间接调用，需要仔细检查
3. 后台管理如果不使用可以整个删除 admin 模块
4. 删除后需要全面测试所有功能
5. 检查是否有定时任务或队列依赖这些文件