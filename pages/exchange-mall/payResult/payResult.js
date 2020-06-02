var api = require('../../../utils/api')
const pay = require('../../../utils/pay.js');

Page({
  data: {
    status: false,
    orderNo: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderNo: options.orderNo,
      status: options.status == 1
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
    // 支付成功后查询
    // api.fetchPost(api.OrderQuery, { order_no: this.data.orderNo}, function (res) {
    // })
  },

  payOrder() {
    pay.payOrder(this.data.orderNo).then(res => {
      this.setData({
        status: true
      });
    }).catch(res => {
      util.showErrorToast('支付失败');
    });
  }
})