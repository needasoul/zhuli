// vue protptype方法
import config from '@/config.js'
import request from '@/utils/request.js'
import {
	authentication
} from '@/api/user.js'
import {
	usergetUserInfo,
} from '@/api/comm.js'
// #ifdef H5 
var fzweixin = require('jweixin-module')
// #endif
export default {

	// 路由调转
	routerTo(url, type = 'navigateTo') {
		uni[type]({
			url
		})
	},

	// 路由返回
	routerBack(delta = 1) {
		let page = getCurrentPages()
		if (page.length > 1) {
			uni.navigateBack({
				delta
			})
		} else {
			uni.reLaunch({
				url: '/pages/index/index'
			})
		}

	},
	routerGo(url, type = 'navigateTo') {
		let token = uni.getStorageSync('userinfo').token
		if (token) {
			uni[type]({
				url
			})
		} else {
			this.loginModel()
		}
	},

	loginModel() {
		uni.showModal({
			title: '提示',
			content: '请前去登录~',
			success: function(res) {
				if (res.confirm) {
					//未登录
					uni.navigateTo({
						url: '/pages/login/index'
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	},
	// toast弹框
	showToast(title) {
		uni.showToast({
			title,
			icon: 'none'
		})
	},

	// 获取用户信息
	getWxUserInfo() {
		return new Promise((reslove, reject) => {
			uni.getUserInfo({
				success(data) {
					reslove(data)
				},
				fail(err) {
					reject(err)
				}
			})

		})
	},

	// 获取login code
	getLoginCode() {
		return new Promise((reslove, reject) => {
			uni.login({
				success({
					code
				}) {
					reslove(code)
				},
				fail(err) {
					reject(err)
				}
			})

		})
	},

	// 选择图片或拍照
	chooseImage(count = 1) {
		return new Promise((reslove, reject) => {
			uni.chooseImage({
				count,
				success(data) {
					reslove(data)
				},
				fail(err) {
					reject(err)
				}
			})

		})
	},

	// 上传图片
	uploadImg(url) {
		let that = this
		return new Promise(async (relove, reject) => {
			let tempFilePaths // 储存图片信息

			// 是否传入图片地址
			if (!url) {
				await that.chooseImage().then(d => {
					tempFilePaths = d.tempFilePaths[0]
				}).catch(err => {
					tempFilePaths = err
				})
			} else {
				tempFilePaths = url
			}

			let {
				skey
			} = uni.getStorageSync('loginInfo')
			// 开始上传
			uni.uploadFile({
				url: config.serverIp + '/client/upload-img',
				fileType: 'image',
				filePath: tempFilePaths,
				name: 'file',
				header: {
					skey
				},
				success: res => {
					let result = JSON.parse(res.data)
					if (result.errorcode === 601) {
						// 无缝刷新token
						uni.login({
							success: ({
								code
							}) => {
								request({
									url: 'client/authentication',
									method: 'get',
									data: {
										code
									}
								}).then(d => {
									uni.setStorageSync('loginInfo', d.data)
									// 刷新token 后 执行之前的逻辑
									that.uploadImg(tempFilePaths).then(d =>
										relove(d)).catch(err => reject(
										err))
								})
							}
						})

					} else {
						let url = result.data.split('`')[0]
						relove(url)
					}

				},
				fail(err) {
					reject(err)
				}
			})

		})
	},

	// 扫码
	scanCode() {
		return new Promise((reslove, reject) => {
			uni.scanCode({
				success: (data) => {
					reslove(data)
					// this.rou
				},
				fail(err) {
					reject(err)
				}
			})
		})
	},

	// 打电话
	openTel(phoneNumber) {
		uni.makePhoneCall({
			phoneNumber
		});
	},

	// 对象转get参数
	getParams: obj => {

		let str = '?'
		for (let s in obj) {
			str += `${s}=${obj[s]}&`
		}
		return str.substr(0, str.length - 1)
	},

	// url 截取
	getUrlRelativePath: url => {
		if (!url) return '';
		var url =
			'https://pl-1254950508.cos-website.ap-guangzhou.myqcloud.com/shaxi/feedback/89shba16qu4z2kowqt7w8t3yms71kl0vm.jpg'
		var arrUrl = url.split("//");
		var start = arrUrl[1].indexOf("/");
		var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符
		if (relUrl.indexOf("?") != -1) {
			relUrl = relUrl.split("?")[0];
		}
		return relUrl.substr(1);
	},

	// 展示图片
	viewImage(e, urls) {

		uni.previewImage({
			urls,
			current: e
		});
	},

	// 获取登录数据
	getLoginInfo() {
		let that = this
		return new Promise(function(relove, reject) {
			that.getLoginCode().then(code => {
				authentication({
					code
				}).then(d => {
					uni.setStorageSync('loginInfo', d.data)
					relove(d)
				}).catch(reject)
			})
		})
	},

	// 获取两个经纬度的距离
	getDistance(lat1, lng1, lat2, lng2) {
		var radLat1 = lat1 * Math.PI / 180.0;
		var radLat2 = lat2 * Math.PI / 180.0;
		var a = radLat1 - radLat2;
		var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378.137; // EARTH_RADIUS;
		s = Math.round(s * 10000) / 10;
		return s; // m
	},

	// 配置授权
	getLocation() {
		return new Promise((relove, reject) => {
			// 授权
			uni.getLocation({
				success: data => {
					relove(data)
				},
				fail(err) {
					wx.getSetting({
						success: (res) => {
							var statu = res.authSetting;
							if (!statu['scope.userLocation']) {
								wx.showModal({
									title: '是否授权当前位置',
									content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
									success(tip) {
										if (tip.confirm) {
											wx.openSetting({
												success: data => {
													console.log('授权成功')
													if (data
														.authSetting[
															"scope.userLocation"
														] === true
													) {
														wx.showToast({
															title: '授权成功',
															icon: 'success',
															duration: 1000
														})
														//授权成功之后，再调用chooseLocation选择地方
														setTimeout(
															function() {
																uni.getLocation({
																	success: data => {
																		relove
																			(
																				data
																			)
																	},
																	fail(
																		err
																	) {
																		reject
																			(
																				err
																			)
																	}
																})

															}, 1000)
													} else {
														reject()
													}
												},
												fail() {
													console.log(
														'openSetting fail'
													)
												}
											})
										} else {
											wx.showToast({
												title: '授权失败',
												icon: 'none',
												duration: 1000
											})
											reject()
										}
									}
								})

							} else {
								uni.getLocation({
									success: data => {
										relove(data)
									},
									fail(err) {
										reject(err)
									}
								})
							}
						}
					})
				}
			})
		})
	},

	// uni方式拿到位置
	uniGetLocation() {
		return new Promise((relove, reject) => {
			uni.getLocation({
				success: d => {
					relove(d)
				},
				fail: d => {
					reject(d)
				}
			})

		})
	},

	// 获取url参数
	get_url(url, name) {

		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var trueUrl1 = url.split('?')[2];
		var trueUrl2 = trueUrl1.match(/(\S*)#/)[1];
		//console.log(trueUrl2)
		var r = trueUrl2.match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	},

	loadApi() {
		const pages = getCurrentPages()
		// 声明一个pages使用getCurrentPages方法
		const curPage = pages[pages.length - 1]
		// 声明一个当前页面
		curPage.onLoad(curPage.options) // 传入参数
		curPage.onShow()
		curPage.onReady()
	},

	// 获取缓存数据
	getStorage(key) {
		return uni.getStorageSync(key) || ''
	},
	/**
	 * @微信消息订阅 tmp为数组,url为支订阅完成跳转的页面
	 */
	subscription(tmp, url, navidx, rest) {
		uni.showToast({
			title: '支付成功',
			icon: 'none',
			duration: 2000,
			success(rse) {}
		})
		let that = this
		wx.getSetting({
			withSubscriptions: true,
			success(res) {
				var itemSettings = res.subscriptionsSetting.itemSettings;
				if (itemSettings) {
					if (itemSettings[tmp[0]] || itemSettings[tmp[1]] || itemSettings[tmp[2]] == 'accept') {
						if (!rest) {
							// 页面重载
							const pages = getCurrentPages()
							// 声明一个pages使用getCurrentPages方法
							const curPage = pages[pages.length - 1]
							// 声明一个当前页面
							curPage.onLoad(curPage.options) // 传入参数
							curPage.onShow()
							curPage.onReady()
						}


					}
				} else {
					wx.getSetting({
						withSubscriptions: true,
						success(res) {
							wx.requestSubscribeMessage({
								tmplIds: tmp,
								success(res) {
									if (!rest) {
										// 页面重载
										const pages = getCurrentPages()
										// 声明一个pages使用getCurrentPages方法
										const curPage = pages[pages.length - 1]
										// 声明一个当前页面
										curPage.onLoad(curPage.options) // 传入参数
										curPage.onShow()
										curPage.onReady()
									}

									wx.showToast({
										title: '订阅成功',
										icon: 'success',
										duration: 2000,
										success(res) {
											if (url) {
												setTimeout(res => {
													// uni.reLaunch({
													// 	url: url
													// })
													if (navidx == 1) {
														uni.navigateBack()
													} else if (navidx ==
														2) {
														that.getcurPage()
													} else {
														uni.reLaunch({
															url
														})
													}
												}, 1000)
											}

										}
									})
								},
								fail(res) {
									if (!rest) {
										// 页面重载
										const pages = getCurrentPages()
										// 声明一个pages使用getCurrentPages方法
										const curPage = pages[pages.length - 1]
										// 声明一个当前页面
										curPage.onLoad(curPage.options) // 传入参数
										curPage.onShow()
										curPage.onReady()
									}
									wx.showToast({
										title: '订阅失败',
										icon: 'error',
										duration: 2000,
										success() {
											if (url) {
												setTimeout(res => {
													if (navidx == 1) {
														uni.navigateBack()
													} else if (navidx == 2) {
														that.getcurPage()
													} else {
														uni.reLaunch({
															url
														})
													}
												}, 1000)
											}
										}
									})
								},
							})

						}
					})
				}
				that.setuser()
			}
		})

	},
	// 页面重载
	getcurPage() {
		// 页面重载
		const pages = getCurrentPages()
		// 声明一个pages使用getCurrentPages方法
		const curPage = pages[pages.length - 1]
		// 声明一个当前页面
		curPage.onLoad(curPage.options) // 传入参数
		curPage.onShow()
		curPage.onReady()
	},
	setuser() {
		usergetUserInfo().then(user => {
			if (user.code == 1) {
				uni.setStorageSync('user', user.data)
			}
		})
	},
	/**
	 * @微信支付
	 * @orderInfo 参数对象格式
	 * @支付成功跳转页面url
	 */
	wxparApi(orderInfo, url, map, rest, navidx) {
		let that = this
		wx.requestPayment({
			timeStamp: orderInfo.timeStamp,
			nonceStr: orderInfo.nonceStr,
			package: orderInfo.package,
			signType: orderInfo.signType,
			paySign: orderInfo.paySign,
			success(res) {
				if (url) {
					that.subscription(map, url, navidx, rest)
				} else {
					uni.showToast({
						title: '支付成功',
						icon: 'none',
						duration: 2000,
						success() {
							if (navidx == 1) {
								uni.navigateBack()
							}
							if (navidx == 2) {
								that.getcurPage()
								return
							}
							uni.reLaunch({
								url: url
							})
							that.setuser()
						}
					})
				}
			},
			fail(res) {
				console.log(44444);
				uni.showToast({
					title: '支付失败',
					icon: 'error',
					duration: 2000,
					success() {
						if (navidx == 1) {

						} else if (navidx == 2) {
							that.getcurPage()
						} else {

							uni.reLaunch({
								url: url
							})
						}
						that.setuser()
					}
				})
			}
		})
	},

	/**
	 * @微信公众号支付
	 * @orderInfo 参数对象格式
	 * @支付成功跳转页面url
	 */
	mpwxparApi(orderInfo, url, navidx) {
		let that = this
		fzweixin.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: orderInfo.appId, // 必填，公众号的唯一标识
			timestamp: orderInfo.timeStamp, // 必填，生成签名的时间戳
			nonceStr: orderInfo.nonceStr, // 必填，生成签名的随机串
			signature: orderInfo.paySign, // 必填，签名
			jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
		})
		fzweixin.ready(function() {
			fzweixin.chooseWXPay({
				timestamp: orderInfo.timeStamp, // 时间戳
				nonceStr: orderInfo.nonceStr, // 随机数
				package: orderInfo.package, //
				signType: orderInfo.signType,
				paySign: orderInfo.paySign, // 签名
				success: function() {
					uni.showToast({
						title: '支付成功'
					});
					setTimeout(() => {
						if (navidx == 2) {
							that.getcurPage()
						} else {
							uni.reLaunch({
								url: url
							})
						}

					}, 2000);
				},
				cancel: function() {
					uni.showToast({
						title: '取消支付',
						icon: 'none'
					});
					setTimeout(() => {
						if (navidx == 2) {
							that.getcurPage()
						} else {
							uni.reLaunch({
								url: url
							})
						}
					}, 2000);
				},
				fail: function(err) {
					console.log('支付失败err', err);
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					});
					setTimeout(() => {
						if (navidx == 2) {
							that.getcurPage()
						} else {
							uni.reLaunch({
								url: url
							})
						}
					}, 2000);
				}
			})
		})


	},

	// h5分享
	async mpweixinShareInfo(urls, int) {
		var that = this;
		var data = {
			urls: urls
		}
		//获取到微信分享相关配置
		await mpJsdk(data).then(res => {
			if (res.data && res.data.signData) {
				fzweixin.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: res.data.signData.appId, // 必填，公众号的唯一标识
					timestamp: res.data.signData.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.data.signData.nonceStr, // 必填，生成签名的随机串
					signature: res.data.signData.signature, // 必填，签名
					jsApiList: ["onMenuShareTimeline", "onMenuShareQQ", "onMenuShareAppMessage",
						"updateAppMessageShareData", "updateTimelineShareData"
					] // 必填，需要使用的JS接口列表
				});
				fzweixin.ready(function() {
					fzweixin.checkJsApi({
						jsApiList: ['updateAppMessageShareData',
							"updateTimelineShareData"
						], // 需要检测的JS接口列表，所有JS接口列表见附录2,
						success: function(res2) {
							// 以键值对的形式返回，可用的api值true，不可用为false
							// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
							// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
							if (int) {
								let user = uni.getStorageSync('userinfo')
								let url = window.location.href + '&pid=' + user.id
								fzweixin.updateAppMessageShareData({
									title: int.title || uni.getStorageSync(
											'configuration')
										.share_title, // 分享标题
									link: url || uni.getStorageSync(
											'configuration')
										.fz_h5_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
									imgUrl: int.content_image[0] || uni
										.getStorageSync('configuration')
										.share_img, // 分享图标
									desc: uni.getStorageSync('configuration')
										.fz_h5_intro, // 分享描述
									success: function() {
										// 设置成功
										console.log('===详情分享===');
									},
									fail: (err) => {
										console.log('详情分享分享失败', err);
									}
								})
								fzweixin.updateTimelineShareData({
									title: int.title || uni.getStorageSync(
											'configuration')
										.share_title, // 分享标题
									link: url || uni.getStorageSync(
											'configuration')
										.fz_h5_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
									imgUrl: int.content_image[0] || uni
										.getStorageSync('configuration')
										.share_img, // 分享图标
									desc: uni.getStorageSync('configuration')
										.fz_h5_intro, // 分享描述
									success: function() {
										// 设置成功
										console.log('===详情分享分享===');
									},
									fail: (err) => {
										console.log('详情分享分享失败', err);
									}
								})
							} else {
								console.log('没有int是detail');
								fzweixin.updateAppMessageShareData({
									title: uni.getStorageSync('configuration')
										.share_title, // 分享标题
									desc: uni.getStorageSync('configuration')
										.fz_h5_intro, // 分享描述
									link: uni.getStorageSync('configuration')
										.fz_h5_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
									imgUrl: uni.getStorageSync('configuration')
										.share_img, // 分享图标
									success: function() {
										// 设置成功
										console.log('===分享===');
									},
									fail: (err) => {
										console.log('分享分享失败', err);
									}
								})

								fzweixin.updateTimelineShareData({
									title: uni.getStorageSync('configuration')
										.share_title, // 分享标题
									desc: uni.getStorageSync('configuration')
										.fz_h5_intro, // 分享描述
									link: uni.getStorageSync('configuration')
										.fz_h5_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
									imgUrl: uni.getStorageSync('configuration')
										.share_img, // 分享图标
									success: function() {
										// 设置成功
										console.log('===分享===');
									},
									fail: (err) => {
										console.log('分享分享失败', err);
									}
								})
							}

						},
						fail: function(err) {
							console.log('checkJsApi:', err);
						}
					});

				})
				fzweixin.error(function(err) {
					console.log('errxx:', err);
					// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

				})

			}

		}).catch(err => {
			console.log('err:', err);
		})

	},




}