<template>
	<view>
		<view class="head">
			<image class="head_bg" src="../../static/index/icon1.png" mode=""></image>
			<view class="user_box zindex flex" v-if="token" @click="routerGo('/pagesA/personage/personage')">
				<image class="user_box_img" :src="user.avatar" mode=""></image>
				<view class="user_box_right">
					<view class="user_box_right_text">
						{{user.username || ''}}
					</view>
					<view class="user_box_right_text_1">
						欢迎使用{{common && common.app_name || ''}}
					</view>

				</view>
			</view>
			<view class="user_box zindex flex" v-else @click="routerGo('/pagesA/personage/personage')">
				<image class="user_box_img" src="../../static/images/avatar.png" mode=""></image>
				<view class="user_box_right">
					<view class="user_box_right_text">
						请登录
					</view>
					<view class="user_box_right_text_1">
						欢迎使用{{common && common.app_name || ''}}
					</view>
				</view>
			</view>

			<view class="search_box zindex flexc" @click="routerTo('/pages/venueTab/venueTab','reLaunch')">
				<image src="@/static/index/icon3.png" mode=""></image>
				<input disabled="true" placeholder-style='color:#DAD8DB;' type="text" placeholder="最新热门场馆,等你来看" />
			</view>

			<view class="tab-list flexs zindex">
				<view class="tab-list-left">
					<view class="tab-list-left-c">
						<view class="tab-list-left-c-title">
							热门场馆
						</view>
						<view class="tab-list-left-c-button" @click="goVenue">
							立即查看
						</view>
					</view>
					<image class="imgs1" src="@/static/index/icon2.png" mode=""></image>
					<view class="hot_activity flexColumn" @tap="routerGo('/pagesC/hotEvents/hotEvents')">
						<view class="hot_activity_text_1">
							热门活动
						</view>
						<view class="hot_activity_text_2">
							精彩活动等你来看
						</view>
					</view>
				</view>
				<view class="tab-list-right flexColumn">
					<view class="tab-list-right-t flex" @tap="routerGo('/pagesC/hotClass/hotClass')">
						<image class="tab-list-right-t_img" src="@/static/index/icon5.png" mode=""></image>
						<view class="">
							<view class="tab-list-right-t_text size14">
								热门课程
							</view>
							<view class="tab-list-right-t_text_1 size12 gray">
								精彩课程等你看
							</view>
						</view>
					</view>
					<view class="tab-list-right-t flex" @tap="routerGo('/pagesC/hotNews/hotNews')">
						<image class="tab-list-right-t_img" src="@/static/index/icon4.png" mode=""></image>
						<view class="">
							<view class="tab-list-right-t_text size14">
								热门资讯
							</view>
							<view class="tab-list-right-t_text_1 size12 gray">
								更多新闻等你看
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>

		<!-- 助力活动列表（新） -->
		<view class="activity-list">
			<view class="activity-card" v-for="item in activityList" :key="item.id">
				<view class="activity-tag">{{ item.tag }}</view>
				<view class="activity-main">
					<view class="activity-title">
						{{ item.title }}
					</view>
					<view class="activity-subtitle">
						{{ item.subTitle }}
					</view>
					<view class="activity-time">
						活动时间：{{ item.timeRange }}
					</view>
				</view>
				<view class="activity-action" @click="goActivityDetail(item)">
					参与活动
				</view>
			</view>
		</view>

		<!-- 快速定场（原功能，暂时保留） -->
		<view class="booking pt-36 pl-22 ">
			<scroll-view scroll-x="true" style="padding-right: 30rpx; margin-bottom: 10rpx;">
				<view class="booking-box d-flex ">
					<view class="booking-item txt-center" v-for="(item,index) in list" :key="index"
						@tap="govenue(item.id)">
						<image :src="item.image" mode=""></image>
						<view class="">{{item.venue_type}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="hot_title">
			当前热门场馆推荐
		</view>

		<view class="hot_box flexw">
			<view class="hot_box_item_group" @tap="routerTo('/pagesC/placeDetails/placeDetails?id='+item.id)"
				v-for="(item,index) in hotList" :key="index">
				<view class="hot_box_item">
					<image class="hot_box_item-img" :src="item.image" mode=""></image>
					<view class="hot_box_item-center flexColumn">
						<view class="me-text-beyond text_1 size14 blod">
							{{item.name}}
						</view>
						<view class="flexc">
							<view class="">
								<u-icon name="map-fill" color="#666666" size="10"></u-icon>
							</view>
							<view class="text2 hue size10 me-text-beyond">
								{{item.address}}
							</view>
						</view>
						<view class="">
							<span class="size10 hue2">￥</span><span
								class="size14 blod hue2">{{item.lower_price}}-{{item.max_price}}</span>
							<span class="size10 hue5">/小时/场</span>
						</view>
					</view>
				</view>
			</view>
		</view>


		<!-- 备案号 -->
		<view class="record">
			<text>小程序备案号：{{configuration.mini_filings || ''}}</text>
			<text class="record_text"> 经营许可：{{configuration.business_license || ''}}</text>
		</view>
		<view style="height: 10rpx;">

		</view>

	</view>
</template>
<script>
	import {
		getclass,
		getPlaceList,
		getNewsList,
		getActivityList,
		getActivityDetails,
		getClassList,
		getClassDetails,
		getSwiperList,
		getUserInfo,
		// 获取公共参数
		getCommon,
		usergetUserInfo,
		getRmVenue,
		loginWxOfficial,
	} from '@/api/comm.js'
	export default {
		data() {
			return {
				indicatorStyle: {
					bottom: '300rpx'
				},
				show1: false,
				// 广告
				advertising: [],
				classList: [],
				ActivityList: [],
				newsList: [],
				placeList: [],
				list: [],
				configuration: '',
				// 新增：活动列表（占位数据，后续对接接口）
				activityList: [],
				token: null,
				user: {},
				hotList: [],
				tokenall: null,
				common: uni.getStorageSync('configuration') || null
			}
		},
		onLoad() {
			// 获取公共参数
			this.getCommonApi()
			this.postgetclassApi()
			this.initActivityList()
			let userinfo = uni.getStorageSync('userinfo')
			this.tokenall = uni.getStorageSync('userinfo')
			if (userinfo) {
				this.getuser()
			} else {
				this.user = null
				this.token = null
				// #ifdef H5
				let code = this.getUrlCode('code')
				if (code) {
					this.handleToLogin(code)
				} else {}
				// #endif
			}
			this.getRmVenueAPi()

		},
		onShow() { // 获取公共参数
			this.getCommonApi()
			let userinfo = uni.getStorageSync('userinfo')
			if (userinfo) {
				this.getuser()
			}
			let token = uni.getStorageSync('userinfo').token
			if (token) {
				this.token = token
			} else {
				this.token = null
			}
			// #ifdef MP-WEIXIN
			if (!uni.getStorageSync('location')) {
				this.getLocation()
			}
			// #endif

		},

		methods: {
			// 初始化示例活动数据，后续可改为接口获取
			initActivityList() {
				this.activityList = [
					{
						id: 1,
						tag: '进行中',
						title: '【今日助力】京东视频红包',
						subTitle: '下单助力可得视频红包',
						timeRange: '10:00-18:00'
					},
					{
						id: 2,
						tag: '今日加场',
						title: '砸一砸赏金-今日加场',
						subTitle: '抢先预约，价格更优',
						timeRange: '10:00-18:00'
					},
					{
						id: 3,
						tag: '进行中',
						title: '邀请好友领红包',
						subTitle: '赚砸一下赏金，奖励多多',
						timeRange: '全天'
					}
				]
			},
			goActivityDetail(item) {
				uni.navigateTo({
					url: `/pages/activityDetail/activityDetail?id=${item.id}`
				})
			},
			// 静默登录
			async handleToLogin(code) {
				//调用接口登录接口
				await loginWxOfficial({
					'code': code,
					'state': 1,
				}).then(resx => {
					if (resx.code == 1) {
						uni.setStorageSync('userinfo', resx.data.userinfo)
						usergetUserInfo().then(res => {
							if (res.data.openid) {
								uni.setStorageSync('openid', res.data.openid)
							}
						})
					} else {
						console.log('失败========', resx);
					}
				})
			},
			//方法:用来提取code
			getUrlCode(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) ||
				[, ''
				])[1].replace(/\+/g, '%20')) || null
			},
			govenue(id) {
				uni.setStorageSync('vueId', id)
				uni.reLaunch({
					url: '/pages/venueTab/venueTab'
				})
			},
			// 热门
			async getRmVenueAPi() {
				let res = await getRmVenue()
				if (res.code == 1) {
					this.hotList = res.data
				}
			},
			async getuser() {
				let res = await usergetUserInfo()
				if (res.code == 1) {
					this.user = res.data
				}
			},
			// 跳转
			goVenue() {
				uni.switchTab({
					url: '/pages/venueTab/venueTab'
				})
			},
			async getCommonApi() {
				const res = await getCommon()
				if (res.code == 1) {
					this.configuration = res.data
					this.common = res.data
					uni.setStorageSync('configuration', res.data)
					// #ifdef H5
					let token = uni.getStorageSync('userinfo')
					if (!token) {
						if (res.data.auth_type == '0') {
							window.location.href = res.data.mpurl
						}
					}
					// #endif
				}

			},

			getLocation() {
				let that = this
				uni.getFuzzyLocation({
					type: 'wgs84',
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					success: function(res) {
						console.log(res)
						uni.setStorageSync('location', JSON.stringify(res))
						that.postgetclassApi()
					},
					fail: function(err) {
						console.log('请打开地理位置', err);
						uni.showToast({
							title: '请打开地理位置',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			async postgetclassApi() {
				let data = await getclass({})
				if (data.code == 1) {
					this.list = data.data
				}
			},

		}
	}
</script>
<style>
	page {
		background-color: #F8F9FC;
	}
</style>
<style lang="scss" scoped>
	.head {
		width: 100vw;
		height: 692rpx;
		position: relative;
		overflow: hidden;

		.zindex {
			position: relative;
			z-index: 4;
		}

		.user_box {
			margin: 128rpx 0 54rpx 34rpx;

			.user_box_img {
				width: 80rpx;
				height: 80rpx;
				border-radius: 26rpx 26rpx 26rpx 26rpx;
				margin-right: 18rpx;
				background-color: #5FB7FE;
			}

			.user_box_right {
				.user_box_right_text {
					font-size: 28rpx;
					color: #FFFFFF;
					margin-bottom: 8rpx;
					font-weight: blod;
				}

				.user_box_right_text_1 {
					font-size: 22rpx;
					color: #FFFFFF;
				}

			}
		}

		.search_box {
			width: 690rpx;
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 22rpx 22rpx 22rpx 22rpx;
			margin: 0 auto 42rpx;
			padding: 22rpx 24rpx;
			box-sizing: border-box;

			input {
				width: 540rpx;
				height: 30rpx;
			}

			image {
				height: 30rpx;
				width: 30rpx;
				margin-right: 20rpx;
				margin-top: 6rpx;
			}
		}

		.head_bg {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100vw;
			height: 692rpx;
			// #ifdef MP-WEIXIN
			z-index: -1;
			// #endif
		}
	}


	.record {
		display: flex;
		justify-content: center;
		font-size: 24rpx;
		color: #959B9E;

		.record_text {
			margin-left: 20rpx;
			font-size: 24rpx;
			color: #959B9E;
		}
	}

	.booking {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 42rpx auto;
	}

	.activity-list {
		width: 690rpx;
		margin: 20rpx auto 0;
	}

	.activity-card {
		position: relative;
		margin-bottom: 20rpx;
		padding: 24rpx 24rpx 24rpx 28rpx;
		background: linear-gradient(135deg, #ffe8c8 0%, #ffd1a1 40%, #ffeede 100%);
		border-radius: 16rpx;
		display: flex;
		align-items: center;
	}

	.activity-tag {
		position: absolute;
		left: 0;
		top: 24rpx;
		padding: 4rpx 18rpx;
		font-size: 22rpx;
		color: #ffffff;
		background: linear-gradient(90deg, #ff8a00 0%, #ff5b00 100%);
		border-radius: 0 999rpx 999rpx 0;
	}

	.activity-main {
		flex: 1;
		padding-left: 12rpx;
	}

	.activity-title {
		font-size: 30rpx;
		color: #3d3d3d;
		font-weight: 700;
		margin-bottom: 4rpx;
	}

	.activity-subtitle {
		font-size: 24rpx;
		color: #7a7a7a;
		margin-bottom: 6rpx;
	}

	.activity-time {
		font-size: 22rpx;
		color: #a36b2f;
	}

	.activity-action {
		width: 160rpx;
		height: 60rpx;
		border-radius: 999rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #ffffff;
		background: linear-gradient(90deg, #ff9b00 0%, #ff6a00 100%);
	}

	.hot_title {
		font-size: 32rpx;
		color: #3D3D3D;
		font-weight: 800;
		margin: 42rpx 0 22rpx 30rpx;
	}

	.hot_box {
		padding: 0 15rpx;
		box-sizing: border-box;

		.hot_box_item_group {
			padding: 15rpx;
			width: 50%;
			box-sizing: border-box;
		}

		.hot_box_item {
			width: 330rpx;
			height: 366rpx;
			background: #FFFFFF;
			border-radius: 10rpx 10rpx 10rpx 10rpx;

			.hot_box_item-img {
				width: 329rpx;
				height: 213rpx;
				border-radius: 10rpx 10rpx 0rpx 0rpx;
			}

			.hot_box_item-center {
				padding: 14rpx 14rpx 28rpx;
				box-sizing: border-box;
				height: calc(100% - 213rpx);

				.text2 {
					margin-left: 6rpx;
					line-height: 20rpx;
				}
			}
		}

	}


	.text {
		font-size: 34rpx;
		font-weight: 600;
		color: #282828;
		-webkit-line-clamp: 2;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		// margin: 36rpx 0 0 22rpx;
	}

	.booking-box {
		width: 100%;
		height: 172rpx;

		// margin-top: 32rpx;
		.booking-item {
			width: 109rpx;
			height: 172rpx;
			margin-right: 43rpx;
			font-size: 26rpx;
			color: #101010;

			image {
				width: 104rpx;
				height: 104rpx;
				border-radius: 36rpx;
			}
		}
	}

	.tab-box {
		height: 226rpx;
	}


	.tab-list {
		display: flex;
		justify-content: space-between;
		width: 690rpx;
		height: 300rpx;
		margin-left: 23rpx;

		.tab-list-left {
			position: relative;

			width: 302rpx;
			height: 300rpx;
			background: #4B8DFD;
			border-radius: 24rpx 24rpx 24rpx 24rpx;


			.imgs1 {
				position: absolute;
				right: 0;
				top: 0;
				width: 116rpx;
				height: 104rpx;
			}

			.hot_activity {
				width: 302rpx;
				height: 124rpx;
				background: #6DA3FD;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				position: absolute;
				bottom: 0;
				z-index: 5;
				padding: 18rpx 32rpx;
				box-sizing: border-box;

				.hot_activity_text_1 {
					font-size: 28rpx;
					color: #FFFFFF;
				}

				.hot_activity_text_2 {
					font-size: 22rpx;
					color: #FFFFFF;
				}
			}

			.tab-list-left-c {
				.tab-list-left-c-title {
					font-size: 28rpx;
					color: #FFFFFF;
					margin: 28rpx 0 22rpx 32rpx;
				}

				.tab-list-left-c-text {
					height: 35rpx;
					font-size: 24rpx;
					color: #2777D2;
					line-height: 35rpx;
				}

				.tab-list-left-c-button {
					width: 148rpx;
					height: 48rpx;
					background: linear-gradient(270deg, #5FB7FE 0%, #2586FF 100%);
					border-radius: 203rpx 203rpx 203rpx 203rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					line-height: 48rpx;
					text-align: center;
					margin-left: 28rpx;
				}
			}
		}

		.tab-list-right {


			.tab-list-right-t {
				width: 356rpx;
				height: 132rpx;
				background: #FFFFFF;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				padding: 26rpx 34rpx;
				box-sizing: border-box;

				.tab-list-right-t_img {
					width: 78rpx;
					height: 78rpx;
					margin-right: 32rpx;

				}

				.tab-list-right-t_text {
					font-size: 28rpx;
					color: #3D3D3D;
					margin-bottom: 6rpx;
				}

				.tab-list-right-t_text_1 {
					font-size: 22rpx;
					color: #C6C6C6;
				}
			}

		}
	}

	::v-deep .u-swiper__indicator {
		bottom: 25% !important;
	}
</style>