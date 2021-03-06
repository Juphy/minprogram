var api = require('../../../utils/api');

Page({
  data: {
    addressList: [],
    type: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.type!=null) {
      this.data.type = options.type;
    }
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
    api.fetchGet(api.AddressList, function (err, res) {
      console.log(res)
      if (res.status === 200) {
        that.setData({
          addressList: res.result.map(item => {
            return {
              ...item,
              address_info: JSON.parse(item.address_info)
            }
          })
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
    // 这里要改成传具体地址，因为如果改了地址，发货地址就变了
    console.log(event.currentTarget.dataset);
    try {
      wx.setStorageSync('addressData', event.currentTarget.dataset.addressData);
    } catch (e) {

    }
    if (this.data.type === 'buy') {
      //选择该收货地址
      wx.navigateBack({
        url: '/pages/exchange-mall/checkout/checkout'
      });
    } else {
      // 编辑
    }
  },
  deleteAddress(id) {
    api.fetchPost(api.AddressDelete, {id}, (err, res) => {
      if (res.status === 200) {
        this.getAddressList()
      }
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})