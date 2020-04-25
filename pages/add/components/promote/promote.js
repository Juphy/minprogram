const Api = require('../../../../utils/api.js');
const DATA = require("../../../Data.js")
const PromoteTypes = DATA.PromoteTypes;

Page({
  data: {
    promote_list: [],
    state: 0,
    promote: {
      id: '',
      promote_name: '',
      promote_type: null,
      promote_guide: '',
      promote_img: null
    },
    PromoteTypes: {}
  },

  onLoad: function () {
    this.setData({ PromoteTypes });
  },

  onShow: function () {
    this.getData();
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
    let promote = prepage.data.promote;
    this.setData({ state: promote.id })
  },

  getData: function () {
    wx.showLoading({
      title: '数据加载中...'
    });
    Api.fetchGet(Api.PromoteList, (err, res) => {
      this.setData({
        promote_list: res.result
      })
      wx.hideLoading();
    })
  },

  getTypes: function () {
    Api.fetchGet(Api.PromoteTypes, (err, res) => {
      this.setData({
        promote_type: res.result
      })
    })
  },

  bindTap: function (e) {
    wx.navigateTo({
      url: "/pages/common/promote/edit/edit"
    })
  },

  selectList: function (e) {
    var state = +e.currentTarget.dataset.index;
    let pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
    let promote = prepage.data.promote;
    if (state) {
      this.setData({ state });
      let _promote = this.data.promote_list.find(item => item.id === state);
      for (let key in promote) {
        promote[key] = _promote[key];
      }
      prepage.setData({ promote })
    } else {
      prepage.setData({
        promote: {
          id: '',
          promote_name: '',
          promote_type: null,
          promote_guide: '',
          promote_img: null
        }
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },

  editPromote: function (e) {
    var id = +e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "/pages/common/promote/edit/edit?id=" + id
    })
  }
})