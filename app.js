var Api = require('./utils/api.js');

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (userInfo) {
                Api.fetchPost(Api.UserInfo,
                  { code: res.code, encrypted_data: userInfo['encryptedData'], iv: userInfo['iv'] },
                  (err, wxInfo) => {
                    that.globalData.userInfo = wxInfo['result'];
                    typeof cb == "function" && cb(that.globalData.userInfo);
                  })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        }
      })
    }
  },

  getTypeList: function(cb){
    var that = this;
    if (this.globalData.typeList){
      typeof cb == "function" && cb(this.globalData.typeList);
    }else{
      Api.fetchGet(Api.ActivityTypeList, (err, res) => {
        that.globalData.typeList = res['result'];
        typeof cb == "function" && cb(that.globalData.typeList);
      })
    }
  },

  globalData: {
    userInfo: null,
    typeList: null
  }
})