<template>
	<view>
		<view class="head">
			<image class="head_bg" src="../../static/newsimg/icon16.png" mode=""></image>
			<!-- #ifdef MP-WEIXIN -->
			<view class="head_back zindex" @click="routerBack">
				<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
			</view>
			<!-- #endif -->
			<view class="head_text zindex">
				<view class="mb-10 f-900 color-f" style="font-size: 80rpx;">
					热门资讯
				</view>
				<view class="f-size-24 color-f">
					精彩资讯等你来看
				</view>
			</view>
		</view>


		<view class="top-box">
			<scroll-view scroll-y="true" style="height: calc(100vh - 350rpx );" @scrolltolower='scrolltolower'>
				<view class="top-box_item flexc flexs" @tap="routerTo('/pagesC/information/information?id='+item.id)"
					v-for="item in contentlist" :key="item.id">
					<image :src="item.image" mode=""></image>
					<view class="top-box_item_left flexColumn">
						<view class="me-text-beyond-multi">
							{{item.title}}
						</view>
						<view class="">
							{{item.startdate}}
						</view>
					</view>
				</view>

				<no-data :isFinishedLoading="isFinishedLoading && contentlist.length != 0"></no-data>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import {
		getNewsList
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				contentlist: [],
				page: 1, // 分页
				isFinishedLoading: false, // 数据是否全部加载完成
			}
		},
		onLoad(e) {
			this.getNewsListApi()
		},
		methods: {

			async getNewsListApi(e) {
				let data = await getNewsList({
					page: this.page,
					limit: 10
				})
				if (data.data.rows.length) {
					if (e == 1) {
						this.contentlist.push(...data.data.rows)
					} else {
						this.contentlist = data.data.rows
					}
					if (data.data.rows.length < 10) {
						this.isFinishedLoading = true
					}
				} else {
					this.isFinishedLoading = true
				}
			},
			scrolltolower() {
				console.log('触底了');
				if (!this.isFinishedLoading) {
					console.log('触底加载');
					this.page++
					this.getNewsListApi(1)
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.top-box {
		margin: -50rpx auto 0;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		padding: 46rpx 48rpx 0;
		box-sizing: border-box;
		position: relative;
		z-index: 99;

		.top-box_item {
			margin-bottom: 50rpx;

			image {
				width: 106rpx;
				height: 120rpx;
				border-radius: 14rpx;
			}

			.top-box_item_left {
				height: 120rpx;
				width: calc(100% - 106rpx - 16rpx);

				view:nth-child(1) {
					font-size: 28rpx;
					color: #3D3D3D;
					font-weight: 600;
				}

				view:nth-child(2) {
					font-weight: 400;
					font-size: 24rpx;
					color: #666666;
				}
			}
		}
	}


	.head {
		height: 350rpx;
		position: relative;
		overflow: hidden;

		.head_bg {
			width: 750rpx;
			height: 350rpx;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			z-index: 1;
		}

		.head_text {
			text-align: center;
			position: absolute;
			left: 50%;
			top: 124rpx;
			z-index: 99;
			font-size: 80rpx;
			transform: translateX(-50%);
		}

		.head_img {
			width: 100%;
			height: 100%;
		}

		.head_back {
			margin: 100rpx 0 0 38rpx;
		}

	}
</style>