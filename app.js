//app.js
var Bmob = require('utils/bmob.js')
Bmob.initialize("c3f7cd1866b4a5dea14fbef5c7f57bf4", "27e4f45f08bfabda8c9739e30f7e53e0")

var dataBmob = require('utils/data_bmob.js')
var buildURL = require('utils/buildURL.js')

App({
  onLaunch: function () {
    console.log("onLaunch")
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function(){
    console.log("onShow")
    var that = this
    //通过bmob异步API获取所有ObjectID数据
    dataBmob.getAllObjectID(function (dataInfo) {
      that.globalData.dataInfo = dataInfo
      that.initOneDataInfo()
    })
  },
  onHide: function(){
    console.log("onHide")
  },
  initOneDataInfo() {
    //获取应该初始化的首条数据
    let that = this
    let globalData = that.globalData
    let nowIndexObjectId = (globalData.nowIndexObjectId === '') ? globalData.dataInfo[0] : globalData.nowIndexObjectId
    globalData.nowIndexObjectId = nowIndexObjectId
    dataBmob.getOneInfo(nowIndexObjectId, function (oneInfo) {
      that.globalData.oneInfo = oneInfo
      that.initAudio()      //初始化播放器
      // that.initDuration()   //获取初始化进度条的数据
    })
  },
  initAudio() {
    // console.log('initAudio')
    let that = this
    let oneInfo = that.globalData.oneInfo
    let audioURL = buildURL.getAudioURL(oneInfo.date)
    let audioManager = wx.getBackgroundAudioManager()
    audioManager.src = audioURL
    let timer = setInterval(function(){
      if (audioManager.duration != null && audioManager.duration != 0){
        console.log("audioManager-->", audioManager.duration)
        audioManager.pause()
        that.globalData.duration = parseInt(audioManager.duration)
        clearInterval(timer)
      }else{
        console.log("else-->", audioManager.duration)
      }
    }, 50)
    
    // wx.playBackgroundAudio({
    //   dataUrl: buildURL.getAudioURL(oneInfo.date),
    //   success: function(){
    //     wx.pauseBackgroundAudio()
    //   },
    //   complete: function(){
    //     wx.pauseBackgroundAudio()
    //   }
    // })
    // wx.pauseBackgroundAudio()
  },
  // initDuration() {
  //   console.log("initDuration")
  //   let that = this
  //   let audioManager = wx.getBackgroundAudioManager()
  //   audioManager.onPause(function(){
  //     console.log("test", audioManager.duration)
  //   })
    // let timer = setInterval(function(){
    //   if(audioManager.duration != null){
    //     console.log("duration-->", audioManager.duration)
    //     clearInterval(timer)
    //   }else{
    //     console.log("一直在输出：", audioManager)
    //   }
    // }, 100)
    // console.log(audioManager.duration)
    // let that = this
    // let timer = setInterval(function(){
    //   wx.getBackgroundAudioPlayerState({
    //     success: function (res) {
    //       console.log("success", res)
    //       if ((res.status === 0) && (res.duration !== null)) {
    //         that.globalData.duration = res.duration
    //         clearInterval(timer)
    //       }
    //     },
    //     fail: function(err){
    //       console.log("fail", err)
    //     },
    //     complete: function(res){
    //       console.log("app.js-->", res)
    //     }
    //   })
    // }, 200)
  // },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo: null,       //记录用户的个人信息
    dataInfo: null,       //记录所有音频文件的Id
    oneInfo: null,        //记录第一个应该被初始化的音频文件
    duration: 0,          //记录初始化音频文件总时长
    nowIndexObjectId: ''  //记录当前播放的音频文件 
  }
})