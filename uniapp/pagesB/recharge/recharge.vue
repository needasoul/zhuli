<template>
	<view class="box" v-if='display'>
		<view class="box_content">
			<view style="margin-top: 250rpx;" v-if="content_list.length<1">
				<u-empty mode="data" :iconSize='70' :textSize='12' text='暂无充值记录' icon=""></u-empty>
			</view>

			<view class="record_content flexc flexs" v-for="(item,index) in content_list" :key="item">
				<view class="record_content_left">
					<view style="font-size: 28rpx;">{{item.pay_channel==1?"充值":"消费"}}订单：{{item.order_no}}</view>
					<view style="font-size: 26rpx;">{{item.createtime}}</view>
				</view>
				<view class="record_content_right">
					<!-- 	<view class="" style="color: #000;font-size: 24rpx;margin-bottom: 6rpx;">
						<text v-if="item.status==1">待付款</text>
						<text v-if="item.status==2">待收货</text>
						<text v-if="item.status==3">已完成</text>
						<text v-if="item.status==4">待退款</text>
						<text v-if="item.status==5">已取消</text>
					</view> -->
					<text v-if="item.pay_channel==1">+{{item.order_amount_total}}</text>
					<text v-if="item.pay_channel==2">-{{item.order_amount_total}}</text>
				</view>
			</view>
		</view>
		<!-- </view> -->
		<u-calendar v-if="show" :show="show" :mode="mode" :rowHeight='90' :minDate='min' @close='show=false'
			@confirm="confirm"></u-calendar>
	</view>
</template>

<script>
	import {
		rechargeList,
	} from "@/api/comm.js"

	import {
		toDate
	} from "@/utils/time.js"

	export default {
		data() {
			return {
				show: false,
				mode: 'range',
				time: [],
				content_list: {},
				min: new Date(new Date().toLocaleDateString()).getTime() - 31 * 24 * 3600 * 1000,
				display: false,
				page: 1,
				curList: {}
			};
		},
		onLoad() {
			// this.point_detailedApi()
			this.getorder()
		},
		onReachBottom() {
			if (this.page < this.curList.last_page) {
				this.page++
				this.getorder(1)
			} else {
				if (this.mark) {
					this.mark = false
					uni.showToast({
						title: '已经到底部了'
					})
				}
			}
		},
		methods: {
			confirm(e) {
				this.time = []
				this.page = 1
				this.time.push(...e)
				this.show = false
				this.getorder()
			},
			async getorder(e) {
				let data = await rechargeList({
					page: this.page,

				})
				data.data.data.forEach(res => {
					res.createtime = toDate(res.createtime * 1000, 1)
				})
				this.curList = data.data
				if (e == 1) {
					this.content_list = [...this.content_list, ...data.data.data]
				} else {
					this.content_list = data.data.data
				}

				this.display = true
			},
		}
	}
</script>

<style lang="scss">
	.box_content {
		width: 702rpx;
		margin: 0 auto;

		.hade {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 0;

			.hade_left {
				text:nth-child(1) {
					font-size: 60rpx;
					font-weight: 600;
					color: #05B6F6;
				}

				text:nth-child(2) {
					font-size: 26rpx;
					font-weight: 400;
					color: #05B6F6;
				}
			}

			.hade_right {
				display: flex;
				align-items: center;

				view:nth-child(1) {
					width: 29rpx;
					height: 32rpx;
				}

				view:nth-child(2) {
					font-size: 24rpx;
					font-weight: 400;
					color: #000000;
				}
			}
		}

		.record {
			min-height: 900rpx;
			height: auto !important;
			height: 900rpx;
			background: #FFFFFF;
			padding: 30rpx 0;
			border-radius: 16rpx;

			.record_title {

				padding: 20rpx 30rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #000101;
				margin-bottom: 30rpx;

			}

		}
	}


	.record_content {
		border-radius: 20rpx;
		background-color: #fff;
		// width: 90%;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 34rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #EBEBEB;
		margin-top: 30rpx;

		.record_content_left {
			view:nth-child(1) {
				font-size: 24rpx;
				font-weight: 400;
				color: #000101;
			}

			view:nth-child(2) {
				font-size: 20rpx;
				font-weight: 400;
				color: #9A9A9A;
				margin-top: 10rpx;
			}
		}

		.record_content_right {
			font-size: 32rpx;
			font-weight: 500;
			color: #05B6F6;
			text-align: right;
		}
	}
</style>