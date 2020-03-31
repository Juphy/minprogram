var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');

const App = getApp();

Page({
  data: {
	list1: [], // 推荐福利
	list2: [], // 精品福利
	list3: [], // 自助福利
	page: 1,
    pagesize: 20,
    lucky: 85,
    money: 1.27,
    menuList: [
	  {name: '每日签到', img: '../../image/calendar.png', color1: '#16D3FF', color2: '#1D95EC' },
	  {name: '兑换商城', img: '../../image/goods.png', color1: '#04E2D7', color2: '#04CBA0' },
	  {name: '幸运夺宝', img: '../../image/lucky.png', color1: '#DF44FF', color2: '#AE46F3' },
	  {name: '幸运大礼', img: '../../image/present.png', color1: '#FF7260', color2: '#EA5750' }
	]	
  },
  
  getPerson:function(e){     
	App.getUserInfo(data => {
	  console.log(data);	
	});    
  },
  
  onLoad: function(){
	this.getData();  
  },
  
  onPullDownRefresh: function(){
	this.setData({
	  page: 1	
	})  
	this.getData();  
  },
  
  onReachBottom: function(){
	this.lower();  
  },
  
  // 获取活动列表
  getData: function(){
	wx.showLoading({
	  title: '数据加载中...'	
	});  
	var that = this;
	var data = 	{
	  page: that.data.page,
	  pagesize: that.data.pagesize
	};
	Api.fetchPost(Api.ActivityList, 
	  data, (err, res) => {
		wx.hideLoading();
		this.setData({		
	  })
	})
  },
  
  // 滑动底部加载
  lower: function(){
    var that = this;
    that.setData({
      page: that.data.page + 1
    });
	that.getData();	
  }
  
  
})