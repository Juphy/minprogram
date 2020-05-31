var api = require('../../../utils/api')
Page({
  data:{
    orderList: [],
    page: 1,
    pagesize: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    // hasMorePages: true,
    scrollLeft: 0,
    status: 0,
    statusNav: [0, 100, 101, 200, 201, 202, 300, 400, 401],
    statusOptions: {
      0: {
        label: '全部',
        color: ''
      },
      100: {
        label: '待支付',
        color: '#b4282d'
      },
      101: {
        label: '已失效',
        color: '#b4282d'
      },
      200: {
        label: '支付完成待发货',
        color: '#b4282d'
      },
      201: {
        label: '已发货',
        color: '#b4282d'
      },
      202: {
        label: '已完成',
        color: '#b4282d'
      },
      300: {
        label: '支付失败',
        color: '#b4282d'
      },
      400: {
        label: '申请退款',
        color: '#b4282d'
      },
      401: {
        label: '已退款',
        color: '#b4282d'
      },
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 页面显示

    wx.showLoading({
      title: '加载中...',
      success: function () {

      }
    });
    console.log(1);
    this.getOrderList();
  },

  /**
       * 页面上拉触底事件的处理函数
       */
  onReachBottom: function () {
    this.getOrderList()
  },

  getOrderList(){
    let that = this;

    if (that.data.nomore) {
      // that.setData({
      //   nomore: true
      // })
      return;
    }
    api.fetchPost(api.OrderList, {page: that.data.page, pagesize: that.data.pagesize, status: that.data.status}, function (err, res) {
      if (res.status === 200) {
        that.setData({
          orderList: that.data.orderList.concat(res.result.data.map(item => {
            item.images = JSON.parse(item.images) || null;
            return item;
          })),
          page: res.result.currentPage + 1,
          nomore: !res.result.has_more_pages
        });
        wx.hideLoading();
      }
    });
  },
  payOrder(event){
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.data.orderList[orderIndex];
      console.log(order);
      wx.redirectTo({
          url: '/pages/exchange-mall/pay/pay?orderNo=' + order.order_no + '&realPrice=' + order.real_price,
      })
  },
  copyOrderNo(event) {
    let orderNo = event.currentTarget.dataset.orderNo;
    wx.setClipboardData({
      data: orderNo,
      success: (res) => {
        wx.showToast({
          title: '已复制到剪切板',
          icon: 'none',
          duration: 1500
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 1500
        });
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  switchCate: function (event) {
    console.log(this.data.status, event.currentTarget.dataset.status);
    if (this.data.status == event.currentTarget.dataset.status) {
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
      status: event.currentTarget.dataset.status,
      page:1,
      // totalPages: 1,
      orderList: [],
      nomore: false
    });
    
    this.getOrderList();
  }
})