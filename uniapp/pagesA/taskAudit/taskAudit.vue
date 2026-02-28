<template>
	<view class="page">
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

		<view class="tip">
			请在限定时间内完成任务并上传佐证信息，超时无法获得赏金~
		</view>

		<view class="empty">
			<image class="empty-img" src="/static/images/order_form.png" mode="aspectFit"></image>
			<view class="empty-text">暂无审核记录</view>
			<view class="empty-sub">完成任务并提交后，可在此查看审核进度</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['全部', '审核中', '审核通过', '未通过'],
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

	.tip {
		font-size: 24rpx;
		color: #ff7a00;
		padding: 16rpx 32rpx;
		background-color: #fff7ec;
	}

	.empty {
		margin-top: 40rpx;
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

