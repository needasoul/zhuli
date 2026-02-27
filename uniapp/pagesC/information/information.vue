<template>
	<view class="box" v-show="display">
		<view class="box_hadr">
			<view class="titleall">
				{{contentlist.title}}
			</view>
			<view class="flexc flexs">
				<view class="time">
					发布时间：{{contentlist.startdate}}
				</view>
				<view class="flexc">
					<view class="time flexc mr-18 ">
						<view class="">
							<image class="img1" src="../static/eye.png" mode="aspectFill"></image>
						</view>
						<view class="ml-10 time_text">{{contentlist.view_counts}}</view>
					</view>
					<view class="time flexc ">
						<view class="">
							<image class="img2" src="../static/dainz.png" mode="aspectFill"></image>
						</view>
						<view class="ml-10 time_text">{{contentlist.view_counts}}</view>
					</view>
				</view>

			</view>

			<view class="conten" v-html="contentlist.content">

			</view>

			<view class="like" @click="infodzApi">
				<image v-if="contentlist.dz_status==0" src="../static/Cicon1.svg" mode=""></image>
				<image v-else src="../static/Cicon2.svg" mode=""></image>
			</view>
			<view class="plTitle">
				参加评论
			</view>
			<view class="plipt flexc flexs">
				<input v-model="plVal" maxlength="140" type="text" placeholder="快来评论吧" />
				<view class="plleg">
					{{plVal.length}}/140
				</view>
				<view class="plBtn" :style="{background:plVal.length>0?'#64BAFD':'',color:plVal.length>0?'#fff':''}"
					@click="infocommentApi">
					提交评论
				</view>
			</view>
			<view class="pl_group">
				<empty v-if="contentlist.comment.length<1"></empty>
				<view class="pl_group_item flexs flexc" v-for="(item,index
				) in contentlist.comment" :key="index">
					<image :src="item.avatar" mode=""></image>
					<view class="pl_group_item_right">
						<view class="pl_group_item_title">
							{{item.username || ''}}
						</view>
						<view class="flex flexs pl_group_item_txt">
							<view class="pl_group_item_txt_1">
								{{item.content}}
							</view>
							<view class="">
								{{item.updatetime}}
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		infordetail,
		infodz,
		infocomment
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				contentlist: {},
				display: false,
				plVal: ''
			}
		},
		onLoad(e) {
			this.infordetailApi(e.id)
		},
		onShareAppMessage(el) {
			return {
				title: this.contentlist.title,
				imageUrl: this.contentlist.image,
				path: `/pagesC/information/information?id=${this.contentlist.id}`
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: this.contentlist.title,
				imageUrl: this.contentlist.image,
				path: `/pagesC/information/information?id=${this.contentlist.id}`
			}
		},
		methods: {
			async infocommentApi() {
				let res = await infocomment({
					id: this.contentlist.id,
					content: this.plVal
				})
				if (res.code == 1) {
					this.plVal = ''
				}
				this.showToast(res.msg)
			},
			async infodzApi(id) {
				let res = await infodz({
					id: this.contentlist.id
				})
				if (res.code == 1) {
					this.infordetailApi(this.contentlist.id)
				}
			},
			async infordetailApi(id) {
				let data = await infordetail({
					id: id
				})
				console.log(data);
				this.contentlist = data.data
				this.display = true
				uni.setNavigationBarTitle({
					title: this.contentlist.title
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		background-color: #fff !important;
		min-height: 100vh;
	}

	.box_hadr {
		margin: 20rpx auto;
		position: relative;

		.titleall {
			margin-bottom: 26rpx;
			font-weight: 700;
			font-size: 36rpx;
			color: #3D3D3D;
		}



		.time {
			.img1 {
				width: 32rpx;
				height: 22rpx;
			}

			.img2 {
				width: 22rpx;
				height: 22rpx;
			}

			font-weight: 400;
			color: #909090;

			.time_text {
				font-size: 26rpx;
			}
		}


		.conten {
			margin-top: 80rpx;
		}
	}

	.like {
		text-align: center;

		image {
			width: 100rpx;
			height: 100rpx;
		}

	}

	.plTitle {
		font-weight: 700;
		font-size: 32rpx;
		color: #3D3D3D;
		margin: 60rpx 0 34rpx;
	}

	.plipt {
		padding: 20rpx 28rpx;
		box-sizing: border-box;
		width: 690rpx;
		height: 92rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		border: 2rpx solid #D8D8D8;

		.plleg {
			font-size: 28rpx;
			color: #999999;
			line-height: 50rpx;
		}

		input {
			height: 100%;
			padding: 2rpx 0 0;
			box-sizing: border-box;
		}

		.plBtn {
			width: 156rpx;
			height: 50rpx;
			background: #F4F4F4;
			border-radius: 1562rpx;
			font-size: 24rpx;
			color: #999999;
			text-align: center;
			line-height: 50rpx;
		}
	}

	.pl_group {
		width: 100%;

		.pl_group_item {
			margin-top: 36rpx;

			image {
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
			}

			.pl_group_item_right {
				width: 600rpx;

				.pl_group_item_title {
					font-size: 28rpx;
					color: #3D3D3D;
					font-weight: 600;
					margin: 0 0 10rpx;
				}

				.pl_group_item_txt {
					font-size: 24rpx;
					color: #999999;
				}

				.pl_group_item_txt_1 {
					width: 450rpx;
					word-wrap: wrap;
					word-break: break-all;
				}
			}
		}
	}
</style>