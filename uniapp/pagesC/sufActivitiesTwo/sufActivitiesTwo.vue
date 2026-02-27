<template>
	<view v-show="display">
		<headBg :title='"报名活动"'></headBg>
		<view class="flexc pl-48 zindex  status_card">
			<view class="mr-24 ">
				<image class="status_card_time" src="../static/icon10.svg" mode=""></image>
			</view>
			<view class="pay" v-if="contentlist.status==1 &&　contentlist.timestamp > 0">
				待付款
				<u-count-down @finish="finish" format="mm:ss" :time="contentlist.timestamp"></u-count-down>
			</view>
			<text v-if="contentlist.status==2">待核销</text>
			<text v-if="contentlist.status==3">已核销</text>
			<text v-if="contentlist.status==4">待退款</text>
			<text v-if="contentlist.status==5">已取消</text>
			<text v-if="contentlist.status==1 && contentlist.timestamp <= 0 ">
				订单已取消
			</text>
		</view>
		<view class="yy_box zindex" v-if="contentlist.status==2">
			<image class="yy_head" src="/pagesC/static/cicnon11.png" mode=""></image>
			<view class="yy_card flexc">
				<image class="yy_card_bg" src="../static/cicon12.png" mode=""></image>
				<view class="mr-14 mt-14">
					<u-icon name="checkmark-circle" color="#29A1FF" size="40"></u-icon>
				</view>
				<view class="yy_card_text">
					<view class="yy_card_text_1">
						预约成功
					</view>
					<view class="yy_card_text_2">
						请在当日准时参加活动
					</view>
				</view>
			</view>
			<image src="../static/cicon10.png" class="yy_img" mode=""></image>
		</view>
		<!-- 用户 -->
		<view class=" user_card zindex">
			<!-- 预约成功 -->
			<view class="pb-14 blod f-size-32">
				{{contentlist.venue_name}}
			</view>
			<view class="message-box d-flex pt-30  ">
				<view class="message-img br-8">
					<image :src="contentlist.hd_image" mode="" class="br-8"></image>
				</view>
				<view class="ml-24 message-box-right flexColumn" style="position: relative;">
					<view class="flexc flexs">
						<view class="f-size-30 blod  color-28 me-text-beyond" style="width:75%;">
							{{contentlist.hd_name}}
						</view>

						<view class="f-size-30  blod color-28 mt-4">¥{{contentlist.order_amount_total}}</view>
					</view>
					<view class="f-size-26 f-400 color-6 hd_time">{{contentlist.cc_name}}</view>
					<view class="f-size-26 f-400 color-6 hd_time">
						{{contentlist.cc_start_times}}-{{contentlist.cc_end_times}}
					</view>
					<view class="f-size-22 f-400 color-6 ">
						{{contentlist.type}}
					</view>
				</view>
			</view>

			<view class="user_card_ipt flexc flexs">
				<view class="user_card_ipt_text">
					入场名单
				</view>
				<view class="user_card_ipt_text">
					{{contentlist.name_list[0].name}}
				</view>
			</view>
			<view class="user_card_ipt flexc flexs">
				<view class="user_card_ipt_text">
					手机号
				</view>
				<view class="user_card_ipt_text">
					{{contentlist.name_list[0].mobile}}
				</view>
			</view>
		</view>
		<!-- 二维码 -->
		<view class="cord_box" v-if="contentlist.status == 2 && ismerchant == 1">
			<view class="divider">
				<u-divider text="待使用"></u-divider>
			</view>
			<view class="cord_box_title">
				凭「二维码」直接入场
			</view>
			<image :src="contentlist.code" mode=""></image>
		</view>

		<!-- 订单信息 -->
		<view class="bg-f pl-30 pr-30 pt-30 order_card" v-if="contentlist.status!=1">
			<view class="f-size-26 f-700 color-3 blod">订单信息</view>
			<view class="f-size-22 f-500 color-3 mt-24">
				<text>订单编号:</text>
				<text class="pl-12">{{contentlist.order_no}}</text>
			</view>
			<view class="f-size-22 f-500 color-3 mt-20">
				<text>支付金额:</text>
				<text class="pl-12">{{contentlist.order_amount_total}}元</text>
			</view>
			<view class="f-size-22 f-500 color-3 mt-20">
				<text>支付时间:</text>
				<text class="pl-12">{{contentlist.pay_time}}</text>
			</view>
			<view class="f-size-22 f-500 color-3 mt-20">
				<text>报名时间:</text>
				<text class="pl-12">{{contentlist.pay_time}}</text>
			</view>
		</view>

		<view class="flexc flexs">
			<view class="btn-box txt-center f-size-32 f-400 color-FB"
				v-if="contentlist.status==1 && ismerchant == 1 && contentlist.timestamp> 0"
				@click="cancel(contentlist.order_no)">
				取消订单
			</view>
			<view class="btn-box txt-center f-size-32 f-400 color-FB"
				v-if="contentlist.status==1 && ismerchant == 1 && contentlist.timestamp> 0"
				@click="promptly(contentlist.order_no)">
				立即支付
			</view>

		</view>

		<view style="height: 30rpx;">

		</view>
	</view>
