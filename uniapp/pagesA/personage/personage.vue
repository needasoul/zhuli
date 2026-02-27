<template>
	<view>
		<view class="head">
			<image src="/pagesA/static/icon6.png" mode=""></image>
			<!-- #ifdef MP-WEIXIN -->
			<navbar :title="'个人资料'" :color="'#fff'"></navbar>
			<!-- #endif -->
		</view>
		<view class="content zindex">
			<view class="" style="position: relative;">
				<button style="margin-top: -60rpx;" size='mini' open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="user_class_2_img" :src="imgall" mode="" />
				</button>
				<image class="editImg" src="../static/icon9.png" mode=""></image>
			</view>
			<view class="content_1">
				个人信息
			</view>
			<view class="user_class">
				<view class="user_class_1">
					<view class="user_class_1_left">
						昵称
					</view>
					<view class="user_class_1_right">
						<input class="user_class_1_right_text" maxlength="20" v-model="user_name" type="nickname"
							placeholder="请输入昵称" @change="inputuser" />
					</view>
				</view>
				<view class="user_class_1">
					<view class="user_class_1_left">
						手机号
					</view>
					<view class="user_class_1_right">
						<input type="text" placeholder="填写手机号" @blur="blur" @focus="focus" maxlength="11"
							v-model="cell" />
					</view>
				</view>

				<view class="user_class_1">
					<view class="user_class_1_left">
						出生日期
					</view>
					<view class="user_class_time_box flexc flexs">
						<view class="user_class_time_box_item flexc" @click="setshow(1)">
							<input disabled="true" v-model="year" type="text" placeholder="年" />
							<view class="pt-6" style="height: 28rpx;">
								<u-icon name="arrow-down" size="16"></u-icon>
							</view>
						</view>
						<view class="user_class_time_box_item flexc" @click="setshow(2)">
							<input disabled="true" v-model="mouth" type="text" placeholder="月" />
							<view class="pt-6" style="height: 28rpx;">
								<u-icon name="arrow-down" size="16"></u-icon>
							</view>
						</view>
						<view class="user_class_time_box_item flexc" @click="setshow(3)">
							<input type="text" disabled="true" v-model="day" placeholder="日" />
							<view class="pt-6" style="height: 26rpx;">
								<u-icon name="arrow-down" size="16"></u-icon>
							</view>
						</view>
					</view>

				</view>

				<view class="content_1_save" @click="accomplish">
					保存
				</view>
			</view>
			<u-picker :show="show" :columns="columns" @cancel='show=false' @confirm='confirm'></u-picker>
			<!-- <u-datetime-picker :minDate="10" :maxDate=" Number(new Date())" :show="true" v-model="value1" mode="date"
				@close="close" @cancel="close"></u-datetime-picker> -->
		</view>
	</view>
</template>

