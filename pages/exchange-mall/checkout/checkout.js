var api = require('../../../utils/api')
var pay = require('../../../utils/pay')
var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {id: 0},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    realPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    // addressData: {},
    couponId: 0,
    // isBuy: false,
    skuId: 0,
    goodsNum: 0,
    couponDesc: '',
    couponCode: '',
    orderNo: 0
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    if (options.skuId!=null) {
      this.data.skuId = options.skuId;
    }
    if (options.goodsNum!=null) {
      this.data.goodsNum = options.goodsNum;
    }
    if (options.goodsTotalPrice!=null) {
      
      // goodsTotalPrice: 0.00, //商品总价
      const freightPrice = 0.00;    //快递费
      const couponPrice = 0.00;    //优惠券的价格
      const orderTotalPrice = 0.00;  //订单总价
      const realPrice = 0.00;     //实际需要支付的总价
      this.setData({
        goodsTotalPrice : options.goodsTotalPrice,
        realPrice: options.goodsTotalPrice // 这个价钱还不知道。
      })
    }
    //每次重新加载界面，清空数据
    app.globalData.userCoupon = 'NO_USE_COUPON'
    app.globalData.courseCouponCode = {}
  },
  
  // getCheckoutInfo: function () {
  //   let that = this;
  //   var url = api.CartCheckout
  //   api.fetchPost(url, { addressId: that.data.addressId, couponId: that.data.couponId }, function (err, res) {
  //     if (res.status === 200) {
  //       that.setData({
  //         checkedGoodsList: res.result.checkedGoodsList,
  //         checkedAddress: res.result.checkedAddress,
  //         realPrice: res.result.realPrice,
  //         checkedCoupon: res.result.checkedCoupon ? res.result.checkedCoupon : "",
  //         couponList: res.result.couponList ? res.result.couponList : "",
  //         couponPrice: res.result.couponPrice,
  //         freightPrice: res.result.freightPrice,
  //         goodsTotalPrice: res.result.goodsTotalPrice,
  //         orderTotalPrice: res.result.orderTotalPrice
  //       });
  //       //设置默认收获地址
  //       if (that.data.checkedAddress.id){
  //           let addressId = that.data.checkedAddress.id;
  //           if (addressId) {
  //               that.setData({ addressId: addressId });
  //           }
  //       }else{
  //           wx.showModal({
  //               title: '',
  //               content: '请添加默认收货地址!',
  //               success: function (res) {
  //                   if (res.confirm) {
  //                       that.selectAddress();
  //                   }
  //               }
  //           })
  //       }
  //     }
  //     wx.hideLoading();
  //   });
  // },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/exchange-mall/address/address?type=buy',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/exchange-mall/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // this.getCouponData()
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    // this.getCheckoutInfo();
    wx.hideLoading();
    
    try {
      var addressId = wx.getStorageSync('addressId');
      var checkedAddress = wx.getStorageSync('addressData');
      console.log(checkedAddress);
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
      if (checkedAddress) {
        this.setData({
          'checkedAddress': checkedAddress
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 获取优惠券
   */
  getCouponData: function () {
    if (app.globalData.userCoupon == 'USE_COUPON') {
      this.setData({
        couponDesc: app.globalData.courseCouponCode.name,
        couponId: app.globalData.courseCouponCode.user_coupon_id,
      })
    } else if (app.globalData.userCoupon == 'NO_USE_COUPON') {
      this.setData({
        couponDesc: "不使用优惠券",
        couponId: '',
      })
    }
  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  /**
   * 选择可用优惠券
   */
  tapCoupon: function () {
    let that = this
  
      wx.navigateTo({
        url: '../selCoupon/selCoupon',
      })
  },

  submitOrder: function () {
    if (this.data.checkedAddress.id <= 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    api.fetchPost(api.OrderSubmit, { sku_id: Number(this.data.skuId), goods_num: Number(this.data.goodsNum), receiver_name: this.data.checkedAddress.receiver_name, receiver_phone: this.data.checkedAddress.receiver_phone, address_info: this.data.checkedAddress.address_info, }, (err, res) => {
      if (res.status === 200) {
        const orderNo = res.result.order_no;
        pay.payOrder(orderNo).then(res => {
          wx.redirectTo({
            url: '/pages/exchange-mall/payResult/payResult?status=true&orderNo=' + orderNo
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/exchange-mall/payResult/payResult?status=false&orderNo=' + orderNo
          });
        });
      } else {
        // util.showErrorToast('下单失败');
        wx.showToast({
          title: '下单失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  }
})