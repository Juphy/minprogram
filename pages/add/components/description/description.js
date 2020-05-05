Page({
  data: {
    describe: ''
  },

  onShow: function () {
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
    this.setData({
      describe: prepage.data.describe
    })
    wx.createSelectorQuery().select('#editor-textarea').context(res => {
      res.context.setContents({
        delta: prepage.data.describe
      })
    }).exec();
  },

  bindTextAreaInput: function (e) {
    var describe = e.detail.delta;
    // let pages = getCurrentPages();
    // var prepage = pages[pages.length - 2], describe = e.detail.html;
    this.setData({ describe, auto_height: false });
  },

  bindTap: function (e) {
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2], describe = this.data.describe;
    prepage.setData({ describe });
    wx.navigateBack({
      delta: 1
    })
  }

})