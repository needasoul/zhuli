<template>
	<view>
		<view class="head">
			<image class="head_bg" src="../../static/newsimg/icon14.svg" mode=""></image>
			<!-- #ifdef MP-WEIXIN -->
			<view class="zindex" style='padding:100rpx 30rpx 40rpx'>
				<navbar :title="'热门课程'"></navbar>
			</view>
			<!-- #endif -->
			<view class="zindex">
				<u-tabs :activeStyle="{ color: '#3D3D3D', fontWeight: 'bold',transform: 'scale(1.05)' }"
					:inactiveStyle="{color: '#8A8B94',transform: 'scale(1)'}"
					itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" lineColor='#EB5548'
					:list="hadrlist" keyName='venue_type' @click="tabclick"></u-tabs>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="" style="height: 250rpx;"> </view>
		<scroll-view scroll-y="true" style="height: calc(100vh - 250rpx);" @scrolltolower='scrolltolower'>
		<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="" style="height: 100rpx;"> </view>
			<scroll-view scroll-y="true" style="height: calc(100vh - 100rpx);" @scrolltolower='scrolltolower'>
			<!-- #endif -->
				<view class="bottom-box ">
					<u-empty mode="list" icon="/static/images/order_form.png" v-if="classList.length<1">
					</u-empty>
					<view class="flexw zindex">
						<view class="content-box zindex" v-for="(item, index) in classList" :key="index">
							<view class="content-item zindex"
								@tap="routerTo('/pagesC/classDetails/classDetails?id='+item.id)">
								<view class="content-item-img">
									<image :src="item.image" mode=""></image>
									<view class="content-item-left">
										年纪
									</view>
									<view class="content-item-txt">{{item.age}}</view>
								</view>
								<view class="content-item-text">
									<view class="content-item-top me-text-beyond">
										{{item.title}}
									</view>
									<view class="curr-text ">
										{{item.workrange}}
									</view>
									<view class="curr-time  flexc ">
										<image src="../../static/images/address.png" mode="aspectFill"></image>
										<view class="me-text-beyond" style="width: 90%;">
											{{item.vaddress}}
										</view>
									</view>
									<view class="money">
										<text>¥</text>
										<text>{{item.min_price}}-{{item.max_price}}</text>
									</view>
									<view class="btn-box">
										订购
									</view>
								</view>
							</view>
						</view>
						<view class="" style="margin:  0 auto;">
							<no-data :isFinishedLoading="isFinishedLoading && classList.length != 0"></no-data>
						</view>
					</view>

					<view style="height: 30rpx;">

					</view>
				</view>


			</scroll-view>

	</view>
</template>

<script>
	import {
		getClassList,
		getUserInfo,
		getclass,
		getPlaceList
	} from '@/api/comm.js'
	import {
		forEach
	} from 'lodash'
	import row from '../../uni_modules/uview-ui/libs/config/props/row'
	export default {
		data() {
			return {
				hadrlist: [{
					venue_type: "全部"
				}],
				classList: [],
				// order价格排序
				order: ' ',
				// 场馆类型
				venue: '',
				// 场馆选择
				selectvenue: '',
				option1: [{
					text: '全部场馆',
					value: 0
				}, ],
				option2: [{
						text: '默认排序',
						value: 0
					},
					{
						text: '高到低',
						value: 2
					},
					{
						text: '低到高',
						value: 1
					}
				],
				value1: 0,
				value2: 0,
				isShow: true,
				avtclass: 0,
				page: 1,
				isFinishedLoading: false, // 数据是否全部加载完成
			}
		},
		onLoad() {
			this.getClassListApi()
			this.post_getclass()
		},
		methods: {
			tabclick(e) {
				this.page = 1
				this.classList = []
				this.venue = e.id
				this.getClassListApi()
			},
			// 获取课程列表
			getClassListApi(e) {
				getClassList({
					type_id: this.venue,
					venue_id: this.selectvenue,
					order: this.order,
					page: this.page,
					limit: 10
				}).then(res => {
					if (res.code == 1) {
						if (res.data.rows.length) {
							if (e == 1) {
								this.classList.push(...res.data.rows)
							} else {
								this.classList = res.data.rows
							}
							if (res.data.rows.length < 10) {
								this.isFinishedLoading = true
							}
						} else {
							this.isFinishedLoading = true
						}
					}
				})
			},
			//课程列表
			async post_getclass() {
				let data = await getclass()
				if (data.code == 1) {
					this.hadrlist.push(...data.data)
				}
			},
			scrolltolower() {
				if (!this.isFinishedLoading) {
					this.page++
					this.getClassListApi(1)
				}
			}

		}
	}
