//one.js
const weeks = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const days = [];
const hours = [];
const mins = [];
// 获取日期
const formateDate = function (day, week) {

}

const Data = require("../../Data.js");
const ReceiveTypes = Data.ReceiveTypes;
const TypeText = Data.TypeText;
const Max = Data.MaxNum;

Page({
  data: {
    index: 0,
    TypeText: {},
    prizes: [
      {
        type: 1, // 1 奖品  2 红包 
        name: '',
        money: null,
        num: '',
        image: '../../../image/hongbao.jpg',
        _receive_type: '按收货地址发货',
        promote: {
          id: 0, // 0 按收货地址收货 !0 让中奖者联系我
          promote_name: '',
          promote_type: null,
          promote_guide: '',
          promote_img: null
        }
      }
    ],
    describe: '', // 抽奖说明
    promote: {
      id: '',
      promote_name: '',
      promote_type: null,
      promote_guide: '',
      promote_img: null
    },
    hideModal: false, // 上传图片
    hideModal1: true,
    hideModal2: true,
    animationData: {},
    draw_mode: 1, // 1 定时开奖  2 手动开奖  3 满人开奖
    end_time: null,
    date: '',
    constraint_max_num: null,
    allChecked: false,
    introduce: '', // 图文介绍
    need_share: true, // 允许参与者分享
    joinFriend: false, // 好友助力
    joinSet: false, // 参与条件设置
    fanSet: false, // 仅公众号粉丝参与
    openComment: false // 开放评论
  },

  onLoad: function () {
  },

  onShow: function () {
    // 不同奖品的显示文字
    this.setData({ TypeText });
    var that = this;
    // 奖品接收方式
    let prizes = this.data.prizes;
    prizes.forEach(item => {
      item['_receive_type'] = item.promote.id === 0 ? '按收货地址发货' : item.promote.promote_name;
    });
    this.setData({ prizes });
    // 奖品描述
    wx.createSelectorQuery().select('#editor-text').context(res => {
      res.context.setContents({
        html: this.data.describe
      })
    }).exec();
  },

  bindInputName: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(e.detail.value);
  },

  bindBlur: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(e.detail.value);
  },

  bindInputNum: function (e) {
    var index = +e.currentTarget.dataset.index;
    console.log(index);
    console.log(e.detail.value);
  },

  bindTextareaTap: function (e) {
    wx.navigateTo({
      url: "/pages/common/description/description"
    })
  },

  bindPromoteTap: function (e) {
    wx.navigateTo({
      url: "/pages/common/promote/promote"
    })
  },

  bindReceive: function (e) {
    var index = +e.currentTarget.dataset.index;
    this.setData({ index });
    wx.navigateTo({
      url: "/pages/common/receive/receive"
    })
  },

  formSubmit: function (e) {
    console.log(e);
  },

  showImgSheet(e) {
    var index = +e.currentTarget.dataset.index, hideModal = true;
    this.setData({ index });
    this.setData({ hideModal });
  },

  tapImg(e) {
    let index = +e.detail.index, that = this, hideModal = false;;
    switch (index) {
      case 0:
        this.setData({ hideModal })
        break;
      case 1:
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            that.setData({ hideModal })
            that.handleImgSuccess(res, index, 0);
          }
        })
        break;
      case 2:
        break;
      case 3:
        wx.chooseMessageFile({
          count: 1,
          type: 'image',
          success(res) {
            that.setData({ hideModal })
            that.handleImgSuccess(res, index, 0);
          }
        })
        break;
    }
  },

  handleImgSuccess(res, image_source, image_type) {
    const tempFilePaths = res.tempFilePaths[0];
    // let prizes = this.data.prizes, index = this.data.index;
    // let prize = prizes[index];
    // prize.image = tempFilePaths;
    wx.navigateTo({
      url: `/pages/common/cropper/cropper?image_source=${image_source}&image_type=${image_type}&src=${tempFilePaths}`
    });
  },

  showModal1: function (e) {
    var hideModal1 = !!+e.currentTarget.dataset.index, that = this, animation;
    if (!hideModal1) {
      this.setData({ hideModal1 });
      animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease'
      });
      this.animation = animation;
      setTimeout(function () {
        that.fadeIn();
      }, 20)
    } else {
      animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease'
      });
      this.animation = animation;
      that.fadeDown()
      setTimeout(function () {
        that.setData({ hideModal1 });
      }, 220)
    }
  },

  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  fadeDown: function () {
    this.animation.translateY(348).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        let prizes = that.data.prizes, index = that.data.index;
        let prize = prizes[index];
        prize.image = tempFilePaths;
        wx.navigateTo({
          url: "/pages/common/cropper/cropper?image_source=0&image_type=0&src=" + tempFilePaths
        })
      }
    })
  },

  chooseMessageFile: function () {
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'image',
      success(res) {
        const tempFilePaths = res.tempFiles[0];
        let prizes = that.data.prizes, index = that.data.index;
        let prize = prizes[index];
        prize.image = tempFilePaths;
        wx.navigateTo({
          url: "/pages/common/cropper/cropper?image_source=0&image_type=0&src=" + tempFilePaths
        })
      }
    })
  },

  changeSwitch: function (e) {
    let type = +e.currentTarget.dataset.index,
      index = this.data.index,
      prizes = this.data.prizes;
    prizes[index].type = type;
    switch (type) {
      case 1:
        prizes[index].image = "../../../image/hongbao.jpg";
        break;
      case 2:
        prizes[index].image = "../../../image/hongbao1.jpg";
        break;
    }
    this.setData({ prizes });
  },

  changeDrawMode: function (e) {
    let draw_mode = +e.currentTarget.dataset.index;
    this.setData({ draw_mode });
    var that = this, animation, hideModal1 = true;
    animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    });
    this.animation = animation;
    that.fadeDown()
    setTimeout(function () {
      that.setData({ hideModal1 });
    }, 220)
  },

  bindPeopleNum: function (e) {
    let constraint_max_num = +e.detail.value;
    if (constraint_max_num > Max) {
      wx.showToast({
        title: `最大人数不能超过${Max}`,
        icon: 'none'
      });
      constraint_max_num = null;
    }
    this.setData({ constraint_max_num });
  },

  changeAllChecked: function (e) {
    let allChecked = e.detail.value;
    this.setData({ allChecked });
  },

  changePreChecked: function (e) {
    let index = +e.currentTarget.dataset.index, value = e.detail.value;
    switch (index) {
      case 1:
        this.setData({ need_share: value });
        break;
      case 2:
        this.setData({ joinFriend: value });
        break;
      case 3:
        this.setData({ joinSet: value });
        break;
      case 4:
        this.setData({ fanSet: value });
        break;
      case 5:
        this.setData({ openComment: value });
        break;
    }
  },

  showUnEdit: function () {
    wx.showToast({
      title: `不可编辑`,
      icon: 'none'
    });
  },

  tapButton(e) {
    let index = +e.detail.index;
    console.log(index);
  }
})

