var wxCharts = require('../../utils/wxcharts.js');

var app = getApp();
var pieChart = null;
Page({
  data: {
    allrecord: [],
    all:[],
    food: 0,
    transfer: 0,
    rent: 0,
    taobao: 0,
    play: 0,
    other: 0,
  },
  touchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
  },
  onLoad: function (e) {
  },
  onShow: function () {
    let bill;

    try {
      bill = wx.getStorageSync('Bill');
    } catch (e) {
    }
    if (bill != "") {
      let allrecord = [];

      for (let key of bill) {
        allrecord.push(key);
      }
      let food=0;
      let transfer=0;
      let rent=0;
      let taobao=0;
      let play=0;
      let other=0;
      for (let key of allrecord) {
        switch (key.spendWay) {
          case "饮食": food += key.spendMoney;
            break;
          case "交通": transfer += key.spendMoney;
            break;
          case "房租": rent += key.spendMoney;
            break;
          case "淘宝": taobao += key.spendMoney;
            break;
          case "娱乐": play += key.spendMoney;
            break;
          case "其他": other += key.spendMoney;
            break;
        }
      } 
      let all=[{
        kind:"饮食",
        num:food,
        kindImg:"../../img/food_p.png",
        kindColor:"#8968CD",
      }, {
        kind: "交通",
        num: transfer,
        kindImg: "../../img/traffic_p.png",
        kindColor: "#7cb5ec",
      },{
        kind:"房租",
        num:rent,
        kindImg: "../../img/rent_p.png",
        kindColor: "#434348",
      }, {
        kind: "淘宝",
        num: taobao,
        kindImg: "../../img/taobao_p.png",
        kindColor: "#90ed7d",
      }, {
        kind: "娱乐",
        num: play,
        kindImg: "../../img/entertainment_p.png",
        kindColor: "#f15c80",
      }, {
        kind: "其他",
        num: other,
        kindImg: "../../img/other_p.png",
        kindColor: "#8085e9",
      }]
      this.creatRank(all);
      this.setData({
        allrecord: allrecord,
        food: food,
        transfer: transfer,
        rent: rent,
        taobao: taobao,
        play: play,
        other: other,
        all:all
      });
    }
    

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '饮食',
        data: this.data.food,
      }, {
        name: '交通',
        data: this.data.transfer,
      }, {
        name: '房租',
        data: this.data.rent,
      }, {
        name: '淘宝',
        data: this.data.taobao,
      }, {
        name: '娱乐',
        data: this.data.play,
      }, {
        name: '其他',
        data: this.data.other,
      }],
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });
  },
  creatRank:function(all){
    for (var i = 1; i < all.length; i++) {
      //降序
      if (all[i].num > all[i - 1].num) {
        //取出无序数列中的第i个作为被插入元素
        var guard = all[i];
        //记住有序数列的最后一个位置，并且将有序数列位置扩大一个
        var j = i - 1;
        all[i] = all[j];

        //比大小，找到被插入元素所在的位置
        while (j >= 0 && guard.num > all[j].num) {
          all[j + 1] = all[j];
          j--;
        }
        //插入
        all[j + 1] = guard;
      }
    }
    console.log('sort success');
  }
});