</script>
<style>
	page {
		background: #f6f6f6;
	}
</style>
<style lang="scss" scoped>
	.head {
		height: 350rpx;
		position: fixed;
		z-index: 1;
		top: 0;

		.head_bg {
			width: 750rpx;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
		}
	}

	.vaddress {
		font-size: 28rpx;
	}

	.top-box {
		display: flex;
		height: 135rpx;
		padding-top: 27rpx;
		padding-left: 12rpx;
		overflow-x: auto;
		display: -webkit-box;
		-webkit-overflow-scrolling: touch;
		background-color: #F5F5F7;
	}

	/* 隐藏滚动条 */
	.top-box::-webkit-scrollbar {
		display: none;
	}

	.bottom-box-top-left {
		display: flex;
	}

	.bottom-box-top-right {
		display: flex;
	}



	.top-box-item {
		height: 80rpx;
		border-radius: 40rpx;
		text-align: center;
		margin-right: 18rpx;
		padding: 0 40rpx 0 40rpx;
		background: #FFFFFF;
	}

	.top-box-fz {
		font-size: 28rpx;
		font-weight: 500;
		color: #64BAFD;
		line-height: 80rpx;

	}

	.bottom-box {
		padding: 0 14rpx;
		box-sizing: border-box;

		// background-color: #fff;
		.content-box {
			width: 50%;
			padding: 0 14rpx;
			box-sizing: border-box;
			margin: 20rpx auto;
		}
	}

	.bottom-box-top {
		width: 100%;
		height: 104rpx;
		background: #FFFFFF;
		display: flex;
	}

	.bottom-box-top-qb {
		font-size: 26rpx;
		font-weight: 500;
		color: #282828;
		line-height: 104rpx;
		margin-left: 120rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #64BAFD;
		letter-spacing: 1px;
		margin-right: 10rpx;
	}

	.bottom-box-top-price {
		font-size: 26rpx;
		font-weight: 500;
		color: #282828;
		line-height: 104rpx;
		margin-left: 271rpx;
		margin-right: 10rpx;
	}

	.content-item {
		background-color: white;
		width: 100%;
		border-radius: 10rpx 10rpx 10rpx 10rpx;

		.content-item-img {
			width: 100%;
			height: 220rpx;
			border-radius: 16rpx;
			position: relative;

			image {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}

			.content-item-left {
				width: 128rpx;
				height: 42rpx;
				background: url("../../static/newsimg/icon15.png") no-repeat;
				background-size: 100% 100%;
				font-weight: 400;
				font-size: 26rpx;
				color: #FFFFFF;
				line-height: 42rpx;
				text-align: center;
				position: absolute;
				bottom: 0;
				left: 0;
				z-index: 9;
			}

			.content-item-txt {
				width: 100%;
				height: 36rpx;
				background: linear-gradient(270deg, #6A6D78 0%, #5D5D68 58%, #8A878C 92%);
				border-radius: 0rpx 0rpx 16rpx 16rpx;

				font-size: 26rpx;
				color: #fff;
				line-height: 41rpx;
				position: absolute;
				bottom: 0;
				opacity: .58;
				font-size: 20rpx;
				text-align: center;
				padding: 0 15rpx 0 70rpx;
				box-sizing: border-box;

			}
		}

		.content-item-text {
			padding: 12rpx 18rpx 18rpx;
			box-sizing: border-box;
		}

		.content-item-top {
			font-size: 26rpx;
			color: #343434;
			font-weight: 600;
		}

		.curr-text {
			font-weight: 400;
			font-size: 24rpx;
			color: #343434;
			margin: 14rpx 0 12rpx;
		}

		.curr-time {
			font-size: 24rpx;
			color: #686868;

			image {
				width: 23rpx;
				height: 25rpx;
				margin-right: 6rpx;
				margin-top: 4rpx;
			}


		}

		.money {
			color: #E1222A;
			margin: 22rpx 0 32rpx;

			text:nth-child(1) {
				font-weight: 400;
				font-size: 24rpx;
				margin-right: 4rpx;
			}

			text:nth-child(2) {
				font-weight: 700;
				font-size: 30rpx;
			}
		}

		.btn-box {
			width: 100%;
			height: 70rpx;
			background: #EC685A;
			border-radius: 384rpx;
			line-height: 70rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #FFFFFF;

		}
	}
</style>