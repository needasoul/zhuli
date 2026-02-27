<template>
	<view v-if="display">
		<headBg :title='"订馆预约"'></headBg>
		<!-- 场馆类型 -->
		<view class="one-box bg-f br-18 zindex">
			<scroll-view scroll-x="true" style="width:100%;white-space: nowrap;">
				<view class="d-flex ml-26">
					<view class="one-box-item txt-center pt-10 br-36 mr-32" v-for="(item,index) in Venuetype"
						:key="item.id" @click="select(item.id)">
						<view class="one-box-item_top" v-if="item.id==clasid">
							<u-icon name="checkbox-mark" color="#fff" size="16"></u-icon>
						</view>
						<view class="one-box-item_img" :style="{border:item.id==clasid?'1rpx solid #49AFFF':'' }">
							<image :src="item.icon" mode=""></image>
						</view>
						<view :style="{color:item.id==clasid?'#49AFFF':'' }" class="f-size-26 f-600 color-0E11 mt-12">
							{{item.venue_type}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 日期选择 -->
		<view class="dates zindex">
			<view class="f-size-28 color-0 txt-center pt-38 pb-30 f-600">
				{{newDate | FormatMount }}
			</view>
			<view class="flexc flexw flexs">
				<view class="dates-list txt-center" :class="{act:indexall==index}"
					v-for="(item,index) in venuetimeslist" :key="index" @click="selecttime(index,item.date)">
					<view class="text">
						{{item.xq}}
					</view>
					<view class="num">
						{{item.date_jl}}
					</view>
				</view>
			</view>

		</view>

		<view class="card">
			<u-tabs :list="list1" :current='current' @click="tabclick" lineWidth="30" lineColor="#4AB0FF" :activeStyle="{
			            color: '#4AB0FF',
			            fontWeight: 'bold',
			            transform: 'scale(1.05)'
			        }" :inactiveStyle="{
			            color: '#3D3D3D',
			            transform: 'scale(1)'
			        }" itemStyle="width:32%;textAlign:center;padding:0 0 16rpx;">
			</u-tabs>

			<view class="venue-list flexc flexw  flexs">
				<view class="venue-list_item me-text-beyond" v-for="(itemall,indexall) in information.day"
					:key="itemall.id">
					<view class="venue-list-c" :class="venuecur==indexall?'venueActive':''"
						@click="venueReservation(itemall,indexall)">
						{{itemall.name}}
					</view>
				</view>
				<view class="venue-list_item me-text-beyond" v-if="information.day.length%2!==0"></view>
			</view>

			<view class="popup-box_content pt-16 flexw flexs" v-if="timerList.length>0">
				<view class="pt-26 pb-26" v-for="(item,index) in timerList" :key="item.id">
					<view @click="setpopCur(index,item)" :class="item.show?'popActive':''"
						class="popup-box_content_item flexColumn text-center">
						<view class="popup-box_content_item_xz" v-if="item.show">
							<u-icon name="checkbox-mark" color="#fff" size="20"></u-icon>
						</view>
						<view class="f-size-26  flexs-c">
							<view class="mr-10 mt-2">
								<u-icon name="clock" :color="item.show?' #27A1FF':'#88898B'" size="14"></u-icon>
							</view>
							<span>{{item.time}}</span>
						</view>
						<view class="f-size-28" v-if="item.status == 1">未出售</view>
						<view class="f-size-28" v-if="item.status == 2">已出售</view>
						<view class="f-size-28 price f-600">¥{{item.price}}</view>
					</view>
				</view>

			</view>
			<empty v-else></empty>

		</view>

		<!-- 场馆列表 -->

		<!-- 确认 -->
		<view class="five-box bg-f pt-32" v-show="coent>0">
			<view class="five-box_conten">
				<view v-for="(itemall,indexall) in selectedData" :key="indexall.id">
					<view class="ml-32 mb-10">
						<view class="five-box-top bg-64 txt-center pt-20">
							<view class="f-size-24 f-400 color-FCFE">{{itemall.ynd}}</view>
							<view class="f-size-24 f-400 color-FCFE">{{itemall.time}}</view>
						</view>
						<view class="five-box-bottom bg-f f-size-32 f-600 color-64 txt-center">{{itemall.terminus}}
						</view>
					</view>
				</view>
			</view>

			<view class="d-flex ml-34 bottom_button">
				<view class="" style="margin-top: 44rpx;">
					<text class="f-size-24 f-600 color-0E11 mr-8">总计金额</text>
					<text class="f-size-32 f-600 color-0E11">¥{{price}}</text>
				</view>
				<view class="btn-box br-8 bg-64 f-size-32 f-600 color-FBFD txt-center" @click="affirm()">确认</view>
			</view>
		</view>
		<view class="" style="height: 600rpx;" v-if="myTimerList.length>0"></view>

		<u-popup :show="popshow" :overlay='false' @close="removeList" :closeable='true'>
			<view class="popup_bom">
				<view class="flexc popup_bom_title">
					<image class="mr-18" src="../static/icon7.png" mode=""></image>
					<span>一个订单不能跨场地进行购买! 凭对应的二维码入场</span>
				</view>
				<view class="f-size-32 f-600 mt-30 mb-22">
					{{ information.day[venuecur].name || ''}}
				</view>
				<view class=" scroll_box">
					<scroll-view scroll-x="true" style="white-space: nowrap;">
						<view class="popup_bom_item  mr-28" v-for="item in  myTimerList" :key='item'>
							<view class="text-1 mt-18">
								{{newDate | Formatsdate }}
							</view>
							<view class="text-1 mt-4">
								{{item.time}}-{{item.end_time}}
							</view>
							<view class="text-2">
								场次时间
							</view>

						</view>
					</scroll-view>
				</view>
				<view class="btn " @click="newAffirm()">
					确认
				</view>
			</view>
		</u-popup>
	</view>
	</view>
