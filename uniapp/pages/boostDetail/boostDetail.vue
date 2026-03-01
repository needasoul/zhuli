<template>
	<view class="boost-detail-container">
		<!-- 顶部导航栏 -->
		<view class="top-bar">
			<view class="back-btn" @click="goBack">
				<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
			</view>
			<view class="share-btn" @click="shareTask">
				<u-icon name="share" color="#fff" size="20"></u-icon>
			</view>
		</view>

		<!-- 基本信息区域 -->
		<view class="basic-info-section">
			<view class="platform-info">
				<image :src="boostDetail.platformIcon" mode="aspectFit"></image>
				<text class="platform-name">{{ boostDetail.platformName }}</text>
			</view>
			<view class="boost-title">{{ boostDetail.title }}</view>
			<view class="boost-description">{{ boostDetail.description }}</view>
		</view>

		<!-- 价格和进度区域 -->
		<view class="price-progress-section">
			<view class="price-info">
				<view class="price">
					<text class="unit">¥</text>
					<text class="amount">{{ boostDetail.price }}</text>
				</view>
				<view class="price-label">单价</view>
			</view>
			
			<view class="progress-info">
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: boostDetail.progress + '%' }"></view>
				</view>
				<view class="progress-text">{{ boostDetail.completed }}/{{ boostDetail.total }}人助力</view>
			</view>
		</view>

		<!-- 任务详情 -->
		<view class="task-details-section">
			<view class="section-title">任务详情</view>
			<view class="detail-item">
				<view class="detail-label">任务链接</view>
				<view class="detail-value link" @click="copyLink">{{ boostDetail.link }}</view>
			</view>
			<view class="detail-item">
				<view class="detail-label">状态</view>
				<view class="detail-value status" :class="statusClass">
					{{ statusText }}
				</view>
			</view>
			<view class="detail-item">
				<view class="detail-label">任务说明</view>
				<view class="detail-value notes">{{ boostDetail.notes }}</view>
			</view>
		</view>

		<!-- 发布者信息 -->
		<view class="publisher-info-section">
			<view class="section-title">发布者信息</view>
			<view class="publisher-card">
				<image class="publisher-avatar" :src="boostDetail.authorAvatar" mode="aspectFill"></image>
				<view class="publisher-details">
					<view class="publisher-name">{{ boostDetail.authorName }}</view>
					<view class="publisher-stats">
						<text>发布任务：{{ boostDetail.authorStats.tasks }}</text>
						<text>成功率：{{ boostDetail.authorStats.success }}%</text>
						<text>好评率：{{ boostDetail.authorStats.rating }}%</text>
					</view>
				</view>
				<view class="contact-btn" @click="contactPublisher">
					<u-icon name="chat" color="#49AFFF" size="24"></u-icon>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<view class="action-btn collect" @click="collectTask">
				<u-icon :name="isCollected ? 'star-fill' : 'star'" :color="isCollected ? '#FFD700' : '#666'" size="20"></u-icon>
				<text>{{ isCollected ? '已收藏' : '收藏' }}</text>
			</view>
			<view class="action-btn share" @click="shareTask">
				<u-icon name="share" color="#666" size="20"></u-icon>
				<text>分享</text>
			</view>
			<view class="action-btn assist primary" @click="assistTask">
				立即助力
			</view>
		</view>

		<!-- 分享弹窗 -->
		<u-popup :show="showShareSheet" @close="showShareSheet = false" mode="bottom">
			<view class="share-popup">
				<view class="popup-header">
					<text>分享任务</text>
					<u-icon name="close" @click="showShareSheet = false"></u-icon>
				</view>
				<view class="share-options">
					<view class="share-option" v-for="(option, index) in shareOptions" :key="index" @click="handleShareOption(index)">
						<view class="share-icon">
							<u-icon :name="option.icon" color="#49AFFF" size="24"></u-icon>
						</view>
						<text class="share-name">{{ option.name }}</text>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 助力确认弹窗 -->
		<u-popup :show="showAssistConfirm" @close="showAssistConfirm = false" mode="bottom">
			<view class="assist-popup">
				<view class="popup-header">
					<text>确认助力</text>
					<u-icon name="close" @click="showAssistConfirm = false"></u-icon>
				</view>
				<view class="assist-content">
					<view class="assist-info">
						<view class="task-title">{{ boostDetail.title }}</view>
						<view class="task-price">¥{{ boostDetail.price }}/次</view>
					</view>
					<view class="assist-count">
						<view class="count-label">助力次数</view>
						<view class="count-controls">
							<view class="count-btn" @click="decreaseCount">
								<u-icon name="minus" color="#666" size="16"></u-icon>
							</view>
							<text class="count-value">{{ assistCount }}</text>
							<view class="count-btn" @click="increaseCount">
								<u-icon name="plus" color="#666" size="16"></u-icon>
							</view>
						</view>
					</view>
					<view class="total-cost">
						<view class="cost-label">总计费用</view>
						<view class="cost-value">¥{{ totalAssistCost }}</view>
					</view>
				</view>
				<view class="popup-footer">
					<button class="cancel-btn" @click="showAssistConfirm = false">取消</button>
					<button class="confirm-btn" @click="confirmAssist">确认助力</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			boostDetail: {
				id: 1,
				title: '【京东】618 购物节助力',
				description: '助力解锁大额优惠券，享受购物折扣，任务简单易完成，助力后请截图发送给发布者确认。',
				price: '1.88',
				status: 'ongoing',
				platformName: '京东',
				platformIcon: '../../static/index/jd_icon.png',
				total: 100,
				completed: 65,
				progress: 65,
				link: 'https://item.jd.com/123456789.html',
				notes: '1. 请按照要求完成助力步骤\n2. 助力后请截图发送给发布者\n3. 如有问题请联系客服',
				authorAvatar: '../../static/images/avatar.png',
				authorName: '张三',
				authorStats: {
					tasks: 128,
					success: 125,
					rating: 98
				}
			},
			isCollected: false,
			showShareSheet: false,
			showAssistConfirm: false,
			assistCount: 1,
			shareOptions: [
				{name: '微信好友', icon: 'chat'},
				{name: '朋友圈', icon: 'friend-circle'},
				{name: 'QQ', icon: 'qq'},
				{name: '复制链接', icon: 'copy'}
			]
		};
	},
	computed: {
		statusClass() {
			return `status-${this.boostDetail.status}`;
		},
		statusText() {
			const statusMap = {
				'ongoing': '进行中',
				'popular': '热门',
				'new': '新发布',
				'completed': '已完成'
			};
			return statusMap[this.boostDetail.status] || '';
		},
		totalAssistCost() {
			return (parseFloat(this.boostDetail.price || 0) * this.assistCount).toFixed(2);
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 复制链接
		copyLink() {
			uni.setClipboardData({
				data: this.boostDetail.link,
				success: () => {
					uni.showToast({
						title: '链接已复制',
						icon: 'success'
					});
				}
			});
		},
		
		// 联系发布者
		contactPublisher() {
			uni.showActionSheet({
				itemList: ['发送消息', '拨打电话', '添加微信'],
				success: (res) => {
					switch(res.tapIndex) {
						case 0:
							uni.navigateTo({
								url: '/pages/chat/chat?userId=' + this.boostDetail.authorId
							});
							break;
						case 1:
							uni.makePhoneCall({
								phoneNumber: '13800138000' // 示例电话
							});
							break;
						case 2:
							uni.setClipboardData({
								data: '微信号：example_wx_id',
								success: () => {
									uni.showToast({
										title: '微信号已复制',
										icon: 'success'
									});
								}
							});
							break;
					}
				}
			});
		},
		
		// 收藏任务
		collectTask() {
			this.isCollected = !this.isCollected;
			uni.showToast({
				title: this.isCollected ? '已收藏' : '已取消收藏',
				icon: 'success'
			});
		},
		
		// 分享任务
		shareTask() {
			this.showShareSheet = true;
		},
		
		// 处理分享选项
		handleShareOption(index) {
			const option = this.shareOptions[index];
			uni.showToast({
				title: `分享到${option.name}`,
				icon: 'none'
			});
			this.showShareSheet = false;
		},
		
		// 立即助力
		assistTask() {
			this.showAssistConfirm = true;
		},
		
		// 减少助力次数
		decreaseCount() {
			if (this.assistCount > 1) {
				this.assistCount--;
			}
		},
		
		// 增加助力次数
		increaseCount() {
			this.assistCount++;
		},
		
		// 确认助力
		confirmAssist() {
			// 这里应该是提交助力请求的逻辑
			console.log(`助力任务，次数: ${this.assistCount}, 总价: ¥${this.totalAssistCost}`);
			
			// 模拟助力成功
			uni.showModal({
				title: '助力确认',
				content: `您将为该任务助力${this.assistCount}次，总计费用¥${this.totalAssistCost}，是否确认？`,
				success: (res) => {
					if (res.confirm) {
						// 模拟支付流程
						uni.showLoading({
							title: '处理中...'
						});
						
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								title: '助力成功！',
								icon: 'success'
							});
							
							this.showAssistConfirm = false;
							
							// 更新进度
							this.boostDetail.completed += this.assistCount;
							this.boostDetail.progress = Math.min(100, Math.round((this.boostDetail.completed / this.boostDetail.total) * 100));
						}, 1500);
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.boost-detail-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
	
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx 10rpx;
		position: sticky;
		top: 0;
		z-index: 100;
		
		.back-btn, .share-btn {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: rgba(0,0,0,0.3);
		}
	}
	
	.basic-info-section {
		background: linear-gradient(135deg, #49AFFF, #6a5af9);
		color: white;
		padding: 50rpx 30rpx 80rpx;
		margin: 0 20rpx 20rpx;
		border-radius: 20rpx;
		position: relative;
		overflow: hidden;
		
		.platform-info {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			image {
				width: 50rpx;
				height: 50rpx;
				margin-right: 15rpx;
			}
			
			.platform-name {
				font-size: 28rpx;
				font-weight: bold;
			}
		}
		
		.boost-title {
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 15rpx;
		}
		
		.boost-description {
			font-size: 26rpx;
			opacity: 0.9;
			line-height: 1.5;
		}
	}
	
	.price-progress-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: white;
		padding: 30rpx;
		margin: 0 20rpx 20rpx;
		border-radius: 15rpx;
		
		.price-info {
			text-align: center;
			
			.price {
				.unit {
					font-size: 24rpx;
					color: #FF5722;
				}
				
				.amount {
					font-size: 48rpx;
					font-weight: bold;
					color: #FF5722;
				}
			}
			
			.price-label {
				font-size: 24rpx;
				color: #999;
				margin-top: 5rpx;
			}
		}
		
		.progress-info {
			flex: 1;
			margin-left: 40rpx;
			
			.progress-bar {
				width: 100%;
				height: 8rpx;
				background: #f0f0f0;
				border-radius: 4rpx;
				margin-bottom: 10rpx;
				
				.progress-fill {
					height: 100%;
					background: linear-gradient(90deg, #49AFFF, #6a5af9);
					border-radius: 4rpx;
					transition: width 0.3s ease;
				}
			}
			
			.progress-text {
				font-size: 24rpx;
				color: #666;
				text-align: center;
			}
		}
	}
	
	.task-details-section {
		background: white;
		padding: 30rpx;
		margin: 0 20rpx 20rpx;
		border-radius: 15rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			color: #333;
		}
		
		.detail-item {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.detail-label {
				font-size: 28rpx;
				color: #666;
				width: 120rpx;
				flex-shrink: 0;
			}
			
			.detail-value {
				font-size: 28rpx;
				color: #333;
				flex: 1;
				margin-left: 20rpx;
				text-align: right;
				
				&.link {
					color: #49AFFF;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				&.status {
					padding: 4rpx 12rpx;
					border-radius: 12rpx;
					font-size: 24rpx;
					
					&.status-ongoing {
						background: #e3f2fd;
						color: #2196f3;
					}
					
					&.status-popular {
						background: #fff3e0;
						color: #ff9800;
					}
					
					&.status-new {
						background: #e8f5e8;
						color: #4caf50;
					}
					
					&.status-completed {
						background: #f5f5f5;
						color: #999;
					}
				}
				
				&.notes {
					text-align: left;
					white-space: pre-line;
					line-height: 1.6;
				}
			}
		}
	}
	
	.publisher-info-section {
		background: white;
		padding: 30rpx;
		margin: 0 20rpx 20rpx;
		border-radius: 15rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			color: #333;
		}
		
		.publisher-card {
			display: flex;
			align-items: center;
			padding: 20rpx;
			background: #f8f9fa;
			border-radius: 12rpx;
			
			.publisher-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			
			.publisher-details {
				flex: 1;
				
				.publisher-name {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 8rpx;
				}
				
				.publisher-stats {
					display: flex;
					font-size: 24rpx;
					color: #666;
					
					text {
						margin-right: 20rpx;
					}
				}
			}
			
			.contact-btn {
				padding: 10rpx;
				border-radius: 50%;
				background: white;
			}
		}
	}
	
	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		background: white;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f0f0f0;
		z-index: 100;
		
		.action-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 10rpx 20rpx;
			margin-right: 20rpx;
			
			text {
				font-size: 24rpx;
				color: #666;
				margin-top: 4rpx;
			}
			
			&.collect {
				margin-right: 30rpx;
			}
			
			&.assist {
				flex: 1;
				background: linear-gradient(135deg, #49AFFF, #6a5af9);
				color: white;
				border-radius: 50rpx;
				padding: 20rpx 40rpx;
				font-size: 28rpx;
				font-weight: bold;
				
				text {
					color: white;
					margin-top: 0;
				}
			}
		}
	}
	
	.share-popup {
		background: white;
		padding: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
		
		.popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			
			text {
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		
		.share-options {
			display: flex;
			justify-content: space-around;
			padding: 20rpx 0;
			
			.share-option {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 20rpx;
				
				.share-icon {
					width: 80rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #f5f5f5;
					border-radius: 50%;
					margin-bottom: 10rpx;
				}
				
				.share-name {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}
	
	.assist-popup {
		background: white;
		padding: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
		
		.popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			
			text {
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		
		.assist-content {
			padding: 20rpx 0;
			
			.assist-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30rpx;
				padding: 20rpx;
				background: #f8f9fa;
				border-radius: 12rpx;
				
				.task-title {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
				}
				
				.task-price {
					font-size: 32rpx;
					color: #FF5722;
					font-weight: bold;
				}
			}
			
			.assist-count {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30rpx;
				padding: 20rpx;
				background: #f8f9fa;
				border-radius: 12rpx;
				
				.count-label {
					font-size: 28rpx;
					color: #333;
				}
				
				.count-controls {
					display: flex;
					align-items: center;
					
					.count-btn {
						width: 48rpx;
						height: 48rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: white;
						border: 1rpx solid #ddd;
						border-radius: 50%;
					}
					
					.count-value {
						margin: 0 20rpx;
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
					}
				}
			}
			
			.total-cost {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx;
				background: #f8f9fa;
				border-radius: 12rpx;
				margin-bottom: 30rpx;
				
				.cost-label {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
				}
				
				.cost-value {
					font-size: 36rpx;
					color: #FF5722;
					font-weight: bold;
				}
			}
		}
		
		.popup-footer {
			display: flex;
			gap: 20rpx;
			
			.cancel-btn, .confirm-btn {
				flex: 1;
				padding: 20rpx;
				border-radius: 50rpx;
				font-size: 28rpx;
				font-weight: bold;
				border: none;
			}
			
			.cancel-btn {
				background: #f5f5f5;
				color: #666;
			}
			
			.confirm-btn {
				background: linear-gradient(135deg, #49AFFF, #6a5af9);
				color: white;
			}
		}
	}
}
</style>