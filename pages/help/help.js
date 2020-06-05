var api = require("../../utils/api.js");
// pages/ucenter/help/help.js
Page({
  data:{
    helpList: {1: [{question: 'aaaa'}, {question: 'aaaa'}, {question: 'aaaa'}], 2: []},
    options: [],
    selected: {}
  },
  getHelpList() {
    let that = this;
    api.fetchGet(api.Question, function (err, res) {
      if (res.status === 200) {
        that.setData({
          helpList: res.result
        })
        console.log(that.data.helpList[1])
      }
    });
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    api.fetchPost(api.sysOptions, {type: 'question_answer'}, function (err, res) {
      if (res.status === 200) {
        that.setData({
          options: res.result
        });
        that.getHelpList()
      }
    });
    // this.getHelpList()

  },
  select(event) {
    console.log(event.currentTarget.dataset.id);
    const selected = {...this.data.selected};
    selected[event.currentTarget.dataset.id] = !selected[event.currentTarget.dataset.id];
    this.setData({
      selected
    })
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