const util = require("../../../utils/util.js");
const Api = require("../../../utils/api.js");

Page({
	data: {
		image_source: 0, // 0 相册  1 会话
		image_type: 0, // 0 奖品相册
		flag: true, // true h>w  false h<w
		src: "",
		width: 300,
		height: 300,
		min_width: 300,
		min_height: 300,
		disable_width: true,
		disable_height: true,
		disable_rotate: true, //是否禁用旋转
		disable_ratio: true, //锁定比例
		limit_move: true, //是否限制移动
	},

	onLoad: function (options) {
		var that = this;
		let {
			image_source,
			image_type,
			src
		} = options;
		this.setData({
			image_source: Number(image_source),
			image_type: Number(image_type),
			src: src
		});
		wx.showLoading({
			title: "加载中",
		});
		wx.getImageInfo({
			src,
			success(res) {
				let flag = res.height > res.width;
				that.setData({
					flag,
				});
				if (flag) {
					let height = that.data.width / 2;
					that.setData({
						height,
					});
				} else {
					let width = that.data.height / 2;
					that.setData({
						width,
					});
				}
				that.cropper = that.selectComponent("#image-cropper");
			}
		});
	},

	cropperload(e) {
		console.log("cropper加载完成");
	},

	loadimage(e) {
		wx.hideLoading();
		this.cropper.imgReset();
	},

	changeRatio: function (e) {
		let _flag = +e.currentTarget.dataset.index,
			flag = this.data.flag;
		if (_flag) {
			if (flag) {
				let height = this.data.width;
				this.setData({
					height,
				});
			} else {
				let width = this.data.height;
				this.setData({
					width,
				});
			}
		} else {
			if (flag) {
				let height = this.data.width / 2;
				this.setData({
					height,
				});
			} else {
				let width = this.data.height / 2;
				this.setData({
					width,
				});
			}
		}
	},

	clickcut(e) {
		wx.previewImage({
			current: e.detail.url, // 当前显示图片的http
			urls: [e.detail.url]  // 需要预览的图片http链接列表
		});
	},

	cancel() {
		wx.navigateBack({
			delta: 1
		})
	},

	submit() {
		wx.showLoading({
			title: "正在上传"
		});
		this.cropper.getImg((obj) => {
			wx.uploadFile({
				url: Api.UploadImg,
				filePath: obj.url,
				name: "img_path",
				header: {
					charset: 'utf-8'
				},
				success(res) {
					wx.hideLoading();
					let data = JSON.parse(res.data);
					let pages = getCurrentPages();
					let prepage = pages[pages.length - 2];
					let index = prepage.data.index, prizes = prepage.data.prizes;
					prizes[index]['image'] = data.result;
					prepage.setData({ prizes });
					console.log(prizes);
					wx.navigateBack({
						delta: 1
					})
				},
			});
		});
	},

	handleImg(res) {
		wx.showLoading({
			title: "加载中",
		});
		const tempFilePaths = res.tempFiles[0];
		wx.getImageInfo({
			src: tempFilePaths,
			success(res) {
				let flag = res.height > res.width;
				if (flag) {
					let height = that.data.width / 2;
					that.setData({
						height
					});
				} else {
					let width = that.data.height / 2;
					that.setData({
						width
					});
				}
				that.cropper.imgReset();
				that.setData({
					flag,
					src: tempFilePaths,
				});
			},
		});
	},

	upload() {
		let that = this;
		let index = this.data.image_source;
		switch (index) {
			case 0:
				wx.chooseImage({
					count: 1,
					sizeType: ["original", "compressed"],
					sourceType: ["album", "camera"],
					success(res) {
						this.handleImg(res);
					},
				});
				break;
			case 1:
				wx.chooseMessageFile({
					count: 1,
					type: 'image',
					success(res) {

						this.handleImg(res);
					}
				})
				break;
		}
	},
	setHeigt(e) {
		let width = this.data.width;
		this.setData({
			height: width / 2,
		});
		this.setData({
			cut_top: this.cropper.data.cut_top
		});
	},
	top() {
		this.data.top = setInterval(() => {
			this.cropper.setTransform({
				y: -3,
			});
		}, 10);
	},
	bottom() {
		this.data.bottom = setInterval(() => {
			this.cropper.setTransform({
				y: 3,
			});
		}, 10);
	},
	left() {
		this.data.left = setInterval(() => {
			this.cropper.setTransform({
				x: -3
			});
		}, 10)
	},
	right() {
		this.data.right = setInterval(() => {
			this.cropper.setTransform({
				x: 3
			});
		}, 10)
	},
});