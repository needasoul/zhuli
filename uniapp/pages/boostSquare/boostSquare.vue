<template>
	<view class="boost-square-container">
		<!-- 页面标题 -->
		<view class="page-header">
			<view class="header-content">
				<view class="header-title">助力广场</view>
				<view class="header-search" @click="showSearch = true">
					<u-search placeholder="搜索助力活动" v-model="searchKeyword" :show-action="false"></u-search>
				</view>
			</view>
		</view>

		<!-- 筛选选项 -->
		<view class="filter-section">
			<view class="filter-item" @click="showPlatformFilter = true">
				<text>{{ selectedPlatform || '平台' }}</text>
				<u-icon name="arrow-down" size="14"></u-icon>
			</view>
			<view class="filter-item" @click="showStatusFilter = true">
				<text>{{ selectedStatus || '状态' }}</text>
				<u-icon name="arrow-down" size="14"></u-icon>
			</view>
			<view class="filter-item" @click="sortByPrice">
				<text>价格</text>
				<u-icon :name="sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'" size="14"></u-icon>
			</view>
		</view>

		<!-- 助力活动列表 -->
		<view class="boost-list">
			<view class="boost-item bg-f br-16" 
				v-for="(item, index) in boostList" 
				:key="item.id"
				@click="goToBoostDetail(item)">
				<view class="boost-item-top">
					<view class="boost-platform">
						<image :src="item.platformIcon" mode="aspectFit"></image>
						<text class="platform-name">{{ item.platformName }}</text>
					</view>
					<view class="boost-status" :class="item.statusClass">
						{{ item.statusText }}
					</view>
				</view>
				
				<view class="boost-content">
					<view class="boost-title">{{ item.title }}</view>
					<view class="boost-desc">{{ item.description }}</view>
					
					<view class="boost-meta">
						<view class="boost-price">
							<text class="unit">¥</text>
							<text class="amount">{{ item.price }}</text>
						</view>
						<view class="boost-progress">
							<view class="progress-bar">
								<view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
							</view>
							<view class="progress-text">{{ item.completed }}/{{ item.total }}人助力</view>
						</view>
					</view>
					
					<view class="boost-tags">
						<view class="tag" v-for="(tag, idx) in item.tags" :key="idx">{{ tag }}</view>
					</view>
				</view>
				
				<view class="boost-footer">
					<view class="boost-author">
						<image :src="item.authorAvatar" mode="aspectFill"></image>
						<text class="author-name">{{ item.authorName }}</text>
					</view>
					<view class="boost-time">{{ item.createTime }}</view>
				</view>
			</view>
		</view>

		<!-- 搜索弹窗 -->
		<u-popup :show="showSearch" @close="showSearch = false" mode="bottom">
			<view class="search-popup">
				<view class="search-header">
					<u-search 
						placeholder="输入关键词搜索" 
						v-model="searchKeyword" 
						@search="performSearch"
						@clear="clearSearch"
					></u-search>
					<text @click="showSearch = false">取消</text>
				</view>
			</view>
		</u-popup>

		<!-- 平台筛选弹窗 -->
		<u-popup :show="showPlatformFilter" @close="showPlatformFilter = false" mode="bottom">
			<view class="filter-popup">
				<view class="popup-header">
					<text>选择平台</text>
					<u-icon name="close" @click="showPlatformFilter = false"></u-icon>
				</view>
				<view class="filter-options">
					<view 
						class="option" 
						:class="{ active: selectedPlatform === option }" 
						v-for="(option, index) in platformOptions" 
						:key="index"
						@click="selectPlatform(option)"
					>
						{{ option }}
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 状态筛选弹窗 -->
		<u-popup :show="showStatusFilter" @close="showStatusFilter = false" mode="bottom">
			<view class="filter-popup">
				<view class="popup-header">
					<text>选择状态</text>
					<u-icon name="close" @click="showStatusFilter = false"></u-icon>
				</view>
				<view class="filter-options">
					<view 
						class="option" 
						:class="{ active: selectedStatus === option.value }" 
						v-for="(option, index) in statusOptions" 
						:key="index"
						@click="selectStatus(option.value, option.text)"
					>
						{{ option.text }}
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 加载更多 -->
		<u-loadmore :status="loadStatus" @loadmore="loadMore" />

		<!-- 悬浮发布按钮 -->
		<view class="floating-publish-btn" @click="goToPublishBoost">
			<image src="../../static/boost/publish_icon.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
			showSearch: false,
			showPlatformFilter: false,
			showStatusFilter: false,
			selectedPlatform: '',
			selectedStatus: '',
			sortOrder: 'desc', // asc 或 desc
			boostList: [],
			page: 1,
			limit: 10,
			loadStatus: 'loadmore', // loading, nomore
			platformOptions: ['全部', '京东', '拼多多', '淘宝', '抖音', '快手'],
			statusOptions: [
				{ value: '', text: '全部' },
				{ value: 'ongoing', text: '进行中' },
				{ value: 'popular', text: '热门' },
				{ value: 'new', text: '最新发布' },
				{ value: 'completed', text: '已完成' }
			]
		}
	},
	onLoad() {
		this.loadData();
	},
	onReachBottom() {
		this.loadMore();
	},
	methods: {
		// 加载数据
		loadData() {
			const statusMap = {
				'ongoing': { text: '进行中', class: 'status-ongoing' },
				'popular': { text: '热门', class: 'status-popular' },
				'new': { text: '新发布', class: 'status-new' },
				'completed': { text: '已完成', class: 'status-completed' }
			};
			
			// 模拟加载数据
			const dataList = [
				{
					id: 1,
					title: '【京东】618 购物节助力',
					description: '助力解锁大额优惠券，享受购物折扣，任务简单易完成',
					price: '1.88',
					status: 'ongoing',
					platformName: '京东',
					platformIcon: '../../static/index/jd_icon.png',
					total: 100,
					completed: 65,
					progress: 65,
					tags: ['高收益', '易完成', '限时'],
					authorAvatar: '../../static/images/avatar.png',
					authorName: '张三',
					createTime: '2 小时前'
				},
				{
					id: 2,
					title: '【拼多多】砍价免费拿',
					description: '帮我砍价到 0 元，即可免费获得商品，助力越多收益越大',
					price: '2.50',
					status: 'popular',
					platformName: '拼多多',
					platformIcon: '../../static/index/pdd_icon.png',
					total: 50,
					completed: 42,
					progress: 84,
					tags: ['热门', '高返现'],
					authorAvatar: '../../static/images/avatar.png',
					authorName: '李四',
					createTime: '1 小时前'
				},
				{
					id: 3,
					title: '【淘宝】双 11 预售定金',
					description: '助力解锁预售优惠，享受定金膨胀，还有额外奖励',
					price: '3.20',
					status: 'new',
					platformName: '淘宝',
					platformIcon: '../../static/index/taobao_icon.png',
					total: 80,
					completed: 20,
					progress: 25,
					tags: ['新品', '高额奖励'],
					authorAvatar: '../../static/images/avatar.png',
					authorName: '王五',
					createTime: '30 分钟前'
				},
				{
					id: 4,
					title: '【抖音】直播间助力',
					description: '进入直播间完成指定任务，助力主播冲榜赢好礼',
					price: '1.50',
					status: 'ongoing',
					platformName: '抖音',
					platformIcon: '../../static/index/douyin_icon.png',
					total: 200,
					completed: 150,
					progress: 75,
					tags: ['直播', '互动'],
					authorAvatar: '../../static/images/avatar.png',
					authorName: '赵六',
					createTime: '4 小时前'
				},
				{
					id: 5,
					title: '【快手】粉丝助力',
					description: '帮忙增加粉丝数量，助力涨粉冲榜，真实有效',
					price: '2.00',
					status: 'ongoing',
					platformName: '快手',
					platformIcon: '../../static/index/kuaishou_icon.png',
					total: 150,
					completed: 80,
					progress: 53,
					tags: ['涨粉', '真实'],
					authorAvatar: '../../static/images/avatar.png',
					authorName: '钱七',
					createTime: '5 小时前'
				}
			];
			
			// 添加状态文本和样式类
			this.boostList = dataList.map(item => {
				const statusInfo = statusMap[item.status] || { text: '', class: '' };
				return {
					...item,
					statusText: statusInfo.text,
					statusClass: statusInfo.class
				};
			});
		},
		
		// 搜索
		performSearch() {
			console.log('搜索:', this.searchKeyword);
			this.page = 1;
			this.loadData();
			this.showSearch = false;
		},
		
		// 清空搜索
		clearSearch() {
			this.searchKeyword = '';
		},
		
		// 选择平台
		selectPlatform(platform) {
			if (platform === '全部') {
				this.selectedPlatform = '';
			} else {
				this.selectedPlatform = platform;
			}
			this.showPlatformFilter = false;
			this.applyFilters();
		},
		
		// 选择状态
		selectStatus(status, text) {
			this.selectedStatus = status;
			this.showStatusFilter = false;
			this.applyFilters();
		},
		
		// 应用筛选条件
		applyFilters() {
			// 这里应用筛选逻辑
			console.log('应用筛选条件:', this.selectedPlatform, this.selectedStatus);
		},
		
		// 价格排序
		sortByPrice() {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
			// 这里应用排序逻辑
			console.log('按价格排序:', this.sortOrder);
		},
		
		// 加载更多
		loadMore() {
			if (this.loadStatus === 'nomore') return;
			
			this.loadStatus = 'loading';
			
			const statusMap = {
				'ongoing': { text: '进行中', class: 'status-ongoing' },
				'popular': { text: '热门', class: 'status-popular' },
				'new': { text: '新发布', class: 'status-new' },
				'completed': { text: '已完成', class: 'status-completed' }
			};
			
			// 模拟加载更多数据
			setTimeout(() => {
				const moreData = [
					{
						id: this.boostList.length + 1,
						title: `【新增】助力任务 ${this.boostList.length + 1}`,
						description: '这是一条新增的助力任务描述，用于演示加载更多功能',
						price: (Math.random() * 5).toFixed(2),
						status: ['ongoing', 'popular', 'new'][Math.floor(Math.random() * 3)],
						platformName: ['京东', '拼多多', '淘宝'][Math.floor(Math.random() * 3)],
						platformIcon: ['../../static/index/jd_icon.png', '../../static/index/pdd_icon.png', '../../static/index/taobao_icon.png'][Math.floor(Math.random() * 3)],
						total: Math.floor(Math.random() * 100) + 50,
						completed: Math.floor(Math.random() * 50) + 20,
						progress: Math.floor(Math.random() * 100),
						tags: ['新增', '高收益'],
						authorAvatar: '../../static/images/avatar.png',
						authorName: `用户${this.boostList.length + 1}`,
						createTime: `${Math.floor(Math.random() * 10) + 1}小时前`
					}
				];
				
				// 添加计算后的状态信息
				const statusInfo = statusMap[moreData[0].status] || { text: '', class: '' };
				moreData[0].statusText = statusInfo.text;
				moreData[0].statusClass = statusInfo.class;
				
				this.boostList.push(...moreData);
				this.loadStatus = this.boostList.length >= 20 ? 'nomore' : 'loadmore';
			}, 1000);
		},
		
		// 跳转到助力详情
		goToBoostDetail(boost) {
			uni.navigateTo({
				url: `/pages/boostDetail/boostDetail?id=${boost.id}`
			});
		},
		
		// 跳转到发布助力
		goToPublishBoost() {
			uni.navigateTo({
				url: '/pages/publishBoost/publishBoost'
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.boost-square-container {
	padding-bottom: 100rpx;
	
	.page-header {
		position: sticky;
		top: 0;
		background: white;
		z-index: 100;
		padding: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
		
		.header-content {
			.header-title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 15rpx;
			}
			
			.header-search {
				::v-deep .u-search {
					border-radius: 50rpx;
				}
			}
		}
	}
	
	.filter-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: white;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
		
		.filter-item {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10rpx 20rpx;
			border-radius: 30rpx;
			background: #f5f5f5;
			font-size: 28rpx;
			color: #666;
			
			&:active {
				background: #e0e0e0;
			}
		}
	}
	
	.boost-list {
		padding: 20rpx;
		
		.boost-item {
			padding: 20rpx;
			margin-bottom: 20rpx;
			
			.boost-item-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 15rpx;
				
				.boost-platform {
					display: flex;
					align-items: center;
					
					image {
						width: 40rpx;
						height: 40rpx;
						margin-right: 10rpx;
					}
					
					.platform-name {
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
					}
				}
				
				.boost-status {
					padding: 5rpx 15rpx;
					border-radius: 20rpx;
					font-size: 20rpx;
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
			
			.boost-content {
				.boost-title {
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
				}
				
				.boost-desc {
					font-size: 24rpx;
					color: #666;
					margin-bottom: 15rpx;
					line-height: 1.5;
				}
				
				.boost-meta {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					
					.boost-price {
						.unit {
							font-size: 24rpx;
							color: #FF5722;
						}
						
						.amount {
							font-size: 36rpx;
							font-weight: bold;
							color: #FF5722;
						}
					}
					
					.boost-progress {
						flex: 1;
						margin-left: 20rpx;
						
						.progress-bar {
							width: 100%;
							height: 10rpx;
							background: #E0E0E0;
							border-radius: 5rpx;
							overflow: hidden;
							margin-bottom: 5rpx;
							
							.progress-fill {
								height: 100%;
								background: linear-gradient(to right, #4CAF50, #8BC34A);
								border-radius: 5rpx;
							}
						}
						
						.progress-text {
							font-size: 20rpx;
							color: #999;
							text-align: right;
						}
					}
				}
				
				.boost-tags {
					display: flex;
					flex-wrap: wrap;
					gap: 10rpx;
					
					.tag {
						padding: 5rpx 15rpx;
						background: #E3F2FD;
						border-radius: 20rpx;
						font-size: 20rpx;
						color: #2196F3;
					}
				}
			}
			
			.boost-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 15rpx;
				padding-top: 15rpx;
				border-top: 1rpx solid #eee;
				
				.boost-author {
					display: flex;
					align-items: center;
					
					image {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}
					
					.author-name {
						font-size: 24rpx;
						color: #666;
					}
				}
				
				.boost-time {
					font-size: 22rpx;
					color: #999;
				}
			}
		}
	}
	
	.search-popup {
		padding: 20rpx;
		
		.search-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 20rpx;
			
			::v-deep .u-search {
				flex: 1;
				margin-right: 20rpx;
			}
		}
	}
	
	.filter-popup {
		padding: 20rpx;
		
		.popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
			font-size: 32rpx;
			font-weight: bold;
		}
		
		.filter-options {
			padding: 20rpx 0;
			
			.option {
				padding: 20rpx 30rpx;
				border-radius: 10rpx;
				margin-bottom: 10rpx;
				background: #f5f5f5;
				font-size: 28rpx;
				color: #333;
				
				&.active {
					background: #2196F3;
					color: white;
				}
			}
		}
	}
	
	.floating-publish-btn {
		position: fixed;
		bottom: 100rpx;
		right: 30rpx;
		width: 100rpx;
		height: 100rpx;
		background: #49AFFF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 20rpx rgba(73, 175, 255, 0.5);
		z-index: 99;
		
		image {
			width: 60rpx;
			height: 60rpx;
		}
	}
}
</style>