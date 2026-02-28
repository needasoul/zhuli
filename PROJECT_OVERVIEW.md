# 场馆预订管理系统 - 项目概览文档

## 项目简介

这是一个基于 **FastAdmin + ThinkPHP** 后端和 **UniApp** 小程序前端的场馆预订管理系统。系统支持场馆预订、活动报名、课程购买、会员管理、优惠券、积分商城等完整的场馆运营功能。

**版本信息：** v1.3.1

---

## 技术架构

### 后端技术栈
- **框架：** FastAdmin + ThinkPHP 5.x
- **数据库：** MySQL
- **服务器：** Apache/Nginx + PHP
- **插件系统：** FastAdmin 插件机制

### 前端技术栈
- **框架：** UniApp (支持微信小程序、H5、APP)
- **UI组件库：** 
  - uView UI
  - ColorUI
  - uni-ui
- **依赖库：**
  - lodash (工具函数)
  - moment (时间处理)
  - jweixin-module (微信SDK)
  - tki-qrcode (二维码生成)

---

## 项目结构

### 后端目录结构

```
├── addons/venue/              # 场馆插件核心目录
│   ├── controller/            # 控制器
│   │   ├── Activity.php       # 活动管理
│   │   ├── Businuss.php       # 商家管理
│   │   ├── Common.php         # 公共方法
│   │   ├── Coupon.php         # 优惠券管理
│   │   ├── Feedback.php       # 意见反馈
│   │   ├── Goods.php          # 商品管理
│   │   ├── Infor.php          # 资讯管理
│   │   ├── Lesson.php         # 课程管理
│   │   ├── Order.php          # 订单管理
│   │   ├── Rotation.php       # 轮播图管理
│   │   ├── Sms.php            # 短信服务
│   │   ├── User.php           # 用户管理
│   │   └── Venue.php          # 场馆管理
│   ├── library/               # 第三方库
│   │   ├── Jssdk.php          # 微信JSSDK
│   │   ├── MpWechat.php       # 微信公众号
│   │   ├── Wxlogin.php        # 微信登录
│   │   ├── WxRefunt.php       # 微信退款
│   │   └── phpqrcode/         # 二维码生成
│   ├── job/                   # 定时任务
│   │   ├── Overtime.php       # 超时处理
│   │   └── SendMessage.php    # 消息发送
│   └── config/                # 配置文件
├── application/               # 应用目录
│   ├── admin/                 # 后台管理
│   ├── api/                   # API接口
│   ├── index/                 # 前台
│   └── common/                # 公共模块
├── public/                    # 公共资源
└── vendor/                    # 第三方依赖
```

### 前端目录结构

