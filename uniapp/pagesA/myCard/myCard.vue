<template>
	<view>
		<image class="head_img" src="/pagesA/static/icon1.svg" mode=""></image>
		<view class="top-box bg-f br-18 ">
			<view class="title flexc">
				<image src="/pagesA/static/icon5.svg" mode=""></image>
				<span>我的优惠券</span>
			</view>
			<view v-for="(item,index) in content" :key="index" class="top-box-card d-flex mb-24 flexs pr-16"
				style="padding-top: 40rpx; ">
				<image class="top-box-card_img" src="../static/icon3.png" mode=""></image>
				<view class="ml-34 zindex">
					<view class="text_center">
						<text class="f-size-20 f-500 color-8c56">¥</text>
						<text class="f-500 color-8c56" style="font-size: 32rpx;">{{item.coupon.used_amount}}</text>
					</view>
					<view class="f-size-22 f-400 color-DEB5 mt-6">满{{item.coupon.with_amount}}使用</view>
				</view>

				<view class="zindex center_time">
					<view class="f-size-26 f-500 color-3632">{{item.coupon.title}}</view>
					<view class="f-size-18 f-400 color-DEB5 mt-16">{{item.coupon.start_time}} -
						{{item.coupon.end_time}}
					</view>
				</view>
				<view class="sybtn zindex" @click="gouse(item.state)">
					使用
				</view>
			</view>

			<empty v-if="content.length<=0"></empty>
			<!-- two -->
			<view class="top-box_add" @click="draw">
				点击查看更多优惠券
			</view>
		</view>



	</view>
</template>

<script>
	import {
		couponlist
	} from "@/api/comm.js"
	import {
		couponcouponList,
		coupondraw
	} from "@/api/comm.js"
	import {
		forEach
	} from "lodash"

	import {
		toDate
	} from "@/utils/time.js"
	export default {
		data() {
			return {
				content: [],
				yhqimg: '',
				isShow: false,
				content1: []
			}
		},
		onLoad() {
			this.couponlistApi()
			this.yhqimg = uni.getStorageSync('configuration').yhqimg
			this.couponcouponListApi()
		},
		onShow() {
			this.couponlistApi()
		},
		methods: {
			async couponcouponListApi() {
				let data = await couponcouponList({})
				console.log(data);
				data.data.forEach((element) => {
					element.start_time = toDate(element.start_time * 1000, 2)
					element.end_time = toDate(element.end_time * 1000, 2)
				})
				this.content1 = []
				this.content1.push(...data.data)
			},
			async getcopemt(id) {
				let that = this
				console.log('领取优惠劵');
				let data = await coupondraw({
					id
				})
				console.log(data);
				if (data.code == 1) {
					that.couponcouponListApi()
				}
				this.showToast(data.msg)
			},



			async couponlistApi() {
				let data = await couponlist({})
				console.log(11, data);
				data.data.forEach((element) => {
					element.coupon.start_time = toDate(element.coupon.start_time * 1000, 2)
					element.coupon.end_time = toDate(element.coupon.end_time * 1000, 2)
				})
				this.content = []
				this.content.push(...data.data)
				this.isShow = true
				// console.log(this.content);
			},
			draw() {
				uni.navigateTo({
					url: '/pagesA/addcouoon/addcouoon'
				})
			},
			gouse(state) {
				if (state == 0) {
					uni.reLaunch({
						url: '/pages/venueTab/venueTab'
					})
				} else {
					this.$showToast('已过期或已使用')
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #FAFAFA;
	}
</style>
<style scoped lang="scss">
	.head_img {
		height: 680rpx;
		width: 100vw;
	}

	.top-box {
		width: 690rpx;
		padding: 42rpx 28rpx;
		box-sizing: border-box;
		margin: -120rpx auto 0;
		position: relative;
		z-index: 100;

		.top-box_add {
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			text-align: center;
			margin: 34rpx 0 0;
		}

		.title {
			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
				margin-top: 6rpx;
			}

			span {
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: 600;
			}
		}

		.top-box-card {
			width: 630rpx;
			height: 148rpx;
			// background: url("/pagesA/static/icon3.png") no-repeat;
			// background-size: 100% 100%;
			margin-top: 38rpx;
			position: relative;

			.top-box-card_img {
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				width: 630rpx;
				height: 148rpx;
			}

			.day-box {
				width: 60rpx;
				height: 25rpx;
				line-height: 25rpx;
				background: #3CBDFF;
				border-radius: 4rpx;
			}

			.pic-box {
				width: 20rpx;
				height: 20rpx;

				image {
					width: 20rpx;
					height: 20rpx;
					color: #00C0FF;
				}
			}
		}
	}

	.center_time {
		width: 220rpx;
	}

	.sybtn {
		width: 132rpx;
		height: 50rpx;
		background: linear-gradient(270deg, #FD6940 0%, #FE3E38 100%);
		border-radius: 1050rpx;
		margin: 16rpx 0 0;

		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
	}

	.box {
		.box_item {
			height: 158rpx;
			margin-top: 42rpx;
		}

		.box_item_left {
			width: 158rpx;
			height: 158rpx;
			background: url('/pagesA/static/icon4.png') no-repeat;
			background-size: 100% 100%;
			position: relative;

			.text_1 {
				color: #AA845A;
				position: absolute;
				top: 44rpx;
				left: 50%;
				width: 158rpx;
				text-align: center;
				transform: translateX(-50%);
				font-weight: bold;
			}

			.text_2 {
				color: #FFD9AA;
				font-size: 24rpx;
				position: absolute;
				bottom: 18rpx;
				left: 50%;
				width: 158rpx;
				text-align: center;
				transform: translateX(-50%);
			}

		}

		.box_item_right {
			width: calc(100% - 158rpx - 18rpx);
			height: 158rpx;

			.box_item_right_btn {
				width: 182rpx;
				height: 56rpx;
				background: linear-gradient(267deg, #FB4034 0%, #FE6A3F 100%);
				border-radius: 812rpx 812rpx 812rpx 812rpx;
				text-align: center;
				line-height: 56rpx;
				color: #FFFFFF;
			}
		}
	}
</style>