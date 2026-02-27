<template>
	<view>
		<view class="tabs-label">
			<u-tabs :list="list1" @click="click" :activeStyle="{
				   color:'#64BAFD'
				   }" lineColor="#64BAFD"></u-tabs>
		</view>
		<view style="height: 90rpx;"></view>
		<u-empty :marginTop="120" mode="list" icon="/static/images/order_form.png" v-if="coententlist.length<1">
		</u-empty>
		<view class="top-box bg-f br-10" v-for="(item,index) in coententlist" :key="index" @click="details(item.id)">
			<view class="f-size-26 f-400 color-17" style="text-align: right;">
				<text class="order-goods-Paid" v-if="item.status==2">待自提</text>
				<text class="order-goods-Paid" v-if="item.status==3">已完成</text>
				<!-- <text class="order-goods-Paid" v-if="item.status==4">待退款</text> -->
				<!-- <text class="order-goods-Paid" v-if="item.status==5">已取消</text> -->
			</view>
			<view class="d-flex mt-16">
				<view class="top-picbox br-6 mr-24">
					<image :src="item.jf_img" mode=""></image>
				</view>
				<view class="" style="width: 464rpx;">
					<view class="" style="display: flex;justify-content: space-between;width: 100%;">
						<text class="f-size-28 f-400 color-3B">{{item.goods_name}}</text>
						<text class="f-size-28 f-400 color-90" style="margin-left: 94rpx;">x{{item.goods_count}}</text>
					</view>
					<view class="f-size-28 f-400 color-98" style="margin-top: 87rpx;">
						件数:{{item.goods_count}}只
					</view>
				</view>
			</view>
			<view class="f-size-28 f-400 color-01 mt-10" style="text-align: right;">
				<text>合计</text>
				<text>{{item.order_amount_total}}积分</text>
			</view>
		</view>
		<no-data :isFinishedLoading="isFinishedLoading && coententlist.length != 0"></no-data>
	</view>
</template>

<script>
	import {
		orderlist,
		orderpay
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				list1: [{
					name: '全部',
				}, {
					name: '待自提',
				}, {
					name: '已完成'
				}],
				status_id: '',
				coententlist: [],
				page: 1, // 分页
				isFinishedLoading: false, // 数据是否全部加载完成
				isBusiness: false, // 是不是商家
				flag: null, //等于2是商家
			}
		},
		onLoad(options) {
			if (options.isBusiness) {
				this.isBusiness = true
				this.flag = "2"
				console.log('商家');
			} else {
				this.isBusiness = false
				this.flag = null
				console.log('不是商家');
			}
			this.orderlistApi()
		},
		onReachBottom() {
			if (!this.isFinishedLoading) {
				console.log('触底加载');
				this.page++
				this.orderlistApi()
			}
		},
		methods: {
			click(item) {
				this.page = 1
				this.coententlist = []
				this.isFinishedLoading = false
				console.log('item', item);
				switch (item.name) {
					case '全部':
						this.status_id = ''
						break;
					case '待自提':
						this.status_id = 2
						break;
					case '已完成':
						this.status_id = 3
						break;
					default:

				}
				console.log(this.status_id);
				this.orderlistApi()

			},
			async orderlistApi() {
				let data = await orderlist({
					status: this.status_id,
					order_type: 1,
					page: this.page,
					flag: this.flag
				})
				if (data.data.rows.length) {
					this.coententlist.push(...data.data.rows)
					if (data.data.rows.length < 10) {
						this.isFinishedLoading = true
					}
				} else {
					this.isFinishedLoading = true
				}
			},
			particulars(id) {
				uni.navigateTo({
					url: '/pagesA/orderFinished/orderFinished?id=' + id
				})
			},
			pay(oder_on) {
				this.promptly(oder_on)
			},
			async promptly(oder_on) {
				orderpay({
					orderNo: oder_on
				}).then(res => {
					console.log(res);
					if (res.code == 1) {
						this.wxparApi(res.data)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'error',
							duration: 2000
						})
					}
				})


			},
			wxparApi(orderInfo) {
				wx.requestPayment({
					timeStamp: orderInfo.timeStamp,
					nonceStr: orderInfo.nonceStr,
					package: orderInfo.package,
					signType: orderInfo.signType,
					paySign: orderInfo.paySign,
					success(res) {
						console.log(res, '支付成功');
						uni.redirectTo({
							url: '/pages/paymentResults/paymentResults'
						})
					},
					fail(res) {
						console.log(res, '支付失败');
						uni.showToast({
							title: '支付失败',
							icon: 'error',
							duration: 2000
						})
					}
				})
			},
			details(id) {
				uni.navigateTo({
					url: '/pagesB/successfulTrade/successfulTrade?id=' + id
				})
			}
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

	.top-box {
		width: 688rpx;
		height: 336rpx;
		margin: 25rpx auto;
		padding: 30rpx 30rpx 39rpx 32rpx;

		.top-picbox {
			width: 158rpx;
			height: 159rpx;
			border-radius: 16rpx;
			overflow: hidden;

			image {
				width: 158rpx;
				height: 159rpx;
			}
		}
	}
</style>