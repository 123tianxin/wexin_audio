//index.js
//获取应用实例
var app = getApp()
var dataBmob = require('../../utils/data_bmob.js')
var buildURL = require('../../utils/buildURL.js')

Page({
  data: {
    dataInfo: null,
    oneInfo: null,
    imageURL: '',
    audioURL: '',
    minMin: '00:00',
    maxMin: '00:00',
    duration: 0,
    currentPosition: 0,
    audioIndex: 0,
    sliderValue: 0,
    isDetail:false,
    pauseStatus: true,
    timer: '',
  },
  onLoad: function (options) {
    console.log("onLoad, index.js")

    //  获取本地存储存储audioIndex
    var audioIndexStorage = wx.getStorageSync('audioIndex')
    if (audioIndexStorage) {
      this.setData({ audioIndex: 0}) 
    }

    let that = this
    let { dataInfo, oneInfo, duration } = app.globalData
    this.setData({
      dataInfo: dataInfo,
      oneInfo: oneInfo,
      imageURL: buildURL.getImageURL(oneInfo.date),
      audioURL: buildURL.getAudioURL(oneInfo.date),
      minMin: '00:00',
      maxMin: that.stotime(duration),
      duration: duration,
    })

    console.log("index.js-->", this.data)
  },
  onShow: function(){
    console.log("onShow, index.js")
    // console.log("index.js-->", app.globalData)
  },
  bindSliderchange: function(audio) {
    // clearInterval(this.data.timer)
    let value = audio.detail.value
    let that = this
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res)
        let { status } = res
        let duration = that.data.duration
        console.log("当前进度：", value * duration / 100)
        if (status === 2 || status === 1 || status === 0) {
          that.setData({
            minMin: that.stotime(parseInt(value * duration / 100)),
            currentPosition: parseInt(value * duration / 100),
            sliderValue: value
          })
        }
        wx.seekBackgroundAudio({
          position: parseInt(value * duration / 100),
          success: function (res) {
            console.log("success-->", res)
          },
          fail: function (err) {
            console.log("fail-->", err)
          }
        })
      }
    })
  },
  bindTapPrev: function() {
    console.log('bindTapPrev')
    let that = this
    that.setData({
      pauseStatus: false,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0, 
      minMin: "00:00",
    })
    let length = this.data.dataInfo.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === 0) {
      audioIndexNow = length - 1
    } else {
      audioIndexNow = audioIndexPrev - 1
    }
    dataBmob.getOneInfo(this.data.dataInfo[audioIndexNow], function (oneInfo) {
      that.setData({
        oneInfo: oneInfo,
        imageURL: buildURL.getImageURL(oneInfo.date),
        audioURL: buildURL.getAudioURL(oneInfo.date),
        audioIndex: audioIndexNow,
      })
      setTimeout(() => {
        if (that.data.pauseStatus === false) {
          that.play()
        }
      }, 1000)
      
      //停止后台播放
      wx.pauseBackgroundAudio()
      wx.setStorageSync('audioIndex', audioIndexNow)

      console.log(audioIndexNow, that.data.imageURL)
    })
  },
  bindTapNext: function() {
    console.log('bindTapNext')
    let that = this
    clearInterval(this.data.timer)
    that.setData({
      pauseStatus: false,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
      minMin: "00:00",
    })
    let length = this.data.dataInfo.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === length - 1) {
      audioIndexNow = 0
    } else {
      audioIndexNow = audioIndexPrev + 1
    }
    dataBmob.getOneInfo(this.data.dataInfo[audioIndexNow], function (oneInfo) {
      that.setData({
        oneInfo: oneInfo,
        imageURL: buildURL.getImageURL(oneInfo.date),
        audioURL: buildURL.getAudioURL(oneInfo.date),
        audioIndex: audioIndexNow,
        pauseStatus: false,
        sliderValue: 0,
        currentPosition: 0,
        duration: 0,
      })
      setTimeout(() => {
        if (that.data.pauseStatus === false) {
          that.play()
        }
      }, 1000)

      //停止后台播放
      wx.pauseBackgroundAudio()
      wx.setStorageSync('audioIndex', audioIndexNow)
    })
  },
  bindTapPlay: function() {
    console.log('bindTapPlay')
    // console.log(this.data.pauseStatus)
    if (this.data.pauseStatus === true) {
      this.play()
      this.setData({pauseStatus: false})
    } else {
      clearInterval(this.data.timer)
      wx.pauseBackgroundAudio()
      this.setData({pauseStatus: true})
    }
  },
  play() {
    let { oneInfo, audioIndex, sliderValue, duration, currentPosition } = this.data
    console.log("play-->", this.data)
    wx.playBackgroundAudio({
      dataUrl: this.data.audioURL,
      title: oneInfo.title,
      coverImgUrl: this.data.imageURL,
      seccess: function(){
        wx.seekBackgroundAudio({
          position: currentPosition,
        })
      }
    })
    let that = this
    let timer = setInterval(function() {
      that.setDuration(that)
    }, 1000)
    this.setData({timer: timer})
  },
  setDuration(that) {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log("setDuration-->", res)
        let {status, duration, currentPosition} = res
        if (status === 1 || status === 0) {
          that.setData({
            minMin: that.stotime(currentPosition),
            maxMin: that.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
            duration: duration
          })
        }
      }
    })
  },
  stotime: function(s) {
    let t = '';
    if(s > -1) {
      // let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      // if (hour < 10) {
      //   t = '0' + hour + ":";
      // } else {
      //   t = hour + ":";
      // }

      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec;
    }
    return t;
  },
  onShareAppMessage: function () {
    let that = this
    return {
      title: 'light轻音乐：' + that.data.audioList[that.data.audioIndex].name,
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    }
  },
  exdetail: function () {
    console.log(this.data.isDetail)
    if (this.data.isDetail == false) {
      this.setData({ isDetail: true })
    }
    else {
      this.setData({ isDetail: false })
    }
  }
})
