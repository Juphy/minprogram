var api = require('../../../utils/api');

Page({
  data: {
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getAddressList();
  },
  getAddressList (){
    let that = this;
    api.fetchGet(api.AddressList, function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.data
        });
      }
    });
  },
  addressAddOrUpdate (event) {
    wx.navigateTo({
      url: '/pages/exchange-mall/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    });
  },
  selectAddress(event){

    try {
      wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
    } catch (e) {

    }

    //选择该收货地址
    wx.navigateBack({
      url: '/pages/exchange-mall/checkout/checkout'
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})