<template>
	<view>
		<image class="head_img" src="/pagesA/static/icon1.svg" mode=""></image>
		<view class="top-box bg-f br-18">
			<view class="title flexc">
				<image src="/pagesA/static/icon2.svg" mode=""></image>
				<span>领取优惠卷</span>
			</view>
			<view class="box">
				<view class="box_item flexc flexs" v-for="(item,index) in content1" :key="index">
					<view class="box_item_left ">
						<view class="text_1 zindex">
							<span class="f-size-22">￥</span><span class="f-size-32">{{item.used_amount}}</span>
						</view>
						<view class="text_2 zindex">
							满{{item.with_amount}}使用
						</view>
						<image class="top-box-card_img" src="../static/icon4.png" mode=""></image>
					</view>
					<view class="box_item_right flexColumn zindex">
						<view class="box_item_right_text1 f-size-32">
							{{item.title}}
						</view>
						<view class="box_item_right_text1 color-6 f-size-28">
							{{item.end_time}} - {{item.start_time}}
						</view>
						<view class="flexc flexs">
							<view class="f-size-36 color-F528">
								￥{{item.used_amount}}
							</view>
							<view class="box_item_right_btn" v-if="item.status==1" @click="getcopemt(item.id)">
								立即领取
							</view>
							<view class="box_item_right_btn" v-else>
								已领取
							</view>
						</view>
					</view>
				</view>
				<empty v-if="content1.length<1"></empty>
			</view>


		</view>
	</view>
</template>

<script>
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
				isShow: false,
				content1: []
			}
		},
		onLoad() {
			this.couponcouponListApi()
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
		}
	}
</script>

<style>
	page {
		background-color: #FAFAFA;
		padding-bottom: 100rpx;
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
			background: url("/pagesA/static/icon3.png") no-repeat;
			background-size: 100% 100%;

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

			.top-box-card_img {
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				width: 100%;
				height: 100%;
			}

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