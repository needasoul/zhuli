<template>
	<view>
		<view class="top-box">
			<view class="top-box-item" @click="classvenue('',0)" :style="{background:avtclass== 0 ?'#64BAFD': ''}">
				<text class="top-box-fz" :style="{color:avtclass== 0 ?'#FFFFFF': '' }">全部类型</text>
			</view>
			<view :id="item.id" class="top-box-item" @click="classvenue(item.id,index+1)" v-for="(item,index) in list"
				:key="index" :style="{background:avtclass== item.id ?'#64BAFD': ''}">
				<text class="top-box-fz" :style="{color:avtclass== item.id ?'#FFFFFF': '' }">{{item.venue_type}}</text>
			</view>
		</view>

		<u-empty :marginTop="120" mode="list" icon="/static/images/order_form.png" v-if="sitelist.length<1">
		</u-empty>
		<view class="middle-box bg-f br-16" v-for="(item,index) in sitelist"
			@tap="routerTo('/pagesC/placeDetails/placeDetails?id='+item.id)" :key="index">
			<view class="pic">
				<image :src="item.image" mode=""></image>
			</view>
			<view class="d-flex">
				<view class="d-flex-c">
					<view class="name-middle-box-new-box f-size-32 f-600 color-28">
						<view class="name-middle-box-new">
							<view class="">
								{{item.name}}
							</view>
							<view class="middle-box-new bg-FFF2 br-8 f-size-20 f-400 color-CF39 txt-center">新客·可用券
							</view>
						</view>
						<view class="distance">
							{{item.distance/1000}}km
						</view>

					</view>
					<view class="address">
						<view class="address-c f-size-24 f-400 color-OA">
							<view class="address-c-left">
								<u-icon name="map-fill" size="15"></u-icon>
								{{item.address}}
							</view>
						</view>
					</view>
					<view class="d-flex_prvi">
						<text class="f-size-22 f-600 color-CF39">¥</text>
						<text class="f-size-34 f-600 color-CF39">{{item.lower_price}}-{{item.max_price}}</text>
						<text class="f-size-22 f-600 color-12">/小时/场</text>
					</view>
				</view>
				<view class="">
					<view class="btn-box">预订</view>
				</view>
			</view>
		</view>
		<no-data :isFinishedLoading="isFinishedLoading && sitelist.length != 0"></no-data>
	</view>
</template>

<script>
	import {
		getclass,
		getPlaceList
	} from "../../api/comm.js"
	export default {
		data() {
			return {
				list: [],
				avtclass: 0,
				venue: '',
				sitelist: [],
				page: 1,
				isFinishedLoading: false, // 数据是否全部加载完成
				typeId: ''
			}
		},
		onLoad(list) {
			console.log(list);
			this.venue = list.id
			this.avtclass = list.id
			this.postgetclassApi()
			this.post_getPlaceList()
		},
		methods: {
			// 获取场馆分类
			async postgetclassApi() {
				let data = await getclass({

				})
				// console.log(data);
				this.list.push(...data.data)
				// console.log(this.list);
			},
			classvenue(id, index) {
				this.page = 1
				this.sitelist = []
				this.isFinishedLoading = false
				console.log(index);
				this.avtclass = id
				this.venue = id
				this.post_getPlaceList()
			},
			// 获取场馆列表
			async post_getPlaceList() {
				console.log('执行');
				let data = await getPlaceList({
					type: this.venue,
					page: this.page,
					limit: 10
				})
				if (data.data.rows.length) {
					this.sitelist.push(...data.data.rows)
					if (data.data.rows.length < 10) {
						this.isFinishedLoading = true
					}
				} else {
					this.isFinishedLoading = true
				}
			},
		},
		onReachBottom() {
			console.log('触底了');
			if (!this.isFinishedLoading) {
				this.page++
				this.post_getPlaceList()
			}
		}
	}
</script>

<style>
	page {
		background-color: #F5F5F5;
	}
</style>

<style scoped lang="scss">
	.top-box {
		display: flex;
		height: 135rpx;
		background: #f2f2f2;
		padding-top: 27rpx;
		padding-left: 12rpx;
		overflow-x: auto;
		display: -webkit-box;
		-webkit-overflow-scrolling: touch;
	}

	/* 隐藏滚动条 */
	.top-box::-webkit-scrollbar {
		display: none;
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

	.middle-box {
		width: 701rpx;
		height: 594rpx;
		margin: 0 auto 20rpx;
		border-radius: 10rpx;
		overflow: hidden;

		.pic {
			width: 701rpx;
			height: 368rpx;

			image {
				width: 701rpx;
				height: 368rpx;
			}
		}

		.middle-box-new {
			width: 137rpx;
			height: 38rpx;
			line-height: 38rpx;
			margin-top: 10rpx;
		}

		.d-flex {
			width: 95%;
			margin: 0 auto;
			position: relative;

			.d-flex-c {
				width: 100%;

				.address {
					width: 100%;

					.address-c {
						width: 100%;
						display: flex;
						justify-content: space-between;

						.address-c-left {
							display: flex;
							align-items: center;
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

		.d-flex_prvi {
			margin-top: 30rpx;
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

	.name-middle-box-new-box {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.name-middle-box-new {
			display: flex;
			align-items: center;

			.middle-box-new {
				margin-left: 14rpx;
			}
		}

		.distance {
			font-weight: 400;
			font-size: 22rpx;
			color: #999999;
		}
	}
</style>