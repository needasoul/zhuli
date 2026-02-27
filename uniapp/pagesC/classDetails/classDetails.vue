<template>
	<view style="padding-bottom: 0rpx;" v-show="display">
		<view class="top-box ">
			<image :src="contentList.content_image" mode=""></image>
		</view>
		<view class="middle-box br-20 bg-f p-34">
			<view class=" f-size-32 f-600 color-38 mb-18">
				{{contentList.title}}
			</view>
			<view class="middle-message  br-6  color-89 ">
				<view class="f-size-26  mb-22">
					<text class="f-400 mr-22">开课场馆：</text>
					<text class="f-500"> {{contentList.vname}}</text>
				</view>
				<view class="f-size-26  f-400" style="display: flex;">
					<text class="mr-24">活动时间：</text>
					<view style="flex: 1;">{{contentList.workrange}}</view>
				</view>
			</view>
		</view>
		<!-- 课程信息 -->
		<view class="course-box bg-f pt-22 pl-32 br-20 pr-34 pb-40">
			<view class="course-box_title">
				负责人
			</view>
			<view class="course-box_user flexc">
				<image :src="contentList.content_image" mode=""></image>
				<view class=" f-size-24 f-400 color-0B" style="margin-bottom: 42rpx;">
					<view class="mb-12">
						姓名：{{contentList.name}}
					</view>
					<view class="">
						电话：{{contentList.tel}}
					</view>
				</view>
			</view>
			<view class="course-box_title">
				课程详细介绍
			</view>
			<view class="f-size-24 color-0 d-flex mb-20 ">
				<view class="f-500 color-6 text-right" style="width: 140rpx;">
					训练时间：
				</view>
				<view class="f-400" style="width: 400rpx;">
					{{contentList.weekdata}}
				</view>
			</view>
			<view class="f-size-24 color-0 d-flex mb-20">
				<view class="f-500 color-6 text-right" style="width: 140rpx;">
					训练地点：
				</view>
				<view class="f-400" style="width: 400rpx;">
					{{contentList.address}}
				</view>
			</view>
			<view class="f-size-24 color-0 d-flex mb-20">
				<view class="f-500 color-6 text-right" style="width: 140rpx;">
					费用明细：
				</view>
				<view class="f-400" style="width: 400rpx;">
					<view class="">
						<text v-for="(item,index) in contentList.details_json" :key="index">
							{{item.price}}/{{item.type}}
						</text>
					</view>
					<!-- <view class="">学员满四人开班</view> -->
				</view>
			</view>
			<view class="f-size-24 color-0 d-flex mb-20">
				<view class="f-500 color-6 text-right" style="width: 140rpx;">
					备注：
				</view>
				<view class="f-400" style="width: 400rpx;">
					{{contentList.remark}}
				</view>
			</view>
		</view>

		<!-- 报名情况 -->
		<view class="course-box bg-f  br-20 ">
			<view class="course-box_title">
				报名情况
			</view>
			<view class="d-flex j-sb mb-22">
				<view class="f-size-24 " style="width: 50%;">
					<text class="f-500 color-6">课程时间：</text>
					<text class="f-400 color-0B">{{contentList.enrollment}}人</text>
				</view>
				<view class="f-size-24 " style="width: 50%;">
					<text class="f-500 color-6">已报名人数：</text>
					<text class="f-400 color-0B">{{contentList.enrollment}}人</text>
				</view>
			</view>
			<view class="d-flex j-sb mb-22">
				<view class="f-size-24" style="width: 50%;">
					<text class="f-500 color-6">年龄段：</text>
					<text class="f-400 color-0B">{{contentList.age}}</text>
				</view>
				<view class="f-size-24" style="width: 50%;">
					<!-- <text class="f-500 color-6">课程次数：</text>
					<text class="f-400 color-0B">月卡/周卡</text> -->
				</view>
			</view>


		</view>
		<!-- 报名 -->
		<view class="bottom-box bg-f pt-22 pl-32 br-20 pr-22 pb-38 ">
			<view class=" ">
				<view class=" btn_price f-500 color-EA mb-40">
					<span class="f-size-32 f-bold color-0 mr-22">总计金额</span> <span class="size12">¥</span>
					<span class="f-size-40">{{contentList.min_price}}-{{contentList.max_price}}</span>
				</view>
				<view class="btn-box br-20 bg-64 color-FB txt-center" @click="apply">
					我要报名
				</view>
			</view>
		</view>
		<view style="height: 300rpx;">

		</view>
		<!-- 弹层 -->
		<u-popup :show="show" :round="14" border-radius='30' mode="bottom" @close="close" closeIconPos="top-right">
			<view class="popup">
				<view class="popup_head flexc flexs">
					<view class=""></view>
					<view class="">类别</view>
					<view class="" @click="close">
						<u-icon name="close" size="18"></u-icon>
					</view>
				</view>
				<view class="" style="height: 80rpx;"></view>
				<view v-for="(item,index) in contentList.details_json"
					:class="['popup-box','d-flex',{'popup-box_activate':lessonType==item.type} ]" :key="index"
					@click="pitch_on(item.type,contentList.id)">
					<view class="popup-picbox br-12 mr-22">
						<image :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="popup-box_price">
						<view class="f-size-32 f-400 mt-6">
							{{item.price}}元/{{item.days}}天,{{item.type}}
						</view>
						<view class="mt-14 f-size-30 f-500 ">¥{{item.price}}</view>
					</view>
					<view class="select" v-if="lessonType==item.type">
						<image src="../static/Cicon3.png" mode=""></image>
					</view>
				</view>
				<view class="popup-btn bg-64 color-f br-40 f-size-32 f-400 color-FB txt-center"
					@click="confirm(lessonType,goodsId)">
					确定
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getClassDetails
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				show: false,
				contentList: {},
				lessonType: '',
				goodsId: '',
				display: false
			}
		},
		onLoad(e) {
			this.getClassDetailsApi(e.id)
		},
		onShareAppMessage() {
			return {
				title: this.contentList.title,
				imageUrl: this.contentList.content_image,
				path: `/pagesC/classDetails/classDetails?id=${this.contentList.id}`
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: this.contentList.title,
				imageUrl: this.contentList.content_image,
				path: `/pagesC/classDetails/classDetails?id=${this.contentList.id}`
			}
		},

		methods: {
			async getClassDetailsApi(id) {
				let data = await getClassDetails({
					id: id
				})
				if (data.code == 1) {
					this.contentList = data.data
					uni.setNavigationBarTitle({
						title: this.contentList.title
					})
					this.display = true
				}
				console.log(this.contentList);
			},
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				// console.log('close');
			},
			// 报名
			apply() {
				this.show = true
			},
			// 选择的
			pitch_on(name, id) {
				console.log(name, id);
				this.lessonType = name
				this.goodsId = id
			},
			// 确定
			confirm(name, id) {
				console.log(name, id);
				if (name) {
					uni.navigateTo({
						url: '/pagesC/elCourse/elCourse?lessonType=' + name + '&goodsId=' + id +
							'&orderType=' + 3
					})
					this.show = false
				} else {
					this.showToast('请选择课程')
				}

			}
		}
	}