```
uniapp/
├── pages/                     # 主包页面
│   ├── index/                 # 首页（活动列表）
│   ├── login/                 # 登录注册
│   ├── order/                 # 我的订单
│   ├── me/                    # 个人中心
│   ├── merchant/              # 商家中心
│   ├── venueTab/              # 热门场馆
│   ├── paymentResults/        # 支付结果
│   ├── allOrders/             # 积分订单
│   └── activityDetail/        # 活动详情
│
├── pagesA/                    # 分包A - 用户功能
│   ├── setaddress/            # 选址
│   ├── orderFinished/         # 订单详情
│   ├── myCard/                # 我的优惠券
│   ├── makeAnAppointment/     # 订场预约
│   ├── quickBooking/          # 快速预订
│   ├── registrationaActivity/ # 报名活动
│   ├── feedback/              # 意见反馈
│   ├── personage/             # 个人设置
│   ├── refundpage/            # 退款申请
│   ├── courseOrder/           # 课程订单
│   ├── orderActivity/         # 活动订单
│   ├── venueVoucher/          # 入场凭证
│   ├── agreement/             # 协议
│   ├── addcouoon/             # 领取优惠券
│   ├── taskCenter/            # 任务中心
│   ├── taskAccepted/          # 已接任务
│   ├── taskPublished/         # 已发布任务
│   └── taskAudit/             # 任务审核
│
├── pagesB/                    # 分包B - 交易功能
│   ├── walletList/            # 消费记录
│   ├── recharge/              # 充值记录
│   ├── wallet/                # 钱包
│   ├── myMembers/             # 积分商城
│   ├── eventDetails/          # 活动详情
│   ├── successfulTrade/       # 订单详情
│   ├── bookingAppointment/    # 订场预约
│   ├── registrationForm/      # 报名表单
│   ├── confirmOrder/          # 确认订单
│   └── goodsPage/             # 商品详情
│
├── pagesC/                    # 分包C - 内容功能
│   ├── hotClass/              # 热门课程
│   ├── hotEvents/             # 热门活动
│   ├── hotNews/               # 热门资讯
│   ├── placeDetails/          # 场馆详情
│   ├── woVoucher/             # 核销凭证
│   ├── sufActivities/         # 报名课程
│   ├── sufActivitiesTwo/      # 订单详情
│   ├── elCourse/              # 报名课程
│   ├── information/           # 资讯详情
│   ├── classDetails/          # 课程详情
│   ├── financial/             # 资金明细
│   └── businessOrder/         # 场馆订单
│
├── components/                # 公共组件
│   ├── empty/                 # 空状态
│   ├── headBg/                # 头部背景
│   ├── navbar/                # 导航栏
│   ├── noData/                # 无数据
│   ├── paypopup/              # 支付弹窗
│   ├── popup/                 # 通用弹窗
│   └── xuan-loading/          # 加载组件
│
├── api/                       # API接口
│   ├── comm.js                # 公共接口
│   └── user.js                # 用户接口
│
├── utils/                     # 工具类
│   ├── request.js             # 请求封装
│   ├── wxApi.js               # 微信API
│   ├── AllWxApi.js            # 完整微信API
│   ├── filter.js              # 过滤器
│   ├── time.js                # 时间处理
│   ├── share.js               # 分享功能
│   ├── toHide.js              # 隐藏处理
│   └── vuePrototype.js        # Vue原型扩展
│
├── static/                    # 静态资源
│   ├── images/                # 图片资源
│   ├── index/                 # 首页图片
│   ├── merchant/              # 商家图片
│   ├── tabbar/                # 底部导航图标
│   └── ...
│
├── style/                     # 样式文件
│   ├── colorui/               # ColorUI样式
│   ├── color.scss             # 颜色变量
│   ├── index.scss             # 全局样式
│   └── public.scss            # 公共样式
│
├── uni_modules/               # uni插件
│   ├── uview-ui/              # uView UI组件库
│   ├── uni-popup/             # 弹窗组件
│   ├── uni-transition/        # 过渡动画
│   └── wmf-code/              # 二维码组件
│
├── App.vue                    # 应用入口
├── main.js                    # 主入口文件
├── config.js                  # 配置文件
├── pages.json                 # 页面配置
├── manifest.json              # 应用配置
└── uni.scss                   # 全局样式变量
```

---

## 核心功能模块

### 1. 用户模块
- **登录注册**
  - 微信授权登录
  - 手机号验证码登录
  - 微信公众号登录（H5）
- **个人中心**
  - 个人信息管理
  - 头像昵称修改
  - 账号绑定
- **钱包功能**
  - 余额充值
  - 消费记录
  - 充值记录

### 2. 场馆预订模块
- **场馆浏览**
  - 场馆列表（支持筛选）
  - 场馆详情
  - 场馆分类
  - 价格区间筛选
  - 地理位置筛选
- **场地预订**
  - 场地选择
  - 时间段选择
  - 日期选择
  - 快速预订
  - 订场预约
- **订单管理**
  - 订单列表
  - 订单详情
  - 订单支付
  - 订单取消
  - 退款申请
  - 入场凭证

### 3. 活动模块
- **活动浏览**
  - 活动列表
  - 热门活动
  - 活动详情
  - 活动分类
- **活动报名**
  - 报名表单
  - 活动时间选择
  - 报名订单
  - 报名凭证

### 4. 课程模块
- **课程浏览**
  - 课程列表
  - 热门课程
  - 课程详情
- **课程购买**
  - 课程报名
  - 课程订单
  - 课程凭证

### 5. 资讯模块
- **资讯浏览**
  - 资讯列表
  - 热门资讯
  - 资讯详情
- **互动功能**
  - 点赞
  - 评论

### 6. 优惠券模块
- **优惠券管理**
  - 优惠券列表
  - 我的优惠券
  - 领取优惠券
  - 可用优惠券查询
  - 优惠券使用

