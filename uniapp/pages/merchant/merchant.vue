<template>
	<view v-if="show">
		<view class="yuer" @click="routerTo('/pagesC/financial/financial')">
			<image class="bgcimg" src="@/static/icon1.svg" mode=""></image>
			<view class="one">
				我的余额(元)
			</view>
			<view class="two">
				{{List.money}}
			</view>
		</view>
		<!-- 扫码核销 -->
		<view class="write-off">
			<view class="scan-code" @click="goorder(0)">
				<image class="imgs" src="@/static/merchant/codeQR.svg" mode=""></image>
			</view>
			<view class="code-input">
				<input class="inputs" type="text" placeholder="请输入核销码" v-model="code">
			</view>
			<view class="but-hexiao" @click="goorder(1)">
				核销
			</view>
		</view>
		<!-- 分类 -->
		<view class="card">

			<view class="card_item" @click="goDetails(2)">
				<image src="../../static/images/bus-cg.png" mode=""></image>
				<view class="text">
					场馆订单
				</view>
			</view>
			<view class="card_item" @click="goDetails(3)">
				<image src="../../static/images/bus-kc.png" mode=""></image>
				<view class="text">
					课程订单
				</view>
			</view>
			<view class="card_item" @click="goDetails(4)">
				<image src="../../static/images/bus-hd.png" mode=""></image>
				<view class="text">
					活动订单
				</view>
			</view>
		</view>
		<!-- 今日数据 -->

		<view class="card-data">
			<view class="title">
				<view class="title-left">
					<view class="box">

					</view>
					<view class="title-text">
						今日数据
					</view>
				</view>
				<view class="title-right flexc">
					<view class="two" style="line-height: 50rpx;margin-left: 20rpx;width: 370rpx;">
						{{timer | Format}} 实时更新
					</view>
					<view class="dayimg">
						<image style="margin-top: 10rpx;" src="@/static/icon9.svg" mode="" @click="getloding"></image>
					</view>
				</view>
			</view>
			<view class="card-data-bottom">
				<view class="turnover flex-direction-align">
					<view class="num">
						{{List.top[0].value}}
					</view>
					<view class="text">
						{{List.top[0].key}}
					</view>
				</view>
				<view class="fenge">
					<image class="imgs" src="../../static/images/xu-xian.png" mode=""></image>
				</view>
				<view class="jiri-order flex-direction-align">
					<view class="num">
						{{List.top[1].value}}
					</view>
					<view class="text">
						{{List.top[1].key}}
					</view>
				</view>
				<view class="xian xian1">

				</view>
				<view class="pv flex-direction-align">
					<view class="num">
						{{List.top[2].value}}
					</view>
					<view class="text">
						{{List.top[2].key}}
					</view>
				</view>
				<view class="xian">

				</view>
				<view class="uv flex-direction-align">
					<view class="num">
						{{List.top[3].value}}
					</view>
					<view class="text">
						{{List.top[3].key}}
					</view>
				</view>
			</view>
		</view>
		<view class="card-data card-data-dianpu">
			<view class="title">
				<view class="title-left">
					<view class="box">

					</view>
					<view class="title-text">
						店铺数据
					</view>
				</view>
				<view class="title-right flexc">

				</view>
			</view>
			<view class="dianpu-data-list">
				<view class="dianpu-data-list-c" v-for="(item,Index) in List.below" :key="Index">
					<view class="num">
						{{item.value}}
					</view>
					<view class="text">
						{{item.key}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store_info,
		hx_code
	} from '@/api/comm.js'
	import {
		join
	} from 'lodash';
	export default {
		data() {
			return {
				value3: true,
				List: {},
				user: {},
				navbarHeight: '',
				inter: null,
				popshow: false,
				timer: new Date(),
				show: false,
				code: '', // 核销码
			};
		},
		onUnload() {
			clearInterval(this.inter)
		},
		onHide() {
			clearInterval(this.inter)
		},
		onLoad() {
			this.getstore_info()
		},
		onShow() {
			this.inter = setInterval(() => {
				this.getstore_info()
			}, 3000)
		},
		methods: {
			// 跳转详情
			goDetails(type) {
				// 积分
				if (type == 1) {
					uni.navigateTo({
						url: '/pages/allOrders/allOrders?isBusiness=1'
					})
				}
				if (type == 2) {
					uni.navigateTo({
						url: '/pagesC/businessOrder/businessOrder'
					})
				}
				// 课程
				if (type == 3) {
					uni.navigateTo({
						url: '/pagesA/courseOrder/courseOrder?isBusiness=1&merchant=1'
					})
				}
				// 活动
				if (type == 4) {
					uni.navigateTo({
						url: '/pagesA/orderActivity/orderActivity?isBusiness=1'
					})
				}
			},
			cancel() {
				this.popshow = false
			},
			confirm() {
				this.popshow = false
				uni.navigateTo({
					url: '/pages/merchant/shopInfo/shopInfo'
				})
			},
			// 判读是否过了营业时间
			gettime() {
				//过滤器 用于格式化时间
				let user = uni.getStorageSync('shopuser')
				let date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let hour = ("0" + date.getHours()).slice(-2);
				let end = user.end_times.substring(0, 2)
				let start = user.start_times.substring(0, 2)
				if (hour < start || hour > end) {
					this.popshow = true;
					this.value3 = false
				} else {
					this.popshow = false;
					this.change()
				}
			},
			async goorder(i) {
				switch (i) {
					case 0:
						uni.scanCode({
							async success(e) {
								console.log(e.result, '扫码成功');
								let result = e.result.split(',')
								let order_no = result[1].substring(8)
								let code = result[0].substring(5)
								let data = await hx_code({
									order_no,
									code
								})
								if (data.code == 1) {
									uni.showToast({
										icon: 'success',
										title: data.msg
									})
								} else {
									uni.showToast({
										icon: 'error',
										title: data.msg
									})
								}
							},
							fail(err) {
								uni.showToast({
									icon: 'error',
									title: err
								})
							}
						})
						break;
					default:
						if (this.code == '') {
							uni.showToast({
								icon: 'none',
								title: '请输入核销码'
							})
							return
						}
						let data = await hx_code({
							code: this.code
						})
						if (data.code == 1) {
							uni.showToast({
								icon: 'success',
								title: data.msg
							})
							this.code = ''
						} else {
							uni.showToast({
								icon: 'error',
								title: data.msg
							})
						}
						break;
				}
			},
			async change() {
				let res = await trade_switchs({
					switch: this.value3
				})
			},
			gopage(url) {
				uni.navigateTo({
					url
				})
			},
			async getloding() {
				uni.showLoading({
					title: '数据加载中...'
				})
				this.getstore_info()
				uni.hideLoading()
			},
			async getstore_info() {
				let res = await store_info()
				if (res.code !== 1) return
				this.List = res.data
				this.timer = res.time
				this.show = true
			}
		}
	}
