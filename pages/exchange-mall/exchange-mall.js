var api = require('../../utils/api.js');

Page({
  data: {
    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    id: 0,
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    // totalPages: 1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // if (options.id) { // 目前不会传过来id
    //   that.setData({
    //     id: parseInt(options.id)
    //   });
    // }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });


    this.getGroupInfo();

  },
  getGroupInfo: function () {
    let that = this;
    api.fetchGet(api.GroupList,
      (err, wxInfo) => {
        if (!that.data.id) {
          that.setData({
            id: 0
          });
        }
        that.setData({
          navList: [{id: 0, name: '全部商品'}, ...wxInfo.result],
        });

        //nav位置
        let currentIndex = 0;
        let navListCount = that.data.navList.length;
        for (let i = 0; i < navListCount; i++) {
          currentIndex += 1;
          if (that.data.navList[i].id == that.data.id) {
            break;
          }
        }
        if (currentIndex > navListCount / 2 && navListCount > 5) {
          that.setData({
            scrollLeft: currentIndex * 60
          });
        }
        that.getGoodsList();
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    this.getGoodsList()
  },

  getGoodsList: function () {
    var that = this;

    if (that.data.nomore) {
      return;
    }
    const data = {page: that.data.page, pagesize: that.data.size};
    if (that.data.id) {
      data['group_id'] = that.data.id;
    }
    api.fetchPost(api.GetGoodsList, data,
      (err, wxInfo) => {
        wxInfo.result.data.forEach(item => {
          item.images = JSON.parse(item.images);
        });
        that.setData({
          goodsList: that.data.goodsList.concat(wxInfo.result.data),        
          page: wxInfo.result.pageinfo.current_page+1,
          // totalPages: wxInfo.result.pageinfo.total / wxInfo.result.pageinfo.per_page
          nomore: !wxInfo.result.pageinfo.has_more_pages
        });
      });
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id,
      page:1,
      // totalPages: 1,
      goodsList: [],
      nomore: false
    });
    
    this.getGoodsList();
  }
})