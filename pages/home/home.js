var Api = require("../../utils/api.js");
var util = require("../../utils/util.js");

const App = getApp();

Page({
	data: {
		lista: [], // 推荐福利
		listb: [], // 精品福利
		listc: [], // 自助福利
		lucky: 85,
		money: 1.27
	},

	getPerson: function (e) {
		App.getUserInfo((data) => {
			console.log(data);
		});
	},

	onLoad: function () {
		this.getPerson();
	},

	onShow: function () {
		this.getData();
	},

	onPullDownRefresh: function () {
		this.getData();
	},

	// 获取活动列表
	getData: function () {
		wx.showLoading({
			title: "数据加载中...",
		});
		var that = this;
		Api.fetchGet(Api.ActivityList, (err, res) => {
			wx.hideLoading();
			if (res.status === 200) {
				res = res.result;
				res[2][1]['name'] = 'AD';
				res[2][1]['html'] = `
				<div style="margin-bottom: 12px">
					<h1 style="text-align: center">广告</h1>
				</div>
				`;
				this.setData({
					lista: res[2],
					listb: res[3],
					listc: res[4]
				})
			}
		});
	}
});
