// 服务的地址、 图片拼接地址
import config from '@/config.js'
// 网络请求http配置文件
// import request from '@/utils/request.js'
// 获取身份信息
export default {
	/**
	 * @路由调转
	 */
	routerTo(url, type = 'navigateTo') {
		uni[type]({
			url
		})
		// console.log(1111111, url);
	},
	/**
	 * @路由返回
	 */
	routerBack(delta = 1) {
		uni.navigateBack({
			delta
		})
	},
	/**
	 * @toast弹框
	 */
	toastApi(delta = 1) {
		uni.showToast({
			title,
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
		return Number(1 * x.toFixed(2)).toLocaleString()
	},
	/**
	 * @array 传递参数1
	 */
	toHide(array) {
		var phone = array.substring(0, 3) + '****' + array.substring(7);
		return phone;
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
					return
				})
			} else {
				tempFilePaths = url
			}
			console.log(tempFilePaths);
			let {
				token
			} = uni.getStorageSync('userinfo')
			// 开始上传
			const uploadTask = uni.uploadFile({
				url: config.serverIp + 'api/common/upload',
				fileType: 'image',
				filePath: tempFilePaths,
				name: 'file',
				header: {
					token
				},
				success: res => {
					// let a = res.data.replaceAll('"', '')
					// let ax = res.data.replaceAll('"', '')
					// let axx = ax.replace(/\\/g, '')
					// console.log(JSON.parse(res.data).data, '========》');
					// let result = JSON.parse(decrypt(axx, '48d75bacb84c61d0',
					// 	"293762219d008256"))
					// let result = axx
					uni.hideLoading()
					relove(JSON.parse(res.data).data)
				},
				fail(err) {
					reject(err)
				}
			})
			uploadTask.onProgressUpdate((res) => {
				console.log('上传进度' + res.progress);
				console.log('已经上传的数据长度' + res.totalBytesSent);
				console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				let schedule = res.progress + '% 上传中'
				if (res.progress == 100) {
					schedule = '已完成请稍等...'
				}
				uni.showLoading({
					title: schedule
				});
				// 测试条件，取消上传任务。
				// if (res.progress > 50) {
				// 	uploadTask.abort();
				// }
			});
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
			phoneNumber
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
	 * @预览图图片大图展示
	 * @e是图片索引
	 * @urls数组
	 */
	viewImage(e, urls) {
		// urls = urls.map(obj => {
		// 	return obj = uni.getStorageSync('loginInfo').imgUrl + '/' + obj
		// })
		console.log(urls)
		uni.previewImage({
			urls,
			current: e,
			loop: true
		});
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
	subscription(tmp, url) {
		wx.getSetting({
			withSubscriptions: true,
			success(res) {
				var itemSettings = res.subscriptionsSetting.itemSettings;
				if (itemSettings) {
					if (itemSettings[tmp[0]] || itemSettings[tmp[1]] || itemSettings[tmp[2]] == 'accept') {
						// // 页面重载
						// const pages = getCurrentPages()
						// // 声明一个pages使用getCurrentPages方法
						// const curPage = pages[pages.length - 1]
						// // 声明一个当前页面
						// curPage.onLoad(curPage.options) // 传入参数
						// curPage.onShow()
						// curPage.onReady()
						wx.showToast({
							title: '支付成功',
							icon: 'success',
							duration: 2000,
							success(rse) {
								setTimeout(res => {
									uni.reLaunch({
										url: url
									})
								}, 2000)
							}
						})
					}
				} else {
					wx.requestSubscribeMessage({
						tmplIds: tmp,
						success(res) {
							// // 页面重载
							// const pages = getCurrentPages()
							// // 声明一个pages使用getCurrentPages方法
							// const curPage = pages[pages.length - 1]
							// // 声明一个当前页面
							// curPage.onLoad(curPage.options) // 传入参数
							// curPage.onShow()
							// curPage.onReady()
							wx.showToast({
								title: '订阅成功',
								icon: 'success',
								duration: 2000,
								success(rse) {
									setTimeout(res => {
										uni.reLaunch({
											url: url
										})
									}, 2000)
								}
							})
						},
						fail(res) {
							// // 页面重载
							// const pages = getCurrentPages()
							// // 声明一个pages使用getCurrentPages方法
							// const curPage = pages[pages.length - 1]
							// // 声明一个当前页面
							// curPage.onLoad(curPage.options) // 传入参数
							// curPage.onShow()
							// curPage.onReady()
							wx.showToast({
								title: '订阅失败',
								icon: 'error',
								duration: 2000,
								success() {
									setTimeout(res => {
										uni.reLaunch({
											url: url
										})
									}, 2000)
								}
							})
						},
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
	/**
	 * @微信支付
	 * @orderInfo 参数对象格式
	 * @支付成功跳转页面url
	 */
	wxparApi(orderInfo, url, map, rest) {
		let that = this
		orderInfo.partnerid = "148*****52"
		orderInfo.prepayid = "wx202254********************fbe90000"
		orderInfo.sign = "A842B45937F6EFF60DEC7A2EAA52D5A0" // 签名，这里用的 MD5/RSA 签名
		wx.requestPayment({
			timeStamp: orderInfo.timeStamp,
			nonceStr: orderInfo.nonceStr,
			package: orderInfo.package,
			signType: orderInfo.signType,
			paySign: orderInfo.paySign,
			success(res) {
				that.subscription(map, url)
			},
			fail(res) {
				uni.showToast({
					title: '支付失败',
					icon: 'error',
					duration: 2000,
					success() {
						setTimeout(res => {
							uni.switchTab({
								url: url
							})
						}, 2000)
					}
				})
			}
		})
	},
	/**
	 * @保存图片到系统相册
	 * @url 图片文件路径
	 */
	down(url) {
		let tempFilePath = url
		let that = this
		if (tempFilePath.indexOf('https://') > -1) {
			uni.downloadFile({
				url: tempFilePath, //仅为示例，并非真实的资源
				success: (res) => {
					if (res.statusCode === 200) {
						console.log('下载成功');
						tempFilePath = res.tempFilePath
						uni.saveImageToPhotosAlbum({
							filePath: tempFilePath, //图片文件路径
							success: function() {
								uni.showToast({
									title: '图片保存成功',
									icon: 'none',
								});
							},
							fail: function(e) {
								console.log(e);
								uni.showToast({
									title: '图片保存失败',
									icon: 'none',
								});
								that.checkForAuthorization('scope.writePhotosAlbum')
							}
						});
					}
				}
			});
		} else {
			uni.saveImageToPhotosAlbum({
				filePath: tempFilePath, //图片文件路径
				success: function() {
					uni.showToast({
						title: '图片保存成功',
						icon: 'none',
					});
				},
				fail: function(e) {
					console.log(e);
					uni.showToast({
						title: '图片保存失败',
						icon: 'none',
					});
					that.checkForAuthorization('scope.writePhotosAlbum')
				}
			});
		}

	},
	/**
	 * @允许从相机和相册扫码
	 */
	scan1() {
		let that = this;
		return new Promise((relove, reject) => {
			uni.scanCode({
				success: function(res) {
					relove(res)
				},
				fail: function(err) {
					reject(err)
				}
			});
		})

	},
	// 
	/**
	 * @textarea格式化文字展示文本域格式文字
	 */
	textFormat(val) {
		if (val) {
			console.log(val)
			let newString = val.replace(/\n/g, '_@').replace(/\r/g, '_#');
			newString = newString.replace(/_#_@/g, `\n`); // IE7-8
			newString = newString.replace(/_@/g, "\n"); // IE9、FF、chrome
			newString = newString.replace(/\s/g, '\t'); // 空格处理
			return newString;
		}
	},
	/**
	 * @scope传入对应的权限用来判断是否开启
	 */
	checkForAuthorization(scope) {
		return new Promise((resolve, reject) => {
			uni.getSetting({
				success(res) {
					console.log(res.authSetting)
					if (!res.authSetting[scope]) {
						uni.authorize({
							scope,
							success() {
								resolve()
							},
							fail() {
								uni.hideLoading();
								uni.showModal({
									title: '温馨提示',
									content: '您已拒绝授权，是否去设置打开？',
									confirmText: "确认",
									cancelText: "取消",
									success: function(res) {
										// console.log(res);
										if (res.confirm) {
											uni.hideLoading();
											uni.openSetting({
												success: (res) => {
													res.authSetting[
															scope] =
														true
													resolve()
												}
											});
										} else {
											reject({
												errMsg: '用户拒绝授权'
											})
										}
									},
									fail(res) {
										reject(res)
									}
								});

							}
						})
					} else {
						resolve()
					}
				},
				fail(res) {
					reject(res)
				}
			})
		})
	},
	/**
	 * @base64转换为本地图片
	 */
	getToLocal(base64) {
		var base64data = base64; // base64
		const fsm = wx.getFileSystemManager();
		const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名
		const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
		if (!format) {
			return (new Error('ERROR_BASE64SRC_PARSE'));
		}
		const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
		const buffer = wx.base64ToArrayBuffer(bodyData);
		return new Promise((resolve, reject) => {
			fsm.writeFile({
				filePath,
				data: buffer,
				encoding: 'binary',
				success(r) {
					console.log(r, 'r')
					console.log(filePath, 'filePath')
					resolve(filePath)
				},
				fail() {
					reject(new Error('ERROR_BASE64SRC_WRITE'))
				}
			});
		})
	},
	/**
	 * function: 60秒内（刚刚），60秒至60分钟（**分钟前），1小时至24小时（**小时前），1天至15天（**天前），其他为正常日期显示
	 * @number   時間戳
	 */
	formatMsgTime(number) {
		var dateTime = new Date(number); // 将传进来的字符串或者毫秒转为标准时间
		var Y = dateTime.getFullYear(); // 年
		var M = dateTime.getMonth() + 1; // 月
		var D = dateTime.getDate(); // 日
		var h = dateTime.getHours(); // 时
		var m = dateTime.getMinutes(); // 分
		var millisecond = dateTime.getTime(); // 将当前编辑的时间转换为毫秒
		var now = new Date(); // 获取本机当前的时间
		var nowNew = now.getTime(); // 将本机的时间转换为毫秒
		var milliseconds = 0;
		var numberStr;
		milliseconds = nowNew - millisecond;
		if (milliseconds <= 1000 * 60 * 1) { // 小于一分钟展示为刚刚
			numberStr = '刚刚'
		} else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) { // 大于一分钟小于一小时展示为分钟
			numberStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
		} else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) { // 大于一小时小于一天展示为小时
			numberStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
		} else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) { // 大于一天小于十五天展示位天
			numberStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
		} else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && Y === now.getFullYear()) {
			numberStr = M + '-' + D + ' ' + h + ':' + m
		} else {
			numberStr = Y + '-' + M + '-' + D + ' ' + h + ':' + m
		}
		return numberStr
	},

	/**
	 * function: 時間戳轉日期
	 * @number   時間戳
	 * @type     格式（1為年-月-日 時-分-秒，2為年-月-日，3為年-月,4為-月）
	 */
	toDate(number, type) {
		var date = new Date(number);
		var Y = date.getFullYear();
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		if (type == '1') {
			return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
		} else if (type == '2') {
			return Y + '-' + M + '-' + D;
		} else if (type == '3') {
			return Y + '-' + M
		} else if (type == '4') {
			return [Y, M]
		}
	},
	/**
	 * @function: 获取图片信息
	 * @url图片地址
	 */
	getImageInfoApi(url) {
		return new Promise((resolve, reject) => {
			uni.getImageInfo({
				src: url,
				success: function(image) {
					resolve(image)
				},
				fail: function(err) {
					reject(err)
				}
			});
		})
	},
	/**
	 * @function:本地缓存设置到期时间，缓存,默认有效期28天
	 * @key
	 * @value存放内容
	 * @seconds秒
	 */
	cache: function(key, value, seconds) {
		var timestamp = Date.parse(new Date()) / 1000
		console.log(timestamp + "===" + key)
		if (key && value === null) {
			//删除缓存
			//获取缓存
			var val = uni.getStorageSync(key);
			var tmp = val.split("|")
			if (!tmp[1] || timestamp >= tmp[1]) {
				console.log("key已失效")
				uni.removeStorageSync(key)
				return ""
			} else {
				console.log("key未失效")
				return tmp[0]
			}
		} else if (key && value) {
			//设置缓存
			if (!seconds) {
				var expire = timestamp + (3600 * 24 * 28)
			} else {
				var expire = timestamp + seconds
			}
			value = value + "|" + expire
			uni.setStorageSync(key, value);
		} else {
			console.log("key不能空")
		}
	}
}