<template>
	<view>
		<view class="tabs-label">
			<u-tabs :list="list1" @click="click" :activeStyle="{
				   color:'#64BAFD',
				   }" lineColor="#64BAFD">
				{{index}}
			</u-tabs>
		</view>
		<view class="background-box">
			<!-- 订单 -->
			<!-- #ifdef MP-WEIXIN -->
			<view style="height: 90rpx;"></view>
			<!-- #endif -->
			<u-empty :marginTop="120" mode="list" icon="/static/images/order_form.png" v-if="coententlist.length<1">
			</u-empty>
			<view class="order-goods" v-for="(item,index) in coententlist" :key="index">
				<view class="timeDown" v-if="item.status == 1 && item.timestamp > 0 && flag != 2">
					剩余支付时间
					<u-count-down @finish="finish" format="mm:ss" :time="item.timestamp"></u-count-down>
				</view>
				<view @click="particulars(item.id)">
					<text class="order-goods-title">{{item.lesson_name}}</text>
					<text class="order-goods-Paid" v-if="item.status==1">待付款</text>
					<text class="order-goods-Paid" v-if="item.status==2">待核销</text>
					<text class="order-goods-Paid" v-if="item.status==3">已核销</text>
					<text class="order-goods-Paid" v-if="item.status==5">已取消</text>
					<view class="order-goods-content">
						<image :src="item.details_json.image" mode=""></image>
						<view class="order-goods-content_title">
							<view class="order-goods-content_title_top">
								{{item.details_json.price}}元/{{item.details_json.days}}天
							</view>
							<view class="order-goods-content_title_bottom">
								<!-- ¥260 -->
							</view>
						</view>
					</view>
					<view class="order-goods-pay " v-if="item.status!=1">实付款:¥<text>{{item.order_amount_total}}</text>
					</view>
				</view>

				<view class="flexc flex-row-reverse">
					<view class="order-goods-pay_bottom " v-if="item.status==1"
						@click.prevent="pay(item.order_no,item.order_amount_total)">
						<text> 立即付款</text>
					</view>
					<view class="order-goods-pay_bottom mr-20" v-if="item.status==1"
						@click.prevent="cancel(item.order_no)">
						<text> 取消订单</text>
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
					},
					{
						name: '已核销'
					},
					{
						name: '已取消'
					},
				],
				status_id: '',
				coententlist: [],
				page: 1, // 分页
				isFinishedLoading: false, // 数据是否全部加载完成
				isBusiness: false, // 是不是商家
				flag: null, //等于2是商家
				ismerchant: 1,
				openid: '',
				ispay: true
			}
		},
		onLoad(options) {
			let openid = uni.getStorageSync('openid')
			if (openid) {
				this.openid = openid
			} else {
				this.getopenidApi()
			}
			if (options.isBusiness) {
				this.isBusiness = true
				this.flag = "2"
				this.ismerchant = 2
				console.log('商家');
			} else {
				this.isBusiness = false
				this.flag = 1
				console.log('不是商家');
			}
		},
		onShow() {
			this.$refs.paypopup.getUser()
			this.page = 1
			this.coententlist = []
			this.isFinishedLoading = false
			this.orderlistApi()
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
			finish() {
				this.page = 1
				this.coententlist = []
				this.isFinishedLoading = false
				this.orderlistApi()
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
					case '已取消':
						this.status_id = 5
						break;
					default:

				}
				console.log(this.status_id);
				this.orderlistApi()

			},
			async orderlistApi(e) {
				let data = await orderlist({
					status: this.status_id,
					order_type: 3,
					page: this.page,
					flag: this.flag
				})
				if (data.data.rows.length) {
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
			},
			particulars(id) {
				uni.navigateTo({
					url: '/pagesC/sufActivities/sufActivities?id=' + id + '&flag=' + this.ismerchant
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
		width: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 9999;
	}

	.order-goods {
		position: relative;
		width: 694rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		margin: 25rpx 28rpx 0 28rpx;
		padding: 26rpx 20rpx 0 20rpx;
		overflow: hidden;
		padding-bottom: 30rpx;

		.timeDown {
			display: flex;
			align-items: center;
			position: absolute;
			left: 20rpx;
			bottom: 30rpx;
			color: #64BAFD;
			font-size: 24rpx;

			/deep/.u-count-down__text {
				margin-left: 5rpx;
				color: #64BAFD !important;
				font-size: 28rpx !important;
				line-height: 24rpx !important;
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
		display: flex;
		align-items: center;
		margin-top: 30rpx;

		image {
			width: 200rpx;
			height: 150rpx;
			border-radius: 8rpx;
		}

		.order-goods-content_title {
			margin-left: 30rpx;
		}
	}



	.order-goods-pay {
		font-size: 26rpx;
		font-weight: 500;
		color: #383838;
		line-height: 37rpx;
		letter-spacing: 2px;
		margin-top: 15rpx;
		text-align: right;

		text {
			font-size: 22rpx;
		}
	}

	.order-goods-pay_bottom {
		font-size: 26rpx;
		font-weight: 500;
		color: #FFFFFF;
		text-align: right;
		margin-top: 20rpx;

		text {
			border-radius: 8rpx;
			padding: 5rpx 15rpx;
			background-color: #64BAFD;
		}

	}

	.u-tabs__wrapper__nav__item.data-v-48634e29 {
		padding: 0 17px;
	}

	.u-tabs__wrapper__nav__line.data-v-48634e29 {
		margin-left: 3rpx;
	}
</style>