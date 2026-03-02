# 助力功能后台安装说明

## 一、数据库安装

### 1. 创建数据库表
执行 `boost_tables.sql` 文件中的SQL语句，创建助力功能所需的4张表：

```bash
mysql -u your_username -p your_database < boost_tables.sql
```

或者直接在数据库管理工具中执行SQL文件内容。

### 2. 表结构说明

#### fa_boost_category - 助力分类表
- 存储助力任务的分类信息
- 默认包含5个分类：电商购物、生活服务、游戏娱乐、金融理财、其他

#### fa_boost_task - 助力任务表
- 存储助力任务的基本信息
- 包含任务标题、描述、价格、平台、链接等字段
- 支持任务状态管理（active, completed, cancelled, expired）

#### fa_boost_order - 助力订单表
- 存储助力相关的订单信息
- 支持发布任务和参与任务两种类型
- 包含订单状态管理（pending, paid, completed, cancelled, refunded）

#### fa_boost_record - 助力记录表
- 存储用户参与助力的记录
- 包含助力状态、评分、评价等信息
- 支持截图凭证和评价功能

## 二、代码文件安装

### 1. 复制控制器文件
将 `application/api/controller/Boost.php` 复制到对应目录

### 2. 复制模型文件
将以下文件复制到 `application/common/model/boost/` 目录：
- `Task.php` - 助力任务模型
- `Order.php` - 助力订单模型
- `Category.php` - 助力分类模型
- `Record.php` - 助力记录模型

### 3. 创建目录结构
```
application/
├── api/
│   └── controller/
│       └── Boost.php
└── common/
    └── model/
        └── boost/
            ├── Task.php
            ├── Order.php
            ├── Category.php
            └── Record.php
```

## 三、API接口说明

### 公共接口（无需登录）
- `POST /api/boost/tasks` - 获取助力任务列表
- `POST /api/boost/taskDetail` - 获取助力任务详情
- `POST /api/boost/categories` - 获取助力分类
- `POST /api/boost/search` - 搜索助力任务
- `POST /api/boost/stats` - 获取助力统计
- `POST /api/boost/progress` - 获取任务进度

### 需要登录的接口
- `POST /api/boost/publish` - 发布助力任务
- `POST /api/boost/join` - 参与助力任务
- `POST /api/boost/myTasks` - 获取我的助力任务
- `POST /api/boost/orders` - 获取助力订单列表
- `POST /api/boost/orderDetail` - 获取助力订单详情
- `POST /api/boost/earnings` - 获取助力收益统计
- `POST /api/boost/rate` - 评价助力任务

## 四、请求参数格式

所有接口都使用JSON格式提交数据，例如：

```json
{
    "page": 1,
    "limit": 10,
    "category_id": 1
}
```

## 五、返回数据格式

统一返回格式：
```json
{
    "code": 1,
    "msg": "操作成功",
    "data": {
        // 具体数据
    }
}
```

## 六、前端配置

确保前端配置文件 `uniapp/config.js` 中的API地址正确：

```javascript
export default {
    serverIp: 'https://zl.nankeyimeng.xyz/api/',
    uploadImgUrl: 'https://zl.nankeyimeng.xyz'
}
```

## 七、测试验证

使用提供的 `test_boost_api.php` 脚本测试接口是否正常工作。

## 八、安全注意事项

1. 确保数据库连接信息安全
2. 验证用户权限和身份
3. 检查余额和支付逻辑
4. 防止重复参与同一任务
5. 合理设置押金和收益分配

## 九、后续优化建议

1. 添加任务审核机制
2. 实现自动结算功能
3. 添加举报和投诉功能
4. 优化搜索和推荐算法
5. 添加数据统计和分析