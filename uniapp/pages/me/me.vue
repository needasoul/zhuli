<template>
	<view>
		<image class="bgImg" src="@/static/newsimg/icon4.png" mode=""></image>
		<view class="top-box zindex">
			<view class="user-box zindex" @click="routerGo('/pagesA/personage/personage')">
				<view class="text_center ">
					<view class="yes-box" v-if="token">
						<image :src="intall.avatar" mode=""></image>
						<view class="edit">
							<u-icon name="edit-pen-fill" color="#696969" size="14"></u-icon>
						</view>
					</view>
					<view class="yes-box" v-else>
						<image src="../../static/images/avatar.png" mode=""></image>
					</view>
					<view class="">
						<view class="user-name" v-if="token">
							{{intall.username || ''}}
						</view>
						<view class="user-name" v-else>
							请登录
						</view>
					</view>
					<view class="bell-box">
						<!-- <image src="@/static/images/bell.png" mode=""></image> -->
					</view>
				</view>
			</view>
		</view>

		<!-- 账户余额 / 金币 概览 -->
		<view class="account-card zindex">
			<view class="account-item" @click="routerGo('/pagesB/wallet/wallet')">
				<view class="account-label">账户余额(元)</view>
				<view class="account-value">{{ intall.balance || 0 }}</view>
				<view class="account-link">去充值 ></view>
			</view>
			<view class="account-item">
				<view class="account-label">我的金币</view>
				<view class="account-value">{{ intall.integral ? intall.integral : 0 }}</view>
				<view class="account-link">赚金币玩法</view>
			</view>
		</view>

		<view class="vip_box zindex flexc flexs" @click="routerGo('/pagesB/myMembers/myMembers')">
			<view class="vip_box_left">
				定馆会员
			</view>
			<view class="vip_box_right flexc">
				<image class="vip_box_right_img_1" src="@/static/newsimg/icon21.svg" mode=""></image>
				<span class="mr-26 ml-12">积分：{{intall.integral?intall.integral:0}}</span>
				<image class="vip_box_right_img_2 mt-4" src="@/static/newsimg/icon22.svg" mode=""></image>
			</view>
		</view>

		<view class="tab-box zindex a-center">
			<view @click="routerGo('/pagesA/myCard/myCard')">
				<view class="tab-img">
					<image src="@/static/newsimg/icon5.svg" mode=""></image>
				</view>
				<view class="tab-text">优惠券</view>
			</view>
			<view @tap="routerGo('/pagesA/orderActivity/orderActivity')">
				<view class="tab-img">
					<image src="@/static/newsimg/icon6.svg" mode=""></image>
				</view>
				<view class="tab-text">活动订单</view>
			</view>
			<view @click="routerGo('/pagesA/courseOrder/courseOrder')">
				<view class="tab-img">
					<image src="@/static/newsimg/icon7.svg" mode=""></image>
				</view>
				<view class="tab-text">课程订单</view>
			</view>
			<view @click="routerGo('/pages/allOrders/allOrders')">
				<view class="tab-img">
					<image src="@/static/newsimg/icon8.svg" mode=""></image>
				</view>
				<view class="tab-text">积分订单</view>
			</view>
		</view>
		<view class="me-tab zindex">
			<view class="me-tab-list  flexs flexc" @click="routerGo('/pages/merchant/merchant')" v-if="intall.store==1">
				<view class=" flexc">
					<image src="@/static/newsimg/icon10.svg" mode=""></image>
					<view class="">
						商家中心
					</view>
				</view>
				<view class="">
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
			</view>
			<view class="me-tab-list flexs flexc" @click="routerGo('/pagesB/wallet/wallet')">
				<view class=" flexc">
					<image src="@/static/newsimg/icon24.svg" mode=""></image>
					<view class="">
						钱包
					</view>
				</view>
				<view class="">
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>

			</view>
			<view class="me-tab-list flexs flexc" @click="routerGo('/pagesA/feedback/feedback')">
				<view class=" flexc">
					<image src="@/static/newsimg/icon9.svg" mode=""></image>
					<view class="">
						意见反馈
					</view>
				</view>
				<view class="">
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>

			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="me-tab-list flexc flexs" open-type="contact" @contact="handleContact">
				<view class=" flexc">
					<image src="@/static/newsimg/icon11.svg" mode=""></image>
					<view class="">
						客服中心
					</view>
				</view>
				<view class="">
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
			</button>
			<!-- #endif -->
			<view class="me-tab-list flexc flexs" @click="routerGo('/pagesA/agreement/agreement?name=' + '关于我们')">
				<view class="flexc">
					<image src="@/static/newsimg/icon12.svg" mode=""></image>
					<view class="">
						关于我们
					</view>
				</view>
				<view class="">
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
			</view>
			<view class="me-tab-list flexs flexc" @click="token?update():loginModel()">
				<view class="flexc">
					<image src="@/static/newsimg/icon13.svg" mode=""></image>
					<view class="">
						退出登录
					</view>
				</view>


				<view class="">
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userlogout,
		usergetUserInfo
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				imgall: '',
				user_name: '',
				mailbox: '',
				cell: '',
				intall: {},
				token: uni.getStorageSync('userinfo').token
			}
		},
		onLoad() {},
		onShow() {
			let token = uni.getStorageSync('userinfo').token
			if (token) {
				this.token = token
				this.int()
			} else {
				this.token = null
			}

		},
		methods: {
			sweep() {
				return new Promise((reslove, reject) => {
					uni.scanCode({
						success: (data) => {
							console.log(err, '扫码成功');
							reslove(data)
							// this.rou
						},
						fail(err) {
							console.log(err, '扫码失败');
							reject(err)
						}
					})
				})
			},
			handleContact(e) {
				console.log(e.detail.path)
				console.log(e.detail.query)
			},
			int() {
				usergetUserInfo().then(res => {
					if (res.data.openid) {
						uni.setStorageSync('openid', res.data.openid)
					}
					this.intall = res.data
					// 用户上传的头像
					this.imgall = res.data.avatar
					// 名字
					this.user_name = res.data.username
					// 邮箱
					this.mailbox = res.data.email
					this.cell = res.data.mobile
				})
			},

			update() {
				let token = uni.getStorageSync('userinfo').token
				if (token) {
					uni.showModal({
						title: '提示',
						content: '确定退出登录吗？',
						success: (res) => {
							if (res.confirm) {
								userlogout({}).then(res => {
									if (res.code == 1) {
										uni.removeStorageSync('userinfo')
										uni.removeStorageSync('user')
										uni.showToast({
											title: '退出成功',
											icon: "success",
											duration: 2000,
											success() {
												setTimeout(function() {
													uni.switchTab({
														url: '/pages/index/index'
													})
												}, 2000)
											}
										})
									} else {
										uni.showToast({
											title: res.msg,
											icon: "error"
										})
									}
								})
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			},


			alloder() {
				uni.navigateTo({
					url: '/pages/allOrders/allOrders'
				})
			},
			gowe() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '关于我们'
				})
			}

		}
	}
</script>
<style>
	page {
		padding-bottom: 100rpx;
		background: #f2f2f2;
	}
</style>
<style lang="scss" scoped>
	.color-OA {
		color: #0A0A0A;
	}

	.bgImg {
		width: 750rpx;
		height: 922rpx;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		// #ifdef MP-WEIXIN
		z-index: -1;
		// #endif
	}

	.account-card {
		width: 690rpx;
		margin: 0 auto 24rpx;
		display: flex;
		justify-content: space-between;
		background: #ffffff;
		border-radius: 24rpx;
		padding: 24rpx 32rpx;
		box-sizing: border-box;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
	}

	.account-item {
		width: 48%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.account-label {
		font-size: 24rpx;
		color: #888888;
		margin-bottom: 8rpx;
	}

	.account-value {
		font-size: 40rpx;
		font-weight: 700;
		color: #ff7a00;
		margin-bottom: 8rpx;
	}

	.account-link {
		font-size: 22rpx;
		color: #ff7a00;
	}

	.top-box {
		width: 750rpx;

		// image {
		// 	width: 750rpx;
		// 	height: 418rpx;
		// }

		position: relative;
	}

	.user-box {
		position: relative;
		z-index: 100;
		// #ifdef MP-WEIXIN
		margin: 160rpx auto 20rpx;

		// #endif
		// #ifdef H5
		top: 20rpx;

		// #endif
		.yes-box {
			width: 139rpx;
			height: 139rpx;
			margin: 0 auto 26rpx;
			position: relative;

			image {
				width: 139rpx;
				height: 139rpx;
				border-radius: 50%;
			}

			.edit {
				position: absolute;
				bottom: 0;
				right: 10rpx;
				width: 30rpx;
				height: 30rpx;
				background: #FFFFFF;
				border-radius: 50%;
			}

		}

		.user-name {
			text-align: center;
			font-weight: 600;
			font-size: 36rpx;
			color: #282828;
		}

		.user-edit {
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
			z-index: 100;
		}

		.bell-box {
			width: 39rpx;
			height: 48rpx;
			margin-left: 43rpx;

			image {
				width: 39rpx;
				height: 48rpx;
			}
		}
	}

	.tab-box {
		display: flex;
		justify-content: space-between;
		// position: absolute;
		// top: 374rpx;
		// left: 30rpx;
		margin-left: 30rpx;
		margin-top: 27rpx;
		margin-bottom: 36rpx;

		width: 690rpx;
		height: 179rpx;
		background: #FFFFFF;
		border-radius: 12rpx;

		padding: 0 31rpx;

		.tab-img {
			width: 71rpx;
			height: 67rpx;
			margin: 0 auto;
			border-radius: 16rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}

		.tab-text {
			font-size: 24rpx;
			font-weight: 600;
			color: #050505;
			margin-top: 17rpx;
		}
	}

	.vip-top {
		width: 690rpx;
		height: 79rpx;
		background: linear-gradient(90deg, #EEDFC0 0%, #EEDFC0 100%);
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.vip-bottom {
		width: 690rpx;
		height: 65rpx;
		background: #442C18;
		border-radius: 0rpx 0rpx 24rpx 24rpx;
		font-size: 22rpx;
		font-weight: 400;
		color: #C3C0BD;
		line-height: 65rpx;
		padding-left: 32rpx;
		display: flex;
		align-items: center;
	}

	.hg-box {
		width: 26rpx;
		height: 23rpx;
		margin-right: 8rpx;

		image {
			width: 26rpx;
			height: 23rpx;
		}
	}

	.vip-text {

		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #442E17;

		letter-spacing: 2px;
	}

	.vip-text-jf {

		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #482D12;

		letter-spacing: 1px;
	}

	.icon-box {
		width: 27rpx;
		height: 30rpx;

		image {
			width: 27rpx;
			height: 30rpx;
		}
	}

	.icon-box-my {
		width: 32rpx;
		height: 31rpx;

		image {
			width: 32rpx;
			height: 31rpx;
		}
	}

	.icon-box-bb {
		width: 33rpx;
		height: 32rpx;

		image {
			width: 33rpx;
			height: 32rpx;
		}
	}

	.icon-box-fk {
		width: 34rpx;
		height: 26rpx;

		image {
			width: 34rpx;
			height: 26rpx;
		}
	}

	.left-box {
		width: 50rpx;
		height: 50rpx;

		image {
			width: 50rpx;
			height: 50rpx;
		}
	}


	.me-tab {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 28rpx;
		margin-left: 30rpx;
		padding: 0 44rpx;
		box-sizing: border-box;

		.me-tab-list {
			display: flex;
			align-items: center;
			padding: 22rpx 0;
			box-sizing: border-box;
			font-size: 30rpx;
			color: #3D3D3D;
			font-weight: 600;
			line-height: 60rpx;

			image {
				width: 60rpx;
				height: 60rpx;
				margin-right: 22rpx;
			}
		}
	}

	button::after {

		border: none;

	}

	button {

		background-color: transparent;

		padding-left: 0;

		padding-right: 0;

		line-height: inherit;

	}

	button {
		border-radius: 0;
	}

	.vip_box {
		width: 690rpx;
		height: 70rpx;
		background: url("@/static/newsimg/icon18.png") no-repeat;
		background-size: 100% 100%;
		margin: 0 auto;

		.vip_box_left {
			width: 236rpx;
			height: 84rpx;
			background: url("@/static/newsimg/icon19.png") no-repeat;
			background-size: 100% 100%;
			margin-top: -18rpx;

			font-size: 28rpx;
			color: #FFBA72;
			padding: 20rpx 0 0 94rpx;
		}

		.vip_box_right {
			font-size: 24rpx;
			color: #E8C9A6;
			margin: 24rpx 20rpx 10rpx 0;
			line-height: 24rpx;

			.vip_box_right_img_1 {
				width: 28rpx;
				height: 24rpx;
				margin-top: -4rpx;
			}

			.vip_box_right_img_2 {
				width: 8rpx;
				height: 16rpx;
			}
		}
	}
</style>