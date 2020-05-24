var api = require('../../utils/api')

Page({
  data: {
    lotteryTypes: [
      {
        title: '实物现金抽奖',
        desc: '奖品类型通常为实物、优惠券、现金',
        img: '../../image/presentfill.png',
        type: 0,
        color: '#EF5227',
        url: '/pages/add/one/one'
      },
      {
        title: '推荐公众号使用',
        desc: '仅限公众号粉丝抽奖功能，吸粉',
        img: '../../image/signalfill.png',
        type: 1,
        color: '#1E86F9'
      },
      {
        title: '推荐实体店使用',
        desc: '增加客户粘性，优惠券发放',
        img: '../../image/shopfill.png',
        type: 1,
        color: '#FEA71C'
      },
      {
        title: '推荐微商使用',
        desc: '吸粉，发放优惠券，增加下单量',
        img: '../../image/wechatfill.png',
        type: 1,
        color: '#00CB72'
      }
    ],
    menuList: [
      { name: '首页推广', img: '../../image/copyto.png', color: '#00C590' },
      { name: '品牌主页', img: '../../image/brand.png', color: '#4B83FA', url: '/pages/brand/pagehome/pagehome' },
      { name: '意见反馈', img: '../../image/ask.png', color: '#8A5DFE' },
      { name: '我要咨询', img: '../../image/warning.png', color: '#1E86F9' }
    ],
  },

  onClickList: function (e) {
    let type = e.currentTarget.dataset.atype;
    console.log(type);
    switch (type) {
      case 0:
        wx.navigateTo({
          url: "/pages/add/one/one"
        });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    // 验证是否有品牌录入
    console.log(this.menuList);
    api.fetchGet(api.GetShopInfo, (err, wxInfo) => {
      // 判断是否有品牌， 没有的话，设置需要认证
      console.log('shopInfo', wxInfo, wxInfo.status);
      if (wxInfo.status === 400) {
        const menuList  = [...that.data.menuList];
        menuList[1].url = '/pages/brand/authentication/authentication'
        that.setData({
          menuList 
        })
      }
    });
  },
})