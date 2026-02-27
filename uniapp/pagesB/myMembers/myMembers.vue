<template>
	<view v-show="display" class="pt-30 pl-30 pr-30">
		<image class="head_img" src="@/static/pagesB/icon4.png" mode=""></image>
		<!-- #ifdef MP-WEIXIN -->
		<view class="pt-50" style="margin-top: 4vh;">
			<navbar :title="'我的会员'" :color="'#fff'"></navbar>
		</view>
		<!-- #endif -->
		<view class="top-box">
			<image class="top-box_zi" src="@/static/pagesB/icon6.png" mode=""></image>
			<image class="top-box_bg" src="@/static/pagesB/icon7.png" mode=""></image>
			<image class="top-box_bg_1" src="@/static/pagesB/icon5.png" mode=""></image>
			<view class="top-box-top d-flex mb-30">
				<view class="top-box-pic">
					<image :src="intall.avatar" mode=""></image>
				</view>
				<view class="flexColumn pt-6 pb-6 pl-20">
					<view class="f-size-32 f-700" style="color: #EDD5A4;">
						{{intall.username}}
					</view>
					<view class="top-box-hg">
						<view class="mr-10">
							<image src="@/static/images/viphg.png" mode=""></image>
						</view>
						<view class="f-size-22">积分:{{intall.integral?intall.integral:0}}</view>
					</view>
				</view>
			</view>
			<view class="top-box-bottom d-flex">
				<view class="f-size-22 f-400 color-CABF">
					会员权益
				</view>
				<view class="top-box-huiyuan d-flex ml-14" v-for="(item,index) in intall.interests" :key="index">
					<view class="mt-8 ml-14">
						<image src="@/static/images/bao.png" mode=""></image>
					</view>
					<view class="f-size-22 f-500 color-180A ml-10 mt-6">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- middle -->
		<view class=" flexs">
			<scroll-view scroll-y="true" class="scroll_left">
				<view class="middle-box">
					<view class="middle-box-item " :class="{bgc:seleTab == ''}" @click="classorder('')">
						全部
					</view>
					<view class="middle-box-item" v-for="(item,index) in productclass" :key="index"
						@click="classorder(item.id,index)" :class="{bgc:seleTab == item.id}">
						{{item.name}}
					</view>
				</view>
			</scroll-view>

			<scroll-view class="scroll_right" scroll-y="true" @scrolltolower='scrolltolower'>
				<view class="bottom-box  d-flex flexs flexw" style="flex-wrap: wrap;">
					<view class="bottom-box-item " v-for="(item,index) in contentlist" :key="index">
						<navigator :url="'/pagesB/goodsPage/goodsPage?id='+item.id">
							<view class="item-pic">
								<image :src="item.thumbnail" mode=""></image>
							</view>
							<view class="pt-16 pl-20">
								<view class="f-size-28 f-500 color-f me-text-beyond">{{item.title}}</view>
								<view class="f-size-20 f-400 me-text-beyond color-AB mt-10 mb-16">{{item.tags}}</view>
								<view class="f-size-26 f-500 color-9922">{{item.price}}积分</view>
							</view>
						</navigator>
					</view>
					<view style="margin: 30rpx auto;">
						<u-empty mode="list" icon="/static/images/order_form.png" v-if="contentlist.length<1">
						</u-empty>
					</view>
				</view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import {
		usergetUserInfo,
		goodsgoods,
		goodsgetGoods
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				intall: {},
				productclass: [],
				contentlist: [],
				page: 1,
				display: false,
				seleTab: ''
			}
		},
		onLoad() {
			this.usergetUserInfoApi()
			this.goodsgoodsApi()
			this.classorder()
		},
		methods: {
			async usergetUserInfoApi() {
				let data = await usergetUserInfo()
				console.log(data);
				this.intall = data.data
			},
			async goodsgoodsApi() {
				let data = await goodsgoods()
				console.log(data);
				this.productclass.push(...data.data)
				this.display = true
			},
			classorder(id) {
				this.seleTab = id
				if (!id) {
					id = ''
				}
				goodsgetGoods({
					type: id,
					page: 1,
					limit: 10
				}).then(res => {
					console.log(res);
					this.contentlist = []
					this.contentlist.push(...res.data.rows)
				})
			},
			classorder_scoll(id) {
				if (!id) {
					id = ''
				}
				goodsgetGoods({
					type: id,
					page: this.page,
					limit: 10

				}).then(res => {
					console.log(res);
					this.contentlist.push(...res.data.rows)
				})
			},
			scrolltolower() {
				this.page++
				this.classorder_scoll()
			}

		},
	}
</script>
<style>
	page {
		background: #191B1F;

	}
</style>
<style scoped lang="scss">
	.scroll_left {
		// #ifdef MP-WEIXIN
		height: calc(100vh - 304rpx - 4vh - 100rpx - 100rpx);
		// #endif
		// #ifdef H5
		height: calc(100vh - 304rpx - 100rpx);
		// #endif
		width: 180rpx;
	}

	.scroll_right {
		// #ifdef MP-WEIXIN
		height: calc(100vh - 304rpx - 4vh - 100rpx - 100rpx);
		// #endif
		// #ifdef H5
		height: calc(100vh - 304rpx - 100rpx);
		// #endif

		width: calc(100% - 180rpx);
	}

	.head_img {
		width: 234rpx;
		height: 234rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.bgc {
		background-color: #F0DAC7 !important;
		color: #3D3D3D !important;
	}

	.top-box {
		width: 690rpx;
		height: 304rpx;
		background: #302F32;
		margin: 40rpx auto 28rpx;
		border-radius: 20rpx;
		padding: 42rpx;
		box-sizing: border-box;
		position: relative;

		.top-box_bg {
			width: 334rpx;
			height: 304rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}

		.top-box_bg_1 {
			width: 176rpx;
			height: 176rpx;
			position: absolute;
			right: 12rpx;
			top: 56rpx;
		}


		// 背景钻石
		.top-box_zi {
			width: 246rpx;
			height: 24rpx;
			margin-bottom: 24rpx;
		}

		.top-box-pic {
			width: 103rpx;
			height: 103rpx;

			image {
				width: 103rpx;
				height: 103rpx;
				border-radius: 50%;
			}
		}

		.top-box-hg {
			height: 40rpx;
			border-radius: 4rpx;
			display: flex;
			align-items: center;
			color: #EDD5A4;

			image {
				width: 26rpx;
				height: 26rpx;
				margin-top: 5rpx;
			}
		}
	}

	.top-box-bottom {
		display: flex;
		align-items: center;

		.top-box-huiyuan {
			width: 152rpx;
			height: 40rpx;
			background: linear-gradient(90deg, #F0DBC8 0%, #E3BF9D 100%);
			border-radius: 2rpx;

			image {
				width: 26rpx;
				height: 26rpx;
			}
		}
	}



	.middle-box {
		height: 138rpx;


		.middle-box-item {
			width: 144rpx;
			height: 68rpx;
			background: rgba(240, 218, 199, 0.1);
			text-align: center;
			line-height: 68rpx;
			border-radius: 250rpx 250rpx 250rpx 250rpx;
			font-size: 24rpx;
			color: #FFFFFF;
			margin-bottom: 30rpx;
		}
	}

	.bottom-box {
		width: 100%;

		.bottom-box-item {
			width: 247rpx;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;

			.item-pic {
				width: 100%;
				height: 248rpx;
				border-radius: 12rpx 12rpx 0rpx 0rpx;

				image {
					width: 100%;
					height: 248rpx;
					border-radius: 12rpx 12rpx 0rpx 0rpx;
				}
			}
		}
	}
</style>