// 设置分享内容
module.exports = {
	// 分享到好友
	onShareAppMessage(el) {
		return {
			title: uni.getStorageSync('configuration').share_title,
			imageUrl: uni.getStorageSync('configuration').share_img
		}
	},
	// 分享到朋友圈
	onShareTimeline() {
		return {
			title: uni.getStorageSync('configuration').share_title,
			imageUrl: uni.getStorageSync('configuration').share_img,
		}
	}
}
// 2.在main.js中引入
// 全局分享
// const $x = {};
// Vue.prototype.$x = $x;
// let share = require('common/share.js');
// Vue.mixin(share);