### 7. 积分商城模块
- **商品管理**
  - 商品分类
  - 商品列表
  - 商品详情
- **积分兑换**
  - 积分订单
  - 兑换记录

### 8. 商家中心模块
- **商家功能**
  - 商家信息
  - 订单管理
  - 核销功能
  - 资金明细
  - 余额管理

### 9. 任务系统模块
- **任务中心**
  - 任务列表
  - 任务发布
  - 任务接取
  - 任务审核
  - 已接任务
  - 已发布任务

### 10. 支付模块
- **支付方式**
  - 微信支付
  - 余额支付
  - 组合支付
- **支付流程**
  - 预申请
  - 创建订单
  - 发起支付
  - 支付结果

---

## API接口列表

### 用户相关
```javascript
// 微信登录
wechatlogin(data)

// 微信公众号登录
loginWxOfficial(data)

// 获取用户信息
usergetUserInfo(data)

// 修改用户信息
userprofile(data)

// 退出登录
userlogout(data)

// 绑定微信
Bind_to_wechat(data)

// 获取openid
getopenid(data)
```

### 短信相关
```javascript
// 发送验证码
Send_verification_code(data)

// 校验验证码
check_code(data)
```

### 场馆相关
```javascript
// 获取场馆分类
getclass(data)

// 获取价格区间
getPrices(data)

// 获取场馆列表
getPlaceList(data)

// 获取场馆详情
getVenuedetails(data)

// 获取场地信息
getsite(data)

// 获取场馆类型
venuegetVenueType(data)

// 获取场地信息
venuegetArea(data)

// 获取场地时间
venuetimes(data)

// 获取首页热门场馆
getRmVenue(data)
```

### 活动相关
```javascript
// 获取活动列表
getActivityList(data)

// 获取活动详情
getActivityDetails(data)

// 获取活动时间
activityTime(data)
```

### 课程相关
```javascript
// 获取课程列表
getClassList(data)

// 获取课程详情
getClassDetails(data)
```

### 资讯相关
```javascript
// 获取资讯列表
getNewsList(data)

// 获取资讯详情
infordetail(data)

// 资讯点赞
infodz(data)

// 资讯评论
infocomment(data)
```

### 优惠券相关
```javascript
// 我的优惠券列表
couponlist(data)

// 优惠券列表
couponcouponList(data)

// 领取优惠券
coupondraw(data)

// 可用优惠券
couponusable(data)
```

### 订单相关
```javascript
// 预申请接口
orderbefore(data)

// 创建订单
ordercreate(data)

// 发起支付
orderpay(data)

// 获取订单列表
orderlist(data)

// 获取订单详情
orderdetail(data)

// 取消订单
cancel(data)

// 退款申请
orderrefund(data)
```

### 商品相关
```javascript
// 获取商品分类
goodsgoods(data)

// 获取商品列表
goodsgetGoods(data)

// 获取商品详情
goodsgetGoodsDetail(data)
```

### 钱包相关
```javascript
// 获取充值优惠列表
recharge(data)

// 获取消费记录
walletList(data)

// 我的充值订单列表
rechargeList(data)
```

### 商家相关
```javascript
// 记录请求
add_log(data)

// 获取商家信息
store_info(data)

// 余额明细列表
balance(data)

// 核销二维码
hx_code(data)
```

### 公共相关
```javascript
// 获取轮播图
getSwiperList(data)

// 获取公共参数
getCommon(data)

// 获取协议
commonpact(data)

// 微信JSSDK
mpJsdk(data)
```

### 反馈相关
```javascript
// 添加意见反馈
feedbackadd(data)
```

---

## 数据流程

### 1. 用户登录流程
```
1. 用户打开小程序
2. 调用微信授权获取code
3. 发送code到后端
4. 后端调用微信接口获取openid
5. 返回token和用户信息
6. 前端存储token
7. 后续请求携带token
```

### 2. 场馆预订流程
```
1. 浏览场馆列表
2. 选择场馆查看详情
3. 选择场地和时间段
4. 调用预申请接口（orderbefore）
5. 选择优惠券
6. 确认订单信息
7. 创建订单（ordercreate）
8. 选择支付方式
9. 发起支付（orderpay）
10. 支付成功后跳转结果页
11. 生成入场凭证
```

