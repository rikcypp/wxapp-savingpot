var util = require('../../utils/util.js')
var wxCharts = require('../../utils/wxcharts.js');
import NumberAnimate from "../../utils/NumberAnimate";

var lineChart = null;
var app = getApp()

Page({
  data: {
    todayExpend: "0",
    monthExpend: "0",
    yearExpend: "0",
    todayRecord: [],
    recentRecord: [],
    date: "",
    showDate: "",
    record: [],
  
    slidetime: 20,
    direction: 0,
    startPos: {},
    list: [
      // {
      //   id: 'view',
      //   name: '最近支出',
      //   open: true,
      //   pages: []
      // },
      // {
      //   id: 'view',
      //   name: '更多图表',
      //   open: true,
      //   pages: [] 
      // }
    ],

  },


  onLoad: function () {
  },
  onShow: function () {
    const showdata = util.formatTime(new Date(), "MM.dd");
    this.setData({
      showDate: showdata,
    });

    let bill;
    const todayDate = util.formatTime(new Date(), "yyyy-MM-dd");
    try {
      bill = wx.getStorageSync('Bill');
    } catch (e) {
    }
    if (bill != "") {
      let todayMoney = 0;
      let monthMoney = 0;
      let yearMoney = 0;
      let todayRecord = [];
      let recentRecord = [];
      let shortRecord = [];
      let list = [];
      for(let key of bill){
        //同一天
        if (util.timeDifference(key.date, todayDate, "D") <= 7) {
          if (util.dateIsDifference(key.date, todayDate, "d")) {
            todayMoney += key.spendMoney;
            todayRecord.push(key);
          }
          recentRecord.push(key);
        }
        //同一月
        if (util.dateIsDifference(key.date, todayDate, "n")) {
          monthMoney += key.spendMoney;
        };
        //同一月
        if (util.dateIsDifference(key.date, todayDate, "y")) {
          yearMoney += key.spendMoney;
        };
      }
      for (let key of recentRecord) {
        let temp = new Date(key.date);
        key.date = util.formatTime(temp, "MM.dd");
        shortRecord.push(key);
      }

      let kinds = ['最近支出', '更多图表']
      for (let i = 0; i <= 0; i++) {
        let id = 'view';
        let name = kinds[i];
        let open = false;
        let pages = shortRecord;
        list.push({ id, name, open, pages });
      }

      this.setData({
        todayExpend: todayMoney,
        monthExpend: monthMoney,
        yearExpend: yearMoney,
        todayRecord: todayRecord,
        recentRecord: shortRecord,
        date: todayDate,
        list: list,
        record: recentRecord,
       
      });
      this.animate();
    };

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth + 15;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '日',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      },
      ],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '支 出',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 175,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });

  },

  creat: function (e) {
    wx.navigateTo({
      url: '../../pages/creat/creat',
    })
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function () {
    let day = util.formatTime(new Date(), "dd");
    var categories = [];
    var temp = [0, 0, 0, 0, 0, 0, 0, 0];
    var data = [];
    var t = [];
    var that = this;
    for (let i = day - 7; i <= day; i++) {
      categories.push((i + 31) % 31);
    }

    for (let key of that.data.recentRecord) {
      t = key.date.toString();
      t = t[3] == "0" ? t[4] : t[3] + t[4];
      temp[day - t] += key.spendMoney;
    }
    for (var i = 7; i >= 0; i--) {
      data.push(temp[i]);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },

  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  animate: function () {

    this.setData({
      num1: '0',
    });

    let num1 = this.data.todayExpend;
    let n1 = new NumberAnimate({
      from: num1,
      speed: 500,
      refreshTime: 30,
      decimals: 0,
      onUpdate: () => {
        this.setData({
          num1: n1.tempValue
        });
      },
    });
  },

})