<script>
	import {
		usergetUserInfo,
		userprofile,
		Bind_to_wechat
	} from "@/api/comm.js"
	import {
		toDate
	} from "@/utils/time.js"
	import {
		toHide
	} from "@/utils/toHide";
	import {
		forIn
	} from "lodash";
	import config from '@/config.js'

	export default {
		data() {
			return {
				// 初始化信息
				int: {},
				// 用户上传的头像
				imgall: '',
				// 名字
				user_name: '',
				// 邮箱
				mailbox: '',
				// 手机号
				cell: '',
				cell2: '',
				openid: '',
				loginInfo: {
					code: '',
					iv: '',
					encryptedData: ''
				},
				show: false,
				value1: Number(new Date()),
				columns: [
					[]
				],
				timeMark: 1,

				year: null,
				mouth: null,
				day: null,
				file: null
			};
		},
		onLoad() {
			this.init()
			this.getyear()
		},
		methods: {
			inputuser(e) {
				this.user_name = e.detail.value
				console.log('eee', e);
			},
			setshow(e) {
				this.columns[0] = []
				if (e == 1) {
					this.getyear()
				} else if (e == 2) {
					this.getmouth()
				} else {
					this.getday()
				}
				this.timeMark = e
				this.show = true
			},
			getyear() {
				let a = 1949;
				for (let i = 0; i < 75; i++) {
					a = a + 1
					this.columns[0].push(a)
				}
			},
			getmouth() {
				let a = 0;
				for (let i = 0; i < 12; i++) {
					a = a + 1
					this.columns[0].push(a)
				}
			},

			getday() {
				let a = 0;
				for (let i = 0; i < 31; i++) {
					a = a + 1
					this.columns[0].push(a)
				}
			},

			focus() {
				this.cell = this.cell2
			},
			blur() {
				this.cell2 = this.cell
			},
			showup() {
				console.log('触发');
				this.show = true
			},
			close() {
				this.show = false
			},
			confirm(e) {
				if (this.timeMark == 1) {
					this.year = e.value[0]
				} else if (this.timeMark == 2) {
					if (e.value[0] < 10) {
						this.mouth = "0" + e.value[0]
					} else {
						this.mouth = e.value[0]
					}
				} else if (this.timeMark == 3) {
					if (e.value[0] < 10) {
						this.day = "0" + e.value[0]
					} else {
						this.day = e.value[0]
					}
				}
				this.show = false
			},
			async init() {
				let res = await usergetUserInfo({})
				if (res.code == 1) {
					// 用户上传的头像
					this.imgall = res.data.avatar
					// 名字
					this.user_name = res.data.username
					this.cell = toHide(res.data.mobile)
					this.file = res.data.b_avatar
					this.cell2 = res.data.mobile
					this.openid = res.data.openid
					if (res.data.birthday) {
						// 出生日期
						let y = res.data.birthday.split('-')
						this.year = y[0]
						this.mouth = y[1]
						this.day = y[2]
					}

				}


			},
			accomplish() {
				let cell =
					/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
				if (!cell.test(this.cell2)) {
					uni.showToast({
						title: '手机号有误',
						icon: 'error',
					})
					return
				}
				if (this.year && this.mouth && this.day) {
					this.mailbox = this.year + "-" + this.mouth + '-' + this.day
				} else {
					return this.showToast('请填写出生日期')
				}
				userprofile({
					file: this.file,
					username: this.user_name,
					birthday: this.mailbox,
					mobile: this.cell2
				}).then(res => {
					console.log(res);
					if (res.code == 1) {
						this.init()
						this.showToast('保存成功')
						uni.navigateBack()
					} else {
						this.showToast('修改失败')

					}
				})

			},
			unbind() {
				Unbind_wechat({}).then(res => {
					console.log(res);
					if (res.code == 1) {
						this.init()
					}
				})
			},
			// 绑定微信
			getPhoneNumber(e) {
				let that = this
				console.log(e);
				let data = e.detail
				this.loginInfo.encryptedData = data.encryptedData
				this.loginInfo.iv = data.iv
				wx.login({
					timeout: 5000,
					success: (res) => {
						that.loginInfo.code = res.code
						this.set()
					},
					flil(res) {
						console.log('获取失败', res);
					},
					complete(res) {
						console.log(res);
					}
				})
			},
			set() {
				Bind_to_wechat({
					iv: this.loginInfo.iv,
					encryptdata: this.loginInfo.encryptedData,
					code: this.loginInfo.code
				}).then(res => {
					if (res.code == 1) {
						this.init()
					}
				})
			},
			quit() {
				let token = uni.getStorageSync('token')
				quit_wechat({
					token: token
				}).then(res => {
					console.log(res);
					if (res.code == 1) {
						wx.removeStorage({
							key: 'token',
						})
						wx.redirectTo({
							url: '/pages/login/login',
						})
					} else {
						this.showToast('退出失败')
					}
				})
			},
			onChooseAvatar(e) {
				console.log(e.detail.avatarUrl, '获取头像成功')
				this.imgall = e.detail.avatarUrl
				this.up()
			},
			up() {
				console.log('this.image', this.imgall);
				let token = wx.getStorageSync('userinfo')
				token = token.token
				let that = this
				uni.uploadFile({
					filePath: this.imgall,
					name: 'file',
					header: {
						token: token
					},
					url: config.uploadImgUrl + '/api/common/upload',
					success(res) {
						let img = JSON.parse(res.data)
						if (img.code == 1) {
							console.log(img.data.fullurl);
							that.imgall = img.data.fullurl
							that.file = img.data.url
						} else {
							that.showToast('上传失败')
						}

					},
					fail(res) {
						console.log(res, '====>>><<<');
						that.showToast('上传失败')
					}
				})

			},

		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	button {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}

	button::after {
		border: none;
	}

	.editImg {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		top: 80rpx;
		left: 58%;
		transform: translateX(-50%);
	}

	.content {
		padding: 0 30rpx;
		box-sizing: border-box;
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		margin-top: -50rpx;
	}


	.content_1 {
		font-weight: 600;
		font-size: 26rpx;
		color: #171717;
		line-height: 37rpx;
		letter-spacing: 1px;

		padding: 40rpx 0 0;
	}

	.user_class {
		background: #FFFFFF;
	}


	.user_class_2_img {
		width: 178rpx;
		height: 178rpx;
		border-radius: 50%;
	}

	.user_class_1 {
		margin: 0 auto;

		.user_class_time_box {

			.user_class_time_box_item {
				padding: 26rpx 28rpx;
				box-sizing: border-box;
				width: 188rpx;
				height: 94rpx;
				background: #FCFBFE;
				border-radius: 20rpx 20rpx 20rpx 20rpx;
				border: 2rpx solid #F0EFF2;

				input {
					height: 30rpx;
					text-align: center;
				}
			}
		}
	}

	.user_class_1_left {
		font-size: 26rpx;
		font-weight: 400;
		color: #171717;
		line-height: 37rpx;
		margin: 36rpx 0 24rpx;
	}

	.user_class_1_right {
		width: 690rpx;
		height: 94rpx;
		background: #FCFBFE;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		border: 2rpx solid #F0EFF2;
		padding: 24rpx 30rpx 0;
		box-sizing: border-box;

		.user_class_1_right_title {
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
			letter-spacing: 1px;
			margin-right: 20rpx;
			text-align: right;
		}
	}

	.user_class_1_right_1 {
		width: 69rpx;
		height: 69rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.user_class_1_right_text {
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
		letter-spacing: 1px;
	}

	.content_1_save {
		width: 690rpx;
		height: 84rpx;
		background: #64BAFD;
		border-radius: 22rpx 22rpx 22rpx 22rpx;
		color: #fff;
		text-align: center;
		line-height: 84rpx;
		margin: 78rpx auto 0;
	}

	.user_class_1_right_2 {
		width: 20rpx;
		height: 30rpx;
	}

	.user_class_1_right_text {
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
	}

	.binding {
		height: 100rpx;
		background: #FFFFFF;
	}

	.binding_box {
		width: 95%;
		height: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.binding_box_left {
		display: flex;
		align-items: center;
	}

	.binding_box_left_text {
		font-size: 28rpx;
		font-weight: 400;
		color: #171717;
		letter-spacing: 1px;
		margin-left: 12rpx;
	}

	.binding_box_right {
		display: flex;
		align-items: center;
	}

	.binding_box_right_name {
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
		letter-spacing: 1px;
		margin-right: 15rpx;
	}

	.binding_box_right_actve {
		width: 95rpx;
		height: 58rpx;
		background: #FEF2F2;
		border-radius: 18rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #B6333C;
		line-height: 58rpx;
		letter-spacing: 1px;
		text-align: center;
	}

	.binding_box_left_img {
		width: 32rpx;
		height: 32rpx;
		margin-top: 5rpx;
	}

	.binding_box_right_img {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: 15rpx;
	}

	.buttom {
		width: 708rpx;
		height: 79rpx;
		margin: 0 auto;
		border-radius: 40rpx;
		border: 2rpx solid #D15963;
		text-align: center;
		line-height: 79rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 600;
		color: #E84442;
		letter-spacing: 1px;
		margin-top: 150rpx;
	}

	.binding {
		height: 100rpx;
		background: #FFFFFF;
	}

	.binding_box {
		width: 95%;
		height: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.binding_box_left {
		display: flex;
		align-items: center;
	}

	.binding_box_left_text {
		font-size: 28rpx;
		font-weight: 400;
		color: #171717;
		letter-spacing: 1px;
		margin-left: 12rpx;
	}

	.binding_box_right {
		display: flex;
		align-items: center;
	}

	.binding_box_right_name {
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
		letter-spacing: 1px;
		margin-right: 15rpx;
	}

	.binding_box_right_actve {
		width: 95rpx;
		height: 58rpx;
		background: #FEF2F2;
		border-radius: 18rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #B6333C;
		line-height: 58rpx;
		letter-spacing: 1px;
		text-align: center;
	}

	.binding_box_left_img {
		width: 32rpx;
		height: 32rpx;
		margin-top: 5rpx;
	}

	.binding_box_right_img {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: 15rpx;
	}



	.head {
		width: 750rpx;
		height: 330rpx;
		position: relative;
		padding: 122rpx 38rpx 0;
		box-sizing: border-box;
		z-index: 1;

		image {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			z-index: -1;
		}
	}
</style>