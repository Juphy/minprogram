const Util = require('../../../../../utils/util.js');
const Api = require('../../../../../utils/api.js');
const Data = require("../../../../Data.js");
const Promotes = Data.PromotesType;
const Promote = Data.Promotes;

Page({
  data: {
    state: 0,
    promote1: {
      promote_type: 1,
      promote_name: '',
      promote_guide: '',
      id: null
    },
    promote2: {
      promote_type: 2,
      promote_name: '',
      promote_guide: '',
      promote_img: '',
      id: null
    },
    Promotes: [],
    Promote: {}
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

  getPromoteInfo(data, callback) {
    Api.fetchPost(Api.PromoteInfo, data, (err, res) => {
      if (res.status === 200) {
        callback(res.result);
      }
    })
  },

  bindSwitch: function (e) {
    var state = +e.currentTarget.dataset.index;
    this.setData({ state });
  },

  bindInput: function (e) {
    let i = +e.currentTarget.dataset.index,
      value = e.detail.value;
    switch (this.data.state) {
      case 0:
        let promote1 = this.data.promote1;
        switch (i) {
          case 0:
            promote1.promote_name = value;
            break;
          case 1:
            promote1.promote_guide = value;
            break;
        }
        this.setData({ promote1 });
        break;
      case 1:
        break;
    }
  },

  bindSelect: function (e) {
    var promote_type = +e.currentTarget.dataset.index;
    let promote2 = this.data.promote2;
    promote2['promote_type'] = promote_type;
    this.setData({ promote2 });
  },

  editPromote: function () {
    switch (this.data.state) {
      case 0:
        let promote1 = this.data.promote1;
        if (!promote1.promote_name) {
          wx.showToast({
            title: '复制内容不能为空',
            icon: 'none',
            duration: 1500
          });
          return;
        }
        if (!promote1.promote_guide) {
          wx.showToast({
            title: '请输入引导用户复制的文案',
            icon: 'none',
            duration: 1500
          });
          return;
        }
        let data = {
          promote_type: promote1.promote_type,
          promote_name: promote1.promote_name,
          promote_guide: promote1.promote_guide
        };
        if (promote1.id) {
          data['id'] = promote1.id;
        }
        Api.fetchPost(Api.EditPromote, data, (err, res) => {
          if (res.status === 200) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.error,
              duration: 1500,
              icon: 'none',
            });
          }
        })
        break;
      case 1:
        break;
    }
  }
})