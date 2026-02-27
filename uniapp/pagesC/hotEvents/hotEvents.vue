<template>
	<view>
		<u-sticky>
			<view class="head">
				<image class="head_img" src="../static/Cicon5.png" mode=""></image>
				<!-- #ifdef MP-WEIXIN -->
				<view class="head_back zindex" @click="routerBack">
					<u-icon name="arrow-left" color="#000" size="20"></u-icon>
				</view>
				<!-- #endif -->

				<view class="head_text ">
					<view class="mb-10 f-900" style="font-size: 80rpx;">
						热门活动
					</view>
					<view class="f-size-24 color-545">
						任何时间,任何地点,活动一直在
					</view>
				</view>

			</view>
			<view class="top-box">
				<view class="flexc flexs ">
					<view class="" style="width: 85%;border-radius: 10rpx;">
						<scroll-view scroll-x="true" style="width:100%;white-space: nowrap;">
							<view class="">
								<view class="scroll_item" :class="timeIdx==index?'active':''"
									v-for="(item, index) in timeList" :key="index" @click="setList(item,index)">
									<view class="mbb-6">
										{{item.week_num}}
									</view>
									<view class="f-bold">
										{{item.date}}
									</view>
								</view>
							</view>
						</scroll-view>
					</view>


					<view class="group_1" @click="calendarShow=true">
						<image src="../static/Cicon6.png" mode=""></image>
						<view class="">
							日历
						</view>
					</view>
				</view>

				<view class="" style="margin-top: 40rpx;">
					<u-tabs lineWidth="30" lineColor="#EB5548" :activeStyle="{
	    color: '#3D3D3D',
	    fontWeight: 'bold',
	    transform: 'scale(1.05)'
	}" :inactiveStyle="{color: '#8A8B94', transform: 'scale(1)'}" keyName='venue_type' :list="classvenue"
						@click="activate"></u-tabs>
				</view>

			</view>
		</u-sticky>

		<view class="middle-box">
			<u-empty :marginTop="120" mode="list" icon="/static/images/order_form.png" v-if="contentlist.length<1">
			</u-empty>
			<view class="activity-list">
				<view class="activity-list-c flexs flexc" v-for="(item,index) in contentlist" :key="index"
					@tap="routerTo('/pagesB/eventDetails/eventDetails?id='+item.id)">
					<view class="imgs-aspectFill">
						<image class="imgs-aspectFill-c" :src="item.image" mode="aspectFill"></image>
						<view class="type">
							{{item.type==1?'个人活动':'团体活动'}}
						</view>
					</view>
					<view class="bottom flexColumn">
						<view class="">
							<view class="title mb-6 me-text-beyond">
								{{item.title}}
							</view>

							<view class="time me-text-beyond-two ">
								报名时间：{{item.enrollrange}}
							</view>

							<view class="time me-text-beyond mt-6 ">
								活动地址：{{item.address}}
							</view>

						</view>

						<view class="flexc flexs mt-10">
							<view class="address">
								<image class="imgs" src="../../static/images/address.png" mode="widthFix"></image>
								<view class="address-km">
									{{item.distance / 1000}}km
								</view>
							</view>
							<view class="ckbtn">
								查看
							</view>
						</view>

					</view>


				</view>
			</view>
			<u-calendar @confirm='confirm' @close='calendarShow=false' :minDate='minDate'
				:defaultDate="defaultDateMultiple" :show="calendarShow" :maxDate="maxDate"></u-calendar>
			<no-data :isFinishedLoading="isFinishedLoading && contentlist.length != 0"></no-data>
		</view>
	</view>
</template>

