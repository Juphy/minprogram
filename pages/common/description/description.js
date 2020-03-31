Page({
  data: {
	describe: ''  
  },
  
  onShow: function(){
	let pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
    this.setData({
	  describe: prepage.data.describe	
	})  
  },
  
  bindTextAreaInput: function(e){
	let pages = getCurrentPages();
    var prepage = pages[pages.length - 2], describe = e.detail.value;
    prepage.setData({describe});
    this.setData({describe});
	console.log(this.data.describe);	
  },
  
  bindTap: function(e){
	wx.navigateBack({
	  delta: 1	
	})  
  }

})