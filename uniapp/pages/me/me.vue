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
							{{intall.username || '用户'}}
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

		<!-- 账户余额 / 收益概览 -->
		<view class="account-card zindex">
			<view class="account-item" @click="routerGo('/pagesB/wallet/wallet')">
				<view class="account-label">账户余额(元)</view>
				<view class="account-value">{{ intall.balance || 0 }}</view>
				<view class="account-link">去充值 ></view>
			</view>
			<view class="account-item" @click="goToEarnings">
				<view class="account-label">累计收益(元)</view>
				<view class="account-value">{{ earnings || 0 }}</view>
				<view class="account-link">去提现 ></view>
			</view>
			<view class="account-item" @click="goToCommission">
				<view class="account-label">佣金收入(元)</view>
				<view class="account-value">{{ commission || 0 }}</view>
				<view class="account-link">明细 ></view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-grid">
				<view class="menu-item" @click="goToMyTasks">
					<view class="menu-icon">
						<u-icon name="list" color="#49AFFF" size="28"></u-icon>
					</view>
					<view class="menu-text">我的任务</view>
				</view>
				<view class="menu-item" @click="goToMyOrders">
					<view class="menu-icon">
						<u-icon name="order" color="#FF9800" size="28"></u-icon>
					</view>
					<view class="menu-text">我的订单</view>
				</view>
				<view class="menu-item" @click="goToMyEarnings">
					<view class="menu-icon">
						<u-icon name="rmb-circle" color="#4CAF50" size="28"></u-icon>
					</view>
					<view class="menu-text">我的收益</view>
				</view>
				<view class="menu-item" @click="goToMyCollect">
					<view class="menu-icon">
						<u-icon name="star" color="#FFC107" size="28"></u-icon>
					</view>
					<view class="menu-text">我的收藏</view>
				</view>
				<view class="menu-item" @click="goToHelpCenter">
					<view class="menu-icon">
						<u-icon name="question-circle" color="#9C27B0" size="28"></u-icon>
					</view>
					<view class="menu-text">帮助中心</view>
				</view>
				<view class="menu-item" @click="goToSettings">
					<view class="menu-icon">
						<u-icon name="setting" color="#607D8B" size="28"></u-icon>
					</view>
					<view class="menu-text">设置</view>
				</view>
			</view>
		</view>

		<!-- 推广区域 -->
		<view class="promotion-section">
			<view class="promotion-header">
				<view class="header-title">推广赚钱</view>
				<view class="header-desc">邀请好友使用，获得额外收益</view>
			</view>
			<view class="promotion-content">
				<view class="invite-card">
					<view class="invite-info">
						<view class="invite-count">{{ inviteCount || 0 }}</view>
						<view class="invite-label">已邀请好友</view>
					</view>
					<button class="invite-btn" @click="shareApp">立即邀请</button>
				</view>
			</view>
		</view>

		<!-- 快速入口 -->
		<view class="quick-access">
			<view class="access-title">快捷入口</view>
			<view class="access-grid">
				<view class="access-item" @click="goToBoostSquare">
					<view class="access-icon">
						<u-icon name="grid" color="#49AFFF" size="24"></u-icon>
					</view>
					<view class="access-text">助力广场</view>
				</view>
				<view class="access-item" @click="goToPublishBoost">
					<view class="access-icon">
						<u-icon name="plus-circle" color="#FF5722" size="24"></u-icon>
					</view>
					<view class="access-text">发布助力</view>
				</view>
				<view class="access-item" @click="goToHistory">
					<view class="access-icon">
						<u-icon name="clock" color="#9C27B0" size="24"></u-icon>
					</view>
					<view class="access-text">历史记录</view>
				</view>
				<view class="access-item" @click="goToCustomerService">
					<view class="access-icon">
						<u-icon name="chat" color="#4CAF50" size="24"></u-icon>
					</view>
					<view class="access-text">客服</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { usergetUserInfo } from "../../api/user.js"
