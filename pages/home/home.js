var Api = require("../../utils/api.js");
var util = require("../../utils/util.js");

const App = getApp();

Page({
	data: {
		list1: [], // 推荐福利
		list2: [], // 精品福利
		list3: [], // 自助福利
		page: 1,
		pagesize: 20,
		lucky: 85,
		money: 1.27
	},

	getPerson: function (e) {
		App.getUserInfo((data) => {
			console.log(data);
		});
	},

	onLoad: function () {
		this.getData();
	},

	onPullDownRefresh: function () {
		this.setData({
			page: 1,
		});
		this.getData();
	},

	onReachBottom: function () {
		this.lower();
	},

	// 获取活动列表
	getData: function () {
		wx.showLoading({
			title: "数据加载中...",
		});
		var that = this;
		var data = {
			// page: that.data.page,
			// pagesize: that.data.pagesize,
		};
		Api.fetchPost(Api.ActivityList, data, (err, res) => {
			wx.hideLoading();
			this.setData({});
		});
	},

	// 滑动底部加载
	lower: function () {
		var that = this;
		that.setData({
			page: that.data.page + 1,
		});
		that.getData();
	},
});
