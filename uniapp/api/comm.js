// 公共api
import request from '../utils/request.js'

// 微信公众号登录
export function loginWxOfficial(data) {
	return request({
		url: '/user/loginWxOfficial',
		method: 'POST',
		data
	})
}
// 微信公众号登录
export function mpJsdk(data) {
	return request({
		url: '/user/getjssdk',
		method: 'POST',
		data
	})
}

/** 
 * 微信登录
 */
export function wechatlogin(data) {
	return request({
		url: 'user/login',
		method: 'POST',
		data
	})
}
/** 
 * 发送验证码
 */
export function Send_verification_code(data) {
	return request({
		url: 'sms/send',
		method: 'POST',
		data
	})
}
// 校验验证码
export function check_code(data) {
	return request({
		url: 'sms/check',
		method: 'POST',
		data
	})
}
/** 
 * 获取场馆分类
 */
export function getclass(data) {
	return request({
		url: 'venue/getType',
		method: 'POST',
		data
	})
}

/** 
 * 筛选的价格区间 
 */
export function getPrices(data) {
	return request({
		url: 'venue/getPrices',
		method: 'POST',
		data
	})
}
/** 
 * 请求页面数据
 */
export function findDevice(data) {
	return request({
		url: 'client/find-device',
		method: 'get',
		data
	})
}

/**
 * 获取用户信息
 */
export function getUserInfo(data) {
	return request({
		url: 'user/login',
		method: 'post',
		data
	})
}

/** 
 * 获取轮播图数据
 */
export function getSwiperList(data) {
	return request({
		url: 'rotation/list',
		method: 'post',
		data
	})
}

// 获取课程列表
export function getClassList(data) {
	return request({
		url: 'lesson/list',
		method: 'post',
		data
	})
}

// 获取课程详情
export function getClassDetails(data) {
	return request({
		url: 'lesson/detail',
		method: 'post',
		data
	})
}

// 获取活动详情
export function getActivityDetails(data) {
	return request({
		url: 'activity/detail',
		method: 'post',
		data
	})
}

// 获取活动列表
export function getActivityList(data) {
	return request({
		url: 'activity/list',
		method: 'post',
		data
	})
}

// 获取资讯列表
export function getNewsList(data) {
	return request({
		url: 'infor/list',
		method: 'post',
		data
	})
}
// 获取资讯详情
export function infordetail(data) {
	return request({
		url: 'infor/detail',
		method: 'post',
		data
	})
}
// 获取场馆列表
export function getPlaceList(data) {
	return request({
		url: 'venue/getVenue',
		method: 'post',
		data
	})
}
// 获取场馆详情
export function getVenuedetails(data) {
	return request({
		url: 'venue/getVenueDetail',
		method: 'post',
		data
	})
}
// 获取场地信息
export function getsite(data) {
	return request({
		url: 'venue/getArea',
		method: 'post',
		data
	})
}
// 我的优惠券列表
export function couponlist(data) {
	return request({
		url: 'coupon/list',
		method: 'post',
		data
	})
}
// 优惠劵列表
export function couponcouponList(data) {
	return request({
		url: 'coupon/couponList',
		method: 'post',
		data
	})
}
// 领取优惠劵
export function coupondraw(data) {
	return request({
		url: 'coupon/draw',
		method: 'post',
		data
	})
}
// 预申请接口
export function orderbefore(data) {
	return request({
		url: 'order/before',
		method: 'post',
		data
	})
}
// 创建订单
export function ordercreate(data) {
	return request({
		url: 'order/create',
		method: 'post',
		data
	})
}
// 发起支付
export function orderpay(data) {
	return request({
		url: 'order/pay',
		method: 'post',
		data
	})
}

// 获取充值优惠列表
export function recharge(data) {
	return request({
		url: 'order/recharge',
		method: 'post',
		data
	})
}

// 获取充值优惠列表
export function walletList(data) {
	return request({
		url: 'order/walletList',
		method: 'post',
		data
	})
}
// 获取场馆类型
export function venuegetVenueType(data) {
	return request({
		url: 'venue/getVenueType',
		method: 'post',
		data
	})
}
// 获取场地信息
export function venuegetArea(data) {
	return request({
		url: 'venue/getArea',
		method: 'post',
		data
	})
}

// 获取场地时间
export function venuetimes(data) {
	return request({
		url: 'venue/times',
		method: 'post',
		data
	})
}
// 获取场地时间
export function couponusable(data) {
	return request({
		url: 'coupon/usable',
		method: 'post',
		data
	})
}

// 获取订单列表接口
export function orderlist(data) {
	return request({
		url: 'order/list',
		method: 'post',
		data
	})
}
// 添加意见反馈
export function feedbackadd(data) {
	return request({
		url: 'feedback/add',
		method: 'post',
		data
	})
}
// 退出登录接口
export function userlogout(data) {
	return request({
		url: 'user/logout',
		method: 'post',
		data
	})
}

