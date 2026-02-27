<script>
	import {
		getCommon
	} from '@/api/comm.js'
	export default {
		onLaunch: function() {
			getCommon().then(res => {
				if (res.code == 1) {
					uni.setStorageSync('configuration', res.data)
				}
			})
			// // #ifdef H5
			// wxApi.mpweixinShareInfo(location.href);
			// // #endif
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.uniPlatform == 'web') {
				uni.setStorageSync('platform', 'mp')
				// if (systemInfo.uniPlatform == 'mp-weixin')
			} else {
				uni.setStorageSync('platform', 'miniapp')
			}
		},
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import url("@/utils/default.scss");
	/*每个页面公共css */
	@import '@/style/index.scss';

	page {
		// font-family: 'Arial Negreta', 'Arial';
		font-family: 'PingFangSC-Medium,PingFang SC', 'Helvetica Neue', 'Helvetica', 'sans-serif';
		font-size: 32upx;
	}
</style>