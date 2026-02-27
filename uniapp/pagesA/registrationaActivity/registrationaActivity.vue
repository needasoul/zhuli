<template>
	<view v-show="display">

		<headBg :title='"报名活动"'></headBg>
		<!-- 体育晚托班信息 -->
		<view class="card zindex">
			<view class="card_title">
				{{content.data.venue}}
			</view>
			<view class="message-box d-flex pt-30 pb-26 ">
				<view class="message-img br-8">
					<image :src="content.data.image" mode="" class="br-8"></image>
				</view>
				<view class="ml-24 flexColumn message_right" style="position: relative;">
					<view class="flexc flexs">
						<view style="width: 220rpx;" class="f-size-28 f-600 me-text-beyond color-0">
							{{content.data.ac_name}}
						</view>
						<view class="f-size-28 f-600  color-0">
							￥{{content.price}}
						</view>
					</view>

					<view class="f-size-24 f-500 color-6 me-text-beyond">
						{{content.data.cc_title}}
					</view>
					<view class="f-size-24 f-500 color-6 me-text-beyond-multi">
						{{content.data.workrange}}
					</view>
					<view class="f-size-24 f-500 color-6 me-text-beyond">
						{{content.data.type}}
					</view>
				</view>

			</view>
			<view class="message-box_card">
				<!-- v-for="(item,index)  in userList " :key="index" -->
				<view class="message-box_card_item">
					<view class="message-box_card_item_ipt flexc flexs">
						<span>入场人员</span>
						<input type="text" v-model="name" placeholder="请输入" placeholder-style="color:#C0C4CC;" />
					</view>
					<view class="message-box_card_item_ipt flexc flexs">
						<span>手机号</span>
						<input maxlength="11" type="text" v-model="mobile" placeholder="请输入"
							placeholder-style="color:#C0C4CC;" />
					</view>
				</view>
			</view>
			<!-- 	<view class="flexs">
				<view class=""></view>
				<view class="add_user flexc " @click="addshow=true">
					<view class="add_user_btn">
						+
					</view><span>添加人员</span>
				</view>
			</view> -->

		</view>


		<!-- 支付 -->
		<view class="btn-box bg-f ">

			<view class="">
				<view class="mb-40">
					<text class="f-400 color-22 mr-14" style="font-size: 32rpx;">总计金额</text>
					<text class="f-600 color-22" style="font-size: 40rpx;">¥{{content.price}}</text>
				</view>
				<view class="btn color-f txt-center" @click="promptly()">
					立即支付
				</view>
			</view>
		</view>
		<u-modal :show="show" @confirm="confirm" @cancel="showModal" ref="uModal" :showCancelButton='true'
			title="是否前往了解活动协议"></u-modal>

		<u-popup :show="addshow" @close="addshow=false">
			<view class="add_card">
				<view class="add_card_head flexc flexs">
					<view class=""> </view>
					<view class="f-size-32 f-600">添加人员</view>
					<image @click="addshow=false" src="../../static/pagesB/close.png" mode=""></image>
				</view>
				<view class="">
					<view class="add_card_item_ipt flexc flexs">
						<span>姓名</span>
						<view class="flexc">
							<input type="text" v-model='addUser' placeholder="请输入" placeholder-style="color:#C0C4CC;" />
							<image class="mt-4 ml-14" src="@/static/pagesB/icon1.png" mode=""></image>
						</view>
					</view>
					<view class="add_card_item_ipt flexc flexs">
						<span>电话</span>
						<view class="flexc">
							<input maxlength="11" type="text" v-model='addmobile' placeholder="请输入"
								placeholder-style="color:#C0C4CC;" />
							<image class="mt-4 ml-14" src="@/static/pagesB/icon1.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="btn  color-f txt-center" @click="setaddUser">
					确定
				</view>
			</view>
		</u-popup>

		<!-- 支付 -->
		<paypopup ref='paypopup' :show='payshow' :pageurl="'/pagesA/orderActivity/orderActivity'" @close='payshow=false'
			:orderNoObj='orderNoObj' @payChannel='payChannel'></paypopup>
	</view>
</template>

