<template>
	<view class="boost-detail-container">
		<!-- 顶部返回按钮 -->
		<view class="top-bar">
			<view class="back-btn" @click="goBack">
				<u-icon name="arrow-left" size="20" color="#fff"></u-icon>
			</view>
			<view class="share-btn" @click="showShareSheet = true">
				<u-icon name="share" size="20" color="#fff"></u-icon>
			</view>
		</view>

		<!-- 任务基础信息 -->
		<view class="basic-info-section">
			<view class="platform-info">
				<image :src="boostDetail.platformIcon" mode="aspectFit"></image>
				<text class="platform-name">{{ boostDetail.platformName }}</text>
			</view>
			<view class="boost-title">{{ boostDetail.title }}</view>
			<view class="boost-description">{{ boostDetail.description }}</view>
		</view>

		<!-- 价格和进度 -->
		<view class="price-progress-section">
			<view class="price-info">
				<view class="price">
					<text class="unit">¥</text>
					<text class="amount">{{ boostDetail.price }}</text>
				</view>
				<view class="price-label">单次助力</view>
			</view>
			<view class="progress-info">
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: boostDetail.progress + '%' }"></view>
				</view>
				<view class="progress-text">{{ boostDetail.completed }}/{{ boostDetail.total }}人助力</view>
			</view>
		</view>

		<!-- 任务详情卡片 -->
		<view class="detail-card">
			<view class="card-header">
				<view class="card-title">任务详情</view>
			</view>
			<view class="card-content">
				<view class="detail-item">
					<view class="detail-label">任务类型</view>
					<view class="detail-value">{{ boostDetail.platformName }}助力</view>
				</view>
				<view class="detail-item">
					<view class="detail-label">助力单价</view>
					<view class="detail-value">¥{{ boostDetail.price }}</view>
				</view>
				<view class="detail-item">
					<view class="detail-label">总需助力</view>
					<view class="detail-value">{{ boostDetail.total }}次</view>
				</view>
				<view class="detail-item">
					<view class="detail-label">已获助力</view>
					<view class="detail-value">{{ boostDetail.completed }}次</view>
				</view>
				<view class="detail-item">
					<view class="detail-label">剩余助力</view>
					<view class="detail-value">{{ boostDetail.total - boostDetail.completed }}次</view>
				</view>
				<view class="detail-item">
					<view class="detail-label">任务状态</view>
					<view class="detail-value status" :class="getStatusClass(boostDetail.status)">
						{{ getStatusText(boostDetail.status) }}
					</view>
				</view>
			</view>
		</view>

		<!-- 助力链接 -->
		<view class="link-card" v-if="boostDetail.link">
			<view class="card-header">
				<view class="card-title">助力链接</view>
			</view>
			<view class="link-content">
				<view class="link-url">{{ boostDetail.link }}</view>
				<button class="copy-btn" @click="copyLink">复制链接</button>
			</view>
		</view>

		<!-- 注意事项 -->
		<view class="notes-card" v-if="boostDetail.notes">
			<view class="card-header">
				<view class="card-title">注意事项</view>
			</view>
			 <view class="notes-content">
				<view class="note-item" v-for="(note, index) in boostDetail.notes.split('\n')" :key="index" v-if="note.trim()">
					<u-icon name="checkmark" size="14" color="#4CAF50"></u-icon>
					<text class="note-text">{{ note }}</text>
				</view>
			</view>
		</view>

		<!-- 发布者信息 -->
		<view class="publisher-card">
			<view class="card-header">
				<view class="card-title">发布者信息</view>
			</view>
			<view class="publisher-content">
				<view class="publisher-info">
					<image :src="boostDetail.authorAvatar" mode="aspectFill"></image>
					<view class="publisher-details">
						<view class="publisher-name">{{ boostDetail.authorName }}</view>
						<view class="publisher-stats">
							<view class="stat-item">
								<text class="stat-value">{{ boostDetail.authorStats.tasks }}</text>
								<text class="stat-label">发布任务</text>
							</view>
							<view class="stat-item">
								<text class="stat-value">{{ boostDetail.authorStats.success }}</text>
								<text class="stat-label">成功完成</text>
							</view>
							<view class="stat-item">
								<text class="stat-value">{{ boostDetail.authorStats.rating }}%</text>
								<text class="stat-label">好评率</text>
							</view>
						</view>
					</view>
				</view>
				<button class="contact-btn" @click="contactPublisher">联系发布者</button>
			</view>
		</view>

		<!-- 保障服务 -->
		<view class="guarantee-card">
			<view class="card-header">
				<view class="card-title">服务保障</view>
			</view>
			<view class="guarantee-content">
				<view class="guarantee-item">
					<u-icon name="shield-checkmark" size="20" color="#4CAF50"></u-icon>
					<view class="guarantee-text">平台担保交易，安全可靠</view>
				</view>
				<view class="guarantee-item">
					<u-icon name="time" size="20" color="#2196F3"></u-icon>
					<view class="guarantee-text">按时完成，超时自动退款</view>
				</view>
				<view class="guarantee-item">
					<u-icon name="person" size="20" color="#FF9800"></u-icon>
					<view class="guarantee-text">专业客服，全程跟进服务</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-action-bar">
			<view class="action-item" @click="collectTask">
				<u-icon :name="isCollected ? 'star-fill' : 'star'" :color="isCollected ? '#FFC107' : '#999'" size="20"></u-icon>
				<text :style="{ color: isCollected ? '#FFC107' : '#999' }">收藏</text>
			</view>
			<view class="action-item" @click="shareTask">
				<u-icon name="share" color="#999" size="20"></u-icon>
				<text>分享</text>
			</view>
			<button class="assist-btn" @click="assistTask">立即助力</button>
		</view>

		<!-- 分享面板 -->
		<u-action-sheet :list="shareOptions" :show="showShareSheet" @close="showShareSheet = false" @click="handleShareOption"></u-action-sheet>

		<!-- 助力确认弹窗 -->
		<u-popup :show="showAssistConfirm" mode="center" :round="10" :closeable="true" @close="showAssistConfirm = false">
			<view class="confirm-popup">
				<view class="popup-title">确认助力</view>
				<view class="popup-content">
					<view class="confirm-info">
						<view class="info-row">
							<text class="label">任务名称：</text>
							<text class="value">{{ boostDetail.title }}</text>
						</view>
						<view class="info-row">
							<text class="label">助力价格：</text>
							<text class="value price">¥{{ boostDetail.price }}</text>
						</view>
						<view class="info-row">
							<text class="label">助力次数：</text>
							<text class="value">{{ assistCount }}次</text>
						</view>
						<view class="info-row">
							<text class="label">总计费用：</text>
							<text class="value price">¥{{ totalAssistCost }}</text>
						</view>
					</view>
					<view class="count-selector">
						<view class="selector-label">助力次数</view>
						<view class="counter">
							<button class="counter-btn" :disabled="assistCount <= 1" @click="decreaseCount">-</button>
							<input class="counter-input" type="number" v-model="assistCount" />
							<button class="counter-btn" @click="increaseCount">+</button>
						</view>
					</view>
				</view>
				<view class="popup-actions">
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
				title: '【京东】618购物节助力',
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
		}
	},
	computed: {
		totalAssistCost() {
			return (parseFloat(this.boostDetail.price || 0) * this.assistCount).toFixed(2);
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				'ongoing': '进行中',
				'popular': '热门',
				'new': '新发布',
				'completed': '已完成'
			};
			return statusMap[status] || '';
		},
		
		// 获取状态样式类
		getStatusClass(status) {
			return `status-${status}`;
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
			}
		}
		
		.progress-info {
			flex: 1;
			margin-left: 30rpx;
			
			.progress-bar {
				width: 100%;
				height: 12rpx;
				background: #E0E0E0;
				border-radius: 6rpx;
				overflow: hidden;
				margin-bottom: 10rpx;
				
				.progress-fill {
					height: 100%;
					background: linear-gradient(to right, #4CAF50, #8BC34A);
					border-radius: 6rpx;
				}
			}
			
			.progress-text {
				font-size: 24rpx;
				color: #999;
				text-align: right;
			}
		}
	}
	
	.detail-card, .link-card, .notes-card, .publisher-card, .guarantee-card {
		background: white;
		border-radius: 15rpx;
		margin: 0 20rpx 20rpx;
		overflow: hidden;
		
		.card-header {
			padding: 25rpx 30rpx 20rpx;
			border-bottom: 1rpx solid #eee;
			
			.card-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.card-content {
			padding: 20rpx 30rpx;
			
			.detail-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 15rpx 0;
				
				.detail-label {
					font-size: 26rpx;
					color: #666;
					width: 120rpx;
				}
				
				.detail-value {
					font-size: 26rpx;
					color: #333;
					flex: 1;
					text-align: right;
					
					&.status {
						padding: 5rpx 15rpx;
						border-radius: 20rpx;
						font-size: 22rpx;
						color: white;
						
						&.status-ongoing {
							background: #4CAF50;
						}
						
						&.status-popular {
							background: #FF9800;
						}
						
						&.status-new {
							background: #2196F3;
						}
						
						&.status-completed {
							background: #9E9E9E;
						}
					}
				}
			}
		}
	}
	
	.link-content {
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.link-url {
			flex: 1;
			font-size: 24rpx;
			color: #666;
			word-break: break-all;
			margin-right: 20rpx;
		}
		
		.copy-btn {
			background: #49AFFF;
			color: white;
			font-size: 24rpx;
			padding: 10rpx 20rpx;
			border-radius: 10rpx;
		}
	}
	
	.notes-content {
		padding: 20rpx 30rpx;
		
		.note-item {
			display: flex;
			align-items: flex-start;
			margin-bottom: 15rpx;
			
			.note-text {
				font-size: 26rpx;
				color: #666;
				margin-left: 10rpx;
				flex: 1;
				line-height: 1.5;
			}
		}
	}
	
	.publisher-content {
		padding: 20rpx 30rpx;
		
		.publisher-info {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			image {
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
					margin-bottom: 10rpx;
				}
				
				.publisher-stats {
					display: flex;
					justify-content: space-around;
					
					.stat-item {
						text-align: center;
						
						.stat-value {
							font-size: 28rpx;
							font-weight: bold;
							color: #49AFFF;
							display: block;
						}
						
						.stat-label {
							font-size: 22rpx;
							color: #999;
						}
					}
				}
			}
		}
		
		.contact-btn {
			background: #49AFFF;
			color: white;
			border-radius: 10rpx;
			padding: 15rpx;
			font-size: 26rpx;
		}
	}
	
	.guarantee-content {
		padding: 20rpx 30rpx;
		
		.guarantee-item {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			.guarantee-text {
				font-size: 26rpx;
				color: #666;
				margin-left: 15rpx;
				flex: 1;
			}
		}
	}
	
	.bottom-action-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
		border-top: 1rpx solid #eee;
		
		.action-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			text {
				font-size: 24rpx;
				color: #999;
				margin-top: 5rpx;
			}
		}
		
		.assist-btn {
			flex: 2;
			background: #FF5722;
			color: white;
			border-radius: 50rpx;
			padding: 25rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
	}
	
	.confirm-popup {
		padding: 40rpx;
		width: 600rpx;
		
		.popup-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			text-align: center;
			margin-bottom: 30rpx;
		}
		
		.popup-content {
			.confirm-info {
				background: #f5f5f5;
				border-radius: 10rpx;
				padding: 20rpx;
				margin-bottom: 30rpx;
				
				.info-row {
					display: flex;
					justify-content: space-between;
					padding: 10rpx 0;
					border-bottom: 1rpx solid #eee;
					
					.label {
						font-size: 26rpx;
						color: #666;
					}
					
					.value {
						font-size: 26rpx;
						color: #333;
						text-align: right;
						
						&.price {
							color: #FF5722;
							font-weight: bold;
						}
					}
				}
			}
			
			.count-selector {
				.selector-label {
					font-size: 26rpx;
					color: #666;
					margin-bottom: 15rpx;
				}
				
				.counter {
					display: flex;
					align-items: center;
					justify-content: center;
					
					.counter-btn {
						width: 60rpx;
						height: 60rpx;
						background: #f5f5f5;
						border: 1rpx solid #ddd;
						border-radius: 50%;
						font-size: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						
						&:disabled {
							background: #eee;
							color: #999;
						}
					}
					
					.counter-input {
						width: 80rpx;
						height: 60rpx;
						text-align: center;
						border: 1rpx solid #ddd;
						border-left: none;
						border-right: none;
						font-size: 30rpx;
					}
				}
			}
		}
		
		.popup-actions {
			display: flex;
			gap: 20rpx;
			margin-top: 30rpx;
			
			button {
				flex: 1;
				padding: 20rpx;
				border-radius: 10rpx;
				font-size: 28rpx;
			}
			
			.cancel-btn {
				background: #f5f5f5;
				color: #666;
			}
			
			.confirm-btn {
				background: #4CAF50;
				color: white;
			}
		}
	}
}
</style>