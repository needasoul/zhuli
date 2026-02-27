<template>
	<view>
		<u-sticky>
			<view class="sticky">
				<view class="head_box">
					<view class="search">
						<u-search placeholder="猜你想搜" :showAction='false' bgColor='#fff' v-model="search"
							@search="post_getPlaceList()"></u-search>
					</view>
					<scroll-view scroll-x="true" :scroll-into-view='infoview' :scroll-with-animation='true'
						style="width: 100%;white-space: nowrap;">
						<view class="top-box">
							<view class="top-box-item" :id='"info"+item.id' @click="classvenue(item.id,index)"
								v-for="(item,index) in list" :key="index"
								:style="{border:avtclass== item.id ?'1rpx solid #64BAFD': ''}">
								<image :src="item.imaged" mode=""></image>
								<view class="top-box-fz" :style="{color:avtclass== item.id ?'#64BAFD': '' }">
									{{item.venue_type}}
								</view>
							</view>
						</view>
					</scroll-view>

				</view>
				<view class="middle-box_bg ">
					<view class="middle-box_bg_top">
						<view class="flexc flexs middle_head">
							<view class="flexc">
								<!-- 地址 -->
								<view class=" flexc middle_head_1" @click="setaddress ">
									<view class="mr-4">
										<u-icon name="map" size="14"></u-icon>
									</view>
									<view class="me-text-beyond" style="max-width: 300rpx;">
										{{address || '附近'}}
									</view>
									<view class="play">
										<u-icon name="play-right-fill" color="#D8D8D8" size="8"></u-icon>
									</view>
								</view>
								<!-- 综合排序 -->
								<view class="middle_head_2 flexc" @click="setShow(1)">
									{{sortText}}
									<view class="play">
										<u-icon name="play-right-fill" :color="sortShow?'#64BAFD':'#D8D8D8'"
											size="8"></u-icon>
									</view>
								</view>
							</view>
							<view class="middle_head_3 flexc" @click="setShow(2)">
								<image v-if="filterShow" src="@/static/newsimg/icon3.svg" mode=""></image>
								<image src="@/static/newsimg/icon1.svg" v-else mode=""></image>
								筛选
							</view>
						</view>

						<!-- 排序 -->
						<view class="middle_head_box_1 " v-if="sortShow" @touchmove.stop.prevent="touchstart">
							<view class="middle_head_box_1_item" @click="setSort(index,item)"
								:class="sortIdx==index?'sortActive':''" v-for="(item,index) in sort" :key="index">
								{{item}}
							</view>
						</view>

						<view class="middle_head_box_2 " v-if="filterShow" @touchmove.stop.prevent="touchstart">
							<view class="middle_head_box_2_title">
								价格
							</view>
							<view class="middle_head_box_2_box flex flexw ">
								<view class="middle_head_box_2_item" :class="pricerCur==index?'active':''"
									v-for="(item,index) in price" :key="index" @click="settab(1,index,item)">
									{{item.min_price}}-{{item.max_price}}
								</view>
								<view class="middle_head_box_2_item_ipt">
									<input @input="priceipt" type="number" placeholder="最低价" v-model="ipt_min_price" />
								</view>
								<view class="middle_head_box_2_item_ipt">
									<input @input="priceipt" type="number" placeholder="最高价" v-model="ipt_max_price" />
								</view>
							</view>
							<view class="middle_head_box_2_title">
								营业状态
							</view>
							<view class="middle_head_box_2_box flex flexw ">
								<view class="middle_head_box_2_item" :class="statusCur==index?'active':''"
									v-for="(item,index) in statusList" :key="index" @click="settab(2,index)">
									{{item}}
								</view>

							</view>
							<view class="middle_head_box_2_btns flexs flexc">
								<view class="middle_head_box_2_btn_1" @click="reset">
									重置
								</view>
								<view class="middle_head_box_2_btn_2" @click="confrim">
									确定
								</view>
							</view>

						</view>

					</view>
				</view>


			</view>
		</u-sticky>
		<view class="middle-box_bg ">
			<view class="" style="height: 80rpx;"></view>
			<view class="" style="padding: 14rpx 30rpx;box-sizing: border-box;">
				<view class="middle-box flexc bg-f br-16" v-for="(item,index) in sitelist"
					@tap="routerTo('/pagesC/placeDetails/placeDetails?id='+item.id)" :key="index">
					<view class="pic">
						<image :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="d-flex">
						<view class="d-flex-c flexColumn">
							<view class="name-middle-box-new me-text-beyond">
								{{item.name}}
							</view>
							<view class="d-flex_prvi">
								<text class="f-size-22 f-600 color-CF39">¥</text>
								<text class="f-size-34 f-600 color-CF39">{{item.lower_price}}-{{item.max_price}}</text>
							</view>
							<view class="distance">
								{{item.distance/1000}}km
							</view>

							<view class="address">
								<view class="address-c f-size-24 f-400 color-OA">
									<view class="address-c-left ">
										<u-icon name="map-fill" color="#999999" size="15"></u-icon>
										<view class="ml-10 address-c-left_text me-text-beyond">{{item.address}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="" style="padding: 0 0 100rpx;">
				<empty :bgColor='"#fff"' v-if="sitelist.length<1"></empty>
			</view>

		</view>
		<view class="overlay" v-if="show" @touchmove.stop.prevent="touchstart" @touchstart="touchstart">
		</view>
		<no-data :isFinishedLoading="isFinishedLoading && sitelist.length != 0"></no-data>
	</view>
</template>

<script>
	import {
		getclass,
		getPlaceList,
		getPrices
	} from "../../api/comm.js"
	export default {
		data() {
			return {
				filterShow: false,
				sortShow: false,
				sortIdx: 0,
				show: false,
				list: [],
				avtclass: 0,
				venue: '',
				sitelist: [],
				page: 1,
				isFinishedLoading: false, // 数据是否全部加载完成
				sort: ['综合排序', '价格最低', '价格最高', '距离最近'],
				sortText: '综合排序',
				price: [],
				statusList: ['营业中', '已歇业'],
				traitList: ['5星好评', '4.5星以上', '4星以下'],
				pricerCur: null,
				statusCur: 0,
				pzcur: 0,
				address: null,
				infoview: '',
				order: 1,
				search: '',
				switch: 1,
				min_price: '',
				max_price: '',

				p_switch: 1,
				p_min_price: '',
				p_max_price: '',

				ipt_min_price: '',
				ipt_max_price: '',

			}
		},
		onLoad(list) {
			console.log(list);
			this.venue = list.id
			this.avtclass = list.id
			this.postgetclassApi(1)
			this.getPricesApi()
		},
		onReady() {
			let bb = uni.getStorageSync('vueId')
			if (bb) {
				this.venue = bb
				this.avtclass = bb
			}
		},
		onShow(e) {
			let bb = uni.getStorageSync('vueId')
			let aa = uni.getStorageSync('venueTabAddress')
			if (aa) {
				this.address = aa.name
			}
			if (bb) {
				setTimeout(() => {
					this.infoview = 'info' + bb
				}, 1000)
				this.venue = bb
				this.avtclass = bb
			}
			this.post_getPlaceList()
		},
		methods: {
			setaddress() {
				this.touchstart()
				uni.navigateTo({
					url: '/pagesA/setaddress/setaddress'
				})
			},
			priceipt() {
				if (this.ipt_min_price.length > 0) {
					this.pricerCur = null
				}

				if (this.ipt_max_price.length > 0) {
					this.pricerCur = null
				}
			},
			async getPricesApi() {
				let res = await getPrices()
				this.price = res.data
			},
			touchstart() {
				this.show = false
				this.sortShow = false
				this.filterShow = false
			},
			setShow(e) {
				if (e == 1) {
					this.sortShow = !this.sortShow
					this.filterShow = false
					this.show = this.sortShow
				} else if (e == 2) {
					this.sortShow = false
					this.filterShow = !this.filterShow
					this.show = this.filterShow
				}
			},
			setSort(index, name) {
				this.sortIdx = index
				this.order = index + 1
				this.sortText = name
				this.sortShow = false
				this.show = false
				this.post_getPlaceList()
			},
			// 获取场馆分类
			async postgetclassApi(e) {
				let data = await getclass()
				if (data.code == 1) {
					this.list.push(...data.data)

					if (!this.venue) {
						this.venue = data.data[0].id
						this.avtclass = data.data[0].id
					}
					this.post_getPlaceList()
				}
			},
			classvenue(id, index) {
				uni.setStorageSync('vueId', id)
				this.page = 1
				this.sitelist = []
				this.isFinishedLoading = false
				console.log(index);
				this.avtclass = id
				this.venue = id
				this.post_getPlaceList()
			},
			// 获取场馆列表
			async post_getPlaceList(e) {
				if (e !== 1) {
					this.page = 1
				}
				let data = await getPlaceList({
					type: this.venue,
					page: this.page,
					limit: 10,
					order: this.order,
					switch: this.switch,
					min_price: this.min_price,
					max_price: this.max_price,
					search: this.search
				})

				if (data.code == 1) {
					if (e == 1) {
						this.sitelist = [...this.sitelist, ...data.data.rows]
					} else {
						this.sitelist = data.data.rows
					}
				}

			},
			settab(e, index, item) {
				if (e == 2) {
					if (index == 0) {
						this.p_switch = 1
					} else {
						this.p_switch = 0
					}
					this.statusCur = index
				} else if (e == 3) {
					this.pzcur = index
				} else if (e == 1) {
					this.p_min_price = item.min_price
					this.p_max_price = item.max_price
					this.ipt_max_price = ''
					this.ipt_min_price = ''
					this.pricerCur = index
				}
			},
			confrim() {
				this.switch = this.p_switch
				console.log(this.ipt_min_price, this.ipt_max_price);
				if (this.ipt_min_price && this.ipt_max_price) {
					if (this.ipt_min_price >= this.ipt_max_price) {
						this.showToast('最低价不能高于最高价')
						return
					} else {
						this.min_price = this.ipt_min_price
						this.max_price = this.ipt_max_price
					}

				} else {
					this.min_price = this.p_min_price
					this.max_price = this.p_max_price
				}

				this.show = false
				this.filterShow = false
				this.post_getPlaceList()
			},
			reset() {
				this.statusCur = 0
				this.pzcur = 0
				this.pricerCur = null
				this.p_switch = 1
				this.p_min_price = ''
				this.p_max_price = ''
				this.ipt_max_price = ''
				this.ipt_min_price = ''
			}

		},
		onReachBottom() {
			this.page++
			this.post_getPlaceList(1)
		}
	}
</script>

<style>
	page {
		background-color: #F5F5F5;
	}
</style>

<style scoped lang="scss">
	.overlay {
		position: fixed;
		top: 35vh;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.5);
	}


	.head_box {
		// #ifdef MP-WEIXIN
		padding: 114rpx 0 30rpx;
		// #endif
		// #ifdef H5
		padding: 20rpx 0 30rpx;
		// #endif
		// margin: 114rpx 0 40rpx 30rpx;
		background-color: #F5F5F5;
	}

	.search {
		// #ifdef MP-WEIXIN 
		width: 500rpx;
		// #endif
		// #ifdef H5
		margin-right: 30rpx;
		// #endif
		margin-left: 30rpx;
	}

	.top-box {
		display: flex;
		background: #f2f2f2;
		margin-left: 30rpx;
		margin-top: 40rpx;
		height: 188rpx;
		overflow-x: auto;
	}

	/* 隐藏滚动条 */
	.top-box::-webkit-scrollbar {
		display: none;
	}

	.top-box-item {
		width: 138rpx;
		height: 148rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		text-align: center;
		margin-right: 18rpx;

		image {
			width: 138rpx;
			height: 92rpx;
			border-radius: 8rpx 8rpx 0rpx 0rpx;
		}
	}

	.top-box-fz {
		font-size: 24rpx;
		color: #3D3D3D;
		margin-top: 8rpx;
	}

	.middle-box_bg {
		background-color: #FFFFFF;
		position: relative;

		.middle-box_bg_top {
			position: absolute;
			z-index: 10086;
			left: 0;
			right: 0;
			top: 0;
			background-color: #fff;
		}

		.middle_head {
			box-sizing: border-box;
			font-size: 28rpx;
			padding: 32rpx 30rpx 20rpx;
			box-sizing: border-box;
		}

		.middle_head_box_1 {
			width: 750rpx;
			background: #FFFFFF;
			position: absolute;
			z-index: 10086;
			left: 0;
			font-size: 28rpx;
			right: 0;
			padding: 10rpx 0;
			box-sizing: border-box;

			.middle_head_box_1_item {
				padding: 20rpx 40rpx;
				box-sizing: border-box;
			}

			.sortActive {
				color: #64BAFD !important;
			}


		}

		.middle_head_box_2 {
			background: #FFFFFF;
			position: absolute;
			z-index: 10086;
			left: 0;
			font-size: 28rpx;
			right: 0;
			padding: 10rpx 30rpx 46rpx;
			box-sizing: border-box;

			.middle_head_box_2_title {
				font-size: 28rpx;
				color: #3D3D3D;
				margin: 22rpx 0 0;
				font-weight: 700;
			}

			.middle_head_box_2_box {
				.middle_head_box_2_item {
					background: #F6F7FB;
					border-radius: 816rpx;
					font-size: 24rpx;
					width: 178rpx;
					height: 72rpx;
					text-align: center;
					margin-right: 24rpx;
					margin-top: 26rpx;
					line-height: 72rpx;
				}

				.middle_head_box_2_item_ipt {
					background: #F6F7FB;
					border-radius: 816rpx;
					font-size: 24rpx;
					width: 178rpx;
					height: 72rpx;
					text-align: center;
					margin-right: 24rpx;
					margin-top: 26rpx;
					padding: 18rpx 0;
					box-sizing: border-box;
				}
			}

			.middle_head_box_2_btns {
				margin-top: 40rpx;

				.middle_head_box_2_btn_1 {
					width: 322rpx;
					height: 92rpx;
					border-radius: 670rpx 670rpx 670rpx 670rpx;
					border: 2rpx solid #CFCFCF;
					font-size: 28rpx;
					color: #232323;
					text-align: center;
					line-height: 92rpx;

				}

				.middle_head_box_2_btn_2 {
					width: 322rpx;
					height: 92rpx;
					border-radius: 670rpx 670rpx 670rpx 670rpx;
					border: 2rpx solid #64BAFD;
					font-size: 28rpx;
					color: #232323;
					text-align: center;
					background: #64BAFD;
					line-height: 92rpx;
					color: #FFFFFF;
				}
			}


		}

		.middle_head_1 {
			line-height: 26rpx;
			margin-right: 20rpx;

			image {
				width: 20rpx;
				height: 20rpx;
				margin: 0 6rpx;
			}

			.play {
				margin: 0 0rpx 0 6rpx;
				transform: rotate(90deg);
			}
		}


		.middle_head_2 {
			line-height: 26rpx;

			image {
				width: 14rpx;
				height: 14rpx;
				margin: 0 6rpx;
			}

			.play {
				margin: 0 0rpx 0 6rpx;
				transform: rotate(90deg);
			}
		}

		.middle_head_3 {
			line-height: 26rpx;

			image {
				width: 24rpx;
				height: 26rpx;
				margin: 0 6rpx;
			}
		}
	}

	.middle-box {
		margin: 0 auto 20rpx;
		border-radius: 10rpx;
		overflow: hidden;

		.pic {
			width: 190rpx;
			height: 196rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}

		.middle-box-new {
			width: 137rpx;
			height: 38rpx;
			line-height: 38rpx;
			margin-top: 10rpx;
		}

		.d-flex {
			width: calc(100% - 190rpx - 30rpx);
			margin: 0 auto;
			position: relative;

			.d-flex-c {
				width: 100%;

				.name-middle-box-new {
					font-size: 32rpx;
					color: #3D3D3D;
					font-weight: 700;
				}

				.address {
					width: 100%;

					.address-c {
						width: 100%;
						display: flex;
						justify-content: space-between;

						.address-c-left {
							width: 100%;
							font-size: 24rpx;
							color: #999999;
							display: flex;
							align-items: center;

							.address-c-left_text {
								width: 90%;
							}
						}
					}
				}
			}


		}

		.f-size-32 {
			margin-top: 10rpx;
		}

		.f-size-24 {
			margin-top: 10rpx;
			display: flex;
			align-items: center;
		}



		.btn-box {
			width: 116rpx;
			height: 48rpx;
			background: #64BAFD;
			border-radius: 48rpx;
			font-weight: 700;
			font-size: 24rpx;
			color: #FFFFFF;
			line-height: 48rpx;
			text-align: center;
			position: absolute;
			right: 0;
			bottom: 0rpx;
		}
	}


	.distance {
		font-size: 28rpx;
		color: #666666;
	}

	.active {
		background: #64BAFD !important;
		color: #fff !important;
	}
</style>