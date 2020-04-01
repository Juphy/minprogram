Page({
  data: {},
  
  onShow: function(){
	let pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
	var that = this;  
    wx.createSelectorQuery().select('#editor-textarea').context(res => {
	  res.context.setContents({
		html: prepage.data.describe  
	  })	
	}).exec();	
  },
  
  bindTextAreaInput: function(e){
	let pages = getCurrentPages();
    var prepage = pages[pages.length - 2], describe = e.detail.html;
    prepage.setData({describe});
  },
  
  bindTap: function(e){
	wx.navigateBack({
	  delta: 1	
	})  
  }

})