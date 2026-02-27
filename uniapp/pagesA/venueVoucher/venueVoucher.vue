<template>
	<view class="d-flex j-center ">
		<view class="" v-if="contentlist.hx_code">
			<view class="bg-f br-34 mt-30 pl-30 pt-26" style="width: 710rpx;">
				<!-- <view class=" f-size-30 color-28 f-500 letter-spacing-2 ">
						{{contentlist.hd_name}}
					</view>
					<view class=" f-size-22 f-400 letter-spacing-2 color-3 mt-32">
				活动时间: {{contentlist.hd_time}}
			</view>
			<view class="f-size-22 f-400 letter-spacing-2 color-3 mt-24">
				活动场馆:{{contentlist.venue_name}}
			</view> -->

				<!-- 核销二维码 -->
				<view class="bg-f br-34 mt-30 pt-28 pl-30 pr-28" style="padding-bottom: 67rpx;">
					<view class="d-flex j-sb">
						<view class="f-size-30 f-500 color-28">进场二维码</view>
						<view class="f-size-24 f-400 color-A5" @click="notice_for_use">使用须知</view>
					</view>
					<!-- <view class="f-size-32 f-400 color-OA txt-center">已入场0次</view> -->
					<view class="code-box">
						<!-- <image src="" mode=""></image> -->
						<!-- <view style="margin: 0 auto;"> -->
						<!-- <w-qrcode :options="options"></w-qrcode> -->
						<!-- </view> -->
						<image style="width: 100%; height: 100%;" :src="contentlist.code" mode="">
						</image>
					</view>
					<view class="f-size-22 f-400 color-OA txt-center">
						<view>
							{{contentlist.hx_code}}
						</view>
						<view style="margin-top: 30rpx;">
							入场前请向工作人员出示本页面
						</view>
					</view>
					<!-- <view class="f-size-22 f-400 color-3C txt-center mt-24">手动刷新</view> -->
					<view class=" " style="margin-top: 64rpx;">
						<view class="conttitle">
							<text class="conttitle_title">场馆名:</text>
							<text style="margin-left: 10rpx;">{{contentlist.venue_name}}</text>
						</view>
						<view class="conttitle">
							<text class="conttitle_title">日期:</text>
							<text style="margin-left: 10rpx;">{{contentlist.fixed_date}}</text>
						</view>
						<view class="conttitle">
							<text class="conttitle_title">包场时段:</text>
							<text
								style="margin-left: 10rpx;">{{contentlist.start_times}}-{{contentlist.end_times}}</text>
						</view>
						<view class="conttitle">
							<text class="conttitle_title">场地类型:</text>
							<text style="margin-left: 10rpx;">{{contentlist.type}}</text>
						</view>
						<view class="conttitle">
							<text class="conttitle_title">场地编号:</text>
							<text style="margin-left: 10rpx;">{{contentlist.area_id}}</text>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import config from '@/config.js'
	export default {
		data() {
			return {
				contentlist: {},
				options: {
					code: 'https://qm.qq.com/cgi-bin/qm/qr?k=LKqML292dD2WvwQfAJXBUmvgbiB_TZWF&noverify=0', // 生成二维码的值
					size: 240, // 460代表生成的二维码的宽高均为460rpx
				},
				uploadImgUrl: ''
			}
		},
		onLoad(contentlist) {
			console.log(contentlist);
			Object.assign(this.contentlist, JSON.parse(contentlist.contentlist))
			console.log(this.contentlist);
			this.uploadImgUrl = config.uploadImgUrl
			// this.options.code = this.contentlist.code
		},
		methods: {
			notice_for_use() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '使用须知'
				})
			},
		}
	}
</script>
<style>
	page {
		background: #FAFAFA;
	}
</style>
<style scoped lang="scss">
	.code-box {
		width: 271rpx;
		height: 269rpx;
		margin: 0 auto;
		margin-top: 50rpx;
	}

	.conttitle {
		margin-bottom: 10rpx;

		.conttitle_title {
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #575354;
		}
	}
</style>