<script>
	import {
		orderbefore,
		ordercreate,
		orderpay,
		usergetUserInfo,
		Bind_to_wechat,
		getopenid,
		getActivityDetails
	} from "@/api/comm.js"
	import
	news
	from "@/utils/wxApi.js"
	export default {
		data() {
			return {
				addUser: "",
				addmobile: "",
				godelist: {},
				checked: false,
				addshow: false,
				payshow: false,
				orderNo: "",
				// 基本案列数据
				radiolist1: [{
						name: '2人',
						disabled: false
					},
					{
						name: '3人',
						disabled: false
					},
					{
						name: '4人',
						disabled: false
					},
				],
				name: '',
				mobile: '',
				radiovalue1: '',
				radiolist2: true,
				// 名单
				// 手机号
				cell: '',
				int: {},
				content: {},
				show: false,
				display: false,
				openid: '',
				userList: [],
				areaId: '',
				ispay: true,
				orderNoObj: {}
			}
		},
		onLoad(e) {
			let openid = uni.getStorageSync('openid')
			if (openid) {
				this.openid = openid
			} else {
				this.getopenidApi()
			}
			this.getActivityDetailsApi(e.id, e.areaId)
			this.areaId = e.areaId
		},
		onShow() {
			this.$refs.paypopup.getUser()
		},
		methods: {
			async getActivityDetailsApi(id, areaId) {
				let data = await getActivityDetails({
					id: id
				})
				if (data.code == 1) {
					this.int = data.data
					this.radiolist1 = data.enroll_num
					orderbefore({
						orderType: 4,
						goodsId: id,
						hd_cc_id: areaId
					}).then(res => {
						this.content = res.data
						this.display = true
					})
				}
			},
			payChannel(e) {
				console.log('ee', e);
				this.orderNoObj.payChannel = e
			},
			async getopenidApi() {
				uni.login({
					success: async (res) => {
						let res1 = await getopenid({
							code: res.code
						})
						if (res1.code == 1) {
							this.openid = res1.data.openid
						} else {
							this.showToast(res.msg)
						}
					}
				})
			},
			setaddUser() {
				let cell =
					/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
				if (!cell.test(this.addmobile)) {
					uni.showToast({
						title: '手机号有误',
						icon: 'none',
					})
					return
				}
				this.userList = []
				this.userList.push({
					name: this.addUser,
					mobile: this.addmobile
				})
				this.addshow = false
				this.addUser = ''
				this.addmobile = ''
				this.$forceUpdate()
			},
			checkboxChange(event) {
				this.checked = event.detail
			},
			showModal() {
				uni.navigateTo({
					url: '/pagesA/agreement/agreement?name=' + '活动协议'
				})
			},

			async promptly() {
				if (!this.ispay) {
					return this.showToast('请勿重复点击')
				}
				this.ispay = false
				setTimeout(() => {
					this.ispay = true
				}, 2000)
				let radiolist2 = 1
				let that = this
				if (this.radiolist2) {
					radiolist2 = 1
				} else {
					radiolist2 = 0
				}
				let cell =
					/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
				if (!cell.test(this.mobile)) {
					this.showToast('手机号有误')
					return
				}
				if (!this.name) return this.showToast('请输入姓名')
				this.userList = []
				this.userList.push({
					mobile: this.mobile,
					name: this.name
				})

				this.orderNoObj = {
					nameList: this.userList,
					entrants: this.radiovalue1,
					orderType: 4,
					goodsId: this.int.id,
					payChannel: 1,
					hd_cc_id: this.areaId
				}
				this.payshow = true
			},
		}
	}
</script>

<style>
	page {
		background: #FAFAFA;
	}
</style>
<style scoped lang="scss">
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

	.card {
		width: 690rpx;
		background: linear-gradient(180deg, #CAE8FF 0%, #FFFFFF 40%, #FFFFFF 80%, #FFFFFF 100%);
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		padding: 34rpx 32rpx;
		box-sizing: border-box;
		margin: 0 auto;



		.card_title {
			font-weight: 600;
			font-size: 32rpx;
			color: #282828;
		}

		.add_user {
			margin: 24rpx 0 0;
			font-size: 24rpx;
			color: #00C0FF;
			text-align: right;

			.add_user_btn {
				width: 32rpx;
				height: 32rpx;
				border: 1rpx solid #00C0FF;
				color: #00C0FF;
				line-height: 30rpx;
				text-align: center;
				border-radius: 50%;
				margin-right: 12rpx;
			}
		}
	}

	.message-box {

		.message-img {
			width: 246rpx;
			height: 180rpx;

			image {
				width: 246rpx;
				height: 100%;
				vertical-align: top;
			}
		}

		.message_right {
			width: calc(100% - 246rpx - 20rpx);
		}
	}

	.btn-box {
		width: 100%;
		border-radius: 28rpx 28rpx 0rpx 0rpx;
		position: fixed;
		bottom: 0;
		padding: 28rpx 30rpx;
		box-sizing: border-box;
		z-index: 9;

		.btn {
			text-align: center;
			line-height: 84rpx;
			width: 690rpx;
			height: 84rpx;
			background: #64BAFD;
			border-radius: 22rpx 22rpx 22rpx 22rpx;
		}
	}

	.top-box {
		margin-top: 30rpx;
		padding: 30rpx 32rpx 0 33rpx;
		height: 103rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.top-box_title {}

		.top-box_scoll {
			width: 530rpx;
			overflow-x: auto;
			white-space: nowrap;
		}
	}

	.middle-box {
		padding: 0 32rpx 0 33rpx;
		height: 103rpx;
		display: flex;
		align-items: center;

	}

	::v-deep .u-radio {
		margin-right: 50rpx !important;
	}

	.buttom-box {
		margin-top: 70rpx;

		button {
			width: 90%;
			background-color: #64BAFD;
			color: #FFFFFF;
		}
	}

	.time_price {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #DFDFDF;
		padding-top: 20rpx;
		padding-bottom: 20rpx;

		.time_price_left {
			font-size: 26rpx;
			font-weight: 400;
			color: #282828;
		}

		.time_price_right {
			font-size: 26rpx;
			font-weight: 400;
			color: #282828;
			letter-spacing: 1px;
		}
	}

	.message-box_card {
		.message-box_card_item {
			.message-box_card_item_ipt {
				padding: 24rpx 0;
				box-sizing: border-box;
				border-bottom: 1rpx solid #E4E7ED;



				span {
					font-size: 28rpx;
					color: #575757;
					font-weight: 600;
				}

				input {
					text-align: right;
				}

			}
		}

	}

	.add_card {
		padding: 32rpx 46rpx;
		box-sizing: border-box;
		border-radius: 40rpx 40rpx 0rpx 0rpx;

		.add_card_head {
			image {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.add_card_item_ipt {
			padding: 42rpx 0 10rpx;
			border-bottom: 1rpx solid #eee;

			span {
				font-size: 28rpx;
				color: #666666;
			}

			image {
				width: 28rpx;
				height: 28rpx;
			}

			input {
				text-align: right;
			}
		}

		.btn {
			text-align: center;
			line-height: 84rpx;
			width: 658rpx;
			height: 84rpx;
			background: #64BAFD;
			border-radius: 22rpx 22rpx 22rpx 22rpx;
			margin-top: 70rpx;
		}
	}
</style>