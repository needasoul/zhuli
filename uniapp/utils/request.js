import config from '@/config.js'
import {
	Bind_to_wechat
} from "@/api/comm.js"
import {
	get
} from 'lodash'
// 配置基础

const request = function(obj) {
	return new Promise(function(resolve, reject) {
		let platform = uni.getStorageSync('platform')
		let opt = {
			url: config.serverIp + obj.url + getParams(obj.params),
			method: obj.method,
			timeout: obj.timeout || 10000 * 3,
			header: {
				'Content-type': 'application/json' || 'application/x-www-form-urlencoded',
				"platform": platform,
			},
			data: obj.data,
			success: res => {
				if (res.statusCode === 200) {
					if (res.data.code !== 1) {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						})
					}
					// lodash 截取
					resolve(get(res, 'data', {}))
				} else {
					reject({
						code: -1,
						msg: 'server error'
					})
					if (res.data.code == 401) {
						uni.hideLoading()
						uni.showModal({
							title: '提示',
							content: '您还未登录是否去登录？',
							success: function(res) {
								if (res.confirm) {
									uni.removeStorageSync('userinfo')
									uni.reLaunch({
										url: '/pages/login/index'
									})
								} else if (res.cancel) {
									uni.removeStorageSync('userinfo')
								}
							}
						});
					} else if (res.data.code == 402) {
						wx.login({
							success: (res) => {
								Bind_to_wechat({
									code: res.code
								}).then(res => {
									uni.showToast({
										title: '网络开小差了，请重新支付！',
										icon: 'none'
									})
								})
							},
							flil(res) {
								console.log('获取失败', res);
							},
							complete(res) {
								console.log(res);
							}
						})
					}


				}
			},
			fail: function({
				errMsg
			}) {
				if (errMsg === 'request:fail timeout') {
					uni.showToast({
						title: '服务忙,稍等会再试吧',
						icon: 'none'
					})
				}
				reject({
					code: -1,
					msg: 'server error'
				})
			}
		}
		let token = uni.getStorageSync('userinfo')
		let location = uni.getStorageSync('location')
		if (location) {
			location = JSON.parse(location)
		}
		uni.getStorageSync('userinfo') ? opt.header.token = token.token : ' '
		uni.getStorageSync('location') ? opt.header.lat = location.latitude : ' '
		uni.getStorageSync('location') ? opt.header.lon = location.longitude : ' '
		uni.request(opt)
	})
}
const getParams = obj => {

	let str = '?'
	for (let s in obj) {
		str += `${s}=${obj[s]}&`
	}
	return str.substr(0, str.length - 1)
}

export default request