//app.js
var Bmob = require('utils/bmob.js')
Bmob.initialize("c3f7cd1866b4a5dea14fbef5c7f57bf4", "27e4f45f08bfabda8c9739e30f7e53e0")

var dataBmob = require('utils/data_bmob.js')

App({
  onLaunch: function () {
    var that = this

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //通过bmob异步API获取所有ObjectID数据
    dataBmob.getAllObjectID(function(dataInfo){
      that.globalData.dataInfo = dataInfo
    })
  },
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
    userInfo:null,
    dataInfo:null,
  }
})