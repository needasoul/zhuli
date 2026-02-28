<template>
	<view>
		<!-- 头部区域 -->
		<view class="head">
			<image class="head_bg" src="../../static/index/icon1.png" mode=""></image>
			<view class="user_box zindex flex" v-if="token" @click="routerGo('/pagesA/personage/personage')">
				<image class="user_box_img" :src="user.avatar" mode=""></image>
				<view class="user_box_right">
					<view class="user_box_right_text">
						{{user.username || '用户'}}
					</view>
					<view class="user_box_right_text_1">
						欢迎使用{{common && common.app_name || '助力放大器'}}
					</view>
				</view>
			</view>
			<view class="user_box zindex flex" v-else @click="routerGo('/pagesA/personage/personage')">
				<image class="user_box_img" src="../../static/images/avatar.png" mode=""></image>
				<view class="user_box_right">
					<view class="user_box_right_text">
						请登录
					</view>
					<view class="user_box_right_text_1">
						欢迎使用{{common && common.app_name || '助力放大器'}}
					</view>
				</view>
			</view>

			<!-- 搜索框 -->
			<view class="search_box zindex flexc">
				<image src="@/static/index/icon3.png" mode=""></image>
				<input disabled="true" placeholder-style='color:#DAD8DB;' type="text" placeholder="搜索助力活动" />
			</view>
		</view>

		<!-- 助力活动分类 -->
		<view class="boost-types zindex">
			<scroll-view scroll-x="true" style="width:100%;white-space: nowrap;">
				<view class="d-flex ml-26">
					<view class="boost-type-item txt-center pt-10 br-36 mr-32" 
						v-for="(item,index) in boostTypes" 
						:key="item.id" 
						:class="{active: activeBoostType===item.id}"
						@click="selectBoostType(item.id)">
						<view class="boost-type-icon">
							<image :src="item.icon" mode=""></image>
						</view>
						<view class="boost-type-name f-size-26 f-600 color-0E11 mt-12">
							{{item.name}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 助力活动列表 -->
		<view class="boost-list-container">
			<view class="boost-list-header">
				<view class="header-title">热门助力活动</view>
				<view class="header-more" @click="goToBoostSquare">查看更多 ></view>
			</view>
			
			<view class="boost-list">
				<view class="boost-item bg-f br-16" 
					v-for="(item, index) in boostActivities" 
					:key="item.id"
					@click="goToBoostDetail(item)">
					<view class="boost-item-top">
						<view class="boost-platform">
							<image :src="item.platformIcon" mode="aspectFit"></image>
							<text class="platform-name">{{ item.platformName }}</text>
						</view>
						<view class="boost-status" :class="getStatusClass(item.status)">
							{{ getStatusText(item.status) }}
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
					</view>
				</view>
			</view>
		</view>

		<!-- 广告横幅 -->
		<view class="banner-section">
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
				<swiper-item v-for="(banner, index) in banners" :key="index">
					<image :src="banner.image" class="banner-image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 快速发布助力 -->
		<view class="quick-publish-section">
			<view class="section-title">快速发布助力</view>
			<view class="publish-card bg-f br-16" @click="goToPublishBoost">
				<view class="publish-icon">
					<image src="../../static/index/publish_icon.png" mode=""></image>
				</view>
				<view class="publish-text">
					<view class="publish-title">发布您的助力任务</view>
					<view class="publish-desc">快速发布助力任务，获得专业助力服务</view>
				</view>
				<view class="publish-arrow">
					<image src="../../static/index/right_arrow.png" mode=""></image>
				</view>
			</view>
		</view>

		<!-- 底部安全提示 -->
		<view class="security-tips">
			<view class="tips-icon">
				<image src="../../static/index/security_icon.png" mode=""></image>
			</view>
			<view class="tips-text">
				安全提醒：请注意保护个人信息，谨防诈骗
			</view>
		</view>
	</view>
</template>

<script>
import { getCommon } from "../../api/comm.js"
export default {
	data() {
		return {
			token: null,
			user: {},
			common: {},
			boostTypes: [
				{ id: 1, name: '京东助力', icon: '../../static/index/jd_icon.png' },
				{ id: 2, name: '拼多多助力', icon: '../../static/index/pdd_icon.png' },
				{ id: 3, name: '淘宝助力', icon: '../../static/index/taobao_icon.png' },
				{ id: 4, name: '抖音助力', icon: '../../static/index/douyin_icon.png' },
				{ id: 5, name: '快手助力', icon: '../../static/index/kuaishou_icon.png' },
				{ id: 6, name: '其他助力', icon: '../../static/index/other_icon.png' }
			],
			activeBoostType: 1,
			boostActivities: [
				{
					id: 1,
					title: '【京东】618购物节助力',
					description: '助力解锁大额优惠券，享受购物折扣',
					price: '1.88',
					status: 'ongoing',
					platformName: '京东',
					platformIcon: '../../static/index/jd_icon.png',
					total: 100,
					completed: 65,
					progress: 65
				},
				{
					id: 2,
					title: '【拼多多】砍价免费拿',
					description: '帮我砍价到0元，即可免费获得商品',
					price: '2.50',
					status: 'popular',
					platformName: '拼多多',
					platformIcon: '../../static/index/pdd_icon.png',
					total: 50,
					completed: 42,
					progress: 84
				},
				{
					id: 3,
					title: '【淘宝】双11预售定金',
					description: '助力解锁预售优惠，享受定金膨胀',
					price: '3.20',
					status: 'new',
					platformName: '淘宝',
					platformIcon: '../../static/index/taobao_icon.png',
					total: 80,
					completed: 20,
					progress: 25
				}
			],
			banners: [
				{ image: '../../static/index/banner1.jpg' },
				{ image: '../../static/index/banner2.jpg' },
				{ image: '../../static/index/banner3.jpg' }
			]
		}
	},
	onLoad() {
		// 初始化数据
		this.initData();
	},
	onShow() {
		// 获取公共参数
		this.getCommonApi();
		let userinfo = uni.getStorageSync('userinfo');
		if (userinfo) {
			this.getuser();
		}
		let token = uni.getStorageSync('userinfo').token;
		if (token) {
			this.token = token;
		} else {
			this.token = null;
		}
	},
	
	methods: {
		// 初始化数据
		initData() {
			// 初始化示例数据，后续可改为接口获取
			this.initBoostActivities();
		},
		
		// 初始化助力活动数据
		initBoostActivities() {
			// 数据已在data中初始化
		},
		
		// 获取公共配置
		async getCommonApi() {
			try {
				let res = await getCommon();
				if (res.code == 1) {
					this.common = res.data;
				}
			} catch (error) {
				console.error('获取公共配置失败:', error);
			}
		},
		
		// 获取用户信息
		async getuser() {
			// 实现获取用户信息逻辑
		},
		
		// 选择助力类型
		selectBoostType(typeId) {
			this.activeBoostType = typeId;
			// 这里可以触发获取特定类型助力活动的逻辑
			this.loadBoostActivitiesByType(typeId);
		},
		
		// 根据类型加载助力活动
		loadBoostActivitiesByType(typeId) {
			// 模拟根据不同类型加载不同活动
			console.log(`加载类型 ${typeId} 的助力活动`);
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
		
		// 跳转到助力详情
		goToBoostDetail(boost) {
			uni.navigateTo({
				url: `/pages/boostDetail/boostDetail?id=${boost.id}`
			});
		},
		
		// 跳转到助力广场
		goToBoostSquare() {
			uni.navigateTo({
				url: '/pages/boostSquare/boostSquare'
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
page {
	background-color: #F8F9FC;
}

.head {
	width: 100vw;
	height: 580rpx;
	position: relative;
	overflow: hidden;

	.zindex {
		position: relative;
		z-index: 4;
	}

	.user_box {
		margin: 100rpx 0 30rpx 34rpx;

		.user_box_img {
			width: 80rpx;
			height: 80rpx;
			border-radius: 26rpx 26rpx 26rpx 26rpx;
			margin-right: 18rpx;
			background-color: #5FB7FE;
		}

		.user_box_right {
			.user_box_right_text {
				font-size: 28rpx;
				color: #FFFFFF;
				margin-bottom: 8rpx;
				font-weight: bold;
			}

			.user_box_right_text_1 {
				font-size: 22rpx;
				color: #FFFFFF;
			}
		}
	}

	.search_box {
		width: 690rpx;
		height: 88rpx;
		background: #FFFFFF;
		border-radius: 22rpx 22rpx 22rpx 22rpx;
		margin: 0 auto 20rpx;
		padding: 22rpx 24rpx;
		box-sizing: border-box;

		input {
			width: 540rpx;
			height: 30rpx;
		}

		image {
			height: 30rpx;
			width: 30rpx;
			margin-right: 20rpx;
			margin-top: 6rpx;
		}
	}

	.head_bg {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100vw;
		height: 580rpx;
	}
}

.boost-types {
	margin: 10rpx 0;
	padding: 15rpx 0;
	background: white;
}

.boost-type-item {
	display: inline-block;
	padding: 8rpx 16rpx;
	border-radius: 36rpx;
	margin-right: 16rpx;
	
	&.active {
		background: #49AFFF;
		color: white;
		
		.boost-type-name {
			color: white;
		}
	}
	
	.boost-type-icon {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
	
	.boost-type-name {
		font-size: 24rpx;
		color: #333;
	}
}

.boost-list-container {
	padding: 15rpx;
}

.boost-list-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
	
	.header-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.header-more {
		font-size: 22rpx;
		color: #666;
	}
}

.boost-list {
	.boost-item {
		padding: 15rpx;
		margin-bottom: 15rpx;
		
		.boost-item-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;
			
			.boost-platform {
				display: flex;
				align-items: center;
				
				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}
				
				.platform-name {
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
				}
			}
			
			.boost-status {
				padding: 4rpx 12rpx;
				border-radius: 16rpx;
				font-size: 18rpx;
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
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 8rpx;
			}
			
			.boost-desc {
				font-size: 22rpx;
				color: #666;
				margin-bottom: 10rpx;
			}
			
			.boost-meta {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.boost-price {
					.unit {
						font-size: 22rpx;
						color: #FF5722;
					}
					
					.amount {
						font-size: 32rpx;
						font-weight: bold;
						color: #FF5722;
					}
				}
				
				.boost-progress {
					flex: 1;
					margin-left: 15rpx;
					
					.progress-bar {
						width: 100%;
						height: 8rpx;
						background: #E0E0E0;
						border-radius: 4rpx;
						overflow: hidden;
						margin-bottom: 4rpx;
						
						.progress-fill {
							height: 100%;
							background: linear-gradient(to right, #4CAF50, #8BC34A);
							border-radius: 4rpx;
						}
					}
					
					.progress-text {
						font-size: 18rpx;
						color: #999;
						text-align: right;
					}
				}
			}
		}
	}
}

.banner-section {
	padding: 0 15rpx 15rpx;
	
	.banner-swiper {
		height: 180rpx;
		border-radius: 12rpx;
		overflow: hidden;
		
		.banner-image {
			width: 100%;
			height: 100%;
		}
	}
}

.quick-publish-section {
	padding: 0 15rpx 15rpx;
	
	.section-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 12rpx;
	}
	
	.publish-card {
		padding: 20rpx;
		display: flex;
		align-items: center;
		
		.publish-icon {
			width: 60rpx;
			height: 60rpx;
			margin-right: 15rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.publish-text {
			flex: 1;
			
			.publish-title {
				font-size: 26rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 4rpx;
			}
			
			.publish-desc {
				font-size: 22rpx;
				color: #666;
			}
		}
		
		.publish-arrow {
			width: 24rpx;
			height: 24rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.security-tips {
	padding: 15rpx;
	display: flex;
	align-items: center;
	background: #FFF9C4;
	border-radius: 8rpx;
	margin: 0 15rpx 15rpx;
	
	.tips-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 8rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.tips-text {
		font-size: 22rpx;
		color: #FF8F00;
		flex: 1;
	}
}
</style>