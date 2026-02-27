<template>
	<view class="Financial">
		<view class="detail">
			<view class="title flexc flexs">
				<view class="">
					收支明细
				</view>
			</view>
			<view class="content" v-if="list.length!==0">
				<view class="item flexc flexs" v-for="(item,i) in list" :key="i">
					<view class="item_left flexc">
						<!-- <image src="../static/head.png" mode=""></image> -->
						<view class="">
							<view class="top" v-if="item.type==1">收款成功</view>
							<view class="top" v-if="item.type==2">退款成功</view>
							<view class="bom">{{item.createtime | Format}} {{item.username}}</view>
						</view>
					</view>
					<view class="right" v-if="item.type==1"> +{{item.money}}</view>
					<view class="right" v-if="item.type==2"> -{{item.money}}</view>
				</view>
			</view>
			<view class="" v-else>
				<empty></empty>
			</view>
		</view>
		<u-datetime-picker closeOnClickOverlay='true' v-if="show" :show="show" @cancel='cancel' @confirm='confirm'
			v-model="value1" mode="year-month">
		</u-datetime-picker>
	</view>
</template>

<script>
	import {
		balance as revenue
	} from '@/api/comm.js'
	export default {
		data() {
			return {
				show: false,
				value1: Number(new Date()),
				user: uni.getStorageSync('shopuser'),
				objectAll: {},
				list: [],
				date: '',
				mag: '100rpx 0rpx',
				timeText: '日期选择',
				pges: 1
			};
		},
		onLoad() {
			this.revenue()
		},
		methods: {
			cancel() {
				this.show = false
			},
			confirm(e) {
				this.show = false
				this.date = this.$way.timerFormat(e.value)
				this.timeText = this.Format(e.value)
				this.revenue()
			},

			async revenue() {
				let res = await revenue({
					date: this.date,
					page: this.pges,
					limit: 10
				})
				this.objectAll = res.data
				this.list.push(...res.data.data)
			},
			gopage() {
				uni.navigateTo({
					url: '/pages/merchant/cash/cash'
				})
			},
		},
		onReachBottom() {
			this.pges++
			this.revenue()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;

	}

	.Financial {



		.card {
			background: #F1F2F2;
			padding: 24rpx 0;
			box-sizing: border-box;
			width: 700rpx;
			height: 456rpx;
			margin: 0 auto;
			border-radius: 0rpx 0rpx 30rpx 30rpx;

			.tix {
				width: 130rpx;
				height: 50rpx;
				border-radius: 20rpx 0 0 20rpx;
				position: absolute;
				top: 300rpx;
				right: 20rpx;
				background-color: #fff;
				font-size: 24rpx;
				color: #00ABFF;
				text-align: center;
				line-height: 50rpx;
			}

			.head {
				position: absolute;
				top: 60rpx;
				left: 80rpx;


				image {
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
					border-radius: 50%;
				}

				color: #fff;
				font-size: 34rpx;
				line-height: 60rpx;

			}

			.text {
				font-size: 28rpx;
				color: #fff;
				position: absolute;
				top: 290rpx;
				left: 80rpx;
			}

			.money {
				font-size: 50rpx;
				color: #fff;
				position: absolute;
				top: 180rpx;
				left: 80rpx;
			}

			.wellet {
				width: 700rpx;
				height: 350rpx;
			}

			.shouyi {
				padding: 20rpx 60rpx 0;
				box-sizing: border-box;
			}

			.yield {
				.one {
					font-size: 24rpx;
					color: #777777;
					margin-right: 20rpx;
				}

				.two {
					font-size: 24rpx;
					color: #00ABFF;
				}
			}
		}

		.detail {
			border-radius: 40rpx 40rpx 0 0;

			.title {
				font-size: 36rpx;
				color: #333333;
				font-weight: 600;
				padding: 40rpx;
				box-sizing: border-box;

				.btn {
					width: 169rpx;
					height: 100%;
					background: #F1F2F2;
					border-radius: 34rpx;
					font-size: 24rpx;
					color: #777777;
					text-align: center;
					line-height: 67rpx;
				}
			}


			.content {
				padding: 0 40rpx 40rpx;
				box-sizing: border-box;

				.item {
					padding: 24rpx 0;
					border-bottom: 1rpx solid #EBEBEB;

					.right {
						font-size: 30rpx;
						color: #18B2FD;
					}

					.item_left {

						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: 50%;
							margin-right: 20rpx;
						}

						.top {
							font-size: 32rpx;
							color: #333333;
						}

						.bom {
							font-size: 24rpx;
							color: #777777;
						}


					}
				}
			}
		}
	}
</style>