</template>

<script>
	import {
		orderdetail,
		orderpay,
		Bind_to_wechat,
		usergetUserInfo,
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
				contentlist: {},
				display: false,
				inter: null,
				id: '',
				ismerchant: 1,
				openid: ''
			}
		},
		onUnload() {
			// clearInterval(this.inter)
		},
		onLoad(id) {

			let openid = uni.getStorageSync('openid')
			if (openid) {
				this.openid = openid
			} else {
				this.getopenidApi()
			}
			console.log(id);
			this.id = id.id
			this.ismerchant = id.flag
			this.orderdetailApi(this.id)
		},
		onShow() {
			this.orderdetailApi(this.id)
		},
		methods: {
			// 取消订单
			async cancel(orderNo) {
				let res = await cancel({
					orderNo
				})
				if (res.code == 1) {
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
			finish() {
				this.orderdetailApi(this.id)
			},
			async orderdetailApi(id) {
				let data = await orderdetail({
					id: id
				})
				data.data.pay_time = toDate(data.data.pay_time * 1000, 1)
				this.contentlist = data.data
				this.display = true
				let nowTime = Date.now()
				nowTime = Math.floor(nowTime / 1000);
				this.contentlist.timestamp = (this.contentlist.overtime - nowTime) * 1000
			},
			async promptly(oder_on, price) {
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
							// #ifdef H5
							this.mpwxparApi(res.data, '', 2)
							// #endif
							// #ifdef MP-WEIXIN
							this.wxparApi(res.data, '', arr, '', 2)
							// #endif
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
	}
</style>
<style scoped lang="scss">
	::v-deep .u-divider {
		margin: 0 !important;
	}

	.pay {
		display: flex;
		color: #FFFFFF;
		font-size: 44rpx;
		align-items: center;
		box-sizing: border-box;

		/deep/.u-count-down__text {
			margin-left: 10rpx;
			color: #fff !important;
			font-size: 24rpx !important;
			line-height: 24rpx !important;
		}
	}

	.message-box {
		border-top: 2rpx solid #DFDFDF;

		.message-img {
			width: 246rpx;
			height: 150rpx;

			image {
				width: 246rpx;
				height: 150rpx;
				vertical-align: top;
			}
		}

		.message-box-right {
			width: calc(100% - 246rpx - 20rpx);

			.hd_time {
				font-weight: 400;
				font-size: 24rpx;
				color: #666666;
			}
		}

	}

	.btn-box {
		width: 300rpx;
		height: 84rpx;
		line-height: 84rpx;
		background: #64BAFD;
		border-radius: 42rpx;
		margin: 0 auto;
		margin-top: 70rpx;
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

	.user_card {
		width: 690rpx;
		background: #FFFFFF;
		margin: 0 auto;
		padding: 32rpx 40rpx 20rpx;
		box-sizing: border-box;
		border-radius: 0rpx 0 16rpx 16rpx;

		.user_card_title {
			color: #999;
		}

		.user_card_ipt {
			padding: 26rpx 0;
			box-sizing: border-box;
			border-bottom: 1rpx solid #E4E7ED;

			.user_card_ipt_text {
				font-weight: 400;
				font-size: 28rpx;
				color: #575757;
			}
		}

	}

	.yy_box {
		width: 690rpx;
		margin: 0 auto;
		position: relative;

		.yy_head {
			width: 100%;
			height: 28rpx;
		}

		.yy_card {
			height: 170rpx;
			background-color: #fff;
			padding: 26rpx 20rpx;
			box-sizing: border-box;
			position: relative;

			.yy_card_bg {
				width: 690rpx;
				height: 170rpx;
				position: absolute;
				top: 0;
				right: 0;
				left: 0;
				bottom: 0;
			}

			.yy_card_text {
				z-index: 99;
				position: relative;
			}

			.yy_card_text_1 {
				font-weight: 700;
				font-size: 32rpx;
				color: #3D3D3D;
				margin-bottom: 16rpx;
			}

			.yy_card_text_2 {
				font-size: 24rpx;
				color: #7D8182;
			}
		}

		.yy_img {
			width: 188rpx;
			height: 162rpx;
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}

	// 二维码
	.cord_box {
		width: 690rpx;
		background: #FFFFFF;
		padding: 22rpx 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		margin: 30rpx auto 0;
		text-align: center;



		.divider {
			width: 220rpx;
			margin: 0 auto;
		}

		.cord_box_title {
			font-size: 28rpx;
			color: #3D3D3D;
			text-align: left;
			font-weight: 600;
			margin: 28rpx 0;
		}

		image {
			width: 298rpx;
			height: 298rpx;
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
</style>