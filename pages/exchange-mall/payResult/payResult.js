var api = require('../../../utils/api')
const pay = require('../../../utils/pay.js');

Page({
  data: {
    status: false,
    orderId: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId || 24,
      status: options.status
    })
    this.updateSuccess()
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
  
  updateSuccess: function () {
    let that = this
    api.fetchPost(api.OrderQuery, { orderId: this.data.orderId}, function (res) {
    })
  },

  payOrder() {
    pay.payOrder(parseInt(this.data.orderId)).then(res => {
      this.setData({
        status: true
      });
    }).catch(res => {
      util.showErrorToast('支付失败');
    });
  }
})