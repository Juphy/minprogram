const Data = require("../../../Data.js");
const ReceiveTypes = Data.ReceiveTypes;
Page({
	data: {
		ReceiveTypes: [],
		receive_type: false, // 
		promote: {
			id: 0,
			promote_name: '',
			promote_type: null,
			promote_guide: '',
			promote_img: null
		}
	},

	onShow(options) {
		console.log(options);
		this.setData({ ReceiveTypes });
		let pages = getCurrentPages();
		var prepage = pages[pages.length - 2];
		let prizes = prepage.data.prizes, index = prepage.data.index;
		let promote = prizes[index]['promote'];
		this.setData({ promote });
		this.setData({ receive_type: !!promote.id })
	},

	changReceiveType(e) {
		let receive_type = !!(+e.currentTarget.dataset.index);
		this.setData({ receive_type });
		if (!receive_type) this.setData({
			promote: {
				id: 0,
				promote_name: '',
				promote_type: null,
				promote_guide: '',
				promote_img: null
			}
		})
	},

	bindPromoteTap: function () {
		wx.navigateTo({
			url: "/pages/common/promote/promote"
		})
	},

	saveReceive: function () {
		if (this.data.receive_type) {
			if (!this.data.promote.id) {
				wx.showToast({
					title: '没有选择发起人信息',
					icon: 'none'
				});
				return;
			}
		}
		let pages = getCurrentPages();
		let prepage = pages[pages.length - 2];
		let prizes = prepage.data.prizes, index = prepage.data.index;
		prizes[index]['promote'] = this.data.promote;
		prepage.setData({ prizes });
		wx.navigateBack({
			delta: 1
		});
	}
})