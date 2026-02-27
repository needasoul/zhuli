<template>
	<view>
		<view class="head">
			<image class="head_img" src="../../static/bx.png" mode=""></image>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="nav pl-38 pr-38">
			<navbar :color="'#fff'" :title='title'></navbar>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5-->
		<view class="" style="height: 100rpx;"></view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		props: ['title'],
		name: "head_bg",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.head {
		width: 750rpx;
		height: 638rpx;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		// #ifdef MP-WEIXIN
		z-index: -1;

		// #endif

		// #ifdef H5
		z-index: 1;

		// #endif
		.head_img {
			width: 100%;
			height: 100%;
		}
	}

	.nav {
		position: relative;
		z-index: 5;
		padding: 100rpx 30rpx 50rpx;
		box-sizing: border-box;
	}
</style>