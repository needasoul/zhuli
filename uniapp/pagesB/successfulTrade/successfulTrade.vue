<template>
	<view v-show="display">
		<view class="top-box bg-f br-28 pt-38 pl-26 pr-16">
			<view class="d-flex">
				<view class="top-box-pic br-26 mr-20">
					<image :src="contentlist.jf_img" mode=""></image>
				</view>
				<view class="">
					<view class="f-size-28 f-400 color-3B mb-8">{{contentlist.goods_name}}</view>
					<view class="f-size-28 f-400 color-98 mb-10">件数:{{contentlist.goods_count}}只</view>
					<view class="f-size-28 f-400 color-28">{{contentlist.order_amount_total}}积分</view>
				</view>
			</view>
			<view class="d-flex j-sb mt-36">
				<view class="f-size-26 f-400 color-22 flex-1">
					收货信息:
				</view>
				<view class="f-size-26 f-400 color-9C text-right flex-2 ">
					{{contentlist.selfdeliverys}}
				</view>
			</view>
			<view class="d-flex j-sb mt-30">
				<view class="f-size-26 f-400 color-22 flex-1">
					订单编号:
				</view>
				<view class="f-size-26 f-400 color-9C text-right flex-2">
					{{contentlist.order_no}}
				</view>
			</view>
			<view class="d-flex j-sb mt-30 mb-30">
				<view class="f-size-26 f-400 color-22" style="width: 116rpx;">
					下单时间:
				</view>
				<view class="f-size-26 f-400 color-9C text-right" style="width:  479rpx;">
					{{contentlist.pay_time}}
				</view>
			</view>
			<view class="d-flex j-sb">
				<view class="f-size-26 f-400 color-22" style="width: 116rpx;">
					支付方式:
				</view>
				<view class="f-size-26 f-400 color-22 text-right" style="width:  479rpx;">
					积分支付
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		orderdetail
	} from "@/api/comm.js"
	import {
		toDate
	} from "@/utils/time.js"
	export default {
		data() {
			return {
				contentlist: {},
				display: false
			}
		},
		onLoad(id) {
			console.log(id.id);
			this.orderdetailApi(id.id)
		},
		methods: {
			async orderdetailApi(id) {
				let data = await orderdetail({
					id
				})
				console.log(data);
				data.data.pay_time = toDate(data.data.pay_time * 1000, 1)
				this.contentlist = data.data
				this.display = true
			}
		}
	}
</script>

<style>
	page {
		background: #F2F2F2;
	}
</style>
<style scoped lang="scss">
	.top-box {
		width: 728rpx;
		height: 573rpx;
		margin: 25rpx auto 0;

		.top-box-pic {
			width: 188rpx;
			height: 188rpx;
			border-radius: 16rpx;
			overflow: hidden;

			image {
				width: 188rpx;
				height: 188rpx;
			}
		}
	}
</style>