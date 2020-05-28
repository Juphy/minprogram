const Data = require("../../Data.js"), Api = require('../../../utils/api');
const ReceiveTypes = Data.ReceiveTypes;
const TypeText = Data.TypeText;
const Max = Data.MaxNum;
const App = getApp();
Page({
  data: {
    index: 0,
    TypeText: {},
    prizes: [
      {
        type: 1, // 1 奖品  2 红包  3 随机
        class: 1, // type=1 => 1普通实物 2商场实物 type=2 => 1拼手气 2普通
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
    height: 80,
    promote: {
      id: '',
      promote_name: '',
      promote_type: null,
      promote_guide: '',
      promote_img: null
    },
    hideModal: false, // 上传图片
    hideModal1: true, // 开奖方式
    hideModal2: true,
    animationData: {},
    draw_mode: 1, // 1 定时开奖  2 手动开奖  3 满人开奖
    end_time: null,
    date: '',
    multiIndex: null,
    multiArray: [],
    constraint_max_num: null,
    allChecked: false,
    introduce: '', // 图文介绍
    files: ['https://images-1253527128.cos.ap-beijing.myqcloud.com/tmp_de44652f95fd662d0dff838520ec350f2b7a8a5842b20358_956dfe9c.jpg'],
    need_share: true, // 允许参与者分享
    joinFriend: false, // 好友助力
    joinSet: false, // 参与条件设置
    fanSet: false, // 仅公众号粉丝参与
    openComment: false, // 开放评论
    sex: 0,
    sexArray: ['不限', '男生', '女生'],
    chaptcha: '', // 口令
    realname: 0,
    realnameArray: ['不实名', '实名'],
    type: null, // 活动类型
    typelist: [],
    typeList: []
  },

  onLoad: function () {
  },

  onShow: function () {
    // 活动类型
    App.getTypeList(typelist => {
      this.setData({
        type: 0,
        typelist: typelist.map(item => item.name),
        typeList: [...typelist]
      })
    })
    // 不同奖品的显示文字
    this.setData({ TypeText });
    var that = this;
    // 奖品接收方式
    let prizes = this.data.prizes;
    prizes.forEach(item => {
      item['_receive_type'] = item.promote.id === 0 ? '按收货地址发货' : item.promote.promote_name;
    });
    this.setData({ prizes });
    // 抽奖说明
    wx.createSelectorQuery().select('#describe-text').context(res => {
      if (res) {
        res.context.setContents({
          delta: that.data.describe
        })
      }
    }).exec();

    // 图文介绍
    wx.createSelectorQuery().select('#editor-text').context(res => {
      if (res) {
        res.context.setContents({
          delta: that.data.introduce
        })
      }
    }).exec();

    // 时间选择
    let multiArray = [[], [], []];
    let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let i = 0;
    while (i < 7) {
      var date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
      var month = date.getMonth() + 1, day = date.getDate(), week = date.getDay()
      var a1 = (month > 9 ? month : '0' + month) + '月', b1 = (day > 9 ? day : '0' + day) + '日', c1 = weeks[week];
      multiArray[0].push(a1 + b1 + '  ' + c1);
      i++;
    }
    i = 0;
    while (i < 24) {
      let hour = i > 9 ? i : '0' + i;
      multiArray[1].push(hour);
      i++;
    }
    i = 0;
    while (i < 60) {
      let minute = i > 9 ? i : '0' + i;
      multiArray[2].push(minute);
      i = i + 5;
    }
    this.setData({ multiArray })
  },

  addPrize: function () {
    let prizes = this.data.prizes;
    prizes.push(
      {
        type: 1,
        class: 1,
        name: '',
        money: null,
        num: '',
        image: '../../../image/hongbao.jpg',
        _receive_type: '按收货地址发货',
        promote: {
          id: 0,
          promote_name: '',
          promote_type: null,
          promote_guide: '',
          promote_img: null
        }
      }
    );
    this.setData({ prizes });
  },

  reducePrize: function (e) {
    var index = +e.currentTarget.dataset.index;
    var prizes = this.data.prizes;
    prizes.splice(index, 1);
    this.setData({ prizes });
  },

  changeClass: function (e) {
    var index = +e.currentTarget.dataset.index,
      _class = +e.currentTarget.dataset.class;
    let prizes = this.data.prizes;
    prizes[index]['class'] = _class;
    this.setData({ prizes });
  },

  bindInputName: function (e) {
    var index = +e.currentTarget.dataset.index, value = e.detail.value;
    let prizes = this.data.prizes;
    var type = prizes[index].type;
    switch (type) {
      case 1:
        prizes[index].name = value;
        break;
      case 2:
        prizes[index].money = Number(+value);
        let num = Number(prizes[index].num);
        if (prizes[index].money < num * 0.01) {
          wx.showToast({
            title: `单个红包金额不得低于0.01元`,
            icon: 'none'
          });
        }
        break;
      case 3:
        break;
    }
    this.setData({ prizes });
  },

  bindInputNum: function (e) {
    var index = +e.currentTarget.dataset.index, value = Number(e.detail.value);
    let prizes = this.data.prizes;
    var type = prizes[index].type;
    prizes[index]['num'] = value;
    if (type === 2) {
      let money = prizes[index].money, _num = parseInt(money / 0.01);
      if (money < value * 0.01) {
        this.setData({ flag: true });
        wx.showToast({
          title: `单个红包金额不得低于0.01元`,
          icon: 'none'
        });
      }
    }
    this.setData({ prizes });
  },

  bindTextareaTap: function (e) {
    wx.navigateTo({
      url: "/pages/add/components/description/description"
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

  bindIndex: function (e) {
    var index = +e.currentTarget.dataset.index;
    this.setData({ index });
  },

  formSubmit: function (e) {

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

  bindMultiPickerChange: function (e) {
    let multiIndex = e.detail.value;
    this.setData({ multiIndex });
  },

  bindPickerChange: function (e) {
    let index = +e.currentTarget.dataset.index;
    switch (index) {
      case 0:
        this.setData({ sex: e.detail.value })
        break;
      case 1:
        break;
      case 2:
        this.setData({ realname: e.detail.value })
        break;
    }
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
    let type = +e.currentTarget.dataset.type,
      index = +e.currentTarget.dataset.index,
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
    let index = Number(e.detail.index);
    console.log(index);
    if (index === 1) {
      let params = {}, flag = false;
      for (let i = 0; i < this.data.prizes.length; i++) {
        let prize = this.data.prizes[i];
        if (prize.type === 1) {
          if (!prize.name) {
            wx.showToast({
              title: `请输入奖品名称`,
              icon: 'none'
            });
            flag = true;
            return;
          }
          if (!prize.num) {
            wx.showToast({
              title: `请输入奖品数量`,
              icon: 'none'
            });
            flag = true;
            return;
          }
        }
        if (prize.type === 2) {
          if (!prize.money) {
            wx.showToast({
              title: `请输入红包金额`,
              icon: 'none'
            });
            flag = true;
            return;
          }
          if (!prize.num) {
            wx.showToast({
              title: `请输入红包数量`,
              icon: 'none'
            });
            flag = true;
            return;
          }
          if (prize.class === 1) {
            if (prize.money < prize.num * 0.01) {
              wx.showToast({
                title: `单个红包金额不得低于0.01元`,
                icon: 'none'
              });
              flag = true;
              return;
            }
          }
        }
      }
      if (flag) return;
      let prize_info = this.data.prizes.map(item => {
        let obj = {
          name: item.name,
          image: item.image,
          sku_id: null,
          prize_money: Number(item.money * 100),
          total_num: (item.type === 2 && item.class === 1) ? 1 : item.num,
          issue_num: item.num,
          type: Number(item.type + '' + item.class),
          promote_id: item.promote.id
        }
        return obj;
      });
      params['prize_info'] = prize_info;
      let describe = this.data.describe;
      if (!describe) {
        wx.showToast({
          title: `请填写抽奖说明`,
          icon: 'none'
        });
        return;
      }
      params['describe'] = describe;
      if (this.data.allChecked) {
        let draw_mode = this.data.draw_mode, end_time, constraint_max_num;
        params['draw_mode'] = draw_mode;
        switch (draw_mode) {
          case 1:
            if (!this.data.multiIndex) {
              wx.showToast({
                title: `请选择开奖时间`,
                icon: 'none'
              });
              return;
            };
            let date = this.data.multiArray[0][this.data.multiIndex[0]], hour = this.data.multiArray[1][this.data.multiIndex[1]], minute = this.data.multiArray[2][this.data.multiIndex[2]];
            params['end_time'] = new Date().getFullYear() + '-' + date.slice(0, 2) + '-' + date.slice(3, 5) + ' ' + hour + ':' + minute + ':00';
            break;
          case 3:
            params['constraint_max_num'] = this.data.constraint_max_num
            break;
        }
        let constraint_sex, constraint_realname, chaptcha;
        if (this.data.joinSet) {
          params['constraint_sex'] = this.data.sex;
          params['constraint_realname'] = this.data.realname;
          params['chaptcha'] = this.data.chaptcha;
        }
        params['need_share'] = this.data.need_share ? 1 : 0;
        params['need_comment'] = this.data.openComment ? 1 : 0;
        params['introduce'] = {
          introduce: this.data.introduce,
          files: this.data.files
        };
      }
      params['type'] = this.data.typeList[this.data.type].id;
      Api.fetchPost(Api.ActivityCreateByUser, params, (err, res) => {
        console.log(res);
      })
    }
  },

  bindIntroduce: function (e) {
    wx.navigateTo({
      url: "/pages/add/components/introduce/introduce"
    })
  },

  bindchaptcha: function (e) {
    wx.navigateTo({
      url: "/pages/add/components/chaptcha/chaptcha"
    })
  },

  bndType: function (e) {
    this.setData({ type: Number(e.detail.value) })
  }
})

