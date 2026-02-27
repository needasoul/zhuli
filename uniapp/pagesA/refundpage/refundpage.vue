<template>
	<view>
		<view class="box">
			<view class="flexc flexs price">
				<view class="box_hadr">
					<span class="tk">*</span> 预计退款金额
				</view>
				<view class="box_hadr">
					¥{{price}}
				</view>
			</view>
			<view class="box_hadr tk_1">
				退款理由 </view>
			<view class="textall">
				<textarea v-model="Text" style="width: 100%;" maxlength="200"
					placeholder="补充说明,有利于商家更好的处理售后问题"></textarea>
				<view class="count">
					{{Text.length}}/200
				</view>
			</view>
			<view class="box_hadr tk_2">
				退款规则
			</view>
			<view class=" tk_3">
				除天气原因及不可抗力影响，订单生效前24小时内不做
				退款处理
			</view>

		</view>
		<view class="bottom" @click="submit">
			提交申请
		</view>
	</view>
</template>

<script>
	import {
		orderrefund
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				Text: '',
				id: '',
				price: 0,
				yd_id: ''
			};
		},
		onLoad(id) {
			console.log(id);
			this.id = id.id
			this.price = id.price
			if (id.yd_id) {
				this.yd_id = id.yd_id
			}

		},
		methods: {
			submit() {
				orderrefund({
					id: this.id,
					desc: this.Text,
					yd_id: this.yd_id
				}).then(res => {
					console.log(res);
					if (res.code == 1) {
						uni.navigateBack()
					}
					this.showToast(res.msg)
				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 30rpx auto;
		box-sizing: border-box;
		padding: 34rpx;

		.price {
			padding-bottom: 24rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #E4E7ED;
		}

		.tk {
			font-size: 24rpx;
			color: #FA3B3A;
			margin-right: 10rpx;
		}

		.tk_1 {
			margin: 38rpx 0 20rpx;
		}

		.tk_2 {
			margin: 22rpx 0;
		}

		.tk_3 {
			font-size: 26rpx;
			color: #666666;
		}

		.box_hadr {
			font-weight: 700;
			font-size: 28rpx;
			color: #232323;
		}

		.box_hadr_refund {
			margin: 0 auto;
			margin-top: 30rpx;

			.box_hadr_refund_content {
				width: 100%;
				height: 57rpx;
				background: #EEF1F6;
				border-radius: 29rpx;
				font-size: 22rpx;
				font-weight: 400;
				color: #282828;
				line-height: 57rpx;
				text-align: center;
				margin-bottom: 10rpx;
			}
		}

		.textall {
			height: 311rpx;
			border-radius: 14rpx;
			background: #FAFAFA;
			margin-top: 30rpx;
			position: relative;
			padding: 32rpx;
			box-sizing: border-box;

			.count {
				position: absolute;
				bottom: 20rpx;
				right: 40rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #CCCCCC;
			}
		}


	}

	.bottom {
		width: 690rpx;
		height: 84rpx;
		background: #64BAFD;
		border-radius: 22rpx 22rpx 22rpx 22rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 84rpx;
		text-align: center;
		margin: 44rpx auto;

	}
</style>