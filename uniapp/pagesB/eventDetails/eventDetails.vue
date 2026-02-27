<template>
  <view v-show="display">
    <view class="top-box ">
      <image :src="content.content_image" mode=""></image>
    </view>
    <view class="middle-box   pt-18 ">
      <view class="flexc mb-20">
        <view v-if="content.type==1" class="middle-event  bg-DF txt-center f-size-20 f-400 color-64 ">
          个人活动
        </view>
        <view v-else class="middle-event  bg-DF txt-center f-size-20 f-400 color-64 ">
          团体活动
        </view>
        <view class="f-size-36 f-600 color-38 middle-box_title me-text-beyond">
          {{content.title}}
        </view>
      </view>
      <view class="middle-box_content">
        <view class="" v-html="content.content">
        </view>
      </view>
      <view class="flexs flexc progress_box mt-20">
        <view class="progress_left flexc">
          <view class="mr-10" style="width: 246rpx;height: 8rpx;">
            <progress :percent="percent" stroke-width="8" activeColor='#FFCB66' border-radius='10' />
          </view>
          <span class="f-size-24" style="line-height: 20rpx;">剩余名额：</span>
          <span style="color: #FCCF78;line-height: 20rpx;" class="f-size-24 f-700">
						{{content.enroll_num_left - content.y_enroll_num}}
					</span>
        </view>
        <view class="progress-right flexc">
          <u-avatar-group :urls="urls" size="20" gap="0.4"></u-avatar-group>
          <span class="f-size-20  ml-10 mt-4">{{content.y_enroll_num}}人已报名</span>
        </view>
      </view>
    </view>
    <!-- 活动介绍 -->
    <view class="bottom-box ">
      <view class="flexc">
        <view class="bottom-box_title_quan">
        </view>
        <view class="bottom-box_title">
          活动时间以及地点
        </view>
      </view>

      <view class="middle-message mt-28 ml-28">
        <view class="middle-message_item flexc mb-20">
          <u-icon name="account" size="14"></u-icon>
          <text class="ml-10 f-size-24">举办方：{{content.name}}</text>
        </view>
        <view class="middle-message_item flexc mb-20">
          <u-icon name="map" size="14"></u-icon>
          <text class="ml-10 f-size-24"> {{content.address}}</text>
        </view>

        <view class="middle-message_item flexc mb-20">
          <u-icon name="clock" size="14"></u-icon>
          <text class="ml-10 f-size-24">报名时间：{{content.enrollrange}}</text>
        </view>
        <view class="middle-message_item flexc ">
          <u-icon name="clock" size="14"></u-icon>
          <text class="ml-10 f-size-24">举办时间：{{content.workrange}}</text>
        </view>
      </view>

    </view>


    <view class="bottom-box " v-if="content.hd_object">
      <view class="flexc">
        <view class="bottom-box_title_quan">
        </view>
        <view class="bottom-box_title">
          活动对象
        </view>
      </view>

      <view class="middle-message mt-28 ml-28">
        <view class="middle-message_item flexc mb-20">
          <text class="ml-10 f-size-24"> {{content.hd_object}}</text>
        </view>
      </view>

    </view>

    <!-- 按钮 -->
    <view class="btn-box bg-f d-flex j-center a-center" @click="setshow">
      <view class="btn bg-64 br-40 txt-center color-FB">
        我要报名
      </view>
    </view>
    <view style="height: 186rpx;">

    </view>
    <!-- 弹层 -->
    <u-popup :show="show" :round="10" mode="bottom" @close="close" :closeable="true">
      <view class="popup bg-f">
        <view class="popup_title">
          选择活动时间场次
        </view>


        <view class="popup-box ">
          <view class="popup-box_head">
            {{content.title}}
            <image class="popup-box_head_img" src="../../static/pagesB/icon3.png" mode=""></image>
          </view>
          <view class="popup-box_content pt-16 flexw flexs">
            <view class="pt-26 pb-26" v-for="(item,index) in content.cc" :key="index">
              <view @click="setpopCur(index,item)" :class="popCur==index?'popActive':''"
                    class="popup-box_content_item flexColumn text-center">
                <view class="popup-box_content_item_xz" v-if="popCur==index">
                  <u-icon name="checkbox-mark" color="#fff" size="20"></u-icon>
                </view>
                <view class="f-size-22">{{item.title}}</view>
                <view class="f-size-22">{{item.start_times}}-{{item.end_times}}</view>
                <view class="f-size-22">¥{{item.activity_price}}</view>
              </view>
            </view>

          </view>


        </view>

        <view class="f-size-22 f-400 color-63 mt-24" v-if="content.hd_object">
          备注:{{content.hd_object}}
        </view>
        <view class="popup-btn bg-64 color-f br-40 f-size-32 f-400 color-FB txt-center" @click="apply">
          下一步
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {
  getActivityDetails
} from "@/api/comm.js"
export default {
  data() {
    return {
      popCur: null,
      show: false,
      content: {},
      display: false,
      percent: 0,
      urls: [],
      areaId: []
    }
  },
  onLoad(e) {

    this.getActivityDetailsApi(e.id)
  },
  onShareAppMessage() {
    return {
      title: this.content.title,
      imageUrl: this.content.content_image,
      path: `/pagesC/classDetails/classDetails?id=${this.content.id}`
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.content.title,
      imageUrl: this.content.content_image,
      path: `/pagesC/classDetails/classDetails?id=${this.content.id}`
    }
  },
  methods: {
    setshow() {
      if (this.content.y_enroll_num >= this.content.enroll_num_left) {
        this.showToast('活动已报满')
      } else {
        this.show = true
      }
    },
    setpopCur(idx, item) {
      this.areaId = item.id
      this.popCur = idx
    },
    async getActivityDetailsApi(id) {
      let data = await getActivityDetails({
        id: id
      })
      if (data.code == 1) {
        this.content = data.data
        this.display = true
        this.content.user_activity.forEach(item => {
          this.urls.push(item.avatar)
        })
        if (this.content.y_enroll_num == 0) {
          this.percent = 100
        } else {
          this.percent = (this.content.y_enroll_num / this.content.enroll_num_left) * 100
        }
        console.log('this.percent ', this.percent);
        uni.setNavigationBarTitle({
          title: data.data.title
        })
      }
      console.log(data);

    },

    close() {
      this.show = false
    },
    apply() {
      if (this.popCur !== null) {
        this.show = false
        uni.navigateTo({
          url: '/pagesA/registrationaActivity/registrationaActivity?data=' + JSON.stringify(this
              .content) + '&areaId=' + this.areaId + '&id=' + this.content.id
        })
      } else {
        this.showToast('请选择场次')
      }

    },


  }
}
</script>
<style>
page {
  background: #fff;
}
</style>
<style scoped lang="scss">
.top-box {
  width: 100%;
  height: 419rpx;

  image {
    width: 100%;
    height: 419rpx;
  }
}

