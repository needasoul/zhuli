<template>
	<view v-show="display">
		<headBg :title='"订单详情"'></headBg>
		<view class="zindex status_card pl-48  flexc ">
			<view class="mr-24 ">
				<image class="status_card_time" src="../static/icon10.svg" mode=""></image>
			</view>
			<!--  -->
			<view class="pay" v-if="contentlist.status=='1'&& contentlist.timestamp > 0  && ismerchant != 1">
				订单待付款
				<view class="" style="margin-top: 14rpx;">
					<u-count-down @finish="finish" format="mm:ss" :time="contentlist.timestamp"></u-count-down>
				</view>
			</view>
			<text v-if="contentlist.status=='1' && ismerchant == 1">订单待付款</text>
			<text v-if="contentlist.status=='2'">订单待核销</text>
			<text v-if="contentlist.status=='3'">{{contentlist.write?'订单已核销':'订单未核销完'}} </text>
			<text v-if="contentlist.status=='4'">{{contentlist.bf_refund==0?'订单待退款':'部分退款'}} </text>
			<text v-if="contentlist.status==5">订单已取消</text>
			<text v-if="contentlist.status==1 && contentlist.timestamp <= 0 && ismerchant != 1">
				订单已取消
			</text>
		</view>
		<!-- 用户 -->
		<view class="user_card zindex">
			<view class="color-999 f-size-24 mb-28">
				{{contentlist.fixed_date || ''}} | {{contentlist.venue_name || ''}}
			</view>
			<view class="d-flex mb-26">
				<u-icon name="account-fill" size="20" color="#64BAFD"></u-icon>
				<view class="f-size-26 f-600 color-34">
					<text class="pl-18 pr-8">{{contentlist.lx_name}}</text>
					<text>{{contentlist.lx_tel}}</text>
				</view>
			</view>
			<view class="flex flexs flexc">
				<view class="flex mb-34">
					<view class="">
						<u-icon name="map-fill" size="18" color="#64BAFD"></u-icon>
					</view>
					<view class="f-size-26 f-600 color-34" style="width: 500rpx;">
						<text class="pl-16">{{contentlist.address}}</text>
					</view>
				</view>
				<view class="two-box-map-km-box " @click="location()">
					<image src="@/static/images/map1.png" mode=""></image>
					<view class="f-size-24 ">
						地图
					</view>
				</view>
			</view>



			<view class="time_box flexc flexs flexw">
				<view class="time_box_item" :class="timeidx==''?'timeActive':''" @click="setidx(item,1)">
					全部
				</view>
				<view class="time_box_item" v-for="(item,index) in contentlist.areaDetail" :key="item.id"
					:class="timeidx==item.id?'timeActive':''" @click="setidx(item)">
					{{item.start_times}}-{{item.end_times}}
				</view>
			</view>

			<view class="vote">
				<view class="vote-list " v-for="(item,index) in areaList" :key="item.id">
					<view class="flexs mt-28">
						<view class="vote-list_left">
							<image class="vote-list_img" :src="contentlist.venue_image" mode=""></image>
						</view>
						<view class="vote-list_right">
							<view class="" style="height: 130rpx;">
								<view class="name">
									<view class="name-left">
										{{item.area_id}}
									</view>
									<view class="name-right">
										<view class="money">
											￥{{item.goods_price}}
										</view>
									</view>
								</view>
								<view class="time">
									<view class="time-c">
										<text style="margin-right: 16rpx;">{{item.fixed_date}}</text>
										<text>{{item.start_times}}-{{item.end_times}}</text>
									</view>

								</view>
							</view>

							<view class="button"
								v-if="ismerchant != 1 && item.status==0 && (contentlist.status=='2' || contentlist.status=='3' || contentlist.status=='4')">
								<view class=" voucher" @click="Venue_admission(item)"
									v-if="item.refund==0 && item.write==0">
									入场凭证
								</view>
								<view class="refund" @click="refund(1,item)" v-if="item.refund==0 && item.write==0">
									退款
								</view>
							</view>
						</view>
					</view>
					<view class="user_card_bom f-size-24 color-34 mt-28" v-if="contentlist.status!=='1' "
						style="color: #999;">
						<span class="mr-18" v-if="item.status==0">未核销</span>
						<span class="mr-18" v-if="item.status==1">已核销</span>
						<span class="mr-18" v-if="item.status==2">退款中</span>
						<span class="mr-18" v-if="item.status==3">已退款</span>
						<span class="mr-18" v-if="item.status==4">已过期</span>

						<span v-if="item.status==0">{{item.fixed_date}} {{item.end_times}}到期</span>
					</view>
				</view>

				<!-- 	<view class="see-more" v-if="areaDetail.length">
					<text class="text" @click="seeMore">{{isExpand?'收起':'查看更多'}}</text>
				</view>
				<view class="mask" v-if="!isExpand && areaDetail.length">

				</view> -->

			</view>


		</view>
		<!-- 订单信息 -->
		<view class="order-info bg-f">
			<view class="title">
				订单详情
			</view>
			<view class="same-style number">
				订单编号：{{contentlist.order_no}}
			</view>
			<view class="same-style money">
				订单金额：{{contentlist.order_amount_total}}元
			</view>
			<view class="same-style pay-time" v-if="contentlist.pay_time">
				支付时间：{{contentlist.pay_time | Format}}
			</view>
			<view class="same-style application-time">
				订单时间：{{contentlist.createtime}}
			</view>
		</view>
		<view class="flexs ml-30 mr-30 mt-30">
			<view class="">

			</view>
			<view class="tg_btn" @click="refund(2)" v-if="contentlist.status==2">
				申请全部退款
			</view>
			<view class="tg_btn" v-if="contentlist.status==1 && contentlist.timestamp > 0"
				@click="cancel(contentlist.order_no)">
				取消订单
			</view>
			<view class="tg_btn" v-if="contentlist.status==1 && contentlist.timestamp > 0"
				@click="promptly(contentlist.order_no)">
				立即付款
			</view>
		</view>


		<view class="" style="height: 200rpx;"></view>

	</view>


