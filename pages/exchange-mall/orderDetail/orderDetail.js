var api = require('../../../utils/api');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    api.fetchPost(api.OrderDetail, {
      orderId: that.data.orderId
    }, function (err, res) {
      if (res.status === 200) {
        that.setData({
          orderInfo: res.result.orderInfo,
          orderGoods: res.result.orderGoods,
          handleOption: res.result.handleOption
        });
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  cancelOrder(){
    let that = this;
    let orderInfo = that.data.orderInfo;

    var order_status = orderInfo.order_status;

    var errorMessage = '';
    switch (order_status){
      case 300: {
        errorMessage = '订单已发货';
        break;
      }
      case 301:{
        errorMessage = '订单已收货';
        break;
      }
      case 101:{
        errorMessage = '订单已取消';
        break;
      }
      case 102: {
        errorMessage = '订单已删除';
        break;
      }
      case 401: {
        errorMessage = '订单已退款';
        break;
      }
      case 402: {
        errorMessage = '订单已退货';
        break;
      }
    }
      
    if (errorMessage != '') {
      util.showErrorToast(errorMessage);
      return false;
    }
    
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {

          util.request(api.OrderCancel,{
            orderId: orderInfo.id
          }).then(function (res) {
            if (res.errno === 0) {
              wx.showModal({
                title:'提示',
                content: res.data,
                showCancel:false,
                confirmText:'继续',
                success: function (res) {
                //  util.redirect('/pages/ucenter/order/order');
                  wx.navigateBack({
                    url: 'pages/exchange-mall/order/order',
                  });
                }
              });
            }
          });

        }
      }
    });
  },
  payOrder() {
    let that = this;
    api.fetchPost(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }, function (err, res) {
      if (res.status === 200) {
        const payParam = res.result;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) {
            console.log(res);
          }
        });
      }
    });

  },
  confirmOrder() {
//确认收货
      let that = this;
      let orderInfo = that.data.orderInfo;

      var order_status = orderInfo.order_status;

      var errorMessage = '';
      switch (order_status) {
          // case 300: {
          //   errorMessage = '订单已发货';
          //   break;
          // }
          case 301: {
              errorMessage = '订单已收货';
              break;
          }
          case 101: {
              errorMessage = '订单已取消';
              break;
          }
          case 102: {
              errorMessage = '订单已删除';
              break;
          }
          case 401: {
              errorMessage = '订单已退款';
              break;
          }
          case 402: {
              errorMessage = '订单已退货';
              break;
          }
      }

      if (errorMessage != '') {
          util.showErrorToast(errorMessage);
          return false;
      }

      wx.showModal({
          title: '',
          content: '确定已经收到商品？',
          success: function (res) {
              if (res.confirm) {

                  api.fetchPost(api.OrderConfirm, {
                      orderId: orderInfo.id
                  }, function (err, res) {
                      if (res.status === 200) {
                          wx.showModal({
                              title: '提示',
                              content: res.result,
                              showCancel: false,
                              confirmText: '继续',
                              success: function (res) {
                                  //  util.redirect('/pages/ucenter/order/order');
                                  wx.navigateBack({
                                      url: 'pages/exchange-mall/order/order',
                                  });
                              }
                          });
                      }
                  });

              }
          }
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})