</script>

<style lang="scss">
	page {
		min-height: 100vh;
		padding: 0 26rpx 26rpx;
		box-sizing: border-box;
		// background: #FAFAFA;
	}



	.headimg {
		width: 62rpx;
		height: 62rpx;
		margin-right: 20rpx;
		border-radius: 50%;
	}

	.title {
		font-size: 34rpx;
		font-weight: 600;
		color: #333333;
	}

	.yuer {
		position: relative;
		width: 700rpx;
		margin: 28rpx 0 0rpx;

		.bgcimg {
			width: 700rpx;
			height: 250rpx;
			border-radius: 10rpx;

		}

		.yuer_bom {
			height: 100rpx;
			padding: 20rpx 26rpx 0;
			box-sizing: border-box;

			image {
				width: 36rpx;
				height: 36rpx;
				margin-right: 16rpx;
			}

			font-size: 24rpx;
			color: #000000;
		}

		.one {
			font-size: 30rpx;
			color: #FFFFFF;
			position: absolute;
			top: 56rpx;
			left: 50rpx;
		}

		.two {
			font-size: 56rpx;
			font-weight: 600;
			color: #FFFFFF;
			position: absolute;
			top: 120rpx;
			left: 50rpx;
		}

		.three {
			font-size: 22rpx;
			color: #FFFFFF;
			position: absolute;
			top: 66rpx;
			right: 88rpx;
		}

		.four {
			width: 188rpx;
			height: 52rpx;
			background: #FFFFFF;
			border-radius: 26rpx;
			font-size: 22rpx;
			color: #00ABFF;
			line-height: 52rpx;
			text-align: center;
			position: absolute;
			top: 132rpx;
			right: 64rpx;
		}
	}


	.card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 693rpx;
		height: 162rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		margin-top: 25rpx;
		padding: 0 40rpx;


		.card_item {
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 72rpx;
				height: 72rpx;
			}

			.text {
				font-weight: 400;
				font-size: 28rpx;
				color: #353535;
				margin-top: 17rpx;
			}

			// .type {
			// 	font-size: 14rpx;
			// 	color: #00ABFF;
			// 	line-height: 26rpx;
			// 	text-align: center;
			// 	width: 26rpx;
			// 	height: 26rpx;
			// 	background: #FFFFFF;
			// 	border: 1rpx solid #00ABFF;
			// 	border-radius: 50%;
			// 	position: absolute;
			// 	right: 36rpx;
			// 	top: 4rpx;
			// 	z-index: 99;
			// }
		}
	}

	.day_card {
		background-color: #fff;

		.dayimg {
			text-align: right;
			width: 40rpx;
		}

		.title {
			padding: 18rpx 30rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #EBEBEB;

			.one {
				font-size: 34rpx;
				color: #000000;
			}

			.two {
				font-size: 24rpx;
				color: #777777;
				width: 350rpx;
				height: 34rpx;
			}

			image {
				width: 27rpx;
				height: 34rpx;
			}
		}
	}

	.grida {
		padding: 20rpx 80rpx;
		box-sizing: border-box;
		text-align: center;

		.grid_one {
			font-size: 26rpx;
			color: #777777;
			margin-bottom: 10rpx;
		}

		.grid_two {
			font-size: 34rpx;
			color: #000000;
		}
	}

	.write-off {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 696rpx;
		height: 89rpx;
		background: #F8F8F8;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		margin-top: 50rpx;
		padding: 0 29rpx 0 25rpx;

		.scan-code {
			width: 46rpx;
			height: 46rpx;

			.imgs {
				width: 100%;
				height: 100%;
			}
		}

		.code-input {
			.inputs {
				width: 180rpx;
				transform: translateX(20rpx);
			}
		}

		.but-hexiao {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 95rpx;
			height: 50rpx;
			background: #64bafd;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			font-weight: 700;
			font-size: 26rpx;
			color: #FFFFFF;
		}
	}

	.card-data {
		width: 693rpx;
		height: 262rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		margin-top: 25rpx;
		padding: 32rpx 27rpx 52rpx 27rpx;
		box-sizing: border-box;

		.title {
			display: flex;
			justify-content: space-between;

			.title-left {
				display: flex;
				align-items: center;

				.box {
					width: 8rpx;
					height: 29rpx;
					background-color: #64bafd;
					margin-right: 12rpx;
				}

				.title-text {}
			}

			.title-right {
				.two {
					font-size: 24rpx;
					color: #777777;
					width: 350rpx;
					height: 34rpx;
				}

				image {
					width: 27rpx;
					height: 34rpx;
				}
			}
		}

		.card-data-bottom {
			display: flex;
			align-items: center;
			margin-top: 50rpx;

			.fenge {
				width: 4rpx;
				height: 49rpx;
				margin: 0 35rpx 0 69rpx;

				.imgs {
					width: 100%;
					height: 100%;
				}
			}

			.xian {
				width: 0rpx;
				height: 49rpx;
				border: 1rpx solid #D8D8D8;
				margin: 0 50rpx;
			}

			.xian1 {}
		}
	}

	.flex-direction-align {
		display: flex;
		flex-direction: column;
		align-items: center;

		.num {
			font-weight: 700;
			font-size: 40rpx;
			color: #343434;
		}

		.text {
			font-weight: 400;
			font-size: 28rpx;
			color: #9E9E9E;
			margin-top: 15rpx;
		}
	}

	.card-data-dianpu {
		.title {
			.title-left {
				.box {
					background-color: #ebb064;
				}
			}
		}

		.dianpu-data-list {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.dianpu-data-list-c {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-top: 50rpx;

				.num {
					font-weight: 700;
					font-size: 40rpx;
					color: #343434;
				}

				.text {
					font-weight: 400;
					font-size: 28rpx;
					color: #9E9E9E;
					margin-top: 20rpx;
				}
			}
		}
	}
</style>