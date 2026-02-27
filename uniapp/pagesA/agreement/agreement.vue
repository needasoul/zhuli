<template>
	<view v-show="display" class="box" v-html="content.content">

	</view>
</template>

<script>
	import {
		commonpact
	} from "@/api/comm.js"
	import {
		method
	} from "lodash";
	export default {
		data() {
			return {
				content: '',
				display: false
			};
		},
		onLoad(name) {
			this.commonpactApi(name.name)
		},
		methods: {
			leftClick() {
				console.log('leftClick');
			},
			async commonpactApi(name) {
				let data = await commonpact({
					pact: name
				})
				console.log(data);
				if (data.code == 1) {
					this.content = data.data
					uni.setNavigationBarTitle({
						title: this.content.title
					})
					this.display = true
				} else {
					uni.showToast({
						title: data.msg,
						icon: "error"
					})
				}
			}
		},

	}
</script>
<style>
	page {
		background: #F2F2F2;
	}
</style>
<style lang="scss">
	.box {
		width: 95%;
		height: calc(100vh - 40rpx);
		margin: 20rpx auto;
		padding: 10rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		overflow-y: auto;
	}
</style>