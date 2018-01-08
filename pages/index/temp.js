// that.initDuration()   //获取初始化进度条的数据

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