export default {
	data() {
		return {
			intall: {},
			token: null,
			earnings: 128.50,
			commission: 45.20,
			inviteCount: 12
		}
	},
	onLoad() {
		this.initData();
	},
	onShow() {
		this.getUserInfo();
	},
	methods: {
		// 初始化数据
		initData() {
			// 初始化示例数据
		},
		
		// 获取用户信息
		async getUserInfo() {
			try {
				let userinfo = uni.getStorageSync('userinfo');
				if (userinfo && userinfo.token) {
					this.token = userinfo.token;
					let res = await usergetUserInfo();
					if (res.code == 1) {
						this.intall = res.data;
					}
				}
			} catch (error) {
				console.error('获取用户信息失败:', error);
			}
		},
		
		// 前往收益页面
		goToEarnings() {
			uni.navigateTo({
				url: '/pages/me/earnings'
			});
		},
		
		// 前往佣金页面
		goToCommission() {
			uni.navigateTo({
				url: '/pages/me/commission'
			});
		},
		
		// 前往我的任务
		goToMyTasks() {
			uni.navigateTo({
				url: '/pages/me/myTasks'
			});
		},
		
		// 前往我的订单
		goToMyOrders() {
			uni.navigateTo({
				url: '/pages/order/order'
			});
		},
		
		// 前往我的收益
		goToMyEarnings() {
			uni.navigateTo({
				url: '/pages/me/myEarnings'
			});
		},
		
		// 前往我的收藏
		goToMyCollect() {
			uni.navigateTo({
				url: '/pages/me/myCollect'
			});
		},
		
		// 前往帮助中心
		goToHelpCenter() {
			uni.navigateTo({
				url: '/pages/me/helpCenter'
			});
		},
		
		// 前往设置
		goToSettings() {
			uni.navigateTo({
				url: '/pages/me/settings'
			});
		},
		
		// 分享应用
		shareApp() {
			uni.showActionSheet({
				itemList: ['分享给微信好友', '分享到朋友圈', '复制链接'],
				success: (res) => {
					uni.showToast({
						title: '功能开发中...',
						icon: 'none'
					});
				}
			});
		},
		
		// 前往助力广场
		goToBoostSquare() {
			uni.switchTab({
				url: '/pages/boostSquare/boostSquare'
			});
		},
		
		// 前往发布助力
		goToPublishBoost() {
			uni.navigateTo({
				url: '/pages/publishBoost/publishBoost'
			});
		},
		
		// 前往历史记录
		goToHistory() {
			uni.navigateTo({
				url: '/pages/me/history'
			});
		},
		
		// 前往客服
		goToCustomerService() {
			uni.navigateTo({
				url: '/pages/me/customerService'
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.bgImg {
	width: 100%;
	height: 400rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}

.top-box {
	width: 100%;
	height: 400rpx;
	position: relative;
	z-index: 2;
	
	.user-box {
		width: 100%;
		height: 400rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		
		.text_center {
			text-align: center;
			
			.yes-box {
				position: relative;
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;
				margin: 0 auto 20rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
				
				.edit {
					position: absolute;
					bottom: 0;
					right: 0;
					width: 30rpx;
					height: 30rpx;
					background: white;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			
			.user-name {
				font-size: 32rpx;
				font-weight: bold;
				color: white;
				margin-bottom: 10rpx;
			}
		}
	}
}

.account-card {
	position: relative;
	z-index: 3;
	background: white;
	margin: -60rpx 30rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
	
	.account-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
		
		&:last-child {
			border-bottom: none;
		}
		
		.account-label {
			font-size: 26rpx;
			color: #666;
		}
		
		.account-value {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
		
		.account-link {
			font-size: 24rpx;
			color: #49AFFF;
		}
	}
}

.menu-section {
	background: white;
	margin: 0 30rpx;
	border-radius: 20rpx;
	padding: 30rpx 0;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
	
	.menu-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30rpx;
		
		.menu-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx 10rpx;
			
			.menu-icon {
				width: 80rpx;
				height: 80rpx;
				background: #f5f5f5;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 15rpx;
			}
			
			.menu-text {
				font-size: 26rpx;
				color: #333;
			}
		}
	}
}

.promotion-section {
	background: white;
	margin: 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
	
	.promotion-header {
		text-align: center;
		margin-bottom: 30rpx;
		
		.header-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 10rpx;
		}
		
		.header-desc {
			font-size: 24rpx;
			color: #666;
		}
	}
	
	.invite-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, #49AFFF, #6a5af9);
		color: white;
		border-radius: 15rpx;
		padding: 30rpx;
		
		.invite-info {
			flex: 1;
			
			.invite-count {
				font-size: 48rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			
			.invite-label {
				font-size: 24rpx;
			}
		}
		
		.invite-btn {
			background: white;
			color: #49AFFF;
			border-radius: 50rpx;
			padding: 15rpx 30rpx;
			font-size: 26rpx;
			font-weight: bold;
		}
	}
}

.quick-access {
	background: white;
	margin: 0 30rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
	
	.access-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.access-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20rpx;
		
		.access-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.access-icon {
				width: 70rpx;
				height: 70rpx;
				background: #f5f5f5;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 10rpx;
			}
			
			.access-text {
				font-size: 22rpx;
				color: #666;
			}
		}
	}
}
</style>