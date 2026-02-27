<template>
	<view v-show="display">
		<!-- 场馆详情 -->
		<!-- 图 -->
		<view class="one-box">
			<u-swiper @click='swiperClick' height='622rpx' :list="contentlist.images"></u-swiper>
			<view class="back" @click="routerBack">
				<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
			</view>
		</view>
		<!-- 场馆详情 -->
		<view class="two-box">
			<view class="two_top">
				<view class="two-box-title">{{contentlist.name}}</view>
				<view class="two-box-price f-600">
					<span class="f-size-22">¥</span><span>{{contentlist.lower_price}}-{{contentlist.max_price}}</span>
					<span class="unit" style="color: #000">/小时/场</span>
				</view>
			</view>

			<view class="two-box-map mt-26 flexc flexs">
				<view class="">
					<view class="two-box-map-title mb-10">{{contentlist.address}}</view>
					<view class="two-box-map-title flexc">
						<u-icon name='map-fill' size="14" color="#999999"></u-icon>
						<span class="ml-10">距离你{{BumberPrecision(contentlist.distance/1000)}}km</span>
					</view>
				</view>
				<view class="two-box-map-km-box " @click="location()" style="margin-right: 10rpx;">
					<image src="@/static/images/map1.png" mode=""></image>
					<view class="f-size-24 ">
						地图
					</view>
				</view>
			</view>
		</view>

		<!-- 场馆类型 -->

		<!-- 场馆介绍 -->
		<view class="five-box ">
			<view class="f-size-32 f-600 color-38  ">场馆介绍</view>
			<view style=" margin: 20rpx auto 0;">
				<u-parse :content="contentlist.content"></u-parse>
			</view>
		</view>
		<!-- 我要订场 -->
		<view class="six-box  flexc flexs">
			<view class="six-box-left" @click="book">
				<image src="../static/Cicon7.png" mode=""></image>
				<view class="six-box-left_text">
					订场
				</view>
			</view>
			<view class="six-box_left-center" @click="Venue_plan()">
				<image src="../static/Cion8.png" mode=""></image>
				<view class="six-box_left-center-text">
					场馆平面图
				</view>
			</view>
			<view class="six-box_left-right" @click="show=true">
				<image src="../static/Cicon9.png" mode=""></image>
				<view class="six-box_left-right-text">
					场地类型
				</view>
			</view>
		</view>
		<u-popup :show="show" :round="10" @close="show=false" :closeable='true'>
			<view class="four-box">
				<view class="four-box-title">
					场馆类型
				</view>
				<view class="four-box-type">
					<view class="four-box-type-item" v-for="(item,index) in Venuetype" :key="index"
						@click="routerGo('/pagesA/makeAnAppointment/makeAnAppointment?venueid=' + contentlist.id + '&clasid=' + item.id ),show=false">
						<image :src="item.icon" mode=""></image>
						<text class="four-box-type-item-txt">{{item.venue_type}}</text>
					</view>
				</view>
			</view>

		</u-popup>
		<view style="height: 220rpx;">

		</view>
	</view>
</template>

<script>
	import {
		getVenuedetails,
		getsite,
		getPlaceList,
		venuegetVenueType
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				show: false,
				contentlist: {},
				// 场馆列表
				venuelist: [],
				Venuetype: [],
				display: false
			}
		},
		onLoad(e) {
			this.getVenuedetailsApi(e.id)
			this.venuegetVenueTypeApi(e.id)
			this.getPlaceListApi()

		},
		methods: {
			swiperClick(e) {
				this.viewImage(e, this.contentlist.images)
				console.log('eee', e);
			},
			book() {
				let token = uni.getStorageSync('userinfo').token
				if (token) {
					let clasid = this.Venuetype[0].id
					uni.navigateTo({
						url: '/pagesA/makeAnAppointment/makeAnAppointment?venueid=' + this.contentlist.id +
							'&clasid=' +
							clasid
					})
				} else {
					this.loginModel()
				}
			},
			router(id) {
				uni.redirectTo({
					url: '/pagesC/placeDetails/placeDetails?id=' + id
				})
			},
			async getVenuedetailsApi(id) {
				let data = await getVenuedetails({
					id: id
				})
				this.contentlist = data.data
				uni.setNavigationBarTitle({
					title: this.contentlist.name
				})
				this.display = true
			},
			// 场馆类型
			async venuegetVenueTypeApi(id) {
				let data = await venuegetVenueType({
					id: id
				})
				this.Venuetype.push(...data.data)
			},
			async getPlaceListApi() {
				let data = await getPlaceList({
					type: ''
				})
				this.venuelist.push(...data.data.rows)
			},
			Venue_plan() {
				uni.previewImage({
					current: 0,
					urls: [this.contentlist.image_plan]
				})
				// wx.previewMedia({
				// 	sources: [{
				// 		url: this.contentlist.image_plan,
				// 		type: 'image'
				// 	}],
				// 	current: 0,
				// 	showmenu: true,
				// 	success(res) {
				// 		console.log(res, '场馆');
				// 	},
				// 	fail(res) {
				// 		console.log(res, '场馆');
				// 	}

				// })

			},
			location() {
				let latitude = parseFloat(this.contentlist.lat)
				let longitude = parseFloat(this.contentlist.lon)
				uni.openLocation({
					latitude,
					longitude,
					scale: 18
				})
			}

		}
	}
</script>
<style>
	page {
		background-color: #FAFAFA;
	}
