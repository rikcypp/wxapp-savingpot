// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:[],
    haveModified:false,
    index:0,
    date: "",
    spendMoney: "",
    remarks: "",
    spendWay: "",
    spendWayImg: "",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index:options.index,
      date: options.date,
      spendMoney:options.spendMoney,
      remarks:options.remarks,
      spendWay:options.spendWay,
      spendWayImg:options.spendWayImg
    })
  },
  deleteRecord:function(){
    let bill;
    let that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          
          try {
            bill = wx.getStorageSync('Bill');
          } catch (e) {
          }
          if (bill != "") {
            bill.splice(that.data.index, 1);
          }
          try {
            wx.setStorageSync('Bill', bill)
          } catch (e) {
          }
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // modifyRecord:function(){
  //   let ind=this.data.index;
  //   wx.navigateTo({
  //     url: '../creat/creat?index=ind',
  //   })
  // },
  
})