<template>
	<view v-if="display">
		<!-- 场馆类型 -->
		<view class="one-box bg-f br-18 pt-38">
			<view class="d-flex ml-32 mb-30">
				<view class="f-size-34 f-600 color-38">场馆类型</view>
			</view>
			<scroll-view scroll-x="true">
				<view class="d-flex ml-26">
					<view class="one-box-item txt-center br-36 mr-32" v-for="(item,index) in Venuetype" :key="item.id"
						@click="select(item.id)">
						<image :src="item.id==clasid?item.imaged:item.icon  " mode=""
							:style="{color:item.id==clasid?'#64BAFD':'',background:item.id==clasid?'#64BAFD':'','border-radius':item.id==clasid?'30rpx':'0'  }">
						</image>
						<view :style="{color:item.id==clasid?'#64BAFD':'' }" class="f-size-26 f-400 color-0E11 mt-12">
							{{item.venue_type}}
						</view>

					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 日期选择 -->
		<view class="dates">
			<view class="dates-list" :class="{act:indexall==index}" v-for="(item,index) in venuetimeslist" :key="index"
				@click="selecttime(index,item.date)">
				<view class="text">
					{{item.xq}}
				</view>
				<view class="num">
					{{item.date_jl}}
				</view>
			</view>
		</view>
		<!-- 场馆列表 -->
		<view class="venue-list">
			<view class="venue-list-c" v-for="(itemall,indexall) in information.day" :key="itemall.id"
				@click="venueReservation(itemall)">
				<image class="venue-img" :src="information.image" mode="aspectFill"></image>
				<view class="info">
					<view class="name">
						{{itemall.name}}
					</view>
					<view class="address">
						{{information.address}}
					</view>
					<view class="money">
						<text class="money-text">￥</text>{{itemall.rule[0].price}}
					</view>
				</view>
			</view>
		</view>
		<view class="complex" v-if="information.day.length<1">
			<view class="complex_box">
				<view style="margin: 40rpx auto;">
					<u-empty mode="data" icon="/static/images/order_form.png">
					</u-empty>
				</view>
			</view>
		</view>
		<!-- 时间选择 -->
		<view style="height:400rpx;" v-show="coent>0">

		</view>
		<!-- 确认 -->
		<view class="five-box bg-f pt-32" v-show="coent>0">
			<!-- <view class="five-box_conten" v-for="(itemall,indexall) in index_1" :key="itemall"> -->
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
		<uni-popup ref="popup" type="bottom">
			<view class="popup-box-bottom">
				<view class="top">
					<view class="name">
						{{chooseVenueInfo.name ||　''}}
					</view>
					<view class="guan" @click="close">
						X
					</view>
				</view>
				<view class="type">
					<view class="types type1">
						<view class="bg">

						</view>
						<view class="text">
							可预订
						</view>
					</view>
					<view class="types type2">
						<view class="bg">

						</view>
						<view class="text">
							不可选
						</view>
					</view>
					<view class="types type3">
						<view class="bg">

						</view>
						<view class="text">
							已选定
						</view>
					</view>
				</view>
				<view class="piao-list">
					<view class="piao-list-c" :class="{shouWan:item.status == 2,act:item.isSelect}"
						v-for="(item,index) in chooseVenueInfo.rule" :key="item.id"
						@click="selectTime(chooseVenueInfo.rule[index])">
						<view class="time">
							{{item.time}}
						</view>
						<view class="price">
							<view class="" v-if="item.status == 1">
								<text class="price-text">￥</text> {{item.price}}
							</view>
							<view class="" v-if="item.status == 2">
								售完
							</view>
						</view>

					</view>
				</view>
				<view class="bottom">
					<view class="jine">
						总计金额:<text class="jine-text">￥</text>{{price}}
					</view>
					<view class="button" @click="newAffirm()">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
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
				venueid: '',
				clasid: '',
				Venuetype: [],
				venuetimeslist: [],
				indexall: 0,
				time: '',
				information: {},
				judge: [],
				final_time: [],
				index_1: [], // 选中的数据
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
				chooseVenueInfo: {},

			}
		},
		onLoad(content) {
			console.log(content);
			this.venueid = content.venueid
			this.clasid = content.clasid
			this.venuegetVenueTypeApi(content.venueid)
			this.venuetimes()
		},
		methods: {
			// 确定
			newAffirm() {
				// goodsId: this.information.id,
				// orderType: 2,
				// areaDetail: this.areaDetail,
				// fixedDate: this.time
				let obj = {}
				obj.fixedDate = this.time
				obj.orderType = 2
				obj.goodsId = this.information.id
				obj.areaDetail = this.areaDetailNew
				if (obj.areaDetail[0].times.length) {
					uni.navigateTo({
						url: '/pages/bookingAppointment/bookingAppointment?areaDetail=' + JSON
							.stringify(obj)
					})
				} else {
					uni.showToast({
						title: "请选择时间",
						icon: "error"
					})
				}
				console.log(obj);

			},
			// 时间选择
			selectTime(item) {
				// console.log('item', item);
				if (item.status == 2) {
					return
				}
				item.isSelect = !item.isSelect

				console.log(this.chooseVenueInfo);
				// console.log('this.areaDetailNew', this.areaDetailNew);
				this.areaDetailNew[0].times = []
				this.areaDetailNew[0].areaId = this.chooseVenueInfo.id
				this.chooseVenueInfo.rule.forEach((item) => {
					if (item.isSelect) {
						this.areaDetailNew[0].times.push({
							price: item.price,
							terminus: this.chooseVenueInfo.name,
							time: item.time,
							ynd: this.time,
						})
					}
				})
				let price = 0
				this.areaDetailNew[0].times.forEach((item) => {
					price += item.price * 1

				})
				this.price = price.toFixed(2)
				console.log(this.areaDetailNew);
			},
			close() {
				this.$refs.popup.close()
			},
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open('bottom')
			},
			// 场地预定
			venueReservation(item) {

				if (this.chooseVenueInfo.id && (item.id == this.chooseVenueInfo.id)) {
					this.open()
					return
				}

				this.areaDetailNew[0].times = []
				this.areaDetailNew[0].areaId = this.chooseVenueInfo.id
				this.price = 0.00
				console.log(item);
				let obj = JSON.parse(JSON.stringify(item))
				obj.rule.forEach((item) => {
					item.isSelect = false
					item.fullTime = this.time + ' ' + item.time
				})

				if (this.indexall == 0) {
					console.log('第一个', this.time, obj);
					let rule = []
					obj.rule.forEach((item) => {
						if (!funTime.isTimeout(item.fullTime)) {
							rule.push(item)
						}
					})
					obj.rule = rule
				}
				this.chooseVenueInfo = obj
				console.log(this.chooseVenueInfo);
				this.open()
			},
			// 场馆类型
			async venuegetVenueTypeApi(id) {
				let data = await venuegetVenueType({
					id: id
				})
				console.log(data);

				this.Venuetype.push(...data.data)
				if (this.clasid == " ") {
					console.log('无id');
					this.clasid = this.Venuetype[0].id
					this.venuegetAreaApi()
				} else {
					console.log('有id');
					this.venuegetAreaApi()
				}
			},
			async venuegetAreaApi() {
				uni.showLoading({

				})
				let data = await venuegetArea({
					typeId: this.clasid,
					venueId: this.venueid,
					time: this.time
				})
				console.log('data.data[0]', data.data[0]);
				this.information = data.data[0]
				this.display = true
				console.log(this.information, '看');
				this.index_1 = []
				this.information.day.forEach((element, index) => {
					this.index_1.push({
						id: element.id,
						data: [],
						site: element.name
					})
				})
				uni.hideLoading()
			},
			// 场地时间
			async venuetimes() {
				let data = await venuetimes({})

				this.venuetimeslist.push(...data.data)
				console.log('this.venuetimeslist', this.venuetimeslist);
				this.time = data.data[0].date
			},
			select(id) {
				this.clasid = id
				this.venuegetAreaApi()
				this.coent = 0
			},
			selecttime(index, time) {
				this.chooseVenueInfo = {}
				this.indexall = index
				this.time = time
				this.venuegetAreaApi()
				this.coent = 0
			},

			selected_scenes(itemall, item, content, time) {
				if (item.status == 1) {
					if (item.style == '') {
						item.style = "active"
						this.coent++
					} else {
						item.style = ''
						this.coent--
					}

				} else {
					console.log('无法预定');
				}
				this.information.day.forEach((element, index) => {
					console.log(element);
					let show = true
					if (content == index) {
						this.index_1[index].data.forEach((all, indexall) => {
							console.log(element.rule[time].time, all.time);
							if (element.rule[time].time == all.time) {
								this.index_1[index].data.splice(indexall, 1)
								show = false
							}
						})
						if (show) {
							this.index_1[index].data.push({
								time: element.rule[time].time,
								terminus: element.name,
								ynd: this.time,
								price: element.rule[time].price
							})
							this.index_1[index].data = [...new Set(this.index_1[index].data)]
						} else {}
						console.log(this.index_1);

					} else {}
				})
				let price = 0
				this.index_1.forEach(element => {
					console.log(element, '这里');
					element.data.forEach(elementall => {
						price += elementall.price * 1
					})
					this.price = price.toFixed(2)
				})

				// console.log(prv);
				console.log('选中数据', this.index_1);
				// 处理选中的数据
				this.selectedData = this.index_1.reduce((prev, next) => {
					if (next.data.length) {
						prev.push(...next.data)
						return prev
					} else {
						return prev
					}
				}, [])
			},
			affirm() {
				// console.log('this.orderbeforeApi()', this.orderbeforeApi());
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
					// uni.navigateTo({
					// 	url: '/pages/bookingAppointment/bookingAppointment?areaDetail=' + JSON
					// 		.stringify(orderbeforeApiObj)
					// })
				}
				// orderbeforeApiObj.areaDetail.forEach(element => {
				// 	if (element.times.length > 0) {
				// 		uni.navigateTo({
				// 			url: '/pages/bookingAppointment/bookingAppointment?areaDetail=' + JSON
				// 				.stringify(orderbeforeApiObj)
				// 		})
				// 	} else {

				// 	}
				// })

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
				// let data = await orderbefore({
				// 	orderType: 2,
				// 	areaDetail: this.areaDetail
				// })
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

	::v-deep .popup-box-bottom {
		padding-bottom: 40rpx;
	}

	.one-box {
		width: 721rpx;
		height: 306rpx;
		margin: 24rpx auto;


		.one-box-item {
			height: 172rpx;

			image {
				width: 109rpx;
				height: 109rpx;
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
		width: 750rpx;
		height: 126rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		padding: 0 55rpx 0 55rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;
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
				height: 29rpx;
				font-weight: 400;
				font-size: 24rpx;
				line-height: 29rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin-top: 6rpx;
			}
		}

		.dates-list.act {
			color: #64BAFD;
		}
	}

	// 场馆列表
	.venue-list {
		width: 100%;
		padding: 0 15rpx;
		box-sizing: border-box;

		.venue-list-c {
			display: flex;
			width: 100%;
			height: 187rpx;
			background: #FFFFFF;
			border-radius: 18rpx 18rpx 18rpx 18rpx;
			padding: 26rpx 20rpx 40rpx 20rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;

			.venue-img {
				width: 121rpx;
				height: 121rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}

			.info {
				.name {
					height: 31rpx;
					font-weight: 700;
					font-size: 32rpx;
					color: #3D3D3D;
					line-height: 31rpx;
					letter-spacing: 1px;
					text-align: left;
					font-style: normal;
					text-transform: none;
					margin-top: 6rpx;
				}

				.address {
					height: 29rpx;
					font-weight: 400;
					font-size: 22rpx;
					color: #666666;
					line-height: 29rpx;
					letter-spacing: 1px;
					text-align: left;
					font-style: normal;
					text-transform: none;
					margin: 15rpx 0 15rpx 0;
				}

				.money {
					height: 22rpx;
					font-family: Source Han Sans, Source Han Sans;
					font-weight: 700;
					font-size: 30rpx;
					color: #E1222A;
					line-height: 22rpx;
					text-align: left;
					font-style: normal;
					text-transform: none;

					.money-text {
						height: 22rpx;
						font-family: Source Han Sans, Source Han Sans;
						font-weight: 400;
						font-size: 24rpx;
						color: #E1222A;
						line-height: 22rpx;
						text-align: left;
						font-style: normal;
						text-transform: none;
					}
				}
			}
		}
	}

	.popup-box-bottom {
		width: 750rpx;
		height: 865rpx;
		background: #FFFFFF;
		border-radius: 50rpx 50rpx 0rpx 0rpx;
		padding: 55rpx 35rpx 0 35rpx;
		box-sizing: border-box;

		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.name {
				height: 31rpx;
				font-family: Source Han Sans, Source Han Sans;
				font-weight: 500;
				font-size: 32rpx;
				color: #0E1115;
				line-height: 31rpx;
				letter-spacing: 1px;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.guan {
				font-size: 30rpx;
				width: 25rpx;
				height: 25rpx;
				color: #1E1E1E;
			}
		}

		.type {
			display: flex;
			align-items: center;
			margin-top: 32rpx;
			margin-bottom: 25rpx;

			.types {
				display: flex;
				align-items: center;
				margin-right: 50rpx;

				.bg {
					margin-right: 10rpx;
					width: 28rpx;
					height: 28rpx;
					background: #8D9CB6;
					border-radius: 3rpx 3rpx 3rpx 3rpx;
				}

				.text {
					height: 26rpx;
					font-family: Source Han Sans, Source Han Sans;
					font-weight: 400;
					font-size: 22rpx;
					color: #0E1115;
					line-height: 26rpx;
					letter-spacing: 1px;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}
			}

			.type2 {
				.bg {
					background: #FF3F2A;
				}
			}

			.type3 {
				.bg {
					background: #64BAFD;
				}
			}
		}

		.piao-list {
			position: relative;
			display: flex;
			flex-wrap: wrap;
			// justify-content: space-between;

			.piao-list-c {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 116rpx;
				height: 96rpx;
				background: #8D9CB6;
				border-radius: 4rpx 4rpx 4rpx 4rpx;
				margin-bottom: 25rpx;
				margin-right: 25rpx;

				.time {
					position: absolute;
					display: flex;
					justify-content: center;
					align-items: center;
					left: 0;
					top: 0;
					width: 62rpx;
					height: 28rpx;
					// background: #D0D2D6;
					background: rgba(255, 255, 255, 0.5);
					border-radius: 4rpx 0rpx 4rpx 0rpx;
					font-weight: 400;
					font-size: 20rpx;
					color: #FFFFFF;
				}

				.price {
					font-weight: 700;
					font-size: 32rpx;
					color: #fff;

					.price-text {
						font-weight: 400;
						font-size: 23rpx;
						color: #fff;
					}
				}

			}

			.piao-list-c.shouWan {
				background: #FF3F2A;

				.price {
					color: white;

					.price-text {
						color: white;
					}
				}
			}

			.piao-list-c.act {
				background: #64BAFD;

				.time {
					background: rgba(255, 255, 255, 0.35);
				}

				.price {
					color: white;

					.price-text {
						color: white;
					}
				}

			}

			.piao-list-c:nth-child(5n) {
				margin-right: 0;
			}
		}

		.bottom {
			position: absolute;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 750rpx;
			height: 193rpx;
			background: #F9FBFF;
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			box-sizing: border-box;
			padding: 0 35rpx;

			.jine {
				font-weight: 700;
				font-size: 30rpx;
				color: #0E1115;

				.jine-text {
					font-size: 24rpx;
				}
			}

			.button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 299rpx;
				height: 82rpx;
				background: #64BAFD;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				font-weight: 700;
				font-size: 32rpx;
				color: #FBFDFF;
			}
		}
	}
</style>