<template>
	<view>
		<view class="flexc flexs">
			<u-icon @click="routerBack" name="arrow-left" :color="color" :size="size"></u-icon>
			<view class="text" :style="{color:color}">
				{{title}}
			</view>
			<view class="">

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {},
			style: {},
			color: {
				default: '#272635'
			},
			size: {
				default: '16'
			}
		},
		name: "navbar",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.text {
		font-size: 32rpx;
		color: #232323;
	}
</style>