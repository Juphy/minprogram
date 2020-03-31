const util = require('../../../utils/util.js');
const Api = require('../../../utils/api.js');

Page({
  data: {
	image_source: 0, // 0 相册  1 会话
    image_type: 0, // 0 奖品相册
    flag: true, // true h>w  false h<w	
    src:'',
    width: 300,
    height: 300,
    min_width: 300,
    min_height: 300,
	disable_width: true,
	disable_height: true,
    disable_rotate:true,//是否禁用旋转
    disable_ratio: true,//锁定比例
    limit_move: true,//是否限制移动
  },
  
  onLoad: function(options){
    var that = this;
    let { image_source, image_type, src } = options;
	this.setData({image_source: Number(image_source)});	
	this.setData({image_type: Number(image_type)});
	wx.getImageInfo({
	  src,
      success(res){
		let flag = (res.height>res.width);
        that.setData({flag});
	    if(flag){
	      let height = that.data.width/2;
	      that.setData({height});
	    }else{
	      let width = that.data.height/2;
	      that.setData({width});	  
	    }				
	  }	  
	});
	this.cropper = this.selectComponent("#image-cropper");
	this.setData({src: src});
	wx.showLoading({
      title: '加载中'
    });
  },
  
  changeRatio: function(e){
	let _flag = +e.currentTarget.dataset.index, 
	flag = this.data.flag;
	if(_flag){
	  if(flag){
	    let height = this.data.width;
	    this.setData({height});  
	  }else{
	    let width = this.data.height;
	    this.setData({width}); 		  
	  }	
	}else{
	  if(flag){
	    let height = this.data.width/2;
	    this.setData({height});
	  }else{
	    let width = this.data.height/2;
	    this.setData({width});	  
	  }					
	}
  },
  
  cropperload(e){
	console.log('cropper加载完成') 
  },
  
  loadimage(e){
	wx.hideLoading();
    this.cropper.imgReset();	
  },
  
  clickcut(e){
	wx.previewImage({
	  current: e.detail.url,
      urls: [e.detail.url]	  
	})  
  },
  
  cancel(){
	  
  },
  
  submit(){
    wx.showLoading({
      title: '正在上传'
    })  
	this.cropper.getImg(obj => {
      wx.uploadFile({
		url: Api.UploadImg,
        filePath: obj.url,
        name: 'img_path',
		success(res){
		  wx.hideLoading();	
		  console.log(res);	
		}	
	  })	  
	})  
  },
  
  upload(){
	let that = this;
      wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        const tempFilePaths = res.tempFilePaths[0];
		wx.getImageInfo({
		  src: tempFilePaths,
		  success(res){
			let flag = (res.height>res.width);
			that.setData({flag});
			if(flag){
			  let height = that.data.width/2;
			  that.setData({height});
			}else{
			  let width = that.data.height/2;
			  that.setData({width});	  
			}
			that.cropper.imgReset();
			that.setData({
			  src: tempFilePaths
			});			
		  }	  
		});	
      }
    })	
  },
  setHeigt(e){
	let width = this.data.width;
    this.setData({
	  height: width/2	
	});	
  },
  top(){
    this.data.top = setInterval(() => {
      this.cropper.setTransform({
        y: -1
      });
    }, 1000 / 60)
  },
  bottom(){
    this.data.bottom = setInterval(() => {
      this.cropper.setTransform({
        y: 1
      });
    }, 1000 / 60)
  } 
})