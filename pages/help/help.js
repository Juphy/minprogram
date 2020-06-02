var Api = require("../../utils/api.js");
// pages/ucenter/help/help.js
Page({
  data:{
    helpList: []
  },
  getHelpList() {
    let that = this;
    Api.fetchGet(Api.Question, function (res) {
      if (res.status === 200) {
        that.setData({
          helpList: res.result
        })
      }
    });
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getHelpList()

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})