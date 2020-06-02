var api = require('../../../utils/api')
Page({
  data: {
    orderNo: 0,
    realPrice: 0.00
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderNo: options.orderNo,
      realPrice: options.realPrice
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //向服务请求支付参数
  requestPayParam() {
    let that = this;
    api.fetchPost(api.PayPrepayId, { order_no: that.data.orderNo }, function (err, res) { // , payType: 1
      if (res.status === 200) {
        let payParam = res.result;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.timeStamp,
          'package': payParam.nonceStr,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '/pages/exchange-mall/payResult/payResult?status=true&orderNo=' + that.data.orderNo,
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '/pages/exchange-mall/payResult/payResult?status=false&orderNo=' + that.data.orderNo,
            })
          }
        })
      }
    });
  },
  startPay() {
    this.requestPayParam();
  }
})