</template>

<script>
	import {
		venuegetVenueType,
		venuegetArea,
		venuetimes,
		orderbefore
	} from "@/api/comm.js"
	import {
		forEach
	} from "lodash";
	import funTime from '@/utils/time.js'
	export default {
		data() {
			return {
				popshow: false,
				text1: "一个订单不能跨场地进行购买! 凭对应的二维码入场",
				show: true,
				popCur: null,
				list1: [{
					name: '上午',
				}, {
					name: '下午',
				}, {
					name: '晚上'
				}],

				list: [],
				venueid: '',
				clasid: '',
				Venuetype: [],
				venuetimeslist: [],
				indexall: 0,
				time: '',
				information: {},
				judge: [],
				final_time: [],
				areaDetail: [],
				areaDetailNew: [{
					areaId: null,
					times: []
				}],
				// 总价
				price: 0.00,
				display: false,
				coent: 0,
				selectedData: [], // 选中的数据
				venuecur: null,
				timerList: [],
				myTimerList: [],
				newDate: +new Date(),
				current: 0,
				areaId: '',
				terminus: ""
			}
		},
		onLoad(content) {
			this.venueid = content.venueid
			if (content.clasid) {
				this.clasid = content.clasid
			}
			this.venuegetVenueTypeApi(content.venueid)
			this.venuetimes()
		},
		methods: {
			close() {
				this.popshow = false
				this.removeList
			},
			// 清楚数据
			removeList() {
				this.popshow = false
				this.myTimerList = []
				this.timerList.forEach(item => {
					if (item.show) {
						item.show = false
					}
				})
			},

			tabclick(e) {
				this.current = e.index
				this.removeList()
				if (this.venuecur == null) return

				if (e.index == 0) {
					this.timerList = this.information.day[this.venuecur].rule_morning
				} else if (e.index == 1) {
					this.timerList = this.information.day[this.venuecur].rule_middle
				} else {
					this.timerList = this.information.day[this.venuecur].rule_evening
				}
				this.$forceUpdate()

			},
			setpopCur(idx, itemAll) {
				let that = this
				this.timerList.forEach((item, index) => {
					if (idx == index) {
						if (item.status == 1) {
							if (item.show) {
								item.show = false
								that.myTimerList.forEach((item1, idx1) => {
									if (item.time == item1.time) {
										that.myTimerList.splice(idx1, 1)
									}
								})
							} else {
								item.show = true
								that.myTimerList.push(item)
							}
						} else {
							this.showToast('已售完')
						}
					}
				})

				if (this.myTimerList.length > 0) {
					this.popshow = true
				} else {
					this.popshow = false
				}

				this.$forceUpdate()


			},
			// 确定
			newAffirm() {
				let obj = {}
				let arr = []
				obj.fixedDate = this.time
				obj.orderType = 2
				obj.goodsId = this.information.id

				this.myTimerList.forEach(item => {
					arr.push({
						price: item.price,
						time: item.time,
						ynd: this.time,
						terminus: this.terminus
					})
				})

				obj.areaDetail = [{
					areaId: this.areaId,
					times: arr
				}]

				// if (obj.areaDetail[0].times.length) {
				uni.navigateTo({
					url: '/pagesB/bookingAppointment/bookingAppointment?areaDetail=' + JSON
						.stringify(obj)
				})
			},

			// 场地预定
			venueReservation(item, index) {
				console.log('item', item);
				this.removeList()
				if (this.current == 0) {
					this.timerList = item.rule_morning
				} else if (this.current == 1) {
					this.timerList = item.rule_middle
				} else {
					this.timerList = item.rule_evening
				}
				this.areaId = item.id
				this.terminus = item.name
				this.venuecur = index
			},
			// 场馆类型
			async venuegetVenueTypeApi(id) {
				let data = await venuegetVenueType({
					id: id
				})
				if (data.code == 1) {
					this.Venuetype.push(...data.data)
					if (this.clasid == " ") {
						this.clasid = this.Venuetype[0].id
						this.venuegetAreaApi()
					} else {
						this.venuegetAreaApi()
					}
				}

			},
			// 场地时间  出售列表 
			async venuegetAreaApi() {
				uni.showLoading()
				let data = await venuegetArea({
					typeId: this.clasid,
					venueId: this.venueid,
					time: this.time
				})
				this.information = data.data[0]
				if (data.data[0].day.length > 0) {
					if (this.venuecur !== null) {
						if (this.current == 0) {
							this.timerList = data.data[0].day[this.venuecur].rule_morning
						} else if (this.current == 1) {
							this.timerList = data.data[0].day[this.venuecur].rule_middle
						} else {
							this.timerList = data.data[0].day[this.venuecur].rule_evening
						}
					} else {
						this.venuecur = 0
						this.timerList = data.data[0].day[0].rule_morning
						this.areaId = data.data[0].day[0].id
						this.terminus = data.data[0].day[0].name
					}
				}

				this.list1[0].name = `上午(${this.information.morning_count})`
				this.list1[1].name = `下午(${this.information.middle_count})`
				this.list1[2].name = `晚上(${this.information.evening_count})`
				this.display = true
				this.$forceUpdate()
				uni.hideLoading()
			},
			// 场地时间
			async venuetimes() {
				let data = await venuetimes()
				if (data.code == 1) {
					this.venuetimeslist.push(...data.data)
					this.time = data.data[0].date
				}
			},
			select(id) {
				this.removeList()
				this.clasid = id
				this.venuegetAreaApi()
				this.coent = 0
			},
			selecttime(index, time) {
				this.removeList()
				this.information.day = []
				this.indexall = index
				this.time = time
				this.venuegetAreaApi()
				this.coent = 0
			},


			affirm() {
				let orderbeforeApiObj = this.orderbeforeApi()
				let isSelected = orderbeforeApiObj.areaDetail.every((item) => {
					return item.length == 0
				})
				// console.log(isSelected, 'isSelected');
				if (isSelected) {
					uni.showToast({
						title: "请选择时间",
						icon: "error"
					})
				} else {
					console.log(orderbeforeApiObj);

				}


			},
			orderbeforeApi() {
				this.areaDetail = []
				let arr = this.index_1
				arr.forEach(element => {
					this.areaDetail.push({
						areaId: element.id,
						times: element.data,
					})
				})

				return {
					goodsId: this.information.id,
					orderType: 2,
					areaDetail: this.areaDetail,
					fixedDate: this.time
				}
			}
		},

	}
