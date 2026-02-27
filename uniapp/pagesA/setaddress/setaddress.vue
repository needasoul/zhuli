<template>
	<view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad(e) {
			this.getmap()
		},
		methods: {
			getmap() {
				uni.chooseLocation({
					success: function(res) {
						let obj = JSON.stringify(res)
						uni.setStorageSync('venueTabAddress', res)
						uni.setStorageSync('location', obj)

						uni.navigateBack({
							delta: 1
						})
					},
					fail(err) {
						uni.navigateBack({
							delta: 1
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>