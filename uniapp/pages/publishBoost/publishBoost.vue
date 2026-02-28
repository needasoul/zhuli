<template>
	<view class="publish-boost-container">
		<!-- 页面标题 -->
		<view class="page-header">
			<view class="header-left" @click="goBack">
				<u-icon name="arrow-left" size="20"></u-icon>
			</view>
			<view class="header-title">发布助力任务</view>
			<view class="header-right"></view>
		</view>

		<!-- 表单内容 -->
		<view class="form-container">
			<!-- 任务类型选择 -->
			<view class="form-section">
				<view class="section-title">选择任务类型</view>
				<view class="platform-selector">
					<view 
						class="platform-item" 
						v-for="(platform, index) in platforms" 
						:key="index"
						:class="{ active: selectedPlatform === platform.name }"
						@click="selectPlatform(platform.name)"
					>
						<image :src="platform.icon" mode="aspectFit"></image>
						<text>{{ platform.name }}</text>
					</view>
				</view>
			</view>

			<!-- 任务详情 -->
			<view class="form-section">
				<view class="section-title">任务详情</view>
				<view class="input-group">
					<view class="input-item">
						<text class="input-label">任务标题 *</text>
						<input 
							class="input-field" 
							placeholder="请输入任务标题，如：京东618助力" 
							v-model="formData.title"
							maxlength="50"
						/>
					</view>
					<view class="input-item">
						<text class="input-label">任务描述 *</text>
						<textarea 
							class="textarea-field" 
							placeholder="详细描述任务内容，如：助力解锁大额优惠券，享受购物折扣..." 
							v-model="formData.description"
							maxlength="200"
							:auto-height="true"
						></textarea>
					</view>
				</view>
			</view>

			<!-- 价格设置 -->
			<view class="form-section">
				<view class="section-title">价格设置</view>
				<view class="price-setting">
					<view class="price-input">
						<text class="currency">¥</text>
						<input 
							class="input-field price-field" 
							type="digit" 
							placeholder="0.00" 
							v-model="formData.price"
						/>
					</view>
					<view class="price-hint">单次助力的价格</view>
				</view>
			</view>

			<!-- 助力数量 -->
			<view class="form-section">
				<view class="section-title">助力数量</view>
				<view class="quantity-setting">
					<view class="quantity-input">
						<input 
							class="input-field quantity-field" 
							type="number" 
							placeholder="请输入需要的助力次数" 
							v-model="formData.quantity"
						/>
						<text class="quantity-unit">次</text>
					</view>
					<view class="quantity-hint">总共需要多少人来助力</view>
				</view>
			</view>

			<!-- 任务链接 -->
			<view class="form-section">
				<view class="section-title">任务链接</view>
				<view class="input-group">
					<view class="input-item">
						<text class="input-label">助力链接</text>
						<input 
							class="input-field" 
							placeholder="请输入助力活动链接" 
							v-model="formData.link"
						/>
						<view class="link-actions">
							<text class="paste-btn" @click="pasteLink">粘贴</text>
							<text class="scan-btn" @click="scanQRCode">扫码</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 附加说明 -->
			<view class="form-section">
				<view class="section-title">附加说明</view>
				<view class="input-group">
					<view class="input-item">
						<text class="input-label">注意事项</text>
						<textarea 
							class="textarea-field" 
							placeholder="如有特殊要求或注意事项，请在此说明..." 
							v-model="formData.notes"
							maxlength="300"
							:auto-height="true"
						></textarea>
					</view>
				</view>
			</view>

			<!-- 保证金 -->
			<view class="form-section">
				<view class="section-title">保证金</view>
				<view class="deposit-setting">
					<view class="deposit-info">
						<text class="deposit-label">保证金：</text>
						<text class="deposit-amount">¥{{ depositAmount }}</text>
					</view>
					<view class="deposit-hint">为保障任务完成质量，需要缴纳一定保证金</view>
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-section">
			<view class="total-cost">
				<text>总费用：</text>
				<text class="total-amount">¥{{ totalCost }}</text>
			</view>
			<button class="submit-btn" @click="submitTask" :disabled="!canSubmit">发布任务</button>
		</view>

		<!-- 发布成功弹窗 -->
		<u-popup :show="showSuccessPopup" mode="center" :round="10" :closeable="true" @close="showSuccessPopup = false">
			<view class="success-popup">
				<view class="popup-icon">
					<u-icon name="checkmark-circle" color="#4CAF50" size="60"></u-icon>
				</view>
				<view class="popup-title">发布成功！</view>
				<view class="popup-desc">您的助力任务已成功发布，等待用户助力中...</view>
				<view class="popup-actions">
					<button class="popup-btn primary" @click="goToTaskDetail">查看任务</button>
					<button class="popup-btn secondary" @click="continuePublish">继续发布</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			platforms: [
				{ name: '京东', icon: '../../static/index/jd_icon.png' },
				{ name: '拼多多', icon: '../../static/index/pdd_icon.png' },
				{ name: '淘宝', icon: '../../static/index/taobao_icon.png' },
				{ name: '抖音', icon: '../../static/index/douyin_icon.png' },
				{ name: '快手', icon: '../../static/index/kuaishou_icon.png' },
				{ name: '其他', icon: '../../static/index/other_icon.png' }
			],
			selectedPlatform: '京东',
			formData: {
				title: '',
				description: '',
				price: '',
				quantity: '',
				link: '',
				notes: ''
			},
			showSuccessPopup: false
		}
	},
	computed: {
		depositAmount() {
			// 保证金计算规则：任务总价的10%，最低1元
			const totalPrice = parseFloat(this.formData.price || 0) * parseInt(this.formData.quantity || 0);
			const deposit = Math.max(totalPrice * 0.1, 1);
			return deposit.toFixed(2);
		},
		totalCost() {
			const totalPrice = parseFloat(this.formData.price || 0) * parseInt(this.formData.quantity || 0);
			const deposit = parseFloat(this.depositAmount);
			return (totalPrice + deposit).toFixed(2);
		},
		canSubmit() {
			return this.formData.title && 
				   this.formData.description && 
				   this.formData.price && 
				   this.formData.quantity &&
				   parseInt(this.formData.quantity) > 0 &&
				   parseFloat(this.formData.price) > 0;
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 选择平台
		selectPlatform(platform) {
			this.selectedPlatform = platform;
		},
		
		// 粘贴链接
		pasteLink() {
			// 模拟粘贴功能
			uni.getClipboardData({
				success: (res) => {
					this.formData.link = res.data;
					uni.showToast({
						title: '链接已粘贴',
						icon: 'success'
					});
				},
				fail: () => {
					uni.showToast({
						title: '剪贴板无内容',
						icon: 'none'
					});
				}
			});
		},
		
		// 扫码
		scanQRCode() {
			uni.scanCode({
				success: (res) => {
					this.formData.link = res.result;
					uni.showToast({
						title: '扫码成功',
						icon: 'success'
					});
				},
				fail: () => {
					uni.showToast({
						title: '扫码失败',
						icon: 'none'
					});
				}
			});
		},
		
		// 提交任务
		submitTask() {
			if (!this.canSubmit) {
				uni.showToast({
					title: '请完善必填信息',
					icon: 'none'
				});
				return;
			}
			
			// 这里应该是提交到服务器的逻辑
			console.log('提交任务:', this.formData);
			
			// 模拟提交成功
			setTimeout(() => {
				this.showSuccessPopup = true;
			}, 1000);
		},
		
		// 查看任务详情
		goToTaskDetail() {
			this.showSuccessPopup = false;
			// 这里应该跳转到刚发布的任务详情页
			uni.navigateTo({
				url: '/pages/boostDetail/boostDetail?id=new'
			});
		},
		
		// 继续发布
		continuePublish() {
			this.showSuccessPopup = false;
			this.resetForm();
		},
		
		// 重置表单
		resetForm() {
			this.formData = {
				title: '',
				description: '',
				price: '',
				quantity: '',
				link: '',
				notes: ''
			};
			this.selectedPlatform = '京东';
		}
	}
}
</script>

