<template>
	<view>
		<view class="box">
			<view class="text_1">
				我的余额
			</view>
			<view class="text_2">
				{{userinfo.money || 0}}
			</view>
			<view class="flexc flexs mt-20">
				<view class="">

				</view>
				<view class="text_3 flexc" @tap="routerTo('/pagesB/recharge/recharge')">
					流水记录
					<u-icon name='arrow-right' color="#fff" size='14'></u-icon>
				</view>

			</view>

		</view>

		<view class="price">
			<view class="price_title flexc flexs">
				<text class="price_title_text1">选择套餐</text>
				<text style="margin-top: 8rpx;">一经充值，概不退换，不兑现</text>
			</view>
			<scroll-view scroll-x="true" style="width: 100%;  white-space: nowrap;">
				<view class="price_box"
					:style="{background:select_index==index?'#F7DAB0':'',	border: select_index==index?'4rpx solid #E0B373':''}"
					v-for="(item,index) in list" :key="item.id" @tap="select(index)">
					<view class="price_box_2" :style="{color:select_index==index?'#59380D ':''}">
						充{{item.amount}}
					</view>
					<view class="" style="font-size: 36rpx ;margin-top: 20rpx;"
						:style="{color:select_index==index?'#59380D ':''}">
						到账
					</view>
					<view class="price_box_3" :style="{color:select_index==index?'#59380D ':''}">
						<text>{{item.amount_over}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="price">
			<view class="price_title flexc flexs">
				<text class="price_title_text1">支付方式</text>
			</view>
			<radio-group>
				<label class="uni-list-cell uni-list-cell-pd">
					<view style="width: 750rpx;" class="flexc popBox_content_item" @click="checked=!checked">
						<view class="flexs" style="width: 90%;">
							<view class="flexc" style="width: 20%;">
								<image class="wximg" src="../static/wx.svg" mode=""></image>
								微信
							</view>
							<radio :checked="checked" />
						</view>
					</view>

				</label>
			</radio-group>
		</view>
		<view class="fixedBtn flexc flexs">
			<view class="fixedBtn_price">
				￥{{price || '0.00'}}
			</view>
			<view class="btn" @click="pay">
				立即支付
			</view>
		</view>

	</view>
</template>

<script>
	import {
		recharge,
		ordercreate,
		orderpay,
		usergetUserInfo,
		getopenid
	} from '@/api/comm.js'

	import wxparApi from "@/utils/wxApi.js"
	export default {
		data() {
			return {
				price: "0.00",
				checked: true,
				user: {},
				list: [],
				select_index: 0,
				userinfo: '',
				openid: "",
				ispay: true
			};
		},

		onLoad() {
			this.getUser()
			this.recharge()
			let openid = uni.getStorageSync('openid')
			if (openid) {
				this.openid = openid
			} else {
				this.getopenidApi()
			}
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
			async getUser() {
				let user = await usergetUserInfo()
				if (user.code == 1) {
					this.userinfo = user.data
					uni.setStorageSync('user', user.data)
				}

			},
			async pay() {
				if (!this.ispay) {
					return this.showToast('请勿重复点击')
				}
				this.ispay = false
				setTimeout(() => {
					this.ispay = true
				}, 2000)

				if (!this.checked) return uni.$showMsg('请选择支付方式')
				let that = this
				let data = await ordercreate({
					orderType: 5,
					goodsId: this.list[this.select_index].id,
					payChannel: 1
				})
				if (data.code == 1) {
					let data_seed = await orderpay({
						orderNo: data.data.orderNo,
						openid: this.openid
					})
					let orderInfo = data_seed.data
					if (data_seed.code == 1) {
						let arr = []
						let configuration = uni.getStorageSync('configuration')
						configuration.message.forEach(item => {
							if (item.message_type == 1) {
								arr.push(item.masterplate)
							}
						})
						// #ifdef H5
						that.mpwxparApi(data_seed.data, '', 2)
						// #endif
						// #ifdef MP-WEIXIN 
						that.wxparApi(data_seed.data, '', arr, '', 2)
						// #endif
						setTimeout(() => {
							that.getUser()
						}, 500)
					} else {
						uni.showToast({
							title: data_seed.msg,
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: data.msg,
						icon: 'none'
					})
				}

			},
			select(e) {
				this.select_index = e
				this.price = this.list[e].amount
			},
			async recharge() {
				let res = await recharge()
				if (res.code == 1) {
					this.list = res.data.data
					this.price = this.list[0].amount
				}
				console.log('res==>', res);
			},

			gopage(url) {
				uni.navigateTo({
					url
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		min-height: 100vh;
		padding: 26rpx 0;
		box-sizing: border-box;
		background: #FAFAFA;
	}

	.wximg {
		width: 35rpx;
		height: 35rpx;
		margin-right: 10rpx;
	}

	.fixedBtn {
		position: fixed;
		background-color: #fff;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: 30rpx;

		.fixedBtn_price {
			font-size: 46rpx;
			color: #1C8FF5;
			line-height: 100rpx;
			margin: 0 0 0 50rpx;
		}
	}

	.btn {
		width: 240rpx;
		height: 100rpx;
		background-color: #1C8FF5;
		color: #fff;
		text-align: center;
		line-height: 100rpx;
		font-size: 28rpx;
	}

	.box {
		width: 94%;
		border-radius: 10rpx;
		background-color: #1C8FF5;
		margin: 20rpx auto;
		padding: 40rpx 40rpx 20rpx;
		box-sizing: border-box;
		color: #fff;
		text-align: center;

		.text_3 {
			text-align: right;
			display: flex;
			justify-content: flex-end;
		}

		.text_1 {
			font-size: 30rpx;
		}

		.text_2 {
			margin-top: 36rpx;
			font-size: 44rpx;
		}
	}

	.price {
		margin: 20rpx 0;
		background-color: #fff;
		padding: 30rpx;
		box-sizing: border-box;

		.price_title {
			font-size: 26rpx;
			color: #868B96;
			margin-bottom: 20rpx;

			.price_title_text1 {
				font-size: 36rpx;
				color: #000;
			}
		}

		.price_box {
			width: 212rpx;
			height: 267rpx;
			background: #FDF6EC;
			border-radius: 15rpx;
			text-align: center;
			margin-right: 25rpx;
			position: relative;
			display: inline-block;
			margin-top: 20rpx;

			.price_box_1 {
				height: 47rpx;
				background: #7F4700;
				border-radius: 16rpx 0rpx 14rpx 0rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #FFF9F6;
				line-height: 47rpx;
				text-align: center;
				position: absolute;
				top: -20rpx;
				left: -1rpx;
				display: flex;
				align-items: center;
				padding-right: 10rpx;

				image {
					width: 30rpx;
					height: 30rpx;
					margin: 0 10rpx;
				}
			}

			.price_box_2 {
				font-size: 30rpx;
				font-weight: 400;
				color: #868B96;
				margin-top: 40rpx;
			}

			.price_box_3 {
				font-size: 48rpx;
				font-weight: 600;
				color: #835814;
				margin-top: 20rpx;
			}

			.price_box_4 {
				font-size: 22rpx;
				font-weight: 400;
				color: #A16421;
				margin-top: 20rpx;
			}
		}
	}
</style>