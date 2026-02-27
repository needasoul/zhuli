<template>
	<view>
		<view style="height: 30rpx;">
		</view>
		<view class="content">
			<view class="content_title">
				问题描述
			</view>
			<view class="canvns">
				<view style="height: 20rpx;">
				</view>
				<textarea placeholder="请输入问题或建议" auto-focus='true' maxlength='200' class="canvns_text"
					v-model="textall" />
				<view class="count">
					{{textall.length}}/200
				</view>
			</view>
			<view class="phone">
				<input type="text" v-model="mobile" placeholder="手机号码 / 邮箱" />
			</view>
			<text class="uploading_hadr">添加图片说明 (选填)</text>
			<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
				:maxCount="4"></u-upload>
			<view class="buttom" @click='sub()'>
				提交
			</view>
		</view>
	</view>
</template>

<script>
	import {
		feedbackadd
	} from "@/api/comm.js"
	import config from '@/config.js'
	export default {
		data() {
			return {
				textall: '',
				imgall: [],
				img: [],
				cell: '',
				mobile: '',
				fileList1: []
			}
		},
		onLoad() {},
		methods: {
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				let that = this
				let token = uni.getStorageSync('userinfo')
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: config.uploadImgUrl + '/api/common/upload',
						filePath: url,
						name: 'file',
						header: {
							token: token.token
						},
						success: (res) => {
							console.log('resrser', res);
							let obj = JSON.parse(res.data)
							setTimeout(() => {
								resolve(obj.data)
							}, 1000)
						}
					});
				})
			},

			async sub() {
				console.log('thisissss', this.fileList1);

				if (!this.mobile && this.mobile.length < 11) return this.showToast('请输入正确 手机号或邮箱')
				let str = []
				this.fileList1.forEach(item => {
					str.push(item.url.url)
				})
				let data = await feedbackadd({
					content: this.textall,
					images: str,
					tel: this.mobile
				})
				if (data.code == 1) {
					this.showToast('反馈成功')
					setTimeout(res => {
						uni.navigateBack()
					}, 1000)
				} else {
					this.showToast(data.msg)
				}
			}
		},
	}
</script>
<style>
	page {
		background: #fff;
	}
</style>
<style scoped lang="scss">
	.content {
		width: 95%;
		margin: 0 auto;
	}

	.phone {
		width: 690rpx;
		height: 72rpx;
		background: #F7F7F7;
		margin-top: 20rpx;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		padding: 18rpx 26rpx 0;
		box-sizing: border-box;
	}

	.content_title {
		font-size: 26rpx;
		font-weight: 400;
		color: #9D9D9D;
		line-height: 37rpx;
	}

	.canvns {
		height: 250rpx;
		background: #F7F7F7;
		border-radius: 10rpx;
		margin-top: 10rpx;
		position: relative;
	}

	.canvns_text {
		width: 95%;
		height: 90%;
		margin: 0 auto;
	}

	.count {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #CCCCCC;
	}

	.uploading {
		margin-top: 20rpx;
		display: flex;
		align-items: center;


	}

	.uploading_hadr {
		margin: 20rpx 0;
		font-size: 28rpx;
		font-weight: 400;
		color: #282828;
		display: inline-block;
	}

	.uploading_left {
		width: 192rpx;
		height: 192rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		border: 1rpx solid #EBEBEB;
	}

	.uploading_left_1 {
		color: #BBBBBB;
		height: 100%;
		font-size: 130rpx;
		// text-align: center;
		// margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.uploading_left_2 {
		font-size: 24rpx;
		font-weight: 400;
		color: #979797;
		line-height: 33rpx;
		text-align: center;
	}

	.uploading_right {}

	.uploading_right_img {
		width: 192rpx;
		height: 192rpx;
		border: 1rpx solid #EBEBEB;
		margin-left: 40rpx;
	}

	.cell {
		height: 88rpx;
		background: #FFFFFF;
		border-radius: 7rpx;
		display: flex;
		align-items: center;
		margin-top: 30rpx;
	}

	.cell_left {
		font-size: 28rpx;
		font-weight: 400;
		color: #313131;
		margin-left: 30rpx;
	}

	.buttom {
		width: 687rpx;
		height: 79rpx;
		background: #64BAFD;
		border-radius: 22rpx;
		margin: 0 auto;
		font-size: 28rpx;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 79rpx;
		text-align: center;
		margin-top: 70rpx;
	}
</style>