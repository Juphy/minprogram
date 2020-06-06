var api = require("../../utils/api.js");
var WxParse = require('../../wxParse/wxParse.js');
// pages/ucenter/help/help.js
Page({
  data:{
    helpList: {1: [], 2: []},
    options: [],
    selected: {},
    tempIndex: {} // 用来记录坐标的；
  },
  getHelpList() {
    let that = this;
    api.fetchGet(api.Question, function (err, res) {
      if (res.status === 200) {
        that.setData({
          helpList: res.result
        })
        const tempIndex = {};
        let len = 0;
        let index = 0;
        for (let j = 0; j < that.data.options.length; j++) {
          const o = that.data.options[j]
          if (res.result[o.value]) {
            len += res.result[o.value].length;
            res.result[o.value].forEach((item, ii) => {
              // console.log(item.answer);
              WxParse.wxParse('reply' + index, 'html', item.answer, that);
              tempIndex[j + '_' + ii] = index;
              index++;
            })
          }
        }
        WxParse.wxParseTemArray("replyTemArray",'reply', len, that);
        console.log(tempIndex);
        that.setData({
          tempIndex
        })
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
  getIndex(optionsIndex, index) {
    console.log(optionsIndex, index);
    let res = index;
    for (let i = 0; i < this.data.options.length; i++) {
      if (optionsIndex === i) {
        break;
      }
      const element = this.data.options[i];
      console.log(this.data.helpList[element.value],this.data.helpList[element.value].length);
      res += this.data.helpList[element.value].length || 0;
      
    }
    console.log(res);
    return res
  },
  select(event) {
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