</style>
<style lang="scss" scoped>
	.one-box {
		width: 100%;
		height: 622rpx;
		position: relative;

		.back {
			width: 60rpx;
			height: 60rpx;
			background: #232323;
			opacity: 0.5;
			border-radius: 50%;
			position: absolute;
			top: 102rpx;
			left: 30rpx;
			padding: 10rpx 10rpx;
			box-sizing: border-box;
			z-index: 9;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.two-box {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 24rpx auto 28rpx;
		padding: 36rpx 30rpx;
		box-sizing: border-box;

		.two_top {
			padding-bottom: 22rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #D8D8D8;
		}
	}

	.two-box-title {
		font-size: 36rpx;
		color: #232323;
		font-weight: 600;
	}

	.two-box-price {
		font-size: 37rpx;
		font-weight: 500;
		color: #EA4952;
		margin-top: 22rpx;
		padding-right: 15rpx;

		.left {
			font-size: 37rpx;
		}

		.unit {
			font-size: 24rpx;
		}

		image {
			width: 27rpx;
			height: 27rpx;
			margin-left: 178rpx;
		}
	}

	.two-box-map {
		width: 100%;

		.two-box-map-title {
			font-size: 24rpx;
			color: #999999;
		}

		.two-box-map-km-box {
			font-size: 24rpx;
			color: #121315;
			text-align: center;

			image {
				width: 35rpx;
				height: 35rpx;
			}
		}

		.two-box-map-km {
			font-size: 30rpx;
			font-weight: 400;
			color: #7F8387;
			margin-left: 22rpx;
		}


	}

	.three-box {
		overflow: hidden;
		background: #FFFFFF;
		border-radius: 18rpx;
		margin-left: 14rpx;
		margin-top: 18rpx;
		padding-left: 30rpx;
		padding-top: 18rpx;

		.three-box-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #383838;
			display: flex;
			align-items: center;
			justify-content: space-between;

			// margin-top: 38rpx;
			.three-box-lasttitle {
				font-size: 24rpx;
				font-weight: 400;
				color: #656565;
				margin-right: 20rpx;
				display: flex;
				align-items: center;
			}
		}


		.three-box-pic::-webkit-scrollbar {
			display: none;
		}

		.three-box-pic {
			display: flex;
			overflow-x: auto;
			display: -webkit-box;
			-webkit-overflow-scrolling: touch;

			.three-box-pic-item {
				width: 261rpx;
				height: 188rpx;
				margin-right: 15rpx;
				margin-top: 24rpx;
				text-align: center;
				position: relative;
				overflow: hidden;
				border-radius: 15rpx;

				image {
					width: 100%;
					height: 100%;
				}

				.three-box-pic-txt {
					position: absolute;
					bottom: 0rpx;
					display: block;
					width: 261rpx;
					height: 63rpx;
					font-size: 26rpx;
					color: #FFFFFF;
					line-height: 63rpx;
					background: #000000;
					opacity: .5;
					font-weight: 400;
				}
			}
		}
	}

	.four-box {
		width: 721rpx;
		min-height: 500rpx;
		background: #FFFFFF;
		border-radius: 18rpx;
		padding-top: 38rpx;
		margin-left: 14rpx;

		.four-box-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #383838;
			text-align: center;
			margin-bottom: 31rpx;
		}

		.four-box-type {
			display: flex;
			flex-wrap: wrap;

			.four-box-type-item {
				width: 178rpx;
				text-align: center;
				margin-bottom: 40rpx;

				image {
					width: 109rpx;
					height: 109rpx;

				}

				.four-box-type-item-txt {
					display: block;
					margin-top: 12rpx;
					height: 37rpx;
					font-size: 26rpx;
					color: #0E1115;
					line-height: 37rpx;

				}
			}
		}
	}

	.five-box {
		background: #FFFFFF;
		padding: 38rpx 30rpx;
		width: 690rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0 auto;
	}

	.six-box {
		padding: 26rpx 30rpx;
		box-sizing: border-box;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0 2rpx 4rpx rgba(114, 130, 138, 0.2) !important;
		position: fixed;
		bottom: 0;

		.six-box-btn {
			width: 687rpx;
			height: 79rpx;
			line-height: 79rpx;
			background: #64BAFD;
			border-radius: 40rpx;
			margin: 36rpx auto 36rpx;
		}

		.six-box-left {
			width: 220rpx;
			height: 148rpx;
			position: relative;

			.six-box-left_text {
				position: absolute;
				font-weight: 900;
				font-size: 40rpx;
				color: #3D3D3D;
				top: 48rpx;
				left: 64rpx;
			}

			image {
				width: 100%;
				height: 100%;
			}
		}

		.six-box_left-center {
			width: 276rpx;
			height: 148rpx;
			position: relative;

			.six-box_left-center-text {
				width: 276rpx;
				text-align: center;
				position: absolute;
				font-weight: 900;
				font-size: 40rpx;
				color: #3D3D3D;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

			image {
				width: 100%;
				height: 100%;
			}
		}

		.six-box_left-right {
			width: 220rpx;
			height: 148rpx;
			position: relative;

			image {
				width: 100%;
				height: 100%;
			}

			.six-box_left-right-text {
				position: absolute;
				font-weight: 900;
				font-size: 40rpx;
				color: #3D3D3D;
				top: 48rpx;
				right: 0rpx;
				width: 180rpx;
			}
		}
	}
</style>