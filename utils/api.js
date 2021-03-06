'use strict';
// api 路径
const HOST = 'https://fw.wenquanpage.com';
// 活动列表 home/activity_list
const ActivityList = HOST + '/home/activity_list',
  // 登录换取 openid
  UserInfo = HOST + '/wechat/get_applet_user_info',
  // 添加发起人信息
  EditPromote = HOST + '/user/edit_promote',
  // 发起人信息列表
  PromoteList = HOST + '/user/promote_list',
  // 发起人详情
  PromoteInfo = HOST + '/user/promote_info',
  // 发起人信息类型
  PromoteTypes = HOST + "/user/promote_types",
  // 上传图片
  UploadImg = HOST + "/ucs/upload_img",
  //  活动类型列表
  ActivityTypeList = HOST + '/activity/type_list',
  //  发布活动
  ActivityCreateByUser = HOST + '/activity/create_by_user',
  // 获取商品列表
  GetGoodsList = HOST + '/home/goods_list',
  CategoryList = HOST + '/home/goods_categorys', 
  GroupList = HOST + '/home/goods_groups',
  // 获取商品spu详情（商品详情)
  GetGoodsSpuInfo = HOST + '/goods/info',
  // 获取商品sku属性列表
  GetGoodsSpuSkus = HOST + '/goods/spu_skus',

  // 获取品牌信息， 如果没有品牌信息则跳到品牌认证页
  GetShopInfo = HOST + '/shop/info',
  // 编辑品牌信息（商铺）
  editShop = HOST + '/shop/edit',
  // 删除品牌（商铺）
  deleteShop = HOST + '/brand/del',
  // 获取options
  sysOptions = HOST + '/home/sys_options',
  // 我要投诉
  addFeedback = HOST + '/user/add_feedback',
  // 地址
  AddressList = HOST + '/user/address_list',
  AddressDetail = HOST + '/xxx/AddressDetail',
  RegionList = HOST + '/home/get_children_diqus',
  GetAddressObj = HOST + '/home/get_location_ex',
  AddressSave = HOST + '/user/edit_address',
  AddressDelete = HOST + '/user/del_address',
  OrderSubmit = HOST + '/order/sku_create',
  OrderList = HOST + '/user/order_list',
   // 支付
  PayPrepayId = HOST + '/order/sku_pay',
  OrderQuery = HOST + '/xxx/OrderQuery',
  OrderDetail = HOST + '/user/order_info',
  Question = HOST + '/user/question_answers',
  GoodsCouponList = HOST + '/xxx/GoodsCouponList';
// get请求方法
let fetchGet = function (url, callback) {
  wx.request({
    url: url,
    header: { 'Content-Type': 'application/json' },
    success(res) {
      callback(null, res.data)
    },
    fail(e) {
      console.error(e)
      callback(e)
    }
  })
}

// post请求方法
let fetchPost = function (url, data, callback) {
  wx.request({
    method: 'POST',
    url: url,
    data: data,
    header: { 'Content-Type': 'application/json' },
    success(res) {
      callback(null, res.data)
    },
    fail(e) {
      console.error(e)
      callback(e)
    }
  })
}

module.exports = {
  // API
  ActivityList,
  UserInfo,
  EditPromote,
  PromoteList,
  PromoteInfo,
  PromoteTypes,
  UploadImg,
  ActivityTypeList,
  ActivityCreateByUser,
  GetGoodsList,
  CategoryList,
  GroupList,
  GetGoodsSpuInfo,
  GetGoodsSpuSkus,
  GetShopInfo,
  editShop,
  deleteShop,
  sysOptions,
  addFeedback,
  PayPrepayId,
  AddressDetail,
  RegionList,
  GetAddressObj,
  AddressList,
  AddressSave,
  AddressDelete,
  OrderList,
  OrderSubmit,
  OrderQuery,
  GoodsCouponList,
  OrderDetail,
  Question,
  // METHOD
  fetchGet,
  fetchPost
}
