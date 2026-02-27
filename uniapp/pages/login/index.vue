<template>
	<view class="box">
		<!-- #ifdef MP-WEIXIN -->
		<view class="arrowLeft flexc flexs" @click="routerBack">
			<u-icon name="arrow-left" color="#333" size="20"></u-icon>
			<view class="">
				登录
			</view>
			<view class="">

			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5-->
		<view class="" style="height: 100rpx;"></view>
		<!-- #endif -->
		<view class="cell">
			登录账号 精彩永相随
		</view>
		<view class="cellbox">
			<view class="mobile">
				<input type="number" v-model="cell" maxlength="11" placeholder="请输入手机号">
				<view class="cellall">
					<text class="cell_text" @click="time" v-if="min==60">获取验证码</text>
					<text class="cell_text" v-if="min<60">{{min}}秒后重新获取</text>
				</view>
			</view>
			<view class="mobile">
				<input type="number" v-model="code" maxlength="4" placeholder="验证码">

			</view>
		</view>
		<view class="button" :class="code.length>=4?'active':''" @click="sub">
			登录
		</view>
		<view class="agreement_box flex">
			<label class="radio " @tap="onChange">
				<radio value="r1" style="transform: scale(0.7);" color="#05B6F6" :checked="checked" />
			</label>
			<view class="check flexw">
				<span class="check_1">请您阅读并同意</span>
				<span class="check_2" @click.stop="routerTo('/pagesA/agreement/agreement?name=' + '用户协议')">《用户协议》
				</span>
				<span class="check_1">和</span>
				<span class="check_2" @click.stop="routerTo('/pagesA/agreement/agreement?name=' + '隐私政策')">《隐私政策》</span>
				<span class="check_1">及</span>
				<span class="check_2" @click.stop="routerTo('/pagesA/agreement/agreement?name=' + '用户个人信息保护政策')">
					《用户个人信息保护政策》
				</span>
			</view>
		</view>
		<view class="divider">
			<u-divider text="手机号快捷登录"></u-divider>
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<view class="rests" v-if="checked">
			<button open-type="getPhoneNumber" hover-class='none' @getphonenumber="getPhoneNumber">
				<image class="rests_2" src="/static/images/phone.png" mode=""></image>
			</button>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5  -->
		<view class="rests" v-if="checked">
			<button @click="goToLoginH5">
				<image class="rests_2" src="/static/images/phone.png" mode=""></image>
			</button>
		</view>
		<!-- #endif -->
		<view class="rests" v-else @click="showToast('请阅读并同意用户协议')">
			<image class="rests_2" src="/static/images/phone.png" mode=""></image>
		</view>


		<u-popup :show="show" :safeAreaInsetBottom='false' :closeable='true' :round="16" mode='center'
			@close="show=false">
			<view class="popBox flexColumn">
				<view class="popBox_title">
					温馨提示
				</view>
				<view class="popBox_txt">
					为了向您提供更好的交友体验, 请阅读并同
					意<span>《用户协议》</span> 、 <span>《隐私政策》</span>, 点击同
					意后才能使用相关功能
				</view>
				<view class=" flexc flexs">
					<view class="qxbtn" @click="qxclick">
						取消
					</view>
					<view class="qdbtn" @click="qdclick">
						同意并继续
					</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import {
		wechatlogin,
		Send_verification_code,
		check_code,
		Bind_to_wechat,
		loginWxOfficial,
		getjmlogin
	} from "@/api/comm.js"
	export default {
		data() {
			return {
				cell: '',
				code: '',
				min: 60,
				checked: false,
				show: false
			}
		},
		onLoad(options) {
			// #ifdef H5
			let code = this.getUrlCode('code')
			if (code) {
				this.handleToLogin(code)
			}
			// #endif

		},
		methods: {
			// H5公众号登录
			goToLoginH5() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '公众号授权登录',
					success: (res) => {
						if (res.confirm) {
							_this.getWeChatCode();
						} else if (res.cancel) {
							uni.showToast({
								title: '未授权',
								icon: 'none'
							})
						}
					}
				});
			},

			//请求微信接口，用来获取code
			getWeChatCode() {
				let code = this.getUrlCode('code')
				if (code == null) {
					this.getpower()
				}
			},
			async getpower() {
				let res = await getjmlogin({
					urls: 'pages/login/index'
				})
				if (res.code == 1) {
					window.location.href = res.data.url
				}

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
						uni.switchTab({
							url: '/pages/index/index'
						})
					} else {
						console.log('失败========》', resx);
					}
				})
			},
			//方法:用来提取code
			getUrlCode(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) ||
				[, ''
				])[1].replace(/\+/g, '%20')) || null
			},




			qxclick() {
				this.show = false
				this.checked = false
			},
			qdclick() {
				this.show = false
				this.checked = true
			},


			deletecell(e) {
				this.cell = ''
			},
			deletecode() {
				this.code = ''
			},
			time() {
				let cell =
					/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
				if (cell.test(this.cell)) {
					let ul = setInterval(res => {
						this.min--
						if (this.min == 0) {
							clearInterval(ul)
							this.min = 60
						}
					}, 1000)
					console.log(this.min);
					Send_verification_code({
						mobile: this.cell
					}).then(res => {
						this.showToast(res.msg)
					})
				} else {
					this.showToast('手机号有误')
				}
			},
			onChange(event) {
				this.checked = !this.checked
				if (this.checked) {
					this.show = true
				}
			},
			sub() {
				if (this.checked) {
					check_code({
						mobile: this.cell,
						captcha: this.code
					}).then(res => {
						if (res.code == 1) {
							uni.setStorageSync('userinfo', res.data.userinfo)
							uni.switchTab({
								url: '/pages/index/index'
							})
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'error',
							})
						}
					})
				} else {
					uni.showToast({
						title: '请阅读并同意协议',
						icon: 'none',
					})
				}
			},
			getPhoneNumber(e) {
				if (!this.checked) {
					uni.showToast({
						title: '请阅读并同意协议',
						icon: 'none',
					})
					this.show = true
					return
				}
				let that = this
				wx.login({
					success(res) {
						console.log(res.code, '这里');
						e.detail.code = res.code
						that.wechar(e.detail)
					},
					fail(res) {
						uni.showToast({
							title: '获取信息失败',
							icon: 'none'
						})
					}
				})
			},
			async wechar(all) {
				// console.log(all, '在看这');
				let data = await wechatlogin(
					all)
				if (data.code == 1) {
					uni.setStorageSync('userinfo', data.data.userinfo)
					uni.switchTab({
						url: '/pages/index/index'
					})
				} else {
					uni.showToast({
						title: data.msg,
						icon: 'none',
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.box {
		height: 100vh;
		background-color: #fff;
	}

	.divider {
		width: 500rpx;
		margin: 0 auto;
	}

	.arrowLeft {
		background-color: #fff;
		font-size: 32rpx;
		color: #333;
		padding: 120rpx 48rpx 200rpx 48rpx;
		box-sizing: border-box;
	}

	.cell {
		font-weight: 500;
		font-size: 42rpx;
		color: #333;
		text-align: center;
	}

	.cellbox {
		margin-top: 38rpx;

		.mobile {
			margin: 0 auto 34rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 58rpx;
			box-sizing: border-box;

			width: 630rpx;
			height: 108rpx;
			background: #F5F5F5;
			border-radius: 54rpx 54rpx 54rpx 54rpx;


			.cellall {
				display: flex;
				align-items: center;

				.icon {
					font-size: 25rpx;
					color: #9D9D9D;
					padding-right: 10rpx;
					margin-top: 5rpx;
				}

				.cell_text {
					font-size: 28rpx;
					color: #FFFFFF;
					width: 220rpx;
					height: 108rpx;
					background: #64BAFD;
					border-radius: 0rpx 54rpx 54rpx 0rpx;
					text-align: center;
					line-height: 108rpx;
				}
			}

			input {
				width: 210rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #333333;
				margin-left: 5rpx;
			}
		}
	}

	.check {
		margin: 38rpx auto 0;

		.check_1 {
			font-size: 24rpx;
			font-weight: 400;
			color: #333;
		}

		.check_2 {
			font-size: 24rpx;
			font-weight: 400;
			color: #64BAFD;
		}

		.check_3 {
			font-size: 24rpx;
			font-weight: 400;
			color: #9D9D9D;
		}

		.check_4 {
			font-size: 24rpx;
			font-weight: 400;
			color: #3D5EA5;
		}
	}

	::v-deep checkbox {
		margin-left: 70rpx;
		border-radius: 50%;
		width: 32rpx;
		height: 32rpx;
	}

	.button {
		width: 630rpx;
		height: 96rpx;
		background: #ACDAFF;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-size: 32rpx;
		color: #F8FAF3;
		line-height: 96rpx;
		text-align: center;
		margin: 0 auto;
	}

	.rests {
		width: 160rpx;
		margin: 0 auto;
		margin-top: 10rpx;

		.rests_1 {
			font-size: 24rpx;
			font-weight: 400;
			color: #454545;
			letter-spacing: 1px;
			text-align: center;
			margin: 0 auto;
		}

		.rests_2 {
			width: 96rpx;
			height: 96rpx;
			margin: 0 auto;
			margin-top: 30rpx;
		}
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

	.agreement_box {
		margin-left: 60rpx;

		.radio {
			margin-top: 30rpx;
		}
	}

	.active {
		background-color: #64BAFD !important;
		color: #fff !important;
	}

	.popBox {
		padding: 28rpx;
		width: 578rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 24rpx 24rpx 24rpx 24rpx;

		.popBox_title {
			font-weight: 400;
			font-size: 32rpx;
			color: #3D3D3D;
			text-align: center;
		}

		.popBox_txt {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
			margin: 26rpx 0 78rpx;

			span {
				color: #64BAFD;
			}
		}

		.qxbtn {
			width: 196rpx;
			height: 66rpx;
			border-radius: 972rpx;
			border: 2rpx solid #999999;
			text-align: center;
			line-height: 66rpx;
			font-size: 28rpx;
			color: #999999;
		}

		.qdbtn {
			width: 196rpx;
			height: 66rpx;
			background: #64BAFD;
			color: #FFFFFF;
			text-align: center;
			line-height: 66rpx;
			font-size: 28rpx;
			border-radius: 972rpx 972rpx 972rpx 972rpx;
		}

	}
</style>