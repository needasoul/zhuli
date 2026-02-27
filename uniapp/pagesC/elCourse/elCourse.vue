<template>
	<view v-show="display">

		<headBg :title='"报名课程"'></headBg>
		<view class="bg-f zindex user_card mb-16 p-40">
			<view class="f-size-24 color-999 mb-28">
				{{newday | newday}} | {{godelist.data.lesson_name || ''}}
			</view>
			<view class="d-flex " style="margin-bottom: 26rpx;">
				<u-icon name="account-fill" size="20" color="#64BAFD"></u-icon>
				<view class="f-size-26 f-600 color-34">
					<text class="pl-18 pr-8">{{godelist.data.lx_name}}</text>
					<text>{{godelist.data.lx_tel}}</text>
				</view>
			</view>
			<view class="d-flex ">
				<u-icon name="map-fill" size="18" color="#64BAFD"></u-icon>
				<view class="f-size-26 f-600 color-34">
					<text class="pl-16">{{godelist.data.venue_address}}</text>
				</view>
			</view>
			<image class="bg_user_img" src="../static/Cicon4.png" mode=""></image>
		</view>
		<!-- 体育晚托班信息 -->
		<view class="class_card  bg-f zindex">
			<view class="message-box d-flex p-40  ">
				<view class="message-img ">
					<image :src="godelist.data.image" mode="aspectFill" class="br-8"></image>
				</view>
				<view class="ml-24 flexColumn">
					<view class="f-size-26 me-text-beyond">
						{{godelist.data.lesson_name || ''}}
					</view>
					<view class="f-size-24 f-500 color-6">
						{{godelist.data.price}}元/{{godelist.data.days}}天/{{godelist.data.type}}
					</view>
					<view class="f-size-22 f-400 color-28 ">
						¥{{godelist.data.price}}
					</view>
				</view>
			</view>
		</view>
		<view class="mt-16 pt-20 pl-32 pr-30 bg-f pb-22 zjCard">
			<view class="d-flex j-sb a-center mb-20">
				<view class="f-size-26 f-600 color-28 ">总价</view>
				<view class="f-size-26 f-400 color-28">¥{{godelist.price}}</view>
			</view>
			<view class="zjCard_text flexc">
				<view class="quan">
					i
				</view>
				<view class="">
					提前24小时可退款，查看<span @click="showModal">退款规则</span>
				</view>
			</view>
		</view>
		<!-- 支付 -->
		<view class="btn-box bg-f">
			<view class="">
				<view class="">
					<text class="f-400 color-22 mr-14" style="font-size: 30rpx;">总计金额</text>
					<text class="f-500 color-22" style="font-size: 40rpx;">¥{{godelist.price}}</text>
				</view>
				<view class="btn color-f txt-center" @click="promptly()">
					立即支付
				</view>
			</view>
		</view>

		<!-- 支付 -->
		<paypopup ref='paypopup' :show='payshow' :pageurl="'/pagesA/courseOrder/courseOrder'" @close='payshow=false'
			:orderNoObj='orderNoObj' @payChannel='payChannel'></paypopup>
	</view>
</template>

<script>
	import {
		orderbefore,
		ordercreate,
		orderpay,
		usergetUserInfo,
		Bind_to_wechat,
		getopenid
	} from "@/api/comm.js"
	import
	news
	from "@/utils/wxApi.js"
	export default {
		data() {
			return {
				payshow: false,
				orderNoObj: {},
				parameter: {},
				godelist: {},
				checked: false,
				show: false,
				display: false,
				openid: '',
				newday: +new Date(),
				ispay: true
			}
		},
		onShow() {
			this.$refs.paypopup.getUser()
		},
		onLoad(e) {
			Object.assign(this.parameter, e)
			this.orderbeforeApi()
			let openid = uni.getStorageSync('openid')
			if (openid) {
				this.openid = openid
			} else {
				this.getopenidApi()
			}
		},
		methods: {
			payChannel(e) {
				console.log('ee', e);
				this.orderNoObj.payChannel = e
			},
			async getopenidApi() {
				uni.login({
					success: async (res) => {
						console.log('res', res);
						let res1 = await getopenid({
							code: res.code
						})
						if (res1.code == 1) {
							this.openid = res1.data.openid
						} else {
							this.showToast(res.msg)
						}
					}
				})
			},
			checkboxChange(event) {
				this.checked = event.detail
			},
			showModal() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '退款规则'
				})
			},

			async orderbeforeApi() {
				let data = await orderbefore(this.parameter)
				if (data.code == 1) {
					this.display = true
					this.godelist = data.data
					console.log(this.godelist);
				} else {
					uni.showToast({
						title: data.mgs,
						icon: "error"
					})
				}
			},
			async promptly() {
				let that = this
				if (!this.ispay) {
					return this.showToast('请勿重复点击')
				}
				this.ispay = false
				setTimeout(() => {
					this.ispay = true
				}, 1500)
				this.parameter.payChannel = 1
				this.orderNoObj = this.parameter
				this.payshow = true
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
	.head {
		width: 750rpx;
		height: 638rpx;
		background: linear-gradient(180deg, #49AFFF 0%, rgba(206, 227, 243, 0) 99%);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.nav {
		margin: 82rpx 0 50rpx;
	}

	.user_card {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0 auto;
		position: relative;

		.bg_user_img {
			width: 366rpx;
			height: 236rpx;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 0;
		}
	}

	.class_card {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 30rpx auto;
	}

	.zjCard {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0rpx auto;

		.zjCard_text {
			font-size: 22rpx;
			color: #222222;

			span {
				color: #64BAFD;
			}

			.quan {
				margin-top: 8rpx;
				width: 24rpx;
				height: 24rpx;
				text-align: center;
				line-height: 24rpx;
				border: 2rpx solid #D81E06;
				border-radius: 50%;
				font-size: 18rpx;
				color: #D81E06;
				margin-right: 10rpx;
			}
		}
	}

	.imgBox {
		width: 100%;

		image {
			width: 100%;
			height: 10rpx;
		}
	}

	.message-box {

		.message-img {
			width: 130rpx;
			height: 130rpx;

			image {
				width: 100%;
				height: 100%;
				vertical-align: top;
			}
		}
	}

	.btn-box {
		width: 100%;
		border-radius: 28rpx 28rpx 0rpx 0rpx;
		padding: 28rpx 30rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;

		.btn {
			line-height: 84rpx;
			width: 690rpx;
			height: 84rpx;
			background: #64BAFD;
			border-radius: 22rpx 22rpx 22rpx 22rpx;
			margin-top: 30rpx;
		}
	}
</style>