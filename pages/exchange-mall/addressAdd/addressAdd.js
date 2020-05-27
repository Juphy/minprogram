var api = require('../../../utils/api')
Page({
  data: {
    address: {
      id: 0,
      sheng: undefined,
      shi: undefined,
      xian: undefined,
      zhen: undefined,
      sheng_s: undefined,
      shi_s: undefined,
      xian_s: undefined,
      zhen_s: undefined,
      address: '', // 全部地址
      street: '', // 街道，详细地址
      full_region: '',
      receiver_name: '',
      receiver_phone: '',
      is_default: 0
    },
    addressId: 0,
    cnAddress: '', // 用于自动匹配地址
    openSelectRegion: false,
    selectRegionList: [{
        code: null,
        name: '省份',
        parent_code: null,
        ssxz: 0
      },
      {
        code: null,
        name: '城市',
        parent_code: null,
        ssxz: 1
      },
      {
        code: null,
        name: '区县',
        parent_code: null,
        ssxz: 2
      },
      {
        code: null,
        name: '街镇',
        parent_code: null,
        ssxz: 3
      },
    ],
    regionType: 0,
    regionList: [],
    selectRegionDone: false
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.receiver_phone = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.receiver_name = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress(event) {
    let address = this.data.address;
    address.street = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindCnAddress(event) {
    this.setData({
      cnAddress: event.detail.value
    });
  },
  bindIsDefault() {
    let address = this.data.address;
    address.is_default = !address.is_default;
    this.setData({
      address: address
    });
  },
  // 没有详情接口， 后续改
  getAddressDetail() {
    let that = this;
    api.fetchPost(api.AddressDetail, {
      id: that.data.addressId
    }, function (err, res) {
      if (res.status === 200) {
        if (res.result) {
          that.setData({
            
            address: res.result.address_info
          });
        }
      }
    });
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return !!item.code;
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let address = this.data.address;
    if (address.sheng && address.shi && address.xian && address.zhen) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].code = address.sheng;
      selectRegionList[0].name = address.sheng_s;
      selectRegionList[0].parent_code = undefined;

      selectRegionList[1].code = address.shi;
      selectRegionList[1].name = address.shi_s;
      selectRegionList[1].parent_code = address.sheng;

      selectRegionList[2].code = address.xian;
      selectRegionList[2].name = address.xian_s;
      selectRegionList[2].parent_code = address.shi;

      selectRegionList[3].code = address.zhen;
      selectRegionList[3].name = address.zhen_s;
      selectRegionList[3].parent_code = address.xian;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });
      // this.getRegionList(address.shi);
    } else {
      this.setData({
        selectRegionList: [{
            code: undefined,
            name: '省份',
            parent_code: undefined,
            ssxz: 0
          },
          {
            code: undefined,
            name: '城市',
            parent_code: undefined,
            ssxz: 1
          },
          {
            code: undefined,
            name: '区县',
            parent_code: undefined,
            ssxz: 2
          },
          {
            code: undefined,
            name: '街镇',
            parent_code: undefined,
            ssxz: 3
          }
        ],
        regionType: 0
      })
      console.log('chooseRegion')
      this.getRegionList(undefined);
    }

    this.setRegionDoneStatus();

  },
  onLoad: function (options) {
    // 如果修改。页面初始化 options为页面跳转所带来的参数
    if (options.id != '' && options.id != 0) {
      this.setData({
        addressId: options.id
      });
      // this.getAddressDetail();
    }

    // this.getRegionList();

  },
  onReady: function () {

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex == this.data.regionType || (regionTypeIndex >= 0 && !selectRegionList[regionTypeIndex].code)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex
    })

    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.parent_code);

    this.setRegionDoneStatus();

  },
  selectRegion(event) {
    let that = this;
    console.log(event.target.dataset);
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.ssxz;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType] = regionItem;


    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.code);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType) {
        item.code = undefined;
        item.name = index == 1 ? '城市' : '区县';
        item.parent_code = undefined;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {

        //标记已选择的
        if (that.data.regionType == item.ssxz && that.data.selectRegionList[that.data.regionType].code == item.code) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.sheng = selectRegionList[0].code;
    address.shi = selectRegionList[1].code;
    address.xian = selectRegionList[2].code;
    address.zhen = selectRegionList[3].code;

    address.sheng_s = selectRegionList[0].name;
    address.shi_s = selectRegionList[1].name;
    address.xian_s = selectRegionList[2].name;
    address.zhen_s = selectRegionList[3].name;

    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 0
    });

  },
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    // 根据父节点获取子节点
    api.fetchPost(api.RegionList, {
      code: regionId
    }, function (err, res) {
      console.log(res);
      if (res.status === 200) {
        that.setData({
          regionList: res.result.map(item => {
            //标记已选择的
            if (regionType == item.ssxz && that.data.selectRegionList[regionType].code == item.code) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            item.name = item.post_name
            return item;
          })
        });
        console.log(that.data.regionList, regionType);
      }
    });
  },
  cancelAddress() {
    wx.navigateBack({
      url: '/pages/exchange-mall/address/address',
    })
  },
  saveAddress() {
    let address = this.data.address;
    console.log(address);
    if (address.receiver_name == '') {
      // util.showErrorToast('请输入姓名');
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1500
      });
      return false;
    }

    if (address.receiver_phone == '') {
      // util.showErrorToast('请输入手机号码');
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1500
      });
      return false;
    }


    if (!address.zhen) {
      // util.showErrorToast('请输入省市区');
      wx.showToast({
        title: '请输入省市区',
        icon: 'none',
        duration: 1500
      });
      return false;
    }

    if (address.street == '') {
      // util.showErrorToast('请输入详细地址');
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    let that = this;
    api.fetchPost(api.AddressSave, {
      // code: address.code,
      receiver_name: address.receiver_name,
      receiver_phone: address.receiver_phone,
      address_info: {
        sheng: address.sheng,
        shi: address.shi,
        xian: address.xian,
        zhen: address.zhen,
        // is_default: address.is_default,
        sheng_s: address.sheng_s,
        shi_s: address.shi_s,
        xian_s: address.xian_s,
        zhen_s: address.zhen_s,
        street: address.street,
      }
    }, function (err2, res2) {
      if (res2.status === 200) {
        wx.navigateBack({
          url: '/pages/exchange-mall/address/address',
        })
      }
    });





  },
  checkoutAddress: function () {
    if (!this.data.cnAddress) {
      wx.showToast({
        title: '请在虚线区域输入详细地址',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    api.fetchPost(api.GetAddressObj, {
      'address_array': [this.data.cnAddress]
    }, (err, res) => {
      if (res.status === 200) {
        let cnAddress = res.result[0];
        let selectRegionList = this.data.selectRegionList;
        selectRegionList[0].code = cnAddress.sheng;
        selectRegionList[0].name = cnAddress.sheng_s;
        selectRegionList[0].parent_code = undefined;
  
        selectRegionList[1].code = cnAddress.shi;
        selectRegionList[1].name = cnAddress.shi_s;
        selectRegionList[1].parent_code = cnAddress.sheng;
  
        selectRegionList[2].code = cnAddress.xian;
        selectRegionList[2].name = cnAddress.xian_S;
        selectRegionList[2].parent_code = cnAddress.shi;
  
        selectRegionList[3].code = cnAddress.zhen;
        selectRegionList[3].name = cnAddress.zhen_s;
        selectRegionList[3].parent_code = cnAddress.xian;

        const address = {...this.data.address};
        address.street = cnAddress.street;
        address.address = cnAddress.address;
        address.sheng = cnAddress.sheng,
        address.shi = cnAddress.shi,
        address.xian = cnAddress.xian,
        address.zhen = cnAddress.zhen,
        address.sheng_s = cnAddress.sheng_s,
        address.shi_s = cnAddress.shi_s,
        address.xian_s = cnAddress.xian_s,
        address.zhen_s = cnAddress.zhen_s,
        address.full_region = selectRegionList.map(item => {
              return item.name;
            }).join(''),
        console.log(address);
        this.setData({
          selectRegionList: selectRegionList,
          address,
          regionType: 3
        });
        // this.doneSelectRegion();
      }
    })
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})