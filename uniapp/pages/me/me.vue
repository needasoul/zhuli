<template>
	<view class="me-container">
		<!-- 顶部用户信息 -->
		<view class="user-section">
			<view class="user-info">
				<image class="avatar" :src="intall.avatar || '../../static/images/avatar.png'" mode="aspectFill"></image>
				<view class="user-details">
					<view class="user-name">{{ intall.username || '用户' }}</view>
					<view class="user-phone">{{ userPhone || '15068916196' }}</view>
				</view>
			</view>
		</view>

		<!-- 账户余额和金币 -->
		<view class="balance-card">
			<view class="balance-item">
				<view class="balance-label">账户余额</view>
				<view class="balance-value">{{ intall.balance || 0 }}</view>
				<view class="balance-link" @click="goToRecharge">去充值 ></view>
			</view>
			<view class="balance-divider"></view>
			<view class="balance-item">
				<view class="balance-label">我的金币</view>
				<view class="balance-value">{{ goldCoins || 0 }}</view>
			</view>
		</view>

		<!-- 我的订单 -->
		<view class="order-section">
			<view class="section-header">
				<view class="header-title">我的订单</view>
				<view class="header-more" @click="goToAllOrders">全部 ></view>
			</view>
			<view class="order-tabs">
				<view class="order-tab" @click="goToOrderByStatus('pending')">
					<view class="tab-icon">
						<text class="icon-text">⏱️</text>
					</view>
					<view class="tab-text">审核中</view>
				</view>
				<view class="order-tab" @click="goToOrderByStatus('rejected')">
					<view class="tab-icon">
						<text class="icon-text">❌</text>
					</view>
					<view class="tab-text">未通过</view>
				</view>
				<view class="order-tab" @click="goToOrderByStatus('waiting')">
					<view class="tab-icon">
						<text class="icon-text">⏰</text>
					</view>
					<view class="tab-text">待开始</view>
				</view>
				<view class="order-tab" @click="goToOrderByStatus('ongoing')">
					<view class="tab-icon">
						<text class="icon-text">🔄</text>
					</view>
					<view class="tab-text">进行中</view>
				</view>
				<view class="order-tab" @click="goToOrderByStatus('confirming')">
					<view class="tab-icon">
						<text class="icon-text">✅</text>
					</view>
					<view class="tab-text">待确认</view>
				</view>
			</view>
		</view>

		<!-- 我的任务 -->
		<view class="task-section">
			<view class="section-header">
				<view class="header-title">我的任务</view>
			</view>
			<view class="task-grid">
				<view class="task-item" @click="goToTaskCenter">
					<view class="task-icon">
						<text class="icon-text">📋</text>
					</view>
					<view class="task-text">任务中心</view>
				</view>
				<view class="task-item" @click="goToAcceptedTasks">
					<view class="task-icon">
						<text class="icon-text">✔️</text>
					</view>
					<view class="task-text">已接任务</view>
				</view>
				<view class="task-item" @click="goToPublishedTasks">
					<view class="task-icon">
						<text class="icon-text">📤</text>
					</view>
					<view class="task-text">已发布任务</view>
				</view>
				<view class="task-item" @click="goToTaskAudit">
					<view class="task-icon">
						<text class="icon-text">🔍</text>
					</view>
					<view class="task-text">任务审核</view>
				</view>
			</view>
		</view>

		<!-- 更多服务 -->
		<view class="service-section">
			<view class="section-header">
				<view class="header-title">更多服务</view>
			</view>
			<view class="service-grid">
				<view class="service-item" @click="goToPersonalInfo">
					<view class="service-icon">
						<text class="icon-text">👤</text>
					</view>
					<view class="service-text">个人资料</view>
				</view>
				<view class="service-item" @click="toggleWechatNotice">
					<view class="service-icon">
						<text class="icon-text">💬</text>
					</view>
					<view class="service-text">开启微信通知</view>
				</view>
				<view class="service-item" @click="goToOnlineService">
					<view class="service-icon">
						<text class="icon-text">🛎️</text>
					</view>
					<view class="service-text">在线客服</view>
				</view>
				<view class="service-item" @click="join交流群">
					<view class="service-icon">
						<text class="icon-text">👥</text>
					</view>
					<view class="service-text">加入交流群</view>
				</view>
				<view class="service-item" @click="goToUserAgreement">
					<view class="service-icon">
						<text class="icon-text">📄</text>
					</view>
					<view class="service-text">用户协议</view>
				</view>
				<view class="service-item" @click="goToPrivacyAgreement">
					<view class="service-icon">
						<text class="icon-text">🔒</text>
					</view>
					<view class="service-text">隐私协议</view>
				</view>
				<view class="service-item" @click="goToRechargeAgreement">
					<view class="service-icon">
						<text class="icon-text">💰</text>
					</view>
					<view class="service-text">充值协议</view>
				</view>
				<view class="service-item" @click="goToSelfDelivery">
					<view class="service-icon">
						<text class="icon-text">📤</text>
					</view>
					<view class="service-text">自助投放</view>
				</view>
				<view class="service-item" @click="goToPromote">
					<view class="service-icon">
						<text class="icon-text">📣</text>
					</view>
					<view class="service-text">我要推广</view>
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
			goldCoins: 0,
			userPhone: '15068916196'
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
		
		// 去充值
		goToRecharge() {
			uni.navigateTo({
				url: '/pagesB/recharge/recharge'
			});
		},
		
		// 去全部订单
		goToAllOrders() {
			uni.navigateTo({
				url: '/pages/order/order'
			});
		},
		
		// 根据状态去订单
		goToOrderByStatus(status) {
			uni.navigateTo({
				url: `/pages/order/order?status=${status}`
			});
		},
		
		// 去任务中心
		goToTaskCenter() {
			uni.navigateTo({
				url: '/pagesA/taskCenter/taskCenter'
			});
		},
		
		// 去已接任务
		goToAcceptedTasks() {
			uni.navigateTo({
				url: '/pagesA/taskAccepted/taskAccepted'
			});
		},
		
		// 去已发布任务
		goToPublishedTasks() {
			uni.navigateTo({
				url: '/pagesA/taskPublished/taskPublished'
			});
		},
		
		// 去任务审核
		goToTaskAudit() {
			uni.navigateTo({
				url: '/pagesA/taskAudit/taskAudit'
			});
		},
		
		// 去个人资料
		goToPersonalInfo() {
			uni.navigateTo({
				url: '/pagesA/personage/personage'
			});
		},
		
		// 开启微信通知
		toggleWechatNotice() {
			uni.showToast({
				title: '功能开发中...',
				icon: 'none'
			});
		},
		
		// 在线客服
		goToOnlineService() {
			uni.showToast({
				title: '功能开发中...',
				icon: 'none'
			});
		},
		
		// 加入交流群
		join交流群() {
			uni.showToast({
				title: '功能开发中...',
				icon: 'none'
			});
		},
		
		// 去用户协议
		goToUserAgreement() {
			uni.navigateTo({
				url: '/pagesA/agreement/agreement?type=user'
			});
		},
		
		// 去隐私协议
		goToPrivacyAgreement() {
			uni.navigateTo({
				url: '/pagesA/agreement/agreement?type=privacy'
			});
		},
		
		// 去充值协议
		goToRechargeAgreement() {
			uni.navigateTo({
				url: '/pagesA/agreement/agreement?type=recharge'
			});
		},
		
		// 去自助投放
		goToSelfDelivery() {
			uni.showToast({
				title: '功能开发中...',
				icon: 'none'
			});
		},
		
		// 去我要推广
		goToPromote() {
			uni.showToast({
				title: '功能开发中...',
				icon: 'none'
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.me-container {
	min-height: 100vh;
	background: #f5f5f5;
	
	.user-section {
		background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
		padding: 40rpx 30rpx;
		color: white;
		
		.user-info {
			display: flex;
			align-items: center;
			
			.avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				border: 3rpx solid rgba(255,255,255,0.5);
				margin-right: 20rpx;
			}
			
			.user-details {
				flex: 1;
				
				.user-name {
					font-size: 36rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
				}
				
				.user-phone {
					font-size: 28rpx;
					opacity: 0.9;
				}
			}
		}
	}
	
	.balance-card {
		background: white;
		margin: -30rpx 30rpx 30rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
		display: flex;
		justify-content: space-around;
		
		.balance-item {
			flex: 1;
			text-align: center;
			
			.balance-label {
				font-size: 26rpx;
				color: #666;
				margin-bottom: 10rpx;
			}
			
			.balance-value {
				font-size: 48rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
			}
			
			.balance-link {
				font-size: 24rpx;
				color: #ff6b6b;
			}
		}
		
		.balance-divider {
			width: 1rpx;
			background: #eee;
			margin: 0 30rpx;
		}
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background: white;
		
		.header-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.header-more {
			font-size: 24rpx;
			color: #999;
		}
	}
	
	.order-section {
		background: white;
		margin-bottom: 20rpx;
		
		.order-tabs {
			display: flex;
			padding: 30rpx 0;
			border-top: 1rpx solid #eee;
			
			.order-tab {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					
					.tab-icon {
					width: 60rpx;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 10rpx;
				}
				
				.icon-text {
					font-size: 40rpx;
				}
					
					.tab-text {
						font-size: 24rpx;
						color: #666;
					}
				}
		}
	}
	
	.task-section {
		background: white;
		margin-bottom: 20rpx;
		
		.task-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			padding: 30rpx 0;
			border-top: 1rpx solid #eee;
			
			.task-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					
					.task-icon {
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 10rpx;
					}
					
					.task-text {
						font-size: 24rpx;
						color: #666;
					}
				}
		}
	}
	
	.service-section {
		background: white;
		
		.service-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			padding: 30rpx 0;
			border-top: 1rpx solid #eee;
			
			.service-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 20rpx 0;
					
					.service-icon {
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 10rpx;
					}
					
					.service-text {
						font-size: 24rpx;
						color: #666;
					}
				}
		}
	}
}
</style>