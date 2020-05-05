Page({
  data: {
    chaptcha: ''
  },

  onShow() {
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
    let chaptcha = prepage.data.chaptcha;
    this.setData({ chaptcha });
  },

  bindchaptcha(e) {
    let chaptcha = e.detail.value;
    this.setData({ chaptcha });
  },

  bindTap() {
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2], chaptcha = this.data.chaptcha;
    prepage.setData({ chaptcha });
    wx.navigateBack({
      delta: 1
    })
  }

})