</script>
<style>
	page {
		background: #FAFAFA;

	}
</style>
<style scoped lang="scss">
	.top-box {
		width: 100%;
		height: 419rpx;

		image {
			width: 100%;
			height: 419rpx;
		}
	}

	.middle-box {
		margin: 18rpx auto 36rpx;
		width: 690rpx;

	}

	.course-box {
		.course-box_title {
			font-size: 28rpx;
			color: #3D3D3D;
			font-weight: 700;
			margin-bottom: 24rpx;
		}

		.course-box_user {
			image {
				width: 100rpx;
				height: 100rpx;
				margin-right: 30rpx;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
			}
		}

		padding: 22rpx 34rpx;
		width: 690rpx;
		margin: 0rpx auto 36rpx;
	}

	.bottom-box {
		width: 100%;
		position: fixed;
		bottom: 0;

		.btn_price {
			font-size: 30rpx;
			color: #EA4952;
		}

		.btn-box {
			text-align: center;
			color: #F5F5F5;
			line-height: 84rpx;

			width: 690rpx;
			height: 84rpx;
			background: #64BAFD;
			border-radius: 22rpx 22rpx 22rpx 22rpx;
		}
	}

	.popup {
		width: 100%;
		margin: 0 auto;
		position: relative;

		.popup_head {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			padding: 30rpx 38rpx 0;
			height: 100rpx;
			border: 30rpx 30rpx 0 0;
			background: linear-gradient(180deg, #C9E9FC 0%, #fff 99%);
		}

		.popup-box_activate {
			color: #00C0FF !important;
			border: 1rpx solid #00C0FF !important;
		}

		.popup-box {
			margin: 34rpx auto 0;
			width: 90%;
			border-radius: 13rpx;
			padding: 10rpx 12rpx;
			color: #333333;
			box-sizing: border-box;
			border: 2rpx solid #F0EFEF;
			position: relative;

			.popup-picbox {
				width: 112rpx;
				height: 105rpx;
				border-radius: 12rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 12rpx;
				}
			}

		}

		.popup-btn {
			width: 690rpx;
			height: 84rpx;
			background: #64BAFD;
			border-radius: 22rpx 22rpx 22rpx 22rpx;
			margin: 38rpx auto;
			color: #fff;
			line-height: 84rpx;
		}

		.select {
			position: absolute;
			right: 0rpx;
			top: 0;

			image {
				width: 42rpx;
				height: 40rpx;
			}
		}
	}
</style>