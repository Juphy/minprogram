var util = require('../../utils/util');
var api = require('../../utils/api');



var app = getApp();

Page({
  data: {
    array: ['请选择投诉类型', '虚假抽奖', '恶意营销', '伪冒侵权', '政治敏感', '诱导分享', '商品相关', '物流状况', '功能异常', '其他'],
    index: 0,
    content:'',
    contentLength:0,
    contact:''
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
  },
  contactInput: function (e) {
    let that = this;
    this.setData({
      contact: e.detail.value,
    });
  },
  contentInput: function (e) {
   
    let that = this;
    this.setData({
      contentLength: e.detail.cursor,
      content: e.detail.value,
    });
  },
  // cleanMobile:function(){
  //   let that = this;

  // },
  sbmitFeedback : function(e){
    let that = this;
    if (that.data.index == 0){
      // util.showErrorToast('');
      wx.showToast({
        title: '请选择投诉类型',
        icon: 'none',
        duration: 1500
      });
      return false;
    }

    if (that.data.content == '') {
      // util.showErrorToast('');
      wx.showToast({
        title: '请输入投诉内容',
        icon: 'none',
        duration: 1500
      });
      return false;
    }

    if (that.data.contact == '') {
      // util.showErrorToast('');
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    wx.showLoading({
      title: '提交中...',
      mask:true,
      success: function () {

      }
    });
    api.fetchPost(api.addFeedback, { contact: that.data.contact, type: that.data.array[that.data.index], content: that.data.content}, function (res) {
      if (res.errno === 0) {

        wx.hideLoading();

        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          complete: function () {
            that.setData({
              index: 0,
              content: '',
              contentLength: 0,
              contact: ''
            });
          }
        });
      } else {
        // util.showErrorToast(res.data);
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 1500
        });
      }
      
    });
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})