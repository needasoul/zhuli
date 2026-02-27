<template>
	<view v-show="display">
		<view class=" head">
			<view class="address">
				线下自提地址：<text class="pl-16">{{contentlist.data.selfdeliverys || ''}}</text>
			</view>
			<view class="user">
				<text>{{contentlist.data.lx_name}}</text>
				<text>{{contentlist.data.lx_tel}}</text>
			</view>
		</view>
		<view class=" middle-box ">
			<view class="flexc flexs">
				<view class="middle-box-pic">
					<image :src="objall.img" mode=""></image>
				</view>
				<view class="middle-box-right flexColumn">
					<view class="text_1 me-text-beyond">{{objall.title || ''}}</view>
					<view class="text_2">{{contentlist.price || 0}}积分</view>
					<view class="flexc flexs text_3">
						<view class="">x{{value || 0}}</view>
						<view class="numberbox">
							<u-number-box v-model=" value" @change="valChange" buttonSize="23"></u-number-box>
						</view>
					</view>
				</view>
			</view>

			<view class="agreement">
				<label class="radio" @click="checkboxChange">
					<radio :checked="checked" /><text style="font-size: 24rpx;margin-left: 16rpx;">
						您已认真阅读并同意</text>
					<text style=" color: #64BAFD;font-size: 24rpx;" @click.stop="showModal()">《积分协议》</text>
				</label>

			</view>
		</view>


		<view class="bottom">
			<view class="bottom_right" @click="ordercreateApi()">
				立即兑换
			</view>
			<view class="bottom_left">
				<text class="bottom_left_1">合计:</text><text class="bottom_left_2">{{contentlist.price}}积分</text>
			</view>
		</view>
	</view>
</template>

<script>
	let orderSubscribeId = 'RbmvAvuM9jSUB0geFtMwYS4E6f0fSZ0vsoIFqaLAoXg'
	import {
		orderbefore,
		ordercreate,
		orderpay,
		Bind_to_wechat,
		usergetUserInfo,
		getopenid
	} from "@/api/comm.js"

	export default {
		data() {
			return {
				value: 1,
				contentlist: {},
				objall: {},
				checked: false,
				display: false,
				openid: '',
				ispay: true
			}
		},
		onLoad(obj) {
			this.objall = obj
			this.value = obj.goodsCount
			this.orderbeforeApi()
			this.getBinding()
			this.getopenidApi()
		},
		methods: {
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
			valChange(e) {
				console.log('当前值为: ' + e.value)
				this.value = e.value
				this.orderbeforeApi()
			},
			async orderbeforeApi() {
				let data = await orderbefore({
					orderType: this.objall.orderType,
					goodsId: this.objall.goodsId,
					goodsCount: this.value
				})
				console.log(data);
				this.contentlist = data.data
				this.display = true
			},
			checkboxChange(event) {
				console.log('sdfsd', this.checked, event);
				this.checked = !this.checked
				console.log(this.checked);
			},
			showModal() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '积分协议'
				})
			},
			//绑定微信
			async getBinding() {
				let res = await usergetUserInfo()
				this.openid = res.data.openid
				console.log();
			},
			ordercreateApi() {
				if (!this.ispay) {
					return this.showToast('请勿重复点击')
				}
				this.ispay = false
				setTimeout(() => {
					this.ispay = true
				}, 2000)
				if (this.checked) {
					if (!this.openid) {
						this.showToast('没有openid,请联系管理员')
					} else {
						ordercreate({
							orderType: this.objall.orderType,
							goodsId: this.objall.goodsId,
							goodsCount: this.value,
							payChannel: 0
						}).then(res => {
							console.log(res);
							if (res.code == 1) {
								this.orderpayApi(res.data.orderNo)
							} else if (res.msg == '用户可用积分不足') {
								this.showToast('您的积分不足')
							} else {
								this.showToast(res.msg)

							}
						})
					}
				} else {
					this.showToast('请勾选兑换协议')
				}

			},
			async orderpayApi(orderNo) {
				let data = await orderpay({
					orderNo
				})
				if (data.code == 1) {
					var _this = this;
					let arr = []
					let configuration = uni.getStorageSync('configuration')
					configuration.message.forEach(item => {
						if (item.message_type == 1) {
							arr.push(item.masterplate)
						}
					})
					// #ifdef MP-WEIXIN 
					this.subscription(arr, '/pages/allOrders/allOrders')
					// #endif
					// #ifdef H5
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/allOrders/allOrders'
						})
					}, 1500)
					// #endif
				}
			}
		}
	}
</script>
<style>
	page {
		background: #F2F2F2;

	}
</style>
<style scoped lang="scss">
	.head {
		background-color: #fff;
		padding: 28rpx 30rpx;
		box-sizing: border-box;
		margin: 0 0 36rpx;

		.address {
			font-weight: 400;
			font-size: 28rpx;
			color: #3D3D3D;
			margin-bottom: 26rpx;
			font-weight: 600;
		}

		.user {
			font-size: 24rpx;
			color: #333333;

			text:nth-child(1) {
				margin-right: 18rpx;
			}
		}
	}

	.imgBox {
		width: 100%;

		image {
			width: 100%;
			height: 10rpx;
		}
	}

	.top-box {
		width: 728rpx;
		// height: 229rpx;
		margin: 25rpx auto;
		padding: 33rpx 46rpx 34rpx 30rpx;
	}

	.middle-box {
		margin: 0 auto;
		padding: 34rpx 30rpx;
		background-color: #fff;
		box-sizing: border-box;

		.middle-box-pic {
			width: 188rpx;
			height: 188rpx;

			image {
				width: 166rpx;
				height: 176rpx;
				border-radius: 10rpx;
			}
		}

		.middle-box-right {
			width: calc(100% - 190rpx);
			height: 176rpx;

			.text_1 {
				font-size: 28rpx;
				color: #232323;
				font-weight: 600;
			}

			.text_2 {
				font-size: 26rpx;
				color: #666666;
			}

			.text_3 {
				font-size: 24rpx;
				color: #666666;
			}

			.text_4 {
				font-size: 26rpx;
				color: #FF9922;
			}

			.numberbox {
				// width: 70rpx;
				// height: 47rpx;
				// margin: 0;
			}
		}
	}

	.agreement {
		font-size: 22rpx;
		color: #222222;
		margin-top: 10rpx;
	}

	.bottom {
		width: 100%;
		height: 129rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		flex-direction: row-reverse;
		position: fixed;
		bottom: 0;

		.bottom_left {
			margin-right: 25rpx;

			.bottom_left_1 {
				font-size: 28rpx;
				font-weight: 600;
				color: #313131;
			}

			.bottom_left_2 {
				font-size: 28rpx;
				font-weight: 600;
				color: #CE1E21;
			}
		}

		.bottom_right {
			width: 221rpx;
			height: 80rpx;
			background: #64BAFD;
			border-radius: 40rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			line-height: 80rpx;
			letter-spacing: 1px;
			text-align: center;
			margin-right: 20rpx;
		}
	}
</style>