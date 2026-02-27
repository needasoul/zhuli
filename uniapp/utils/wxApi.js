// 服务的地址、 图片拼接地址
import config from '@/config.js'
// 网络请求http配置文件
// import request from '@/utils/request.js'
// 获取身份信息
// import {
// 	authentication
// } from '@/api/user.js'

export default {
	openloadFile(url) {
		let token = uni.getStorageSync('X-Auth-Token')
		if (!token) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		} else {
			uni.downloadFile({
				url: url, //文件的下载路径
				success(res) {
					//保存到本地
					uni.saveFile({
						tempFilePath: res.tempFilePath, //文件的临时路径
						success: function(res) {
							const savedFilePath = res.savedFilePath;
							// 打开文件
							uni.openDocument({
								filePath: savedFilePath,
								success: function(res) {
									uni.hideLoading()
								},
								fail: function(res) {},
								complete: function(res) {
									setTimeout(() => {
										uni.hideLoading()
									}, 4000)
								},
							});
						},
						fail: function(err) {}
					});
				},
				fail(res) {}
			})

		}
	},

	/**
	 * @路由调转
	 */
	routerTo(url, type = 'navigateTo') {
		uni[type]({
			url
		})
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
						url: '/pages/login/login'
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	},

	/**
	 * @路由返回
	 */
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
	/**
	 * @toast弹框
	 */
	showMsg(data) {
		uni.showToast({
			title: data,
			icon: 'none'
		})
	},
	/**
	 * @米转换为公里
	 */
	mkm(x) {
		let nub = Math.round((x / 100) / 10);
		return nub.toFixed(2)
	},
	/**
	 * @数字精度
	 */
	BumberPrecision(x) {
		return Number(x).toFixed(2)
	},
	/**
	 * @微信获取用户信息
	 */
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
	/**
	 * @微信获取code
	 */
	loginApi() {
		return new Promise((reslove, reject) => {
			uni.login({
				success(res) {
					console.log("wv=====>", res)
					reslove(res)
				},
				fail(err) {
					reject(err)
				}
			})

		})
	},
	/**
	 * @选择图片或拍照
	 */
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
	/**
	 * @上传图片
	 */
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
				token
			} = uni.getStorageSync('userinfo_')
			// 开始上传
			uni.uploadFile({
				url: config.baseUrl + '/api/common/upload',
				fileType: 'image',
				filePath: tempFilePaths,
				name: 'file',
				header: {
					token
				},
				success: res => {
					let result = JSON.parse(res.data)
					console.log(result);
					relove(result.data)

				},
				fail(err) {
					reject(err)
				}
			})

		})
	},
	/**
	 * @扫码
	 */
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
	/**
	 * @打电话
	 */
	openTel(phoneNumber) {
		uni.makePhoneCall({
			phoneNumber,
			success() {
				console.log('成功');
			},
			fail() {
				console.log('失败');
			}
		});
	},
	/**
	 * @设置系统剪贴板的内容
	 * @String 参数
	 */
	setClipboardData(data) {
		uni.setClipboardData({
			data: data,
			showToast: true,
			success: function() {
				console.log('success');
			}
		});
	},
	/**
	 * @对象转get参数
	 */
	getParams: obj => {
		let str = '?'
		for (let s in obj) {
			str += `${s}=${obj[s]}&`
		}
		return str.substr(0, str.length - 1)
	},
	/**
	 * @url截取
	 */
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
	/**
	 * @展示图片
	 */
	viewImage(e, urls) {
		// urls = urls.map(obj => {
		// 	return obj = uni.getStorageSync('loginInfo').imgUrl + '/' + obj
		// })
		// console.log(urls)
		uni.previewImage({
			urls,
			current: e
			// e.currentTarget.dataset.url
		});
	},
	// 登录提示
	getShowModel() {
		uni.showModal({
			title: '提示',
			content: '请前去登录~',
			success: function(res) {
				if (res.confirm) {
					//未登录
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	},

	/**
	 * @保存网络图片
	 * url 图片
	 */
	http_saveImg(url) {
		let that = this
		return new Promise(async (relove, reject) => {
			// 开始上传
			uni.downloadFile({
				url, //仅为示例，并非真实的资源
				success: (res) => {
					if (res.statusCode === 200) {
						console.log('下载成功');
						console.log('===》', res);
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: (res) => {
								if (res.errMsg == "saveImageToPhotosAlbum:ok") {
									uni.showToast({
										title: '保存成功',
										icon: "success"
									})
								}
							},
							fail: (res) => {
								console.log('res===>', res);
								uni.showToast({
									title: '保存失败',
									icon: "error"
								})
							}
						})

					}
				}
			});

		})
	},
	/**
	 * @保存图片
	 * url 图片 
	 */
	saveImg(url) {
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
				token
			} = uni.getStorageSync('userinfo_')
			// 开始上传
			uni.uploadFile({
				url: config.baseUrl + '/api/common/upload',
				fileType: 'image',
				filePath: tempFilePaths,
				name: 'file',
				header: {
					token
				},
				success: res => {
					let result = JSON.parse(res.data)
					uni.saveImageToPhotosAlbum({
						filePath: result.data.fullurl,
						success: (res) => {
							if (res.errMsg == "saveImageToPhotosAlbum:ok") {
								uni.showToast({
									title: '保存成功',
									icon: "success"
								})
							}
						},
						fail: (res) => {
							uni.showToast({
								title: '保存失败',
								icon: "error"
							})
						}
					})
				},
				fail(err) {
					console.log('网络图片上传失败');
				}
			})

		})
	},


	/**
	 * @获取登录数据
	 */
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
	/**
	 * @获取两个经纬度的距离
	 */
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
	/**
	 * @配置授权位置
	 */
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
	/**
	 * @uni方式拿到位置
	 */
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
	/**
	 * @微信小程序模糊定位位置
	 */
	wxgetFuzzyLocation() {
		return new Promise((relove, reject) => {
			wx.getFuzzyLocation({
				type: 'wgs84',
				success: d => {
					relove(d)
				},
				fail: d => {
					reject(d)
				}
			})
		})
	},
	/**
	 * @打开地图手动选择位置
	 */
	getchooseLocation() {
		return new Promise((relove, reject) => {
			uni.chooseLocation({
				success: function(d) {
					relove(d)
				},
				fail: function(d) {
					reject(d)
				}
			});
		})
	},
	/**
	 * @使用应用内置地图查看位置
	 */
	getopenLocation(latitude, longitude) {
		return new Promise((relove, reject) => {
			uni.openLocation({
				latitude: Number(latitude),
				longitude: Number(longitude),
				success: function(d) {
					relove(d)
				},
				fail: function(d) {
					reject(d)
				}
			});
		})
	},

	/**
	 * @获取url参数
	 */
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
	/**
	 * @获取缓存数据
	 */
	getStorage(key) {
		return uni.getStorageSync(key) || ''
	},
	/**
	 * @微信消息订阅 tmp为数组,url为支订阅完成跳转的页面
	 */
	wxApisubscription(tmp, url, navidx, rest) {
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

						wx.showToast({
							title: '支付成功',
							icon: 'success',
							duration: 2000,
							success(rse) {
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
									}, 2000)
								}

							}
						})
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
												}, 2000)
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
												}, 2000)
											}
										}
									})
								},
							})

						}
					})

				}
			}

		})

	},

	/**
	 * @微信小程序 开启全页面分享功能在APP.js中onLaunch中调用此方法
	 */
	onLaunch(options) {
		this.overShare()
	},
	overShare() {
		wx.onAppRoute((res) => {
			// console.log('route', res)
			let pages = getCurrentPages()
			let view = pages[pages.length - 1]
			if (view) {
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline'],
					success(res) {
						console.log(res, '分享了');
					},
					fail(e) {
						console.log(e, '分享失败');
					}
				})
			}
		})
	},


}