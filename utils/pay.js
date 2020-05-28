/**
 * 支付相关服务
 */

// const util = require('../utils/util.js');
// const api = require('../config/api.js');
const api = require('./api.js');
/**
 * 判断用户是否登录
 */
function payOrder(orderNo) {
  return new Promise(function (resolve, reject) {
    api.fetchPost(api.PayPrepayId, {
      order_no: orderNo
    }, (err, res) => {
      if (res.status === 200) {
        const payParam = res.result;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            resolve(res);
          },
          'fail': function (res) {
            reject(res);
          },
          'complete': function (res) {
            reject(res);
          }
        });
      } else {
        reject(res);
      }
    });
  });
}


module.exports = {
  payOrder,
};











