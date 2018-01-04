// pages/list/list.js
var app = getApp()
var dataBmob = require('../../utils/data_bmob.js')

Page({
  data: {
    list_key:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    dataBmob.getAllInfo(function (list_content){
      that.setData({
        list_key: list_content
      })
    })
  },

  onBindTap: function (event) {
    console.log("点击列表图片，时间触发", event.currentTarget)
    app.globalData.nowIndexObjectId = event.currentTarget.id
    wx.switchTab({
      url: "/pages/index/index",
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})