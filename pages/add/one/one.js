//one.js
const weeks=['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const days = [];
const hours = [];
const mins = [];
// 获取日期
const formateDate = function(day, week){
	
}

const Data = require("../../Data.js");
const ReceiveTypes = Data.ReceiveTypes;
const TypeText = Data.TypeText;

Page({
  data: {
	index: 0,
	TypeText: {},
    prizes: [
	  { type: 1, // 1 奖品  2 红包 
	    name: '', 
		money: null,
	    num: '', 
	    img: '../../../image/hongbao.jpg', 
	    receive_type: 0,
	    promote:{}
	  }
	],
	describe: '', // 抽奖说明
	promote: {
	  id: '',
      promote_name: '',
      promote_type: null,
      promote_guide: '',
	  promote_img: null	
	},
	hideModal: true,
	animationData: {}
  },
  
  onLoad: function () {
	this.setData({TypeText});  
	let prizes = this.data.prizes;
    prizes.forEach(item => {
	  let receiveType = ReceiveTypes[item.receive_type];
      item['_receive_type'] = receiveType.name;	  
	});
    this.setData({prizes});	
  },
  
  bindInputName: function(e){
	var index = e.currentTarget.dataset.index;
    console.log(index);	
	console.log(e.detail.value);
  },  
   
  bindBlur: function(e){
	var index = e.currentTarget.dataset.index;
    console.log(index);	
	console.log(e.detail.value);
  },
  
  bindInputNum: function(e){
	var index = e.currentTarget.dataset.index;
    console.log(index);		  
	console.log(e.detail.value);
  },
  
  bindTextareaTap: function(e){
	wx.navigateTo({
		url: "/pages/common/description/description"
	}) 
  },
  
  bindPromoteTap: function(e){
	wx.navigateTo({
		url: "/pages/common/promote/promote"
	})   
  },
  
  formSubmit: function(e){
	console.log(e);  
  },
  
  showModal: function(e){
	var hideModal = !!+e.currentTarget.dataset.index, that = this, animation;
	if(!hideModal){
      this.setData({hideModal});
      animation = wx.createAnimation({
		duration: 200,
		timingFunction: 'ease'
	  });
      this.animation = animation;
      setTimeout(function(){
		that.fadeIn();  
	  }, 20)	  
	}else{
	  animation = wx.createAnimation({
		duration: 200,
        timingFunction: 'ease'		
	  });
      this.animation = animation;
	  that.fadeDown()
      setTimeout(function(){
		that.setData({hideModal});  
	  }, 220)	  
	}
  },


  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  
  fadeDown: function () {
    this.animation.translateY(348).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  
  chooseImage: function(){
	var that = this;
    wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success (res) {
        const tempFilePaths = res.tempFilePaths[0];
		let prizes = that.data.prizes, index = that.data.index;
		let prize = prizes[index];
		prize.img = tempFilePaths;
		wx.navigateTo({
			url: "/pages/common/cropper/cropper?image_source=0&image_type=0&src=" + tempFilePaths
		}) 
      }
   })	  
  },
  
  chooseMessageFile: function(){
	var that = this;	  
	wx.chooseMessageFile({
      count: 1,
      type: 'image',
	  success (res) {
        const tempFilePaths = res.tempFiles[0];
		let prizes = that.data.prizes, index = that.data.index;
		let prize = prizes[index];
		prize.img = tempFilePaths;
		wx.navigateTo({
			url: "/pages/common/cropper/cropper?image_source=0&image_type=0&src=" + tempFilePaths
		}) 		
      }
	})
  },
  
  changeSwitch: function(e){
	let type = +e.currentTarget.dataset.index, 
	index = this.data.index,
	prizes = this.data.prizes;
	prizes[index].type = type;
	switch(type){
	  case 1:
	    prizes[index].img = "../../../image/hongbao.jpg";  
      break;
	  case 2:
	    prizes[index].img = "../../../image/hongbao1.jpg"; 
      break;	  
	}
    this.setData({prizes});	
  }
})

