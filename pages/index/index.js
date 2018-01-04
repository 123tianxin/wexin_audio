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
    audioIndex: 0,
    pauseStatus: true,
    listShow: false,
    timer: '',
    currentPosition: 0,
    duration:0,    
  },
  onLoad: function () {
    var that = this
    this.setData({
      dataInfo: app.globalData.dataInfo
    })
    console.log('onLoad', this.data.dataInfo)

    dataBmob.getOneInfo(this.data.dataInfo[0], function (oneInfo){
        that.setData({
          oneInfo: oneInfo,
          imageURL: buildURL.getImageURL(oneInfo.date),
          audioURL: buildURL.getAudioURL(oneInfo.date),
        })
    })

    //  获取本地存储存储audioIndex
    var audioIndexStorage = wx.getStorageSync('audioIndex')
    console.log(audioIndexStorage)
    if (audioIndexStorage) {
      this.setData({ audioIndex: 0}) 
    }
  },
  onReady: function (e) {
    console.log('onReady')
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    // this.audioCtx = wx.createAudioContext('audio')
  },
  bindSliderchange: function(e) {
    // clearInterval(this.data.timer)
    let value = e.detail.value
    let that = this
    console.log(e.detail.value)
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res)
        let {status, duration} = res
        if (status === 1 || status === 0) {
          that.setData({
            sliderValue: value
          })
          wx.seekBackgroundAudio({
              position: value * duration / 100,
          })
        }
      }
    })
  },
  bindTapPrev: function() {
    console.log('bindTapPrev')
    let that = this
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
        sliderValue: 0,
        currentPosition: 0,
        duration: 0, 
      })
      setTimeout(() => {
        if (that.data.pauseStatus === true) {
          that.play()
        }
      }, 1000)
      wx.setStorageSync('audioIndex', audioIndexNow)

      console.log(audioIndexNow, that.data.imageURL)
    })
  },
  bindTapNext: function() {
    console.log('bindTapNext')
    let that = this
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
        sliderValue: 0,
        currentPosition: 0,
        duration: 0,
      })
      setTimeout(() => {
        if (that.data.pauseStatus === false) {
          that.play()
        }
      }, 1000)
      wx.setStorageSync('audioIndex', audioIndexNow)
    })
  },
  bindTapPlay: function() {
    console.log('bindTapPlay')
    console.log(this.data.pauseStatus)
    if (this.data.pauseStatus === true) {
      this.play()
      this.setData({pauseStatus: false})
    } else {
      wx.pauseBackgroundAudio()
      this.setData({pauseStatus: true})
    }
  },
  play() {
    let {oneInfo, audioIndex} = this.data
    wx.playBackgroundAudio({
      dataUrl: this.data.audioURL,
      title: oneInfo.title,
      coverImgUrl: this.data.imageURL
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
        // console.log(res)
        let {status, duration, currentPosition} = res
        if (status === 1 || status === 0) {
          that.setData({
            currentPosition: that.stotime(currentPosition),
            duration: that.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
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
  }
})
