<template>
	<view>
		<view class="kong" v-if="isFinishedLoading">
			<view class="text">{{showContents}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			isFinishedLoading: {
				type: Boolean,
				default: false
			},
			showContents: {
				type: String,
				default: '暂无更多数据!'
			},
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.kong {
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;


		.text {
			color: #AEAEAE;
		}
	}
</style>