.middle-box {
  position: relative;
  z-index: 9;
  background-color: #F6F8FC;
  margin: -60rpx auto 0;
  padding: 52rpx 30rpx 38rpx;
  box-sizing: border-box;
  border-radius: 40rpx 40rpx 0rpx 0rpx;

  .middle-box_title {
    line-height: 40rpx;
    width: 500rpx;
  }

  .middle-box_content {
    margin: 20 0 24rpx;
  }

  .middle-event {
    display: inline-block;
    background-color: #596686;
    color: white;
    padding: 5rpx 20rpx;
    font-size: 24rpx;
    border-radius: 5rpx;
    transform: skewX(-30deg);
    margin-right: 20rpx;
    /* 水平倾斜度 */


  }

  .middle-message {

    .middle-message_item {
      font-size: 24rpx;
      color: #343434;

      image {
        width: 22rpx;
        height: 25rpx;
      }
    }
  }

}

.bottom-box {
  padding: 20rpx 30rpx;
  box-sizing: border-box;

  .bottom-box_title_quan {
    width: 26rpx;
    height: 26rpx;
    background: #FFFFFF;
    border: 6rpx solid #5B6382;
    border-radius: 50%;
    margin-right: 12rpx;

  }

  .bottom-box_title {
    font-weight: 700;
    font-size: 28rpx;
    color: #3D3D3D;
    line-height: 28rpx;
  }
}

.btn-box {
  position: fixed;
  bottom: 0;
  width: 749rpx;
  box-shadow: 0rpx -1rpx 14rpx 0rpx rgba(0, 0, 0, 0.14);
  padding: 36rpx 0;
  box-sizing: border-box;

  .btn {
    line-height: 84rpx;
    width: 690rpx;
    height: 84rpx;
    background: linear-gradient(90deg, #64BAFD 0%, #9FD5FF 100%);
    border-radius: 22rpx 22rpx 22rpx 22rpx;
  }
}

.popup {
  border-radius: 40rpx;
  padding: 44rpx 48rpx;
  box-sizing: border-box;

  .popup-box {
    margin: 24rpx 0 32rpx;
    height: 604rpx;
    background: #FFFFFF;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    border: 2rpx solid #64BAFD;

    .popup-box_head {
      width: 100%;
      height: 116rpx;
      background: linear-gradient(90deg, #64BAFD 0%, #6497FD 97%);
      border-radius: 16rpx 16rpx 0rpx 0rpx;
      position: relative;
      font-size: 32rpx;
      color: #FFFFFF;
      padding: 34rpx;
      box-sizing: border-box;

      .popup-box_head_img {
        width: 188rpx;
        height: 116rpx;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    .popup-box_content {
      padding: 10rpx 22rpx;
      box-sizing: border-box;
      max-height: 460rpx;
      overflow-y: auto;

      .popup-box_content_item {
        width: 192rpx;
        height: 174rpx;
        background: #F6F8FC;
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        padding: 14rpx;
        box-sizing: border-box;
        font-size: 22rpx;
        color: #3D3D3D;
        position: relative;

        .popup-box_content_item_xz {
          width: 40rpx;
          height: 40rpx;
          background: #49AFFF;
          position: absolute;
          border-radius: 50%;
          right: -20rpx;
          top: -20rpx;
          padding: 2rpx 0 0 4rpx;
        }
      }


    }

  }

  .popup_title {
    font-size: 32rpx;
    color: #3D3D3D;
    text-align: center;
    font-weight: 600;
  }

  .popup-btn {
    width: 100%;
    height: 84rpx;
    background: #64BAFD;
    border-radius: 22rpx 22rpx 22rpx 22rpx;
    line-height: 84rpx;
    margin: 46rpx auto 0;

  }
}

.progress_box {
  .progress_left {
    padding: 10rpx 0 0;
    box-sizing: border-box;
    width: 440rpx;

  }

  .progress-right {
    color: #A8AAAC;
  }
}

.popActive {
  background: rgba(100, 186, 253, 0.76) !important;
  border: 2rpx solid #29A1FF;
  color: #FFFFFF !important;
}
</style>