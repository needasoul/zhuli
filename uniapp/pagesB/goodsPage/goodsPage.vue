<template>
	<view v-show="display">
		<view class="top-box">
			<swiper style="height: 100%;" :autoplay="true" :interval="3000" :duration="1000" circular="true">
				<swiper-item v-for="(item,index) in contentlist.image" :key="index">
					<image :src="item" mode=""></image>
				</swiper-item>
			</swiper>
			<view class="back" @click="routerBack">
				<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
			</view>
		</view>
		<view class="middle-box bg-f br-26 mt-38">
			<view class="f-size-34 f-500 color-05  mb-12">
				{{contentlist.title}}
			</view>
			<view class="f-size-38 f-500 color-FD2952">
				{{contentlist.price}}积分
			</view>
		</view>

		<view class="middle-box bg-f br-26 mt-38">
			<view class="middle-box_item">
				<view class="middle-box_left">
					产地
				</view>
				<view class="middle-box_right" v-if="contentlist.cd">
					{{contentlist.cd || ''}}
				</view>
			</view>
			<view class="middle-box_item" v-if="contentlist.title">
				<view class="middle-box_left">
					品名
				</view>
				<view class="middle-box_right me-text-beyond">
					{{contentlist.title}}
				</view>
			</view>
			<view class="middle-box_item" v-if="contentlist.cz">
				<view class="middle-box_left">
					材质
				</view>
				<view class="middle-box_right  me-text-beyond">
					{{contentlist.cz || ''}}
				</view>
			</view>
			<view class="middle-box_item" v-if="contentlist.rl">
				<view class="middle-box_left">
					容量
				</view>
				<view class="middle-box_right  me-text-beyond">
					{{contentlist.rl || ''}}
				</view>
			</view>
			<view class="middle-box_item" v-if="contentlist.bz">
				<view class="middle-box_left">
					包装
				</view>
				<view class="middle-box_right  me-text-beyond">
					{{contentlist.bz || ''}}
				</view>
			</view>
			<view class="middle-box_item" v-if="contentlist.cpdj">
				<view class="middle-box_left">
					产品等级
				</view>
				<view class="middle-box_right  me-text-beyond">
					{{contentlist.cpdj || ''}}
				</view>
			</view>

		</view>

		<view class="middle-box" v-if="contentlist.content">
			<view class="rich_text_title">
				商品详情
			</view>

			<view class="">
				<u-parse :content='contentlist.content'></u-parse>
			</view>

		</view>

		<view class="middle-box_1 flexs flexc">
			<view class="">
				兑换数量
			</view>
			<view class="">
				<u-number-box v-model="value">
					<view slot="minus" class="minus">
						<u-icon name="minus" color="#64BAFD" size="12"></u-icon>
					</view>
					<text slot="input" style="width: 50rpx;text-align: center;" class="input">{{value}}</text>
					<view slot="plus" class="plus">
						<u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
					</view>
				</u-number-box>
			</view>

		</view>

		<view class=" middle-box_buttom" @click="promptly()">
			<view class="middle-box_buttom_title">
				立即兑换
			</view>
		</view>
		<view style="height: 150rpx;">

		</view>
		<template>
			<u-popup :show="show" mode="bottom" @close="close" @open="open">
				<view class="bottom-box bg-f br-14 pt-32">
					<view class="bottom-box-top d-flex ml-38">
						<view class="bottom-box-pic br-10">
							<image :src="contentlist.thumbnail" mode=""></image>
						</view>
						<view class=" bottom-box-pic_box">
							<view class="bottom-box-pic_title">
								{{contentlist.title}}
							</view>
							<view class="bottom-box-pic_price">
								{{price}}积分
							</view>
						</view>
					</view>
					<view class="bottom-box-middle ml-38 d-flex mt-36">
						<view class="f-size-28 f-500 color-3C3C bottom-box-middle_left">数量</view>
						<view class="f-size-22 f-400 color-6 bottom-box-middle_count">
							库存{{contentlist.stock}}件,日限购{{contentlist.daily}}件</view>
						<view class=" bottom-box-middle_right">
							<u-number-box v-model="value" @change="valChange"></u-number-box>
						</view>
					</view>
					<view class="bottom" @click="paid(1,contentlist.id,value)">
						确定
					</view>
				</view>
			</u-popup>
		</template>
	</view>
</template>

