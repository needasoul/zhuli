<template>
	<view>
		<view class="tabs-label">
			<u-tabs style="z-index: 100;" :list="list1" @click="click" :activeStyle="{
				   color:'#64BAFD',
				   }" lineColor="#64BAFD">

			</u-tabs>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view style="height: 90rpx;"></view>
		<!-- #endif -->
		<view class="background-box">
			<!-- 订单 -->
			<u-empty :marginTop="120" mode="list" icon="/static/images/order_form.png" v-if="coententlist.length<1">
			</u-empty>
			<view class="order-goods" v-for="(item,index) in coententlist" :key="index">
				<view class="order-goods-c" @tap="particulars(item.id)">
					<view class="timeDown" v-if="item.status == 1 && item.timestamp > 0">
						剩余支付时间
						<u-count-down @finish="finish" format="mm:ss" :time="item.timestamp"></u-count-down>
					</view>
					<view class="order-id">
						<text class="order-id-text">订单编号：{{item.order_no}}</text>
						<view class="order-type">
							<view class="type" v-if="item.status==1">
								待付款
							</view>
							<view class="type" v-if="item.status==2">
								待核销
							</view>
							<view class="type" v-if="item.status==3">
								已核销
							</view>
							<view class="type" v-if="item.status==4">
								待退款
							</view>
							<view class="type" v-if="item.status==5">
								已取消
							</view>
						</view>
					</view>
					<view class="order-goods-c-top">
						<view class="imgs">
							<image class="imgs-c" :src="item.venue_img" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="info-t">
								<view class="name me-text-beyond">
									<text class="text2">{{item.venue_name}}</text>
								</view>
								<view class="type">
									￥{{item.order_amount_total}}
								</view>
							</view>
							<view class="info-c">
								<view class="address-img">
									<image class="address-img-c" src="../../static/images/address.png" mode=""></image>
								</view>
								<view class="text">
									{{item.venue_address}}
								</view>
							</view>
							<view class="info-Box" :style="{height:item.timeShow?'50rpx':''}">
								<view class="info-c" v-for="(item1,index1) in item.times" :key="index1">
									<view class="time-img">
										<image class="time-img-c" src="../../static/images/time.png" mode=""></image>
									</view>
									<view class="text time" @click.stop="settime(item.id,index1)">
										{{item.fixed_date}} {{item1.start_times}}-{{item1.end_times}}
									</view>
									<view class="" v-if="item.timeShow &&index1==0"
										@click.stop="settime(item.id,index1)" style="margin-left: 10rpx;">
										<u-icon name="arrow-right" color="#9E9E9E" size="14"></u-icon>
									</view>
									<view class="" v-if="!item.timeShow &&index1==0"
										@click.stop="settime(item.id,index1)" style="margin-left: 10rpx;">
										<u-icon name="arrow-down" color="#9E9E9E" size="14"></u-icon>
									</view>
								</view>
							</view>
						</view>

					</view>
				</view>
				<view class="order-goods-pay_bottom-list">
					<view class="order-goods-pay_bottom refund mr-20" v-if="item.status==1"
						@click.stop="cancel(item.order_no)">
						<text>取消订单</text>
					</view>
					<view class="order-goods-pay_bottom" v-if="item.status==1"
						@click.stop="pay(item.order_no,item.order_amount_total)">
						<text>立即付款</text>
					</view>
					<view class="order-goods-pay_bottom refund" v-if="item.status==2"
						@click.stop="particulars(item.id)">
						<text>退款</text>
					</view>
				</view>

			</view>
			<no-data :isFinishedLoading="isFinishedLoading && coententlist.length != 0"></no-data>
		</view>

		<paypopup ref='paypopup' :show='payshow' :pageurl="''" @close='payshow=false' :orderNo='orderNo' :navidx='2'>
		</paypopup>
		<view style="height: 30rpx;"></view>
	</view>
</template>

