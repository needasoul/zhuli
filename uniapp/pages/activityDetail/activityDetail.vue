<template>
	<view class="page">
		<scroll-view scroll-y class="scroll">
			<!-- 顶部 banner & 标题 -->
			<view class="header">
				<image class="banner" src="@/static/index/icon1.png" mode="aspectFill"></image>
				<view class="title">
					{{ activity.title || '活动标题示例' }}
				</view>
				<view class="sub-title">
					{{ activity.subTitle || '助力活动说明文案示例' }}
				</view>
			</view>

			<!-- 重要说明 -->
			<view class="section">
				<view class="section-title">重要说明</view>
				<view class="section-body">
					<view class="bullet" v-for="(tip, index) in importantTips" :key="index">
						{{ index + 1 }}. {{ tip }}
					</view>
				</view>
			</view>

			<!-- 活动入口 -->
			<view class="section">
				<view class="section-title">活动入口</view>
				<view class="section-body">
					<view class="paragraph" v-for="(text, index) in entranceSteps" :key="index">
						{{ text }}
					</view>
				</view>
			</view>

			<!-- 自测流程 -->
			<view class="section">
				<view class="section-title">自测流程</view>
				<view class="section-body">
					<view class="paragraph" v-for="(text, index) in selfTestSteps" :key="index">
						{{ text }}
					</view>
				</view>
			</view>

			<!-- 下单流程 -->
			<view class="section">
				<view class="section-title">下单流程</view>
				<view class="section-body">
					<view class="paragraph" v-for="(text, index) in orderSteps" :key="index">
						{{ text }}
					</view>
				</view>
			</view>

			<!-- 查看进度 -->
			<view class="section">
				<view class="section-title">查看进度</view>
				<view class="section-body">
					<view class="paragraph" v-for="(text, index) in progressSteps" :key="index">
						{{ text }}
					</view>
				</view>
			</view>

			<!-- 领取赏金 -->
			<view class="section">
				<view class="section-title">领取赏金</view>
				<view class="section-body">
					<view class="paragraph" v-for="(text, index) in rewardSteps" :key="index">
						{{ text }}
					</view>
				</view>
			</view>

			<!-- 售后流程 -->
			<view class="section">
				<view class="section-title">售后流程</view>
				<view class="section-body">
					<view class="paragraph" v-for="(text, index) in afterSaleSteps" :key="index">
						{{ text }}
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部勾选 + 按钮 -->
		<view class="footer">
			<view class="agree-row" @click="toggleAgree">
				<radio :checked="agreed" color="#FF7A00" style="transform: scale(0.8);" />
				<text class="agree-text">
					我已仔细阅读并了解活动规则，下单即视为确认接受所有条款
				</text>
			</view>
			<view
				class="submit-btn"
				:class="{ disabled: !agreed }"
				@click="handleSubmit"
			>
				立即下单
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activityId: null,
				activity: {},
				agreed: false,
				importantTips: [
					'一个账号每天参与次数有限，请勿重复下单。',
					'下单前请先完成自测，未自测不支持售后。',
					'助力人数仅保证目标人数，不承诺具体赏金金额差额。',
					'所有助力操作须遵守第三方平台规则，请勿违规操作。',
					'若链接填写错误导致助力失败，由用户自行承担后果。'
				],
				entranceSteps: [
					'打开支付宝或其他平台，搜索对应活动名称进入活动页面。',
					'在活动页面中点击“立即邀请”或类似按钮，生成专属助力链接。',
					'复制活动链接备用，后续将在本小程序下单时粘贴该链接。'
				],
				selfTestSteps: [
					'将活动链接先分享给自己的好友进行自测助力。',
					'在活动页面中查看自测后的赏金或助力人数是否达到最低要求。',
					'仅当自测结果满足活动要求时，才建议在本小程序下单。'
				],
				orderSteps: [
					'在本页面底部点击“立即下单”。',
					'选择需要助力的日期或场次（后续可在表单中补充）。',
					'粘贴刚才复制的活动链接，确认无误后提交订单。'
				],
				progressSteps: [
					'下单完成后，可前往“我的订单”查看该活动的助力进度。',
					'助力通常会在活动日期当日或约定时间内完成，请耐心等待排队。',
					'如长时间未完成，可根据页面提示发起售后申请。'
				],
				rewardSteps: [
					'助力完成后，请回到支付宝等第三方活动页面领取赏金或奖励。',
					'部分活动支持每天多次兑换，请以第三方平台规则为准。',
					'奖励的具体金额与有效期以第三方平台展示为准。'
				],
				afterSaleSteps: [
					'若在约定时间内未完成助力，可在“我的订单”中找到对应订单发起售后。',
					'按照指引上传页面截图或录屏，填写实际助力情况说明。',
					'售后申请提交后将进入审核流程，审核结果会通过消息进行通知。'
				]
			}
		},
		onLoad(options) {
			this.activityId = options.id || null
			// 预留：后续可根据 activityId 从接口获取活动详情数据
		},
		methods: {
			toggleAgree() {
				this.agreed = !this.agreed
			},
			handleSubmit() {
				if (!this.agreed) {
					uni.showToast({
						title: '请先勾选同意活动规则',
						icon: 'none'
					})
					return
				}
				// 预留：下单表单与接口对接
				uni.showToast({
					title: '示例：下单逻辑待接入',
					icon: 'none'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f7f7f7;
	}

	.scroll {
		flex: 1;
	}

	.header {
		background: #ffffff;
		padding-bottom: 24rpx;
	}

	.banner {
		width: 100%;
		height: 320rpx;
		background: #ffe6cc;
	}

	.title {
		margin: 24rpx 32rpx 8rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
	}

	.sub-title {
		margin: 0 32rpx;
		font-size: 26rpx;
		color: #999999;
	}

	.section {
		margin-top: 16rpx;
		padding: 24rpx 32rpx;
		background: #ffffff;
	}

	.section-title {
		position: relative;
		font-size: 30rpx;
		font-weight: 600;
		color: #333333;
		padding-left: 16rpx;
		margin-bottom: 12rpx;
	}

	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10rpx;
		width: 6rpx;
		height: 32rpx;
		border-radius: 4rpx;
		background: #ff7a00;
	}

	.section-body {
		font-size: 26rpx;
		color: #555555;
		line-height: 40rpx;
	}

	.bullet {
		margin-bottom: 6rpx;
	}

	.paragraph {
		margin-bottom: 10rpx;
	}

	.footer {
		background: #ffffff;
		padding: 16rpx 24rpx 24rpx;
		box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.agree-row {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.agree-text {
		font-size: 24rpx;
		color: #666666;
		margin-left: 8rpx;
	}

	.submit-btn {
		height: 88rpx;
		border-radius: 44rpx;
		text-align: center;
		line-height: 88rpx;
		font-size: 30rpx;
		color: #ffffff;
		background: linear-gradient(90deg, #ff9b00 0%, #ff6a00 100%);
	}

	.submit-btn.disabled {
		opacity: 0.5;
	}
</style>