<script>
	import {
		goodsgetGoodsDetail
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				value: 1,
				contentlist: {},
				price: '',
				show: false,
				display: false
			}
		},
		onLoad(id) {
			console.log(id);
			this.goodsgetGoodsDetailApi(id.id)
		},
		onShareAppMessage() {
			return {
				title: this.contentlist.title,
				imageUrl: this.contentlist.image[0],
				path: `/pagesB/goodsPage/goodsPage?id=${this.contentlist.id}`
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: this.contentlist.title,
				imageUrl: this.contentlist.image[0],
				path: `/pagesB/goodsPage/goodsPage?id=${this.contentlist.id}`
			}
		},

		methods: {
			valChange(value) {
				console.log(value);
				this.price = this.contentlist.price * value.value
			},
			async goodsgetGoodsDetailApi(id) {
				let data = await goodsgetGoodsDetail({
					id
				})
				console.log(data);
				this.contentlist = data.data
				this.price = data.data.price
				this.display = true
			},
			promptly() {
				this.show = true
			},
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				// console.log('close');
			},
			paid(orderType, goodsId, goodsCount) {
				console.log(orderType, goodsId, goodsCount);
				uni.navigateTo({
					url: '/pagesB/confirmOrder/confirmOrder?orderType=' + orderType + '&goodsId=' + goodsId +
						'&goodsCount=' + goodsCount + '&img=' + this.contentlist.thumbnail + '&title=' +
						this.contentlist.title
				})
				this.show = false
			}
		}
	}
</script>
<style>
	page {
		background: #F6F6F6;
	}
</style>
<style scoped lang="scss">
	.middle-box_1 {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		padding: 20rpx 34rpx;
		box-sizing: border-box;
		margin: 20rpx auto;
	}

	.minus {
		width: 22px;
		height: 22px;
		border-width: 1px;
		border-color: #64BAFD;
		border-style: solid;
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		border-bottom-left-radius: 100px;
		border-bottom-right-radius: 100px;
		@include flex;
		justify-content: center;
		align-items: center;
	}

	.input {
		padding: 0 10px;
	}

	.plus {
		width: 22px;
		height: 22px;
		background-color: #64BAFD;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.top-box {
		width: 100%;
		height: 656rpx;
		position: relative;

		.back {
			width: 60rpx;
			height: 60rpx;
			background: #232323;
			opacity: 0.5;
			border-radius: 50%;
			position: absolute;
			top: 102rpx;
			left: 30rpx;
			padding: 14rpx 12rpx;
			box-sizing: border-box;
			z-index: 9;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.middle-box {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 36rpx auto 0;
		padding: 20rpx 0 24rpx 24rpx;

		.middle-box_item {
			display: flex;
			padding: 18rpx 0;
			box-sizing: border-box;

			.middle-box_left {
				margin-right: 40rpx;
				font-size: 28rpx;
				color: #666666;
			}

			.middle-box_right {
				width: 500rpx;
				font-size: 28rpx;
			}
		}



	}

	.middle-box_buttom {
		width: 100%;
		position: fixed;
		bottom: 0;
		padding: 20rpx 0;

		.middle-box_buttom_title {
			width: 687rpx;
			height: 79rpx;
			background: #64BAFD;
			border-radius: 40rpx;
			margin: 0 auto;
			font-size: 32rpx;
			font-weight: 400;
			color: #FBFEFF;
			line-height: 79rpx;
			text-align: center;
		}
	}

	.bottom-box {
		width: 100%;
		height: 500rpx;
		// position: fixed;
		// bottom: 0;

		.bottom-box-top {
			.bottom-box-pic {
				width: 209rpx;
				height: 208rpx;
				border-radius: 14rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.bottom-box-pic_box {
				margin-left: 40rpx;

				.bottom-box-pic_title {
					font-size: 40rpx;
					font-weight: 400;
					color: #333333;
					margin-top: 10rpx;
				}

				.bottom-box-pic_price {
					font-size: 30rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
					color: #F5282E;
					margin-top: 80rpx;
				}
			}
		}

		.bottom-box-btn {
			width: 687rpx;
			height: 79rpx;
			line-height: 79rpx;
			background: #64BAFD;
			border-radius: 40rpx;
			margin: 155rpx auto 25rpx;
		}

		.bottom-box-middle {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.bottom-box-middle_right {
				margin-right: 30rpx;
			}

			.numberbox {
				.u-number-box__input {
					width: 70rpx;
					height: 47rpx;
					margin: 0;
				}
			}
		}

		.bottom {
			width: 687rpx;
			height: 79rpx;
			background: #64BAFD;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: 400;
			color: #FBFEFF;
			line-height: 79rpx;
			text-align: center;
			margin: 0 auto;
			margin-top: 60rpx;
		}
	}

	.rich_text {
		width: 710rpx;
		margin: 0 auto;
		box-shadow: 0rpx 2rpx 20rpx 0rpx rgba(0, 0, 0, 0.11);
		padding-bottom: 30rpx;
		margin-top: 20rpx;
		border-radius: 40rpx;

		.rich_text_title {
			font-size: 34rpx;
			font-weight: 500;
			color: #050505;
			margin-left: 30rpx;
		}

		.rich_text_html {
			width: 95%;
			margin: 0 auto;
			margin-top: 10rpx;
		}
	}

	.zan-wu {
		color: #828282;
		padding-left: 32rpx;
	}
</style>