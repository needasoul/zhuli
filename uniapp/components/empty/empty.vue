<template>
	<view>
		<view :style="{'margin':mag,'background':bgColor}">
			<u-empty icon="/static/images/order_form.png" mode="list" :iconSize='150' text='暂无数据'></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		name: "emptyPage",
		props: {
			mag: {
				type: String,
				default: '20% 0 10%'
			},
			bgColor: {
				type: String,
				default: 'transparent'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: transparent;
	}
</style>