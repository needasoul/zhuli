<template>
	<view v-show="display">
		<headBg :title="'订场预约'"></headBg>
		<!-- 用户信息地址 -->
		<view class="bg-f mb-16 userCard mb-30 zindex">
			<view class="userCard_text_1 mb-28">
				{{intdata.data.fixedDate}} | {{intdata.data.name}}
			</view>
			<view class="d-flex mb-26">
				<u-icon name="account-fill" size="15" color="#64BAFD"></u-icon>
				<view class="f-size-28 f-600 color-34">
					<text class="pl-18 pr-8">{{intdata.data.lx_name}}</text>
					<text>{{intdata.data.lx_tel}}</text>
				</view>
			</view>
			<view class="d-flex ">
				<u-icon name="map-fill" size="15" color="#64BAFD"></u-icon>
				<view class="f-size-28 f-600 color-34">
					<text class="pl-16">{{intdata.data.venue_address}}</text>
				</view>
			</view>
			<image class="user_img" src="@/static/pagesB/icon8.png" mode=""></image>
		</view>
		<!-- 场馆类型 -->
		<view class="vote zindex">
			<view class="vote-list flexs" v-for="(item,index) in intdata.data.areaDetail[0].times" :key="index">
				<view class="">
					<image class="vote-list_img" :src="intdata.data.image" mode=""></image>
				</view>
				<view class="vote-list_right flexColumn">
					<view class="name">
						<view class="name-left">
							{{item.venue_name}}
						</view>
						<view class="money">
							￥{{item.price}}
						</view>
					</view>
					<view class="type flexc">
						<!-- <view class="mr-12">
							<u-icon name="map" size="16"></u-icon>
						</view> -->
						<view class="">
							{{intdata.data.type}}
						</view>
					</view>
					<view class="time flexc">
						<!-- 	<view class="mr-12">
							<u-icon name="clock" size="14"></u-icon>
						</view> -->
						<view class="time-c mr-12">
							<text style="margin-right: 16rpx;">{{item.fixedDate}}</text>
							<text>{{item.start}}{{'-'}}{{item.end}}</text>
						</view>

					</view>
				</view>

			</view>
		</view>
		<!-- 价格详情 -->
		<view class="bottom-box  " style="">
			<view class="d-flex j-sb  color-2A">
				<view class="f-size-26 f-600">总价</view>
				<view class="f-size-26">¥{{intdata.price}}</view>
			</view>
			<view class="d-flex j-sb mt-22" @click="showPopup()">
				<view class="f-size-26 f-600 color-2A">优惠券</view>
				<view class="d-flex">
					<view class="f-size-24 f-400 color-C2C3 mr-30" v-if="usable<1">无可用优惠券</view>
					<view class="f-size-24 f-400 color-C2C3 mr-30" v-else>
						<text v-if="indexcoupon>=0">立减{{usable[indexcoupon].coupon.used_amount}}￥</text>
						<text v-else>可用优惠券</text>
					</view>
					<u-icon name="arrow-right" size="13"></u-icon>
				</view>
			</view>
			<view class="d-flex mt-20 " @click="routerTo( '/pagesA/agreement/agreement?name=' + '退款规则')">
				<u-icon name="info-circle" color="#D81E06" size="10"></u-icon>
				<view class="guize f-size-22 f-400 color-22">提前24小时可退款，查看退款规则
					<text class="color-64">退款规则</text>
				</view>
			</view>
		</view>
		<!-- 支付 -->
		<view class="btn-box bg-f">
			<view class="">
				<text class="f-600 color-22 mr-14" style="font-size: 32rpx;">总计金额</text>
				<text class="f-500 color-22" style="font-size: 40rpx;">¥{{intdata.price}}</text>
			</view>
			<view class="btn color-f txt-center" @click="pay()">
				立即支付
			</view>
		</view>

		<template>
			<u-popup :show="show" mode='bottom' length="60%" style="height: 40%;" @close="show = false">
				<view style="height: 30rpx;"></view>
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="upbox">
						<view class="upbox_cont" v-for="(item,index) in usable" :key="index">
							<view class="upbox_cont_1">
								<view class="upbox_cont_1_top">
									¥{{item.coupon.used_amount}}
								</view>
								<view class="upbox_cont_1_but">
									满{{item.coupon.with_amount}}使用{{index}}
								</view>
							</view>
							<view class="upbox_cont_2">
								<view class="upbox_cont_2_top">
									{{item.coupon.title}}
								</view>
								<view class="upbox_cont_2_but">
									{{item.coupon.start_time}}-{{item.coupon.end_time}}
								</view>
							</view>
							<view class="upbox_cont_3_bottom" @click="immediate_use(item.coupon_id,index)"
								:style="{background: indexcoupon===index?'#cebdc0':''}">
								立即使用
							</view>
						</view>
					</view>
				</scroll-view>
			</u-popup>
		</template>
		<u-modal :show="show1" @confirm="confirm" @cancel="showModal" ref="uModal" :showCancelButton='true'
			title="是否前往了包场协议"></u-modal>

		<!-- 支付 -->
		<paypopup ref='paypopup' :show='payshow' :pageurl="'/pages/order/order'" @close='payshow=false'
			:orderNoObj='orderNoObj' @payChannel='payChannel'></paypopup>
		<view style="height: 300rpx;">
		</view>
	</view>
