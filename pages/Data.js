const ReceiveTypes = [
  {
    value: 0,
    name: '按收货地址发货',
    desc: '中奖者开奖后需要填写收货地址，发起者根据地址直接发送奖品。常用于实物奖品'
  },
  {
    value: 1,
    name: '让中奖者联系我',
    desc: '中奖者开奖后，会看到你填写的联系方式，并主动联系你。常用于优惠券等虚拟奖品'
  }
];

const PromoteTypes = {
  1: { value: 1, img: '../../../../image/addbox.png', color: '#666666' },
  2: { value: 2, img: '../../../../image/wechat.png', color: '#1DCB72' },
  3: { value: 3, img: '../../../../image/person.png', color: '#60A2FF' },
  4: { value: 4, img: '../../../../image/persons.png', color: '#00BAFF' },
  5: { value: 5, img: '../../../../image/link.png', color: '#7B7EFF' },
  6: { value: 6, img: '../../../../image/dot.png', color: '#FFB911' }
};

const PromotesType = [
  { value: 2, name: '微信号' },
  { value: 3, name: '公众号' },
  { value: 4, name: '微信群' },
  { value: 5, name: '小程序' },
  { value: 6, name: '其他' }
];

const Promotes = {
  2: { name1: '微信昵称', name2: '上传微信二维码' },
  3: { name1: '公众号', name2: '上传公众号二维码' },
  4: { name1: '群昵称', name2: '上传群二维码' },
  5: { name1: '小程序名称', name2: '上传小程序二维码' },
  6: { name1: '名称', name2: '上传二维码' }
};

const TypeText = {
  1: {
    name: '奖品名称', _name: '请输入奖品名称',
    num: '奖品数量', _num: '数量',
  },
  2: {
    name: '总金额', _name1: '请输入总金额', _name2: '请输入金额',
    num: '红包个数', _num: '数量',
  }
};

const MaxNum = 99999;

module.exports = {
  ReceiveTypes,
  PromoteTypes,
  PromotesType,
  Promotes,
  TypeText,
  MaxNum
}