<style lang="scss" scoped>
.publish-boost-container {
	min-height: 100vh;
	background: #f5f5f5;
	
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 20rpx 20rpx;
		background: white;
		position: sticky;
		top: 0;
		z-index: 100;
		
		.header-left, .header-right {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
		}
		
		.header-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.form-container {
		padding: 20rpx;
		
		.form-section {
			background: white;
			border-radius: 15rpx;
			margin-bottom: 20rpx;
			padding: 30rpx;
			
			.section-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 25rpx;
			}
			
			.platform-selector {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 20rpx;
				
				.platform-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 20rpx;
					border: 2rpx solid #eee;
					border-radius: 10rpx;
					background: #fafafa;
					
					&.active {
						border-color: #49AFFF;
						background: #e3f2fd;
					}
					
					image {
						width: 60rpx;
						height: 60rpx;
						margin-bottom: 10rpx;
					}
					
					text {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
			
			.input-group {
				.input-item {
					margin-bottom: 30rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					.input-label {
						display: block;
						font-size: 26rpx;
						color: #666;
						margin-bottom: 10rpx;
					}
					
					.input-field {
						width: 100%;
						padding: 20rpx;
						border: 1rpx solid #eee;
						border-radius: 10rpx;
						font-size: 28rpx;
						
						&.price-field {
							width: auto;
							flex: 1;
						}
						
						&.quantity-field {
							width: auto;
							flex: 1;
						}
					}
					
					.textarea-field {
						width: 100%;
						padding: 20rpx;
						border: 1rpx solid #eee;
						border-radius: 10rpx;
						font-size: 28rpx;
						min-height: 120rpx;
					}
					
					.link-actions {
						display: flex;
						justify-content: flex-end;
						margin-top: 10rpx;
						
						.paste-btn, .scan-btn {
							padding: 10rpx 20rpx;
							background: #49AFFF;
							color: white;
							border-radius: 20rpx;
							font-size: 24rpx;
							margin-left: 20rpx;
						}
					}
				}
			}
			
			.price-setting, .quantity-setting {
				.price-input, .quantity-input {
					display: flex;
					align-items: center;
					border: 1rpx solid #eee;
					border-radius: 10rpx;
					padding: 10rpx 20rpx;
					
					.currency {
						font-size: 36rpx;
						color: #FF5722;
						margin-right: 10rpx;
					}
					
					.input-field {
						border: none;
						padding: 0;
						font-size: 36rpx;
					}
					
					.quantity-unit {
						font-size: 28rpx;
						color: #666;
						margin-left: 10rpx;
					}
				}
				
				.price-hint, .quantity-hint {
					font-size: 24rpx;
					color: #999;
					margin-top: 10rpx;
				}
			}
			
			.deposit-setting {
				.deposit-info {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					
					.deposit-label {
						font-size: 28rpx;
						color: #666;
					}
					
					.deposit-amount {
						font-size: 36rpx;
						font-weight: bold;
						color: #FF5722;
					}
				}
				
				.deposit-hint {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}
	
	.submit-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		padding: 20rpx 30rpx;
		box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.total-cost {
			font-size: 28rpx;
			color: #666;
			
			.total-amount {
				font-size: 36rpx;
				font-weight: bold;
				color: #FF5722;
			}
		}
		
		.submit-btn {
			background: #49AFFF;
			color: white;
			border-radius: 50rpx;
			padding: 20rpx 40rpx;
			font-size: 32rpx;
			font-weight: bold;
			
			&:disabled {
				background: #ccc;
			}
		}
	}
	
	.success-popup {
		padding: 40rpx;
		text-align: center;
		width: 500rpx;
		
		.popup-icon {
			margin: 20rpx auto 30rpx;
		}
		
		.popup-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.popup-desc {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 40rpx;
			line-height: 1.5;
		}
		
		.popup-actions {
			display: flex;
			gap: 20rpx;
			
			.popup-btn {
				flex: 1;
				padding: 20rpx;
				border-radius: 10rpx;
				font-size: 28rpx;
				
				&.primary {
					background: #4CAF50;
					color: white;
				}
				
				&.secondary {
					background: #f5f5f5;
					color: #666;
				}
			}
		}
	}
}
</style>