//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '活动让生活更美好!',
    userInfo: {},
    mineMenuList:[
      {
        title: '发起人信息管理',
        desc: '奖品类型通常为实物、优惠券、现金',
        icon: '../../image/customermanager.png',
        url: ''
      },
      {
        title: '审核抽奖活动',
        desc: '仅限公众号粉丝抽奖功能，吸粉',
        icon: '../../image/examine.png',
        url: ''
      }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    app.getUserInfo(userInfo => this.setData({ userInfo }))
  }

})