</template>

<script>
	import funTime from '@/utils/time.js'
	import {
		orderdetail,
		orderpay,
		hx_code,
		Bind_to_wechat,
		usergetUserInfo,
		getopenid,
		cancel
	} from "@/api/comm.js"
	import
	news
	from "@/utils/wxApi.js"
	export default {
		data() {
			return {
				contentlist: {},
				display: false,
				detailid: null,
				residueAreaDetail: [], // 长度大于三时剩余的票
				areaDetail: [], // 前三项 
				isExpand: false, //是否展开
				ismerchant: 0,
				openid: '',
				timeidx: '',
				areaList: {},
				ispay: true
			}
		},
		onLoad(obj) {
		
			let openid = uni.getStorageSync('openid')
			if (openid) {
				this.openid = openid
			} else {
				this.getopenidApi()
			}
			this.detailid = obj.id
			this.ismerchant = obj.merchant
		},
		onHide() {},
		onShow() {
			this.orderdetailApi(this.detailid)
		},
		methods: {
			// 取消订单
			async cancel(orderNo) {
				let res = await cancel({
					orderNo
				})
				if (res.code == 1) {
					this.orderdetailApi(this.detailid)
				}
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
			location() {
				let latitude = parseFloat(this.contentlist.venue_lat)
				let longitude = parseFloat(this.contentlist.venue_lon)
				uni.openLocation({
					latitude,
					longitude,
					scale: 18
				})
			},
			setidx(item, e) {
				if (e == 1) {
					this.timeidx = ''
					this.areaList = this.contentlist.areaDetail

				} else {
					this.timeidx = item.id
					this.areaList = [item]
				}
			},

			finish() {
				this.orderdetailApi(this.detailid)
			},
			// 看更多
			seeMore() {
				// 收起
				if (this.isExpand) {
					console.log(this.areaDetail);
					this.contentlist.areaDetail = this.contentlist.areaDetail.slice(0, 3)
					this.isExpand = false
				} else {
					// 展开
					this.contentlist.areaDetail.push(...this.residueAreaDetail)
					this.isExpand = true
				}
			},
			async orderdetailApi(id) {
				let data = await orderdetail({
					id: id
				})
				if (data.code == 1) {
					console.log(data);
					this.areaList = data.data.areaDetail
					data.data.areaDetail.forEach((item) => {
						item.isTimeout = funTime.isTimeout(item.fixed_date + ' ' + item.start_times)
					})
					if (data.data.areaDetail.length > 3) {
						this.areaDetail = data.data.areaDetail.slice(0, 3)
						this.residueAreaDetail = data.data.areaDetail.slice(3)
						console.log(this.residueAreaDetail, '剩余的');
						data.data.areaDetail = this.areaDetail
						this.contentlist = data.data
						console.log('this.arealist', data.data.areaDetail);

					} else {
						this.contentlist = data.data
					}
					this.display = true
					let nowTime = Date.now()
					nowTime = Math.floor(nowTime / 1000);
					this.contentlist.timestamp = (this.contentlist.overtime - nowTime) * 1000
				}
			},
			async promptly(oder_on, price) {
				let that = this
				if (!this.ispay) {
					return this.showToast('请勿重复点击')
				}
				this.ispay = false
				setTimeout(() => {
					this.ispay = true
				}, 2000)
				if (!this.openid) {
					this.showToast('没有openid,请联系管理员')
				} else {
					orderpay({
						orderNo: oder_on,
						openid: this.openid
					}).then(res => {
						if (res.code == 1) {
							let arr = []
							let configuration = uni.getStorageSync('configuration')
							configuration.message.forEach(item => {
								if (item.message_type == 1) {
									arr.push(item.masterplate)
								}
							})
							// #ifdef H5
							that.mpwxparApi(res.data, '', 2)
							// #endif
							// #ifdef MP-WEIXIN
							that.wxparApi(res.data, '', arr, '', 2)
							// #endif
						} else {
							this.showToast(res.msg)
						}
					})
				}
			},
			Venue_admission(item) {
				if (item.write == 1) {
					uni.showToast({
						title: '该凭证您已核销'
					})
					return
				}
				uni.navigateTo({
					url: '/pagesA/venueVoucher/venueVoucher?contentlist=' + JSON.stringify(item)
				})
			},
			refund(e, item) {
				// 部分退款
				if (e == 1) {
					uni.navigateTo({
						url: '/pagesA/refundpage/refundpage?id=' + this.contentlist.id + "&price=" + item
							.goods_price +
							"&yd_id=" + item.id
					})
				} else {
					uni.navigateTo({
						url: '/pagesA/refundpage/refundpage?id=' + this.contentlist.id + "&price=" + this
							.contentlist.order_amount_total
					})
				}

			},
			soscode() {
				uni.scanCode({
					async success(e) {
						console.log(e.result, '扫码成功');
						let data = await hx_code({
							order_no: e.result
						})
						if (data.code == 1) {
							uni.showToast({
								icon: 'success',
								title: data.msg
							})
						} else {
							uni.showToast({
								icon: 'error',
								title: data.msg
							})
						}
					},
					fail(err) {
						uni.showToast({
							icon: 'error',
							title: err
						})
					}
				})
			}
		}
	}
</script>

<style>
	page {
		/* background-color: #FAFAFA; */
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

	.two-box-map-km-box {
		font-size: 24rpx;
		color: #121315;
		text-align: center;
		margin-top: -12rpx;

		image {
			width: 35rpx;
			height: 35rpx;
		}
	}

	.nav {
		margin: 82rpx 0 50rpx;
	}

	.imgBox {
		width: 100%;

		image {
			width: 100%;
			height: 10rpx;
		}
	}

	.tg_btn {
		width: 282rpx;
		height: 88rpx;
		background: #64BAFD;
		border-radius: 580rpx 580rpx 580rpx 580rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 88rpx;
		text-align: center;
	}


	.status_card {
		color: #FFFFFF;
		margin: 0 0 34rpx 44rpx;

		.status_card_time {
			width: 66rpx;
			height: 66rpx;
		}

		text {
			font-size: 48rpx;
		}
	}

	.pay {
		display: flex;
		color: #FFFFFF;
		font-size: 44rpx;
		align-items: center;
		padding-bottom: 10rpx;
		box-sizing: border-box;

		/deep/.u-count-down__text {
			margin-left: 10rpx;
			color: #fff !important;
			font-size: 24rpx !important;
			line-height: 24rpx !important;
		}
	}

	.middle-box {
		width: 100%;
		padding: 26rpx 0;

		.middle-box-top {
			height: 64rpx;
			margin: 0 64rpx;
		}

		.middle-box-bottom {
			margin: 18rpx 64rpx 0;

			.use {
				font-size: 22rpx;
				font-weight: 400;
				color: #64BAFD;
				line-height: 30rpx;
				letter-spacing: 1px;
			}

			.code {
				width: 148rpx;
				height: 54rpx;
				border-radius: 28rpx;
				border: 1rpx solid #3CBDFF;
				font-size: 22rpx;
				font-weight: 400;
				color: #64BAFD;
				line-height: 54rpx;
				letter-spacing: 1px;
				text-align: center;
			}
		}
	}

	.price-box {
		width: 100%;
		height: 169rpx;
		background: #FFFFFF;
	}

	.location {

		.location_bottom {
			width: 231rpx;
			height: 79rpx;
			border-radius: 40rpx;
			border: 2rpx solid #3CBDFF;
			margin: 0 auto;
			text-align: center;
			line-height: 79rpx;
			margin-top: 50rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #64BAFD;
		}
	}

	// 场馆类型
	.vote {
		position: relative;

		.vote-list {
			.vote-list_img {
				width: 130rpx;
				height: 130rpx;
				border-radius: 12rpx;
			}

			.user_card_bom {
				padding: 28rpx 0 0;
				box-sizing: border-box;
				border-top: 1rpx dotted #D8D8D8;
			}

			.vote-list_right {
				width: calc(100% - 150rpx);
			}

			.name {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.name-left {
					height: 41rpx;

					font-weight: 700;
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 41rpx;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.name-right {}
			}

			.type {
				height: 41rpx;

				font-weight: 400;
				font-size: 24rpx;
				color: #9E9E9E;
				line-height: 41rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin-top: 7rpx;
				margin-bottom: 7rpx;
			}

			.time {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.time-c {
					height: 41rpx;

					font-weight: 400;
					font-size: 24rpx;
					color: #9E9E9E;
					line-height: 41rpx;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.money {
					height: 41rpx;
					font-weight: 700;
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 41rpx;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}
			}

			.button {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin-top: 32rpx;

				.voucher {
					width: 164rpx;
					height: 62rpx;
					background: #64BAFD;
					border-radius: 534rpx 534rpx 534rpx 534rpx;
					font-weight: 700;
					font-size: 24rpx;
					color: #FFFFFF;
					line-height: 62rpx;
					text-align: center;
					margin-right: 24rpx;
				}

				.refund {
					width: 164rpx;
					height: 62rpx;
					background: #E4E4E4;
					border-radius: 534rpx 534rpx 534rpx 534rpx;
					font-weight: 700;
					font-size: 24rpx;
					color: #999999;
					line-height: 62rpx;
					text-align: center;
				}
			}
		}

		.see-more {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;

			.text {
				font-weight: 400;
				font-size: 24rpx;
				color: #64BAFD;
				line-height: 41rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.text.act {
				color: #64BAFD;
			}
		}

		.mask {
			height: 200rpx;
			width: 100%;
			position: absolute;
			bottom: 40rpx;
			left: 0;
			background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0.2) 0%, #FFFFFF 80%);
			// opacity: 0.5;
		}
	}

	// 总价
	.total-price {
		margin-left: 22rpx;
		width: 706rpx;
		// height: 189rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.03);
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		padding: 32rpx 20rpx 26rpx 20rpx;

		.total-price-t {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: 400;
			font-size: 32rpx;
			color: #3D3D3D;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}

		.total-price-c {
			width: 675rpx;
			height: 1rpx;
			// border: 1rpx solid #D8D8D8;
			background-color: #D8D8D8;
			opacity: .5;
			margin: 25rpx 0 25rpx 0;
		}

		.total-price-b {
			margin-top: 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.text {
				height: 41rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #3D3D3D;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin-right: 17rpx;
				line-height: 41rpx;
			}

			.num {
				height: 41rpx;
				font-weight: 700;
				font-size: 28rpx;
				color: #3D3D3D;
				text-align: left;
				font-style: normal;
				text-transform: none;
				line-height: 41rpx;
			}
		}
	}

	.order-info {
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		padding: 30rpx 36rpx;
		box-sizing: border-box;
		width: 702rpx;
		margin: 20rpx auto;

		.title {
			height: 41rpx;
			font-weight: 700;
			font-size: 26rpx;
			color: #3D3D3D;
			line-height: 41rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
			margin-bottom: 10rpx;
		}

		.same-style {
			height: 41rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #9E9E9E;
			line-height: 41rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
			margin-bottom: 10rpx;
		}
	}

	.user_card {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0 auto;
		padding: 40rpx 40rpx;
		box-sizing: border-box;
	}

	.time_box {
		margin: 0 0 10rpx;

		.time_box_item {
			width: 284rpx;
			height: 58rpx;
			background: rgba(141, 141, 141, 0.1);
			border-radius: 972rpx 972rpx 972rpx 972rpx;
			text-align: center;
			line-height: 58rpx;
			font-size: 28rpx;
			color: #999999;
			margin: 10rpx 0;
		}
	}

	.timeActive {
		background: rgba(24, 153, 255, 0.1) !important;
		color: #29A1FF !important;
	}
</style>