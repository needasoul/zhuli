<template>
	<view v-show="display">
		<headBg :title='"课程详细"'></headBg>
		<view class="flexc pl-48 zindex  status_card">
			<view class="mr-24 ">
				<image class="status_card_time" src="../static/icon10.svg" mode=""></image>
			</view>
			<!-- v-if="contentlist.status==1 && contentlist.timestamp > 0" -->
			<view class="pay color-f f-size-48" v-if="contentlist.status==1 ">
				待付款
				<u-count-down @finish="finish" format="mm:ss" :time="contentlist.timestamp"></u-count-down>
			</view>
			<text v-if="contentlist.status==2">待核销 </text>
			<text v-if="contentlist.status==3">已核销 </text>
			<text v-if="contentlist.status==4">待退款</text>
			<text v-if="contentlist.status==5">已取消</text>
		</view>
		<!-- 用户 -->
		<view class="bg-f user_card zindex">
			<view class="user_card_title f-size-24 f-size-24 color-9 mb-28">
				{{contentlist.createtime || ''}} | {{contentlist.venue_name || ''}}
			</view>

			<view class="d-flex  mb-26">
				<u-icon name="account-fill" size="18" color="#64BAFD"></u-icon>
				<view class="f-size-26 f-600 color-34">
					<text class="pl-18 pr-8">{{contentlist.lx_name || ''}}</text>
					<text>{{contentlist.lx_tel || ''}}</text>
				</view>
			</view>
			<view class="d-flex  ">
				<u-icon name="map-fill" size="15" color="#64BAFD"></u-icon>
				<view class="f-size-26 f-600 color-34">
					<text class="pl-16">{{contentlist.address || ''}}</text>
				</view>
			</view>

			<view class="message-box d-flex  mb-28">
				<view class="message-img br-8">
					<image :src="contentlist.details_json.image" mode="" class="br-8"></image>
				</view>
				<view class="ml-24 message-box_right flexColumn">
					<view class="f-size-26 blod_700 ">
						{{contentlist.venue_name || ''}}
					</view>
					<view class="f-size-24 f-500 color-6">
						{{contentlist.details_json.price || ''}}元/{{contentlist.details_json.days || ''}}天
						{{contentlist.lesson_type || ''}}
					</view>
					<view class="f-size-28 blod_700 color-28">
						￥{{contentlist.order_amount_total || ''}}
					</view>
				</view>
			</view>

			<!-- 按钮 -->
			<view class="btn-box" v-if="contentlist.status==2 && ismerchant == 1">
				<view class="btn-box_content">
					<view class="btn-box_content_code">
						<image style="width: 100%;height: 100%;" :src="contentlist.code" mode=""></image>
					</view>
				</view>
			</view>

			<view class="status_box">
				<text v-if="contentlist.status==1">待付款 </text>
				<text v-if="contentlist.status==2">待核销 </text>
				<text v-if="contentlist.status==3">已核销 </text>
				<text v-if="contentlist.status==4">待退款</text>
				<text v-if="contentlist.status==5">已取消</text>
			</view>

		</view>

		<view class="bg-f  order_card" v-if="contentlist.status!=1">
			<view class="f-size-26 f-700 color-3 blod">订单信息</view>
			<view class="f-size-22 f-500 color-3 mt-20">
				<text>订单编号:</text>
				<text class="pl-12">{{contentlist.order_no || ''}}</text>
			</view>
			<!-- v-if="contentlist.status!=5" -->
			<view class="f-size-22 f-500 color-3 mt-20">
				<text>支付金额:</text>
				<text class="pl-12">{{contentlist.order_amount_total || ''}}元</text>
			</view>
			<view class="f-size-22 f-500 color-3 mt-20">
				<text>支付时间:</text>
				<text class="pl-12">{{contentlist.pay_time || ''}}</text>
			</view>
			<view class="f-size-22 f-500 color-3 mt-20">
				<text>报名时间:</text>
				<text class="pl-12">{{contentlist.createtime || ''}}</text>
			</view>
		</view>
		<view class="flexs mt-32">
			<view class=""> </view>
			<view class="tkBtn" v-if="contentlist.status==2" @click="tkshow=true">
				申请退款
			</view>
			<view v-if="contentlist.status==1 && ismerchant == 1" class="tkBtn" @click="cancel(contentlist.order_no)">
				取消订单
			</view>
			<view v-if="contentlist.status==1 && ismerchant == 1" class="tkBtn" @click="promptly(contentlist.order_no)">
				立即支付
			</view>
		</view>
		<u-modal :show="tkshow" :title="tktitle" :content='tkcontent' :showCancelButton='true' @cancel='tkshow=false'
			@confirm='orderrefundApi'></u-modal>


	</view>
</template>

