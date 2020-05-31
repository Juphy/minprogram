var api = require('../../../utils/api')
Page({
  data:{
    orderList: [],
    page: 1,
    pagesize: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    hasMorePages: true
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

    if (!that.data.hasMorePages) {
      that.setData({
        nomore: true
      })
      return;
    }
    console.log(2)
    api.fetchPost(api.OrderList, {page: that.data.page, pagesize: that.data.pagesize}, function (err, res) {
      if (res.status === 200) {
        that.setData({
          orderList: that.data.orderList.concat(res.result.data.map(item => {
            item.images = JSON.parse(item.images) || null;
            return item;
          })),
          page: res.result.currentPage + 1,
          hasMorePages: res.result.has_more_pages
        });
        wx.hideLoading();
      }
    });
  },
  payOrder(event){
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.data.orderList[orderIndex];
      wx.redirectTo({
          url: '/pages/exchange-mall/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price,
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
  }
})