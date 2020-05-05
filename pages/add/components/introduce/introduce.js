const Api = require('../../../../utils/api');
Page({
  data: {
    files: [],
    introduce: ''
  },

  onShow: function () {
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
    this.setData({ files: prepage.data.files });
    wx.createSelectorQuery().select('#editor-textarea').context(res => {
      res.context.setContents({
        delta: prepage.data.introduce
      })
    }).exec();
  },

  bindTextAreaInput: function (e) {
    let introduce = e.detail.delta;
    this.setData({ introduce })
  },

  bindTap: function (e) {
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2], introduce = this.data.introduce, files = this.data.files;
    console.log(introduce, files);
    prepage.setData({ introduce, files });
    wx.navigateBack({
      delta: 1
    })
  },

  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 8,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths[0];
        wx.showLoading({
          title: "正在上传"
        });
        wx.uploadFile({
          url: Api.UploadImg,
          filePath: tempFilePaths,
          name: 'img_path',
          header: {
            charset: 'utf-8'
          },
          success(res) {
            wx.hideLoading();
            let data = JSON.parse(res.data);
            let files = that.data.files;
            files.push(data.result);
            that.setData({ files });
          }
        })
      }
    })
  },

  reduceFile(e) {
    var index = +e.currentTarget.dataset.index, files = this.data.files;
    files.splice(index, 1);
    this.setData({ files });
  }

})