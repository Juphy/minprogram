const Util = require('../../../utils/util');
const Api = require('../../../utils/api.js');
const Data = require("../../Data.js");
const Promotes = Data.PromotesType;
const Promote = Data.Promotes;

Page({
  data: {
    state: 0,
    promote: {
      id: 0,
      promote_name: '',
      promote_type: null,
      promote_guide: '',
      promote_img: null
    },
    name: '',
    logo: '',
    describe: '',
    introduce: ''
  },

  onLoad: function (options) {
    this.setData({ Promotes });
    this.setData({ Promote });
    let id = options.id;
    if (id) {
      this.getPromoteInfo({ id }, promote => {
        if (promote.promote_type === 1) {
          let promote1 = this.data.promote1;
          for (let key in promote1) {
            promote1[key] = promote[key];
          }
          this.setData({ promote1 })
        } else {
          let promote2 = this.data.promote2;
          for (let key in promote2) {
            promote2[key] = promote[key];
          }
          this.setData({ promote2 })
        }
      })
    }
  },

  // onShow: function () {
  //   let pages = getCurrentPages();
  //   var prepage = pages[pages.length - 2];
  //   this.setData({
  //     introduce: prepage.data.introduce
  //   })
  //   wx.createSelectorQuery().select('#editor-textarea').context(res => {
  //     res.context.setContents({
  //       delta: prepage.data.introduce
  //     })
  //   }).exec();
  // },
  bindNameInput: function(e) {
    const name = e.detail.value;
    this.setData({ name });
  },

  bingDescribeInput: function(e) {
    const describe = e.detail.value;
    this.setData({ describe });
  },

  bindTextAreaInput: function (e) {
    var introduce = e.detail.delta;
    // let pages = getCurrentPages();
    // var prepage = pages[pages.length - 2], describe = e.detail.html;
    this.setData({ introduce, auto_height: false });
  },

  
  submitForm: function() {
    const data = {
      name: this.data.name,
      logo: this.data.logo,
      describe: this.data.describe,
      introduce: this.data.introduce,
      promote_id: this.data.promote.id
    }
    console.log(data);
    Api.fetchPost(Api.editShop, data, (err, res) => {
      console.log(res);
      // 保存成功，跳到详情页
      wx.navigateTo({
        url: "/pages/brand/pagehome/pagehome"
      })
    })
  }
})