<script>
	const d = new Date()
	const year = d.getFullYear()
	let month = d.getMonth() + 1
	month = month < 10 ? `0${month}` : month
	const date = d.getDate()
	import {
		getActivityList,
		getclass,
		activityTime
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				calendarShow: false,
				classvenue: [{
					id: '',
					image: '',
					venue_type: '全部'
				}],
				id: '',
				ind: 0,
				contentlist: [],
				page: 1,
				isFinishedLoading: false, // 数据是否全部加载完成
				defaultDateMultiple: [`${year}-${month}-${date}`, `${year}-${month}-${date + 1}`,
					`${year}-${month}-${date + 2}`
				],
				maxDate: `${year}-${month}-${date + 60}`,
				minDate: `${year}-${month}-${date - 60}`,
				timeList: [],
				timeIdx: 0,
				newtime: ''
			}
		},
		onLoad() {
			this.getclassApi()
			this.activityTimeApi()
			this.getActivityListApi()
		},
		methods: {
			confirm(e) {
				let a = e[0]
				let time = (new Date(a).getTime()) / 1000;
				this.page = 1
				this.contentlist = []
				this.newtime = time
				this.timeIdx = null
				this.getActivityListApi()
				this.calendarShow = false
			},
			setList(item, idx) {
				this.page = 1
				this.contentlist = []
				this.timeIdx = idx
				this.newtime = item.str
				this.getActivityListApi()
			},
			async activityTimeApi() {
				let res = await activityTime()
				if (res.code == 1) {
					this.timeList = res.data
				}
			},
			goback() {
				uni.navigateBack()
			},
			async getclassApi() {
				let data = await getclass()
				if (data.code == 1) {
					this.classvenue.push(...data.data)
				}
			},
			// 活动列表
			async getActivityListApi() {
				let data = await getActivityList({
					type: this.id,
					page: this.page,
					limit: 10,
					hd_time: this.newtime
				})
				if (data.data.rows.length) {
					this.contentlist.push(...data.data.rows)
					if (data.data.rows.length < 10) {
						this.isFinishedLoading = true
					}
				} else {
					this.isFinishedLoading = true
				}
			},
			activate(e, index) {
				this.page = 1
				this.contentlist = []
				this.isFinishedLoading = false
				this.id = e.id
				this.ind = index
				this.getActivityListApi()
			},

		},
		onReachBottom() {
			console.log('触底了');

			if (!this.isFinishedLoading) {
				console.log('触底加载');
				this.page++
				this.getActivityListApisroll()
			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f7;
	}
</style>
<style lang="scss" scoped>
	// #ifdef H5
	::v-deep .u-sticky {
		position: fixed;
		top: 0 !important;
	}

	// #endif

	.head {
		width: 100%;
		height: 350rpx;
		position: relative;

		.head_text {
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
			position: absolute;
			left: 38rpx;
			top: 100rpx;
			z-index: 99999;
		}
	}

	.top-box {
		padding: 32rpx 38rpx 0;
		box-sizing: border-box;
		margin-top: -50rpx;
		margin-bottom: 34rpx;
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		position: relative;
		z-index: 9;

		.scroll_item {
			text-align: center;
			display: inline-block;
			font-size: 24rpx;
			color: #3D3D3D;
			width: 128rpx;
			height: 88rpx;
			padding: 12rpx;
			box-sizing: border-box;
			background: #FDF6F8;
		}

		.group_1 {
			text-align: center;
			font-size: 24rpx;
			color: #3D3D3D;

			image {
				width: 40rpx;
				height: 40rpx;
			}
		}

	}

	/* 隐藏滚动条 */
	.top-box::-webkit-scrollbar {
		display: none;
	}

	.top-box-item {
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 40rpx;
		text-align: center;
		margin-right: 18rpx;
		padding: 0 40rpx 0 40rpx;
	}

	.top-box-fz {
		font-size: 28rpx;
		font-weight: 500;
		color: #64BAFD;
		line-height: 80rpx;

	}

	.middle-box {
		// background-color: #fff;
	}

	.middle-box-item {
		width: 95%;
		margin: 0 auto;
		display: flex;
		margin-top: 20rpx;
	}

	.middle-box-item-pic {
		width: 230rpx;
		height: 206rpx;
		border-radius: 24rpx;
		margin-right: 22rpx;
		position: relative;

		image {
			width: 230rpx;
			height: 206rpx;
		}

		.middle-agebox {
			width: 100rpx;
			height: 41rpx;
			background: #938B9A;
			opacity: 0.58;
			border-radius: 0rpx 24rpx 0 24rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			font-size: 20rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 41rpx;
			text-align: center;
		}
	}

	.middle-box-item-content {
		position: relative;

		.middle-box-item-content-title {
			font-size: 26rpx;
			font-weight: 600;
			color: #343434;
			margin-top: 20rpx;
		}

		.middle-box-item-content-time {
			font-size: 24rpx;
			font-weight: 400;
			color: #343434;
		}

		.middle-box-item-content-address {
			font-size: 24rpx;
			font-weight: 400;
			color: #686868;
			margin-top: 20rpx;

			image {
				width: 16rpx;
				height: 19rpx;
				margin-right: 5rpx;
			}

		}
	}

	.activity-list {
		.activity-list-c {
			width: 704rpx;
			background: white;
			border-radius: 10rpx 10rpx 10rpx 10rpx;
			margin: 0 auto 25rpx;
			padding: 20rpx;
			box-sizing: border-box;

			.imgs-aspectFill {
				position: relative;
				width: 158rpx;
				height: 142rpx;
				border-radius: 10rpx;

				.imgs-aspectFill-c {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}

				.type {
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					left: 0;
					bottom: 0;
					width: 103rpx;
					height: 37rpx;
					background: rgba(52, 52, 52, 0.32);
					border-radius: 0rpx 16rpx 0rpx 0rpx;
					font-weight: 700;
					font-size: 20rpx;
					color: #FFFFFF;
				}
			}

			.bottom {
				width: calc(100% - 158rpx - 16rpx);
				padding: 0 12rpx;
				box-sizing: border-box;

				.ckbtn {
					width: 116rpx;
					height: 48rpx;
					background: #EC685A;
					border-radius: 376rpx;
					line-height: 48rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					text-align: center;
				}

				.title {
					font-weight: 700;
					font-size: 26rpx;
					color: #343434;
				}

				.time {
					font-weight: 400;
					font-size: 22rpx;
					color: #343434;
				}

				.address {
					display: flex;
					align-items: center;

					.address-c {
						font-weight: 400;
						font-size: 22rpx;
						color: #666666;
						line-height: 22rpx;
					}

					.address-km {
						font-weight: 400;
						font-size: 22rpx;
						color: #232323;
					}


					.imgs {
						width: 28rpx;
						height: 28rpx;
						margin-right: 6rpx;
					}
				}
			}
		}
	}

	.active {
		background: #F8DDE9 !important;
		border-radius: 8rpx;
	}
</style>