</template>

<script>
	import {
		orderbefore,
		couponusable,
		ordercreate,
		orderpay,
		Bind_to_wechat,
		usergetUserInfo,
		getopenid
	} from "@/api/comm.js"
	import {
		toDate
	} from "@/utils/time.js"
	import {
		forEach
	} from "lodash";
	import
	news
	from "@/utils/wxApi.js"
	export default {
		data() {
			return {
				int: {},
				intdata: {},
				show: false,
				show1: false,
				usable: [],
				checked: true,
				couponactivate: '',
				indexcoupon: 'null',
				display: false,
				openid: '',
				disabled: false, //按钮禁用
				payshow: false,
				orderNo: "",

				orderNoObj: {}
			}
		},
		onShow() {
			this.$refs.paypopup.getUser()
		},
		onLoad(open) {
			Object.assign(this.int, JSON.parse(open.areaDetail))
			this.intcontent()
			let openid = uni.getStorageSync('openid')
			if (openid) {
				this.openid = openid
			} else {
				this.getopenidApi()
			}
		},
		methods: {
			payChannel(e) {
				console.log('ee', e);
				this.orderNoObj.payChannel = e
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
			async intcontent() {
				this.int.couponId = this.couponactivate
				let data = await orderbefore(this.int)
				if (data.code == 1) {
					this.intdata = data.data
					this.display = true
					let data1 = await couponusable({
						areaDetail: this.int.areaDetail
					})
					if (data1.code == 1) {
						data1.data.forEach(element => {
							element.coupon.start_time = toDate(element.coupon.start_time * 1000, 2)
							element.coupon.end_time = toDate(element.coupon.end_time * 1000, 2)
						})
						this.usable = []
						this.usable.push(...data1.data)
					}
				}
			},
			showPopup() {
				if (this.usable.length > 0) {
					this.show = true
				} else {
					uni.showToast({
						title: '暂无可用优惠劵',
						icon: "error"
					})
				}
			},

			immediate_use(coupon, index) {
				this.indexcoupon = index
				this.couponactivate = coupon
				this.intcontent()
				this.show = false

			},
			checkboxChange(event) {
				this.checked = event.detail
			},
			showModal() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '包场协议'
				})
			},

			async pay() {
				let that = this
				if (this.disabled) {
					this.showToast('请勿重复点击')
					return
				}
				this.disabled = true
				setTimeout(() => {
					this.disabled = false
				}, 1000)
				this.orderNoObj = {
					payChannel: 1,
					orderType: this.int.orderType,
					goodsId: this.int.goodsId,
					couponId: this.couponactivate,
					fixedDate: this.int.fixedDate,
					venueDetail: this.int.areaDetail
				}
				this.payshow = true
			},



		}
	}
</script>
<style>
	page {
		background-color: #FAFAFA;
	}
