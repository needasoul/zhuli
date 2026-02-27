<template>
	<view>
		<view class="d-flex j-center " v-show="display">
			<view class="">
				<view class="bg-f br-34 mt-30 pl-30 pt-26" style="width: 686rpx;height: 230rpx; margin: 0 auto; ">
					<view class="f-size-30 color-28 f-500 letter-spacing-2 ">
						{{contentlist.hd_name}}
					</view>
					<view class="f-size-22 f-400 letter-spacing-2 color-3 mt-32">
						活动时间: {{contentlist.hd_time}}
					</view>
					<view class="f-size-22 f-400 letter-spacing-2 color-3 mt-24">
						活动场馆:{{contentlist.venue_name}}
					</view>
				</view>

				<!-- 核销二维码 -->
				<view class="bg-f br-34 mt-30 pt-28 pl-30 pr-28" style="padding-bottom: 67rpx;">
					<view class="d-flex j-sb">
						<view class="f-size-30 f-500 color-28">核销二维码</view>
						<view class="f-size-24 f-400 color-A5" @click="notice_for_use">使用须知</view>
					</view>
					<view class="code-box">

						<image style="width: 100%; height: 100%;" :src="contentlist.code" mode=""></image>
					</view>
					<view class="f-size-22 f-400 color-OA txt-center">
						<view>
							{{contentlist.hx_code}}
						</view>
						<view style="margin-top: 30rpx;">
							入场前请向工作人员出示本页面
						</view>
					</view>
					<view class="d-flex j-sb a-center" style="margin-top: 64rpx;">
						<view class="f-size-26 f-400 color-OA flex-1 text-left">
							<text>类型:</text>
							<text>{{contentlist.type}}</text>
						</view>
					</view>
					<view class="d-flex j-sb a-center mt-22">
						<view class="f-size-26 f-400 color-OA flex-1 text-left ">
							<text>姓名:</text>
							<text>{{contentlist.lx_name}}</text>
						</view>
						<view class="f-size-26 f-400 color-OA flex-1 text-left">
							<text>票价:</text>
							<text style="font-size: 20rpx;">¥&nbsp;</text>
							<text>{{contentlist.order_amount_total}}元</text>
						</view>
					</view>
					<view class="d-flex j-sb a-center mt-22">
						<view class="f-size-26 f-400 color-OA flex-1 text-left">
							<text>电话:</text>
							<text>{{contentlist.lx_tel}}</text>
						</view>
						<view class="f-size-26 f-400 color-OA flex-1 text-left">
							<text>实付:</text>
							<text style="font-size: 20rpx;">¥&nbsp;</text>
							<text>{{contentlist.order_amount_total}}元</text>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		orderdetail,
		orderpay
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				contentlist: {},
				options: {
					code: 'https://qm.qq.com/cgi-bin/qm/qr?k=LKqML292dD2WvwQfAJXBUmvgbiB_TZWF&noverify=0', // 生成二维码的值
					size: 240, // 460代表生成的二维码的宽高均为460rpx
				},
				inter: null,
				id: '',
				display: false
			}
		},
		// onLoad(contentlist) {
		// 	Object.assign(this.contentlist, JSON.parse(contentlist.contentlist))
		// 	this.options.code = this.contentlist.code
		// },
		onUnload() {},
		onLoad(id) {
			this.id = id.id
			this.orderdetailApi(this.id)
		},
		onShow() {

		},
		methods: {
			notice_for_use() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '使用须知'
				})
			},
			async orderdetailApi(id) {
				let data = await orderdetail({
					id: id
				})
				this.contentlist = data.data
				this.display = true
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
		width: 240rpx;
		height: 240rpx;
		margin: 0 auto;
		margin-top: 50rpx;
	}
</style>