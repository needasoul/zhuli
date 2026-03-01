<template>
	<view class="order-container">
		<!-- 页面标题 -->
		<view class="page-header">
			<view class="header-left" @click="goBack">
				<u-icon name="arrow-left" size="20"></u-icon>
			</view>
			<view class="header-title">我的订单</view>
			<view class="header-right"></view>
		</view>

		<!-- 订单分类标签 -->
		<view class="order-tabs">
			<view 
				class="tab-item" 
				v-for="(tab, index) in tabs" 
				:key="index"
				:class="{ active: activeTab === index }"
				@click="switchTab(index)"
			>
				{{ tab.name }}
				<view class="tab-badge" v-if="tab.count > 0">{{ tab.count }}</view>
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-item" v-for="(order, index) in orderList" :key="order.id">
				<view class="order-header">
					<view class="order-info">
						<view class="order-id">订单号：{{ order.orderId }}</view>
						<view class="order-status" :class="`status-${order.status}`">{{ getStatusText(order.status) }}</view>
					</view>
					<view class="order-platform">
						<image :src="order.platformIcon" mode="aspectFit"></image>
						<text>{{ order.platformName }}</text>
					</view>
				</view>
				
				<view class="order-content" @click="goToOrderDetail(order)">
					<view class="order-preview">
						<image :src="order.taskImage" mode="aspectFill"></image>
						<view class="order-details">
							<view class="task-title">{{ order.taskTitle }}</view>
							<view class="task-desc">{{ order.taskDesc }}</view>
						</view>
					</view>
					
					<view class="order-summary">
						<view class="summary-row">
							<text class="label">助力次数:</text>
							<text class="value">{{ order.assistCount }}次</text>
						</view>
						<view class="summary-row">
							<text class="label">单价:</text>
							<text class="value">¥{{ order.unitPrice }}</text>
						</view>
						<view class="summary-row total">
							<text class="label">总计:</text>
							<text class="value total-price">¥{{ order.totalPrice }}</text>
						</view>
					</view>
				</view>
				
				<view class="order-footer">
					<view class="order-date">{{ order.createTime }}</view>
					<view class="order-actions">
						<button class="action-btn" v-if="order.status === 'pending_payment'" @click="payOrder(order)">付款</button>
						<button class="action-btn" v-if="order.status === 'in_progress'" @click="viewProgress(order)">查看进度</button>
						<button class="action-btn" v-if="order.status === 'completed'" @click="viewResult(order)">查看结果</button>
						<button class="action-btn primary" @click="contactSeller(order)">联系客服</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="orderList.length === 0">
			<u-empty mode="order" icon="/static/images/order_empty.png">
				<view class="empty-text">暂无{{ tabs[activeTab].name }}订单</view>
				<button class="empty-btn" @click="goToBoostSquare">去助力广场</button>
			</u-empty>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabs: [
				{ name: '全部', count: 0 },
				{ name: '待付款', count: 0 },
				{ name: '进行中', count: 0 },
				{ name: '已完成', count: 0 },
				{ name: '已取消', count: 0 }
			],
			activeTab: 0,
			orderList: []
		}
	},
	onLoad() {
		this.loadData();
	},
	watch: {
		activeTab: {
			handler(newVal) {
				this.loadOrdersByStatus(newVal);
			},
			immediate: true
		}
	},
	methods: {
		// 加载数据
		loadData() {
			// 初始化示例订单数据
			this.allOrders = [
				{
					id: 1,
					orderId: 'ORD202311010001',
					status: 'completed',
					platformName: '京东',
					platformIcon: '../../static/index/jd_icon.png',
					taskTitle: '【京东】618购物节助力',
					taskDesc: '助力解锁大额优惠券，享受购物折扣',
					taskImage: '../../static/order/task_example1.jpg',
					assistCount: 5,
					unitPrice: '1.88',
					totalPrice: '9.40',
					createTime: '2023-11-01 14:30'
				},
				{
					id: 2,
					orderId: 'ORD202311020002',
					status: 'in_progress',
					platformName: '拼多多',
					platformIcon: '../../static/index/pdd_icon.png',
					taskTitle: '【拼多多】砍价免费拿',
					taskDesc: '帮我砍价到0元，即可免费获得商品',
					taskImage: '../../static/order/task_example2.jpg',
					assistCount: 10,
					unitPrice: '2.50',
					totalPrice: '25.00',
					completeCount: 7,
					remainingCount: 3,
					createTime: '2023-11-02 10:15'
				},
				{
					id: 3,
					orderId: 'ORD202311030003',
					status: 'pending_payment',
					platformName: '淘宝',
					platformIcon: '../../static/index/taobao_icon.png',
					taskTitle: '【淘宝】双11预售定金',
					taskDesc: '助力解锁预售优惠，享受定金膨胀',
					taskImage: '../../static/order/task_example3.jpg',
					assistCount: 8,
					unitPrice: '3.20',
					totalPrice: '25.60',
					createTime: '2023-11-03 16:45'
				},
				{
					id: 4,
					orderId: 'ORD202311040004',
					status: 'cancelled',
					platformName: '抖音',
					platformIcon: '../../static/index/douyin_icon.png',
					taskTitle: '【抖音】直播间助力',
					taskDesc: '进入直播间完成指定任务，助力主播冲榜赢好礼',
					taskImage: '../../static/order/task_example4.jpg',
					assistCount: 20,
					unitPrice: '1.50',
					totalPrice: '30.00',
					createTime: '2023-11-04 09:20'
				}
			];
			
			// 计算各状态订单数量
			this.calculateTabCounts();
			
			// 加载当前标签页的数据
			this.loadOrdersByStatus(this.activeTab);
		},
		
		// 计算各标签页订单数量
		calculateTabCounts() {
			const counts = {
				all: this.allOrders.length,
				pending_payment: 0,
				in_progress: 0,
				completed: 0,
				cancelled: 0
			};
			
			this.allOrders.forEach(order => {
				switch(order.status) {
					case 'pending_payment':
						counts.pending_payment++;
						break;
					case 'in_progress':
						counts.in_progress++;
						break;
					case 'completed':
						counts.completed++;
						break;
					case 'cancelled':
						counts.cancelled++;
						break;
				}
			});
			
			this.tabs[0].count = counts.all;
			this.tabs[1].count = counts.pending_payment;
			this.tabs[2].count = counts.in_progress;
			this.tabs[3].count = counts.completed;
			this.tabs[4].count = counts.cancelled;
		},
		
		// 根据状态加载订单
		loadOrdersByStatus(tabIndex) {
			if (tabIndex === 0) {
				// 全部订单
				this.orderList = [...this.allOrders];
			} else {
				let statusFilter = '';
				switch(tabIndex) {
					case 1: statusFilter = 'pending_payment'; break;
					case 2: statusFilter = 'in_progress'; break;
					case 3: statusFilter = 'completed'; break;
					case 4: statusFilter = 'cancelled'; break;
				}
				
				this.orderList = this.allOrders.filter(order => order.status === statusFilter);
			}
		},
		
		// 切换标签页
		switchTab(index) {
			this.activeTab = index;
		},
		
		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				'pending_payment': '待付款',
				'in_progress': '进行中',
				'completed': '已完成',
				'cancelled': '已取消'
			};
			return statusMap[status] || '';
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 前往订单详情
		goToOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/order/detail?orderId=${order.id}`
			});
		},
		
		// 付款
		payOrder(order) {
			uni.showModal({
				title: '确认付款',
				content: `订单总额 ¥${order.totalPrice}，是否确认付款？`,
				success: (res) => {
					if (res.confirm) {
						// 模拟付款成功
						uni.showLoading({
							title: '处理中...'
						});
						
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								title: '付款成功',
								icon: 'success'
							});
							
							// 更新订单状态
							order.status = 'in_progress';
							this.calculateTabCounts();
							this.loadOrdersByStatus(this.activeTab);
						}, 1500);
					}
				}
			});
		},
		
		// 查看进度
		viewProgress(order) {
			uni.navigateTo({
				url: `/pages/order/progress?orderId=${order.id}`
			});
		},
		
		// 查看结果
		viewResult(order) {
			uni.navigateTo({
				url: `/pages/order/result?orderId=${order.id}`
			});
		},
		
		// 联系客服
		contactSeller(order) {
			uni.showActionSheet({
				itemList: ['联系发布者', '联系平台客服'],
				success: (res) => {
					if (res.tapIndex === 0) {
						uni.navigateTo({
							url: `/pages/chat/chat?orderId=${order.id}`
						});
					} else {
						uni.makePhoneCall({
							phoneNumber: '400-123-4567'
						});
					}
				}
			});
		},
		
		// 前往助力广场
		goToBoostSquare() {
			uni.switchTab({
				url: '/pages/boostSquare/boostSquare'
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.order-container {
	min-height: 100vh;
	background: #f5f5f5;
	
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 20rpx 20rpx;
		background: white;
		position: sticky;
		top: 0;
		z-index: 100;
		
		.header-left, .header-right {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
		}
		
		.header-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.order-tabs {
		display: flex;
		background: white;
		border-bottom: 1rpx solid #eee;
		
		.tab-item {
			flex: 1;
			padding: 20rpx 0;
			text-align: center;
			font-size: 28rpx;
			color: #666;
			position: relative;
			
			&.active {
				color: #49AFFF;
				font-weight: bold;
				
				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 60rpx;
					height: 4rpx;
					background: #49AFFF;
					border-radius: 2rpx;
				}
			}
			
			.tab-badge {
				position: absolute;
				top: 5rpx;
				right: 30rpx;
				background: #FF5722;
				color: white;
				font-size: 20rpx;
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	
	.order-list {
		padding: 20rpx;
		
		.order-item {
			background: white;
			border-radius: 15rpx;
			margin-bottom: 20rpx;
			overflow: hidden;
			
			.order-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 30rpx;
				border-bottom: 1rpx solid #eee;
				
				.order-info {
					display: flex;
					flex-direction: column;
					
					.order-id {
						font-size: 24rpx;
						color: #666;
						margin-bottom: 5rpx;
					}
					
					.order-status {
						font-size: 22rpx;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						color: white;
						
						&.status-pending_payment {
							background: #FF9800;
						}
						
						&.status-in_progress {
							background: #2196F3;
						}
						
						&.status-completed {
							background: #4CAF50;
						}
						
						&.status-cancelled {
							background: #9E9E9E;
						}
					}
				}
				
				.order-platform {
					display: flex;
					align-items: center;
					
					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
					
					text {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
			
			.order-content {
				padding: 20rpx 30rpx;
				
				.order-preview {
					display: flex;
					margin-bottom: 20rpx;
					
					image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 10rpx;
						margin-right: 20rpx;
					}
					
					.order-details {
						flex: 1;
						
						.task-title {
							font-size: 28rpx;
							font-weight: bold;
							color: #333;
							margin-bottom: 10rpx;
						}
						
						.task-desc {
							font-size: 24rpx;
							color: #666;
							line-height: 1.4;
						}
					}
				}
				
				.order-summary {
					.summary-row {
						display: flex;
						justify-content: space-between;
						padding: 8rpx 0;
						font-size: 24rpx;
						color: #666;
						
						&.total {
							padding-top: 10rpx;
							border-top: 1rpx dashed #eee;
							margin-top: 10rpx;
							
							.total-price {
								color: #FF5722;
								font-weight: bold;
							}
						}
						
						.label {
							color: #999;
						}
						
						.value {
							color: #333;
						}
					}
				}
			}
			
			.order-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 30rpx;
				background: #f9f9f9;
				
				.order-date {
					font-size: 22rpx;
					color: #999;
				}
				
				.order-actions {
					display: flex;
					gap: 10rpx;
					
					.action-btn {
						padding: 10rpx 20rpx;
						font-size: 24rpx;
						border-radius: 30rpx;
						border: 1rpx solid #eee;
						background: white;
						color: #666;
						
						&.primary {
							background: #49AFFF;
							color: white;
							border-color: #49AFFF;
						}
					}
				}
			}
		}
	}
	
	.empty-state {
		margin-top: 100rpx;
		
		.empty-text {
			font-size: 28rpx;
			color: #999;
			margin: 20rpx 0;
		}
		
		.empty-btn {
			background: #49AFFF;
			color: white;
			border-radius: 50rpx;
			padding: 20rpx 40rpx;
			font-size: 28rpx;
			margin-top: 30rpx;
		}
	}
}
</style>