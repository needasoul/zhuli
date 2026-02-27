<template>
	<view>
		<!-- one -->
		<view class="top-box d-flex">
			<view class="mr-14 top-box_title">
				入场人数
			</view>
			<view class="top-box_scoll">
				<u-radio-group v-model="radiovalue1" placement="row" @change="groupChange">
					<u-radio v-for="(item, index) in radiolist1" activeColor="#39B54A" :key="index" :label="item.name"
						:name="item.name" @change="radioChange">
						{{item.name}}人
					</u-radio>
				</u-radio-group>
			</view>
		</view>
		<!-- two -->
		<view class="middle-box d-flex j-sb">
			<view class="mr-14" style="width: 22%;">
				入场名单
			</view>
			<view class="" style="width: 100%; border-bottom: 1rpx solid #E6E6E6; ">
				<input type="text" v-model="nameall" placeholder="请添加人员名单（必填)">
			</view>
		</view>
		<!-- three -->
		<view class="middle-box d-flex j-sb" v-if="int.age>1">
			<view class="mr-14">
				入场人员年龄是否满足{{int.age}}岁以上
			</view>
			<view class="">
				<radio style="transform: scale(70%); " value="r1" :checked="radiolist2" @click="ageselise" /></label>
			</view>
		</view>
		<!-- four -->
		<view class="middle-box d-flex ">
			<view class="mr-14" style="width: 22%;">
				手机号
			</view>
			<view class="d-flex j-sb" style="width: 100%; border-bottom: 1rpx solid #E6E6E6;">
				<input style="width: 100%;" type="number" v-model="cell" maxlength="11" placeholder="请填写紧急联系人手机号码（必填）">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 基本案列数据
				radiolist1: [{
						name: '2人',
						disabled: false
					},
					{
						name: '3人',
						disabled: false
					},
					{
						name: '4人',
						disabled: false
					},
				],
				radiovalue1: '',
				radiolist2: true,
				// 名单
				nameall: '',
				// 手机号
				cell: '',
				int: {}
			};
		},
		onLoad(data) {
			let list = JSON.parse(data.data)
			this.int = list
			console.log(JSON.parse(data.data));
			this.radiolist1 = list.enroll_num
		},
		methods: {
			groupChange(n) {
				console.log('groupChange', n);
			},
			radioChange(n) {
				console.log('radioChange', n);
			},
			ageselise(n) {
				if (this.radiolist2) {
					this.radiolist2 = false
				} else {
					this.radiolist2 = true
				}
			},
			save() {

				uni.navigateTo({
					url: '/pages/Registration_activity/Registration_activity?data=' + JSON.stringify(obj)
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #FFF;
	}
</style>
<style scoped lang="scss">
	.top-box {
		margin-top: 30rpx;
		padding: 30rpx 32rpx 0 33rpx;
		height: 103rpx;

		// line-height: 103rpx;
		.top-box_title {
			width: 300rpx;
		}

		.top-box_scoll {
			overflow-x: auto;
			white-space: nowrap;
		}
	}

	.middle-box {
		padding: 0 32rpx 0 33rpx;
		height: 103rpx;
		display: flex;
		align-items: center;

	}

	::v-deep .u-radio {
		margin-right: 50rpx !important;
	}

	.buttom-box {
		margin-top: 70rpx;

		button {
			width: 90%;
			background-color: #64BAFD;
			color: #FFFFFF;
		}
	}
</style>