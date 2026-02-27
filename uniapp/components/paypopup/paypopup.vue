<template>
	<view>
		<!-- @close="close" -->
		<u-popup :show="show" :round='10'>
			<view class="popBox">
				<view class="flexs flexc popBox_title">
					<view class=""></view>
					<view class="">
						请选择支付方式
					</view>
					<view class="" @click="close1">
						<u-icon name="close" size="32rpx"></u-icon>
					</view>
				</view>
				<view class="popBox_content">
					<radio-group>
						<label class="" v-for="(item, index) in pay_type" :key="item">
							<view class="flexc popBox_content_item" v-if="item=='wechat'"
								@click="userinfo.money>0?setpay(index):''">
								<view class="flexs flexc" style="width: 90%;">
									<view>微信</view>
									<radio :value="index" :checked="index === current" />
								</view>
							</view>
							<view class="flexc popBox_content_item" v-if="item=='yue' "
								@click="userinfo.money>0?setpay(index):''">
								<view class="flexs flexc" style="width: 90%;">
									<view :class="userinfo.money>0?'':'color-9'">钱包余额({{userinfo.money || '0.00'}})
									</view>
									<view class="" v-if="userinfo.money>0">
										<radio :value="index" :checked="index === current" />
									</view>
									<view class="color-9 f-size-28 flexc" v-else
										@click="routerTo('/pagesB/wallet/wallet')">
										<span>去充值</span>
										<u-icon name='arrow-right' icon='24' color='#999'></u-icon>
									</view>
								</view>
							</view>
						</label>
					</radio-group>
				</view>

				<view class="payBtn" @click="confirm">
					立即付款
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		orderpay,
		usergetUserInfo,
		getopenid,
		ordercreate
	} from "@/api/comm.js"
	import wxparApi from '@/utils/wxApi.js'
	export default {
		props: ['show', 'curpage', 'orderNoObj', 'pageurl', 'navidx', 'order', 'sign', 'orderNo'],
		name: "paypopup",
		data() {
			return {
				pay_type: ['wechat', 'yue'],
				current: 0,
				userinfo: uni.getStorageSync('user'),
				common: uni.getStorageSync('public'),
				isqb: uni.getStorageSync('public').isqb,
				openid: uni.getStorageSync('openid') || ''
			};
		},
		watch: {
			order(val) {
				if (val) {
					this.payorder()
				}
			}
		},
		created() {
			let openid = uni.getStorageSync('openid')
			let token = uni.getStorageSync('userinfo').token
			if (openid) {
				this.openid = openid
			} else {
				if (token) {
					this.getopenidApi()
				}
			}
		},

		methods: {
			async getopenidApi() {
				uni.login({
					success: async (res) => {
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
			async getUser() {
				let user = await usergetUserInfo()
				if (user.code == 1) {
					uni.setStorageSync('user', user.data)
					this.userinfo = user.data
				}
			},
			close1() {
				this.$emit('close')
			},
			close() {
				if (this.navidx == 1) {

				} else if (this.navidx == 2) {

				} else {
					uni.reLaunch({
						url: this.pageurl
					})
				}
				this.$emit('close')
			},
			confirm() {
				if (this.sign) {
					this.$emit('confirm')
				} else {
					if (this.orderNo) {
						this.payorder(this.orderNo)
					} else {
						this.createOrder()
					}
				}
			},

			setpay(index) {
				this.current = index
				if (this.current == 0) {
					this.$emit('payChannel', 1)
				} else {
					this.$emit('payChannel', 2)
				}
			},
			async createOrder() {
				let res1 = await ordercreate(this.orderNoObj)
				if (res1.code == 1) {
					this.payorder(res1.data.orderNo)
				} else {
					this.showToast(res1.msg)
				}
			},
			async payorder(orderNo) {
				if (this.current == 0) {
					let res = await orderpay({
						orderNo: orderNo,
						openid: this.openid,
						payChannel: 1
					})
					if (res.code == 1) {
						let arr = []
						let configuration = uni.getStorageSync('configuration')
						configuration.message.forEach(item => {
							if (item.message_type == 1) {
								arr.push(item.masterplate)
							}
						})
						// #ifdef H5
						this.mpwxparApi(res.data, this.pageurl, this.navidx)
						// #endif
						// #ifdef MP-WEIXIN 
						this.wxparApi(res.data, this.pageurl, arr, '', this.navidx)
						// #endif
						this.getUser()
						this.$emit('close')
					} else {
						this.showToast(res.msg)
					}
				} else {
					let res = await orderpay({
						orderNo: orderNo,
						openid: this.openid,
						payChannel: 2
					})
					if (res.code == 1) {
						let arr = []
						let configuration = uni.getStorageSync('configuration')
						configuration.message.forEach(item => {
							if (item.message_type == 1) {
								arr.push(item.masterplate)
							}
						})
						// #ifdef MP-WEIXIN 
						this.subscription(arr, this.pageurl, this.navidx)
						// #endif
						// #ifdef H5
						setTimeout(() => {
							uni.reLaunch({
								url: this.pageurl
							})
						}, 1500)
						// #endif
						this.getUser()
						this.$emit('close')
					} else {
						this.showToast(res.msg)
						setTimeout(() => {
							uni.reLaunch({
								url: this.pageurl
							})
						}, 1500)
					}
				}




			}

		}
	}
</script>

<style lang="less">
	.popBox {
		// height: 500rpx;
		padding: 32rpx;
		box-sizing: border-box;
		position: relative;
		width: 100%;

		.popBox_title {
			font-size: 32rpx;
			color: #000;
			width: 100%;
			margin-bottom: 36rpx;
		}

		.popBox_content {

			.popBox_content_item {
				padding: 24rpx 0;
				box-sizing: border-box;
				font-size: 36rpx;
				width: 750rpx;
			}
		}
	}

	.payBtn {
		width: 623rpx;
		height: 80rpx;
		background: #157FE7;
		border-radius: 41rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 30rpx;
		margin: 40rpx auto 0;
		color: #fff;
	}
</style>