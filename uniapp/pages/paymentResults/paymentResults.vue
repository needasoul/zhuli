<template>
	<view>
		<view class="top-box d-flex j-center bg-f">
			<view class="">
				<view class="top-box-pic d-flex j-center">
					<image src="@/static/images/succeed.png" mode=""></image>
				</view>
				<view class=" f-size-30 f-500  txt-center" style="margin-top: 30rpx;">
					<view>
						恭喜您
					</view>
					<view>
						本次交易支付成功
					</view>
				</view>
				<view class="f-600  mt-30 txt-center" style="color: #F4370F ; font-size:48rpx;">
					¥{{price}}
				</view>
				<view class="goback" @click="goback">
					返回首页
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				price: 0
			}
		},
		onLoad(price) {
			console.log(price);
			this.price = price.name
		},
		methods: {
			goback() {
				uni.reLaunch({
					url: "/pages/index/index"
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
	.top-box {
		width: 100%;
		height: 100vh;

		.top-box-pic {
			margin-top: 119rpx;
			width: 309rpx;
			height: 258rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goback {
			width: 279rpx;
			height: 72rpx;
			margin: 60rpx auto;
			background: #24D54E;
			border-radius: 36rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 72rpx;
			letter-spacing: 1rpx;
			text-align: center;
		}
	}
</style>