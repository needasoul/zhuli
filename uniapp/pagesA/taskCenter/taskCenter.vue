<template>
	<view class="page">
		<view class="top-actions">
			<view class="action-btn primary">
				发布任务
			</view>
			<view class="action-btn">
				已接任务
			</view>
		</view>

		<view class="tabs flexs">
			<view
				v-for="(item, index) in tabs"
				:key="index"
				class="tab-item"
				:class="{ active: currentTab === index }"
				@click="currentTab = index"
			>
				{{ item }}
			</view>
		</view>

		<view class="empty">
			<image class="empty-img" src="/static/images/order_form.png" mode="aspectFit"></image>
			<view class="empty-text">暂无任务</view>
			<view class="empty-sub">请在活动中接取任务或自行发布任务</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['全部', '进行中', '审核中', '审核通过', '未通过'],
				currentTab: 0
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f6f6f6;
	}

	.top-actions {
		display: flex;
		justify-content: space-between;
		padding: 24rpx 32rpx 12rpx;
		background-color: #ffffff;
	}

	.action-btn {
		flex: 1;
		margin: 0 8rpx;
		height: 72rpx;
		border-radius: 999rpx;
		text-align: center;
		line-height: 72rpx;
		font-size: 26rpx;
		color: #ff7a00;
		border: 2rpx solid #ffb366;
		background-color: #fff7ec;
	}

	.action-btn.primary {
		color: #ffffff;
		border: none;
		background: linear-gradient(90deg, #ff9b00 0%, #ff6a00 100%);
	}

	.tabs {
		background-color: #ffffff;
		padding: 0 24rpx 12rpx;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 18rpx 0;
		font-size: 26rpx;
		color: #999999;
	}

	.tab-item.active {
		color: #ff7a00;
		font-weight: 600;
		border-bottom: 4rpx solid #ff7a00;
	}

	.empty {
		margin-top: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.empty-img {
		width: 220rpx;
		height: 220rpx;
		margin-bottom: 16rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #666666;
		margin-bottom: 8rpx;
	}

  
	.empty-sub {
		font-size: 24rpx;
		color: #aaaaaa;
	}
</style>

