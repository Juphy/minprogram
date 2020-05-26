var api = require('../../../utils/api')
var app = getApp();

Page({
  data: {
    couponList: null,
    buyType: ''
  },
  onLoad: function (options) {
    this.data.buyType = options.buyType
    this.loadListData()
  },

  loadListData: function () {
    let that = this;
    api.fetchPost(api.GoodsCouponList, { type: this.data.buyType }, function (err, res) {
      if (res.status === 200) {
        that.setData({
          couponList: res.result
        });
      }
    });
  },

  /**
   * 点击不使用优惠券
   * 返回上一页
   */
  noUseCoupon: function () {
    app.globalData.userCoupon = 'NO_USE_COUPON'
    wx.navigateBack({
    })
  },

  tapCoupon: function (event) {
    let item = event.currentTarget.dataset.item
    if (item.enabled==0) {
      return
    }
    app.globalData.userCoupon = 'USE_COUPON'
    app.globalData.courseCouponCode = item
    wx.navigateBack({
    })
  }
})