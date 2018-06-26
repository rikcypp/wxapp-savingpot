// pages/mine/mine.js
const app = getApp()

Page({
  data: {
    totalDays: 0,
    totalTimes: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  //事件处理函数
  onLoad: function () {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },
  onShow:function(){
    let totalDays = 0;
    let totalTimes= 0;
    try {
      totalDays = wx.getStorageSync('totalDays')
      totalTimes = wx.getStorageSync("totalTimes")
    } catch (e) {
    }
    this.setData({
      totalDays: totalDays,
      totalTimes: totalTimes,
    })

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showAbout:function(){
    wx.showModal({
      title: '关于此小程序',
      content: '该小程序用于记账,'+
      '有助于形成良好的消费习惯！',
      showCancel:false,
      
    })
  }
})
