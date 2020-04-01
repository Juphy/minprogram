const Data = require("../../Data.js");
const ReceiveTypes = Data.ReceiveTypes;
Page({
	data:{
	  ReceiveTypes: [],
      receive_type: 1,
      promote: {}	  
	},
	
    onLoad(){
	  this.setData({ReceiveTypes});
      let pages = getCurrentPages();	
	  var prepage = pages[pages.length - 2];
      let receive_type = prepage.data.receive_type;
      this.setData({receive_type});	  
	},
	
	changReceiveType(e){
	  let receive_type = +e.currentTarget.dataset.index;
      this.setData({receive_type});	  
	}	
})