<script>
	import {
		orderdetail,
		orderpay,
		Bind_to_wechat,
		usergetUserInfo,
		orderrefund,
		getopenid,
		cancel
	} from "@/api/comm.js"
	import {
		toDate
	} from "@/utils/time.js"
	import
	news
	from "@/utils/wxApi.js"
	export default {

		data() {
			return {
				tkshow: false,
				tktitle: '温馨提示',
				tkcontent: "确定要退款吗？",
				contentlist: {},
				options: {
					code: 'https://qm.qq.com/cgi-bin/qm/qr?k=LKqML292dD2WvwQfAJXBUmvgbiB_TZWF&noverify=0', // 生成二维码的值
					size: 270, // 460代表生成的二维码的宽高均为460rpx
				},
				display: false,
				id: '',
				inter: null,
				ismerchant: 1,
				openid: '',
				ispay: true
			}
		},
		onLoad(id) {
			console.log(id);
			this.id = id.id
			this.ismerchant = id.flag
			this.orderdetailApi(id.id)
			this.getopenidApi()
		},
		onShow() {
			this.contentlist = {}
			this.orderdetailApi(this.id)
		},
		methods: {
			// 取消订单
			async cancel(orderNo) {
				let res = await cancel({
					orderNo
				})
				if (res.code == 1) {
					this.contentlist = {}
					this.orderdetailApi(this.id)
				}
			},
			async getopenidApi() {
				uni.login({
					success: async (res) => {
						console.log('res', res);
						let res1 = await getopenid({
							code: res.code
						})
						if (res1.code == 1) {
							this.openid = res1.data.openid
						} else {
							this.showToast(res.msg)
						}
					}
				})
			},
			async orderrefundApi() {
				let res = await orderrefund({
					id: this.id
				})
				if (res.code == 1) {
					this.tkshow = false
					this.orderdetailApi(this.id)
				} else {
					this.showToast(res.msg)
				}
			},

			finish() {
				this.orderdetailApi(id.id)
			},
			notice_for_use() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '使用须知'
				})
			},
			async orderdetailApi(id) {
				let data = await orderdetail({
					id: id
				})
				console.log(data);
				data.data.pay_time = toDate(data.data.pay_time * 1000, 1)
				this.contentlist = data.data
				this.options.code = data.data.code
				this.display = true
				let nowTime = Date.now()
				nowTime = Math.floor(nowTime / 1000);
				this.contentlist.timestamp = (this.contentlist.overtime - nowTime) * 1000
			},
			async promptly(oder_on, price) {
				if (!this.ispay) {
					return this.showToast('请勿重复点击')
				}
				this.ispay = false
				setTimeout(() => {
					this.ispay = true
				}, 2000)
				let that = this
				if (!this.openid) {
					this.showToast('没有openid,请联系管理员')
				} else {
					orderpay({
						orderNo: oder_on,
						openid: this.openid
					}).then(res => {
						console.log(res);
						if (res.code == 1) {
							let arr = []
							let configuration = uni.getStorageSync('configuration')
							configuration.message.forEach(item => {
								if (item.message_type == 1) {
									arr.push(item.masterplate)
								}
							})
							that.wxparApi(res.data, '', arr, '', 2)
						} else {
							this.showToast(res.msg)
						}
					})
				}
			},
		}
	}
</script>
<style>
	page {
		background: #FAFAFA;
		padding-bottom: 50rpx;
	}
</style>
<style scoped lang="scss">
	.blod_700 {
		font-weight: 700;
	}

	.head {
		width: 750rpx;
		height: 638rpx;
		background: linear-gradient(180deg, #49AFFF 0%, rgba(206, 227, 243, 0) 99%);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.nav {
		margin: 82rpx 0 50rpx;
	}

	.imgBox {
		width: 100%;

		image {
			width: 100%;
			height: 10rpx;
		}
	}

	.pay {
		display: flex;
		font-size: 48rpx;

		/deep/.u-count-down__text {
			margin-left: 12rpx;
			margin-top: 30rpx;
			color: #fff !important;
			font-size: 22rpx !important;
			line-height: 22rpx !important;
			// padding-top: 4rpx !important;
		}
	}

	.message-box {
		margin-top: 44rpx;

		.message-img {
			width: 130rpx;
			height: 130rpx;
			border-radius: 12rpx 12rpx 12rpx 12rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
			}
		}

		.message-box_right {
			width: calc(100% - 150rpx);
		}
	}

	.status_box {
		border-top: 2rpx dotted #D8D8D8;
		padding-top: 28rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
	}

	.btn-box {
		background: #FFFFFF;

		.btn-box_content {
			margin: 0 auto 20rpx;

			.btn-box_content_code {
				width: 270rpx;
				height: 270rpx;
				background: #D8D8D8;
				margin: 0 auto;
			}

			.btn-box_content_title {
				font-size: 22rpx;
				font-weight: 400;
				color: #333333;
				margin: 0 auto;
				text-align: center;
			}

			.btn-box_content_title_type {
				background: #F9FCFE;
				border-radius: 19rpx;
				margin: 20rpx auto;
				text-align: center;
				font-size: 22rpx;
				font-weight: 400;
				color: #3CBDFF;
				width: 114rpx;
			}
		}
	}

	.location {
		width: 100%;
		height: 183rpx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;

		.location_bottom {
			width: 231rpx;
			height: 79rpx;
			border-radius: 40rpx;
			border: 2rpx solid #3CBDFF;
			margin: 0 auto;
			text-align: center;
			line-height: 79rpx;
			margin-top: 50rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #64BAFD;
		}
	}

	.user_card {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0 auto;
		padding: 40rpx 40rpx 20rpx;
		box-sizing: border-box;

		.user_card_title {
			color: #999;
		}
	}

	.order_card {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 30rpx auto;
		padding: 30rpx 36rpx;
		box-sizing: border-box;
	}

	.tkBtn {
		width: 282rpx;
		height: 88rpx;
		background: #64BAFD;
		border-radius: 580rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 88rpx;
		text-align: center;
		margin-right: 30rpx;
	}

	.status_card {
		color: #FFFFFF;
		margin: 0 0 34rpx 44rpx;

		.status_card_time {
			width: 66rpx;
			height: 66rpx;
		}

		text {
			font-size: 48rpx;
		}
	}
</style>