<script>
	import {
		orderlist,
		orderpay,
		Bind_to_wechat,
		usergetUserInfo,
		getopenid,
		cancel
	} from "@/api/comm.js"
	import
	news
	from "@/utils/wxApi.js"
	export default {
		data() {
			return {
				payshow: false,
				orderNo: '',
				list1: [{
						name: '全部',
					}, {
						name: '待支付'
					}, {
						name: '待核销',
					}, {
						name: '已核销'
					},
					{
						name: '待退款'
					},
					{
						name: '已取消'
					},
				],
				status_id: '',
				coententlist: [],
				page: 1, // 分页
				isFinishedLoading: false, // 数据是否全部加载完成
				isTimer: false,
				timeEnd: true,
				openid: '',
				ispay: true
			}
		},
		onLoad() {

		},
		onShow() {
			this.page = 1
			this.coententlist = []
			this.isFinishedLoading = false
			this.orderlistApi()
			let token = uni.getStorageSync('userinfo').token
			if (token) {
				this.$refs.paypopup.getUser()
				let openid = uni.getStorageSync('openid')
				if (openid) {
					this.openid = openid
				} else {
					// this.getopenidApi()
				}
			}

		},
		onReachBottom() {
			if (!this.isFinishedLoading) {
				this.page++
				this.orderlistApi(1)
			}
		},
		methods: {
			// 取消订单
			async cancel(orderNo) {
				let res = await cancel({
					orderNo
				})
				if (res.code == 1) {
					this.coententlist.forEach(item => {
						if (item.order_no == orderNo) {
							item.status = 5
						}
					})
					this.$forceUpdate()
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
			settime(id, idx) {
				if (idx == 0) {
					this.coententlist.forEach(item => {
						if (item.id == id) {
							if (item.timeShow) {
								item.timeShow = false
							} else {
								item.timeShow = true
							}
						}
					})
				}

			},

			finish() {
				this.page = 1
				this.coententlist = []
				this.isFinishedLoading = false
				this.orderlistApi()
				// uni.navigateBack(0)
			},
			refund(item) {
				uni.navigateTo({
					url: '/pagesA/refundpage/refundpage?id=' + item.id + "&price=" + item.order_amount_total
				})
			},
			click(item) {
				this.page = 1
				this.coententlist = []
				this.isFinishedLoading = false
				console.log('item', item);
				switch (item.name) {
					case '全部':
						this.status_id = ''
						break;
					case '待支付':
						this.status_id = 1
						break;
					case '待核销':
						this.status_id = 2
						break;
					case '已核销':
						this.status_id = 3
						break;
					case '待退款':
						this.status_id = 4
						break;
					case '已取消':
						this.status_id = 5
						break;
					default:

				}
				this.orderlistApi()

			},
			async orderlistApi(e) {
				this.ountdown = []
				uni.showLoading()
				let data = await orderlist({
					status: this.status_id,
					order_type: 2,
					flag: '1',
					page: this.page
				})
				if (data.code == 1) {
					if (data.data.rows.length) {
						data.data.rows.forEach(item => {
							item.timeShow = true
						})
						if (e == 1) {
							this.coententlist = [...this.coententlist, ...data.data.rows]
						} else {
							this.coententlist = data.data.rows
						}
						if (data.data.rows.length < 10) {
							this.isFinishedLoading = true
						}
					} else {
						this.isFinishedLoading = true
					}
					let nowTime = Date.now()
					nowTime = Math.floor(nowTime / 1000);
					this.coententlist.forEach((item, index) => {
						item.timestamp = (item.overtime - nowTime) * 1000
					})
					this.isTimer = true
					uni.hideLoading()
				}

			},
			particulars(id) {
				uni.navigateTo({
					url: '/pagesA/orderFinished/orderFinished?id=' + id
				})
			},
			pay(oder_on, price) {
				if (!this.ispay) {
					return this.showToast('请勿重复点击')
				}
				this.ispay = false
				setTimeout(() => {
					this.ispay = true
				}, 1000)
				this.orderNo = oder_on
				this.payshow = true
			},

		}
	}
</script>
<style>
	page {
		background: #f2f2f2;
	}
</style>
<style scoped lang="scss">
	/deep/ .u-tabs__wrapper__nav__item__text {

		font-size: 26rpx !important;
		font-weight: 500;
		color: #9C9C9C;

		letter-spacing: 2px;
	}

	.tabs-label {
		background-color: #fff;
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 1000000;
	}

	.order-goods {
		width: 706rpx;
		// height: 247rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		margin: 25rpx 22rpx 0 22rpx;
		padding: 25rpx 18rpx 18rpx 14rpx;
		box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.03);
		box-sizing: border-box;
		z-index: -1000;


		.order-goods-c {
			position: relative;

			.timeDown {
				display: flex;
				align-items: center;
				position: absolute;
				left: 3rpx;
				bottom: -60rpx;
				color: #64BAFD;
				font-size: 24rpx;

				/deep/.u-count-down__text {
					margin-left: 5rpx;
					color: #64BAFD !important;
					font-size: 28rpx !important;
					line-height: 24rpx !important;
				}
			}

			.order-id {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 33rpx;

				.order-id-text {
					font-weight: 400;
					font-size: 22rpx;
					color: #666666;
				}

				.order-type {
					font-weight: 400;
					font-size: 28rpx;
					color: #64BAFD;
				}
			}

			.order-goods-c-top {
				display: flex;

				.imgs {
					width: 130rpx;
					height: 130rpx;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
					// overflow: hidden;
					margin-right: 22rpx;

					.imgs-c {
						width: 130rpx;
						height: 130rpx;
						border-radius: 4rpx 4rpx 4rpx 4rpx;
					}
				}

				.info {
					.info-t {
						display: flex;
						justify-content: space-between;
						width: 522rpx;

						.name {
							font-weight: 700;
							font-size: 28rpx;
							color: #3D3D3D;
							width: 80%;
						}

						.type {
							font-weight: 700;
							font-size: 28rpx;
							color: #3D3D3D;
						}
					}

					.info-c {
						display: flex;
						align-items: center;
						margin-top: 15rpx;

						.address-img {
							width: 28rpx;
							height: 28rpx;
							margin-right: 10rpx;
							transform: translateX(-3rpx);

							.address-img-c {
								width: 28rpx;
								height: 28rpx;
							}
						}

						.text {
							font-weight: 400;
							font-size: 24rpx;
							color: #9E9E9E;
						}
					}

					.info-Box {

						overflow: hidden;
					}

					.info-c {
						display: flex;
						align-items: center;

						.time-img {
							width: 26rpx;
							height: 26rpx;
							transform: translateY(-6rpx);
							margin-right: 12rpx;

							.time-img-c {
								margin-top: 2rpx;
								width: 100%;
								height: 100%;
							}
						}

						.text.time {
							font-weight: 400;
							font-size: 24rpx;
							color: #9E9E9E;
							transform: translateX(4rpx);
						}
					}




				}
			}

			.order-goods-c-bottom {
				display: flex;
				justify-content: flex-end;
				margin-top: 26rpx;

				.amount-of-money {
					display: flex;
					align-items: center;

					.text1 {
						font-weight: 400;
						font-size: 24rpx;
						color: #3D3D3D;
					}

					.text2 {
						font-weight: 700;
						font-size: 28rpx;
						color: #3D3D3D;
					}
				}
			}
		}
	}

	.order-goods-title {

		font-size: 34rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 600;
		color: #383838;
		line-height: 48rpx;

	}

	.order-goods-Paid {
		font-size: 26rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #64BAFD;
		line-height: 37rpx;
		letter-spacing: 2px;
		float: right;
	}

	.order-goods-content {
		width: 654rpx;
		height: 145rpx;
		background: #F5F5F5;
		border-radius: 6rpx;
		margin-top: 26rpx;
		padding: 30rpx 0 30rpx 23rpx;
	}

	.order-goods-content-seat {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #9D9D9D;
		line-height: 33rpx;
		letter-spacing: 2px;
		margin-top: 19rpx;
	}

	.order-goods-content-time {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #000000;
		line-height: 33rpx;
		letter-spacing: 2px;
		margin-left: 22rpx;
	}

	.order-goods-pay {
		font-size: 26rpx;
		font-weight: 500;
		color: #383838;
		line-height: 37rpx;
		letter-spacing: 2px;
		margin-top: 25rpx;
		text-align: right;



		text {
			font-size: 22rpx;
		}
	}

	.order-goods-pay_bottom-list {
		margin-top: 15rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.order-goods-pay_bottom {
		display: flex;
		justify-content: center;
		align-items: center;
		// font-size: 26rpx;
		// font-weight: 500;
		// color: #FFFFFF;
		// text-align: right;
		// margin-top: 20rpx;
		width: 161rpx;
		height: 61rpx;
		border-radius: 139rpx 139rpx 139rpx 139rpx;
		border: 2rpx solid #64BAFD;


		text {
			// border-radius: 8rpx;
			// padding: 5rpx 15rpx;
			// background-color: #64BAFD;
			font-weight: 400;
			font-size: 28rpx;
			color: #64BAFD;
		}

	}

	.order-goods-pay_bottom.refund {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 161rpx;
		height: 61rpx;
		border-radius: 139rpx 139rpx 139rpx 139rpx;
		border: 2rpx solid #999999;
		margin-left: 16rpx;

		text {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
		}

	}


	.u-tabs__wrapper__nav__item.data-v-48634e29 {
		padding: 0 17px;
	}

	.u-tabs__wrapper__nav__line.data-v-48634e29 {
		margin-left: 3rpx;
	}
</style>