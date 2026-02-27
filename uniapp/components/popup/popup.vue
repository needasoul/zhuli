<template>
	<view>
		<u-popup :show="show" @close="close">
			<view>
				<text>出淤泥而不染，濯清涟而不妖</text>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: ['show'],
		name: "popup",
		data() {
			return {

			};
		},
		methods: {

		}
	}
</script>

<style lang="scss">

</style>