</style>
<style scoped lang="scss">
	.imgBox {
		width: 100%;

		image {
			width: 100%;
			height: 10rpx;
		}
	}





	.middle-box {
		width: 100%;
		padding: 26rpx 0;

		.middle-box-top {
			margin: 0 64rpx;
		}

		.middle-box-bottom {
			// margin-top: 18rpx;
			margin: 30rpx 64rpx 0;
			// height: 99rpx;
		}
	}

	.bottom-box {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0 auto;
		padding: 38rpx 40rpx;
		box-sizing: border-box;
	}


	.userCard {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0 auto 28rpx;
		padding: 40rpx;
		box-sizing: border-box;
		position: relative;

		.userCard_text_1 {
			font-size: 24rpx;
			color: #999999;
		}

		.user_img {
			width: 226rpx;
			height: 238rpx;
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
		}
	}

	.btn-box {
		width: 750rpx;
		height: 226rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: fixed;
		bottom: 0;

		padding: 28rpx 30rpx;
		box-sizing: border-box;

		.btn {
			width: 690rpx;
			height: 84rpx;
			background: #64BAFD;
			border-radius: 22rpx 22rpx 22rpx 22rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			line-height: 84rpx;
			margin-top: 42rpx;
		}
	}

	.upbox {
		height: 500rpx;

		.upbox_cont {
			width: 95%;
			height: 194rpx;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #F1FAFF;
			border-radius: 25rpx;
			margin-bottom: 20rpx;

			.upbox_cont_1 {
				text-align: center;
				width: 170rpx;
				height: 185rpx;
				background: #FFFFFF;
				border-radius: 4rpx;
				margin-left: 5rpx;

				.upbox_cont_1_top {
					margin-top: 55rpx;
					font-size: 40rpx;
					font-weight: 500;
					color: #64BAFD;
				}

				.upbox_cont_1_but {
					font-size: 20rpx;
					font-weight: 400;
					color: #A29E99;
				}

			}

			.upbox_cont_3_bottom {
				width: 170rpx;
				height: 185rpx;
				background: #ce5052;
				border-radius: 4rpx;
				text-align: center;
				line-height: 170rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				font-weight: 400rpx;

			}

			.upbox_cont_3_bottom_activate {
				width: 170rpx;
				height: 185rpx;
				border-radius: 4rpx;
				text-align: center;
				line-height: 170rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				font-weight: 400rpx;
				background: #ceb5b9;
			}

			.upbox_cont_2_top {
				font-size: 26rpx;
				font-weight: 500;
				color: #36322E;
				letter-spacing: 2px;
			}

			.upbox_cont_2_but {
				font-size: 18rpx;
				font-weight: 400;
				color: #A29E99;
			}
		}


	}

	// 场馆类型
	.vote {
		width: 100%;

		.vote-list {
			width: 690rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			padding: 40rpx;
			box-sizing: border-box;
			margin: 0 auto 30rpx;

			.vote-list_img {
				width: 130rpx;
				height: 130rpx;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
			}

			.vote-list_right {
				width: calc(100% - 150rpx);
				height: 130rpx;
			}

			.money {
				font-weight: 700;
				font-size: 28rpx;
				color: #3D3D3D;
			}

			.name {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.name-left {
					font-weight: 700;
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 28rpx;
				}

				.name-right {
					font-size: 28rpx;
					color: #64BAFD;
				}
			}

			.type {
				font-size: 24rpx;
				color: #9E9E9E;
				line-height: 24rpx;
			}

			.time {
				display: flex;
				align-items: center;

				.time-c {
					font-weight: 400;
					font-size: 24rpx;
					color: #9E9E9E;
					line-height: 24rpx;
				}


			}

			.button {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin-top: 32rpx;

				.voucher {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 173rpx;
					height: 54rpx;
					background: rgba(100, 186, 253, 0.1);
					border-radius: 145rpx 145rpx 145rpx 145rpx;
					font-weight: 700;
					font-size: 24rpx;
					color: #64BAFD;
				}

				.refund {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 173rpx;
					height: 54rpx;
					border-radius: 145rpx 145rpx 145rpx 145rpx;
					border: 2rpx solid #64BAFD;
					font-weight: 700;
					font-size: 24rpx;
					color: #64BAFD;
					margin-left: 28rpx;
				}
			}
		}

		.see-more {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;

			.text {
				font-weight: 400;
				font-size: 24rpx;
				color: #9E9E9E;
				line-height: 41rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.text.act {
				color: #64BAFD;
			}
		}
	}

	.guize {
		margin-left: 10rpx;
	}
</style>