### 3. 活动报名流程
```
1. 浏览活动列表
2. 查看活动详情
3. 选择活动时间
4. 填写报名表单
5. 创建订单
6. 支付订单
7. 生成报名凭证
```

### 4. 支付流程
```
1. 用户确认订单
2. 选择支付方式（微信/余额/组合）
3. 调用orderpay接口
4. 后端返回支付参数
5. 调用微信支付API
6. 用户完成支付
7. 接收支付回调
8. 更新订单状态
9. 跳转支付结果页
```

---

## 配置说明

### 后端配置
```php
// config.php - 数据库配置
'database' => [
    'hostname' => 'localhost',
    'database' => 'your_database',
    'username' => 'your_username',
    'password' => 'your_password',
]

// 微信配置（在后台管理系统中配置）
- AppID
- AppSecret
- 商户号
- 商户密钥
```

### 前端配置
```javascript
// uniapp/config.js
export default {
    // 服务器地址
    serverIp: 'http://aa.ab/addons/venue/',
    // 图片拼接地址
    uploadImgUrl: 'http://aa.ab'
}

// uniapp/manifest.json
{
    "mp-weixin": {
        "appid": "你的小程序AppID",
        // 其他配置...
    }
}
```

---

## 关键技术点

### 1. 请求封装
- 统一的请求拦截
- Token自动携带
- 地理位置自动携带
- 错误统一处理
- 登录状态检查

### 2. 分包加载
- 主包：首页、登录、订单、个人中心
- 分包A：用户功能模块
- 分包B：交易功能模块
- 分包C：内容功能模块
- 优化首屏加载速度

### 3. 自定义导航栏
- 大部分页面使用自定义导航栏
- 适配不同机型状态栏高度
- 统一的导航栏组件

### 4. 支付集成
- 微信小程序支付
- 微信H5支付
- 余额支付
- 组合支付

### 5. 地理位置
- 获取用户位置
- 场馆距离计算
- 地图选点

### 6. 二维码功能
- 入场凭证二维码
- 核销二维码
- 分享二维码

---

## 部署说明

### 后端部署
1. 配置PHP环境（PHP 7.0+）
2. 配置MySQL数据库
3. 导入数据库文件（install.sql）
4. 配置伪静态规则
5. 配置域名和SSL证书
6. 配置微信支付参数
7. 配置短信接口

### 前端部署

#### 微信小程序
1. 修改config.js中的服务器地址
2. 修改manifest.json中的AppID
3. 使用HBuilderX编译为微信小程序
4. 上传到微信公众平台
5. 提交审核

#### H5版本
1. 修改config.js中的服务器地址
2. 配置H5域名
3. 配置微信公众号参数
4. 编译为H5
5. 部署到服务器

---

## 开发建议

### 1. 代码规范
- 使用统一的代码风格
- 组件化开发
- 接口统一管理
- 工具函数封装

### 2. 性能优化
- 图片懒加载
- 分包加载
- 请求防抖节流
- 数据缓存

### 3. 用户体验
- 加载状态提示
- 错误友好提示
- 空状态处理
- 网络异常处理

### 4. 安全性
- Token验证
- 接口签名
- 数据加密
- SQL注入防护

---

## 常见问题

### 1. 登录问题
- 检查AppID配置
- 检查服务器域名白名单
- 检查微信授权设置

### 2. 支付问题
- 检查商户号配置
- 检查支付密钥
- 检查支付回调地址
- 检查证书配置

### 3. 图片上传问题
- 检查上传接口
- 检查文件大小限制
- 检查文件类型限制

### 4. 地理位置问题
- 检查位置权限
- 检查地图密钥配置
- 检查域名白名单

---

## 后续优化方向

### 功能优化
1. 增加会员等级系统
2. 增加积分规则配置
3. 增加营销活动功能
4. 增加数据统计分析
5. 增加消息推送功能
6. 增加在线客服功能

### 技术优化
1. 接口性能优化
2. 数据库查询优化
3. 缓存机制优化
4. 前端性能优化
5. 代码重构优化

### 用户体验优化
1. UI界面优化
2. 交互流程优化
3. 加载速度优化
4. 错误提示优化

---

## 联系方式

如需技术支持或有任何问题，请联系开发团队。

---

**文档版本：** v1.0  
**最后更新：** 2024年  
**维护者：** 开发团队