// 获取用户信息接口
export function usergetUserInfo(data) {
	return request({
		url: 'user/getUserInfo',
		method: 'post',
		data
	})
}
// 修改用户信息
export function userprofile(data) {
	return request({
		url: 'user/profile',
		method: 'post',
		data
	})
}
// 获取订单详情
export function orderdetail(data) {
	return request({
		url: 'order/detail',
		method: 'post',
		data
	})
}

// 获取商品分类
export function goodsgoods(data) {
	return request({
		url: 'goods/getType',
		method: 'post',
		data
	})
}
// 获取商品列表
export function goodsgetGoods(data) {
	return request({
		url: 'goods/getGoods',
		method: 'post',
		data
	})
}

//获取商品详情
export function goodsgetGoodsDetail(data) {
	return request({
		url: 'goods/getGoodsDetail',
		method: 'post',
		data
	})
}
//获取协议
export function commonpact(data) {
	return request({
		url: 'common/pact',
		method: 'post',
		data
	})
}
//退款申请
export function orderrefund(data) {
	return request({
		url: 'order/refund',
		method: 'post',
		data
	})
}


//绑定微信
export function Bind_to_wechat(data) {
	return request({
		url: 'user/binding',
		method: 'post',
		data
	})
}

export function getOpenid(data) {
	return request({
		url: 'get/openid',
		method: 'post',
		data
	})


}


//记录请求
export function add_log(data) {
	return request({
		url: 'businuss/add_log',
		method: 'post',
		data
	})
}

//获取商家信息
export function store_info(data) {
	return request({
		url: 'businuss/store_info',
		method: 'post',
		data
	})
}
// 余额明细列表
export function balance(data) {
	return request({
		url: 'businuss/balance',
		method: 'post',
		data
	})
}
// 核销二维码
export function hx_code(data) {
	return request({
		url: 'businuss/hx_code',
		method: 'post',
		data
	})
}
// 获取公共参数信息
export function getCommon(data) {
	return request({
		url: 'common/common',
		method: 'post',
		data
	})
}

// 获取首页热门场馆列表
export function getRmVenue(data) {
	return request({
		url: 'venue/getRmVenue',
		method: 'post',
		data
	})
}

// 资讯点赞
export function infodz(data) {
	return request({
		url: 'infor/dz',
		method: 'post',
		data
	})
}


// 资讯点赞
export function infocomment(data) {
	return request({
		url: 'infor/comment',
		method: 'post',
		data
	})
}

// 获取活动时间
export function activityTime(data) {
	return request({
		url: 'activity/time',
		method: 'post',
		data
	})
}


// 获取openid
export function getopenid(data) {
	return request({
		url: 'user/getopenid',
		method: 'post',
		data
	})
}


// 获取openid
export function getjmlogin(data) {
	return request({
		url: 'user/getjmlogin',
		method: 'post',
		data
	})
}



//我的充值订单列表
export function rechargeList(data) {
	return request({
		url: 'order/rechargeList',
		method: 'post',
		data
	})
}


//取消订单
export function cancel(data) {
	return request({
		url: 'order/cancel',
		method: 'post',
		data
	})
}

// ======================== 助力功能新增API ========================

// 获取助力任务列表
export function getBoostTasks(data) {
	return request({
		url: 'boost/tasks',
		method: 'post',
		data
	})
}

// 获取助力任务详情
export function getBoostTaskDetail(data) {
	return request({
		url: 'boost/taskDetail',
		method: 'post',
		data
	})
}

// 发布助力任务
export function publishBoostTask(data) {
	return request({
		url: 'boost/publish',
		method: 'post',
		data
	})
}

// 参与助力任务
export function joinBoostTask(data) {
	return request({
		url: 'boost/join',
		method: 'post',
		data
	})
}

// 获取我的助力任务
export function getMyBoostTasks(data) {
	return request({
		url: 'boost/myTasks',
		method: 'post',
		data
	})
}

// 获取助力订单列表
export function getBoostOrders(data) {
	return request({
		url: 'boost/orders',
		method: 'post',
		data
	})
}

// 获取助力订单详情
export function getBoostOrderDetail(data) {
	return request({
		url: 'boost/orderDetail',
		method: 'post',
		data
	})
}

// 获取助力收益统计
export function getBoostEarnings(data) {
	return request({
		url: 'boost/earnings',
		method: 'post',
		data
	})
}

// 获取助力任务分类
export function getBoostCategories(data) {
	return request({
		url: 'boost/categories',
		method: 'post',
		data
	})
}

// 搜索助力任务
export function searchBoostTasks(data) {
	return request({
		url: 'boost/search',
		method: 'post',
		data
	})
}

// 获取助力任务进度
export function getBoostProgress(data) {
	return request({
		url: 'boost/progress',
		method: 'post',
		data
	})
}

// 评价助力任务
export function rateBoostTask(data) {
	return request({
		url: 'boost/rate',
		method: 'post',
		data
	})
}

// 获取助力任务统计数据
export function getBoostStats(data) {
	return request({
		url: 'boost/stats',
		method: 'post',
		data
	})
}