</script>

<style>
	page {
		background-color: #FAFAFA;
	}
</style>
<style scoped lang="scss">
	::v-deep .vue-ref {
		padding-bottom: 0 !important;
	}



	.head {
		width: 750rpx;
		height: 638rpx;
		background: linear-gradient(180deg, #49AFFF 0%, rgba(206, 227, 243, 0) 99%);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.nav {
		margin: 82rpx 0 50rpx;
	}

	.one-box {
		width: 690rpx;
		padding: 44rpx 0;
		box-sizing: border-box;
		margin: 24rpx auto;


		.one-box-item {
			height: 172rpx;
			position: relative;

			.one-box-item_img {
				width: 109rpx;
				height: 109rpx;
				border-radius: 34rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 34rpx;
				}
			}



			.one-box-item_top {
				width: 26rpx;
				height: 26rpx;
				background: #49AFFF;
				border-radius: 50%;
				position: absolute;
				top: 2rpx;
				left: -5rpx;
				z-index: 9;
			}
		}
	}

	.two-box {
		width: 721rpx;
		height: 306rpx;

		.two-box-nike {
			width: 200rpx;
			height: 63rpx;
			line-height: 63rpx;
		}

		.two-box-tebu {
			width: 200rpx;
			height: 63rpx;
			line-height: 63rpx;
			border: 1rpx solid #0E1115;
		}

		.two-box-map {
			width: 680rpx;
			height: 77rpx;

			// line-height: 77rpx;
			.two-box-pic {
				width: 36rpx;
				height: 36rpx;

				image {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}

	.three-box {
		width: 721rpx;
		height: 205rpx;
		margin: 18rpx auto 12rpx;

		.three-box-bc {
			width: 101rpx;
			height: 63rpx;
			line-height: 63rpx;
		}
	}

	.five-box {
		width: 100%;
		// height: 0;
		box-shadow: 0rpx -1rpx 9rpx 0rpx rgba(0, 0, 0, 0.09);
		border-radius: 28rpx 28rpx 0rpx 0rpx;
		position: fixed;
		bottom: 0;
		animation: myfirst 1s linear;
		/* Safari 与 Chrome */
		-webkit-animation: myfirst 1s;
		animation-fill-mode: forwards;
		overflow-y: scroll;

		.five-box_conten {
			height: 200rpx;
			display: flex;
			align-items: center;
			white-space: nowrap;
			overflow-x: scroll;
		}

		.five-box-top {
			width: 202rpx;
			height: 100rpx;
			border-radius: 6rpx 6rpx 0rpx 0rpx;
		}

		.five-box-bottom {
			width: 202rpx;
			line-height: 76rpx;
			box-shadow: 0rpx 1rpx 12rpx 0rpx rgba(0, 0, 0, 0.15);
			border-radius: 6rpx;
		}

		.btn-box {
			width: 347rpx;
			height: 96rpx;
			line-height: 96rpx;
			margin-left: 115rpx;
		}
	}

	@keyframes myfirst {
		from {
			height: 0rpx;

		}

		to {
			height: 350rpx;
		}
	}

	.reserve_hadr {

		.reserve_hadr_time {
			background: #64BAFD;
			border-radius: 25rpx 25rpx 0rpx 0rpx;
			height: 130rpx;

			margin: 0 auto;

			.reserve_hadr_time_box {
				width: 113rpx;
				height: 92rpx;
				border-radius: 8rpx 8rpx 0rpx 0rpx;
				margin-top: 40rpx;
				color: #FCFEFF;

				.reserve_hadr_time_1 {
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					line-height: 37rpx;
					letter-spacing: 1px;
					text-align: center;
					margin-top: 10rpx;
				}

				.reserve_hadr_time_2 {
					font-size: 24rpx;
					font-weight: 400;
					line-height: 33rpx;
					text-align: center;
				}
			}
		}
	}

	.reserve_state_box {
		width: 440rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		margin-bottom: 40rpx;

		.reserve_state_box_content_1_1 {
			width: 28rpx;
			height: 28rpx;
			background: #EEF1F6;
			border-radius: 3rpx;
			margin: 0 auto;
		}

		.reserve_state_box_content_2_2 {
			width: 28rpx;
			height: 28rpx;
			background: #BDBEC0;
			border-radius: 3rpx;
			margin: 0 auto;
		}

		.reserve_state_box_content_3_3 {
			width: 28rpx;
			height: 28rpx;
			background: #64BAFD;
			border-radius: 3rpx;
			margin: 0 auto;
		}
	}

	.complex {}

	.complex_box {
		width: 95%;
		margin: 0 auto;
		display: flex;
	}

	.complex_box_hadr {
		display: flex;
		margin-left: 10rpx;
		padding: 0 30rpx 30rpx 0;
		overflow-x: scroll;

	}

	.complex_box_hadr_jue {
		// display: flex;
		text-align: center;
		margin-left: 20rpx;

		.complex_box_hadr_jue_title {
			font-size: 20rpx;
			font-weight: 600;
			color: #0E1115;
			letter-spacing: 1px;
		}

		.complex_box_hadr_jue_text {
			padding: 0 10rpx;
			height: 40rpx;
			background: #EEF1F6;
			border-radius: 12rpx;
			margin-top: 20rpx;
			text-align: center;
			line-height: 40rpx;
		}

		.complex_box_hadr_jue_text.active {
			background: #64BAFD;
			color: #FFFFFF;
		}
	}

	.complex_box_hadr_item {
		display: flex;
		flex-direction: column;
		// flex-wrap: wrap;
		margin-top: 55rpx;
		margin-left: 10rpx;

		.complex_box_hadr_item_text {
			height: 40rpx;
			margin-top: 20rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #0E1115;
			line-height: 40rpx;
			letter-spacing: 1px;
		}
	}

	.bottom_button {
		padding-bottom: 30rpx;
	}

	// 日期选择
	.dates {
		border-radius: 16rpx 16rpx 16rpx 16rpx;


		width: 690rpx;
		background: #FFFFFF;
		padding: 0 55rpx 30rpx 55rpx;


		margin: 30rpx auto;
		margin-bottom: 40rpx;

		.dates-list {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: #232323;

			.text {
				height: 31rpx;
				font-weight: 500;
				font-size: 26rpx;
				line-height: 31rpx;
				letter-spacing: 1px;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.num {
				width: 58rpx;
				height: 58rpx;
				font-weight: 400;
				font-size: 24rpx;
				line-height: 62rpx;
				text-align: center;
				margin: 0 auto;
				margin-top: 16rpx;
				border-radius: 50%;
			}
		}

		.dates-list.act {
			color: #4AB0FF;

			.num {
				color: #fff;
				background-color: #4AB0FF;
			}

		}
	}

	// 场馆列表
	.venue-list {
		width: 100%;

		.venue-list_item {
			width: 32%;
		}

		.venue-list-c {
			height: 74rpx;
			background: rgba(173, 173, 173, 0.1);
			border-radius: 464rpx 464rpx 464rpx 464rpx;
			text-align: center;
			line-height: 80rpx;
			color: #ADADAD;
			font-size: 24rpx;
			padding: 0 22rpx;
			box-sizing: border-box;
			margin: 20rpx auto 0;
		}

		.venueActive {
			background: rgba(74, 176, 255, 0.1) !important;
			color: #4AB0FF !important;
		}
	}


	.card {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		padding: 40rpx;
		box-sizing: border-box;
		margin: 0 auto;

		.popup-box_content {
			.popup-box_content_item {
				width: 284rpx;
				height: 194rpx;
				background: #F9FAFB;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				height: 194rpx;
				padding: 18rpx;
				box-sizing: border-box;
				font-size: 22rpx;
				color: #88898B;
				position: relative;

				.popup-box_content_item_xz {
					width: 40rpx;
					height: 40rpx;
					background: #49AFFF;
					position: absolute;
					border-radius: 50%;
					left: -10rpx;
					top: -10rpx;
					padding: 2rpx 0 0 4rpx;
				}
			}


		}

	}

	.popActive {
		background: rgba(74, 176, 255, 0.2) !important;
		color: #27A1FF !important;

		.price {
			color: #FC503A !important;
		}
	}

	.popup_bom {

		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(100, 186, 253, 0.25);
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		padding: 28rpx;
		box-sizing: border-box;

		.popup_bom_title {
			font-size: 24rpx;
			color: #6B6B6B;
			line-height: 24rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #E8E8E8;

			image {
				width: 24rpx;
				height: 20rpx;
			}
		}

		.btn {
			width: 690rpx;
			height: 96rpx;
			background: #64BAFD;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			font-size: 32rpx;
			color: #FBFDFF;
			line-height: 96rpx;
			text-align: center;
			margin-top: 50rpx;
		}
	}

	.scroll_box {
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.popup_bom_item {
		width: 160rpx;
		height: 172rpx;
		background: url('../static/icon8.png') no-repeat;
		background-size: 100% 100%;
		position: relative;
		display: inline-block;

		.text-1 {
			text-align: center;
			font-size: 24rpx;
			color: #0190DE;
			box-sizing: border-box;
		}

		.text-2 {
			position: absolute;
			font-weight: 400;
			font-size: 26rpx;
			color: #FFFFFF;
			bottom: 16rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>