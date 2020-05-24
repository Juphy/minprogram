var api = require('../../../utils/api')
Page({
  data: {
    winHeight: "",
    id: 0,
    goods: {},
    gallery: [],
    specificationList: [], // 规格列表
    productList: [], // 选择了的规格
    number: 1, // 库存, 购买数量
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    checkedProduct: null
  },
  getGoodsInfo: function () {
    let that = this;
    api.fetchPost(api.GetGoodsSpuInfo, { id: that.data.id },
      (err, wxInfo) => {
        wxInfo.result.images = JSON.parse(wxInfo.result.images);
        that.setData({
          goods: wxInfo.result,
          specificationList: wxInfo.result.specs.map(spec => {
            return {
              spec_name: spec.spec_name,
              spec_id: spec.spec_id,
              spec_values: Object.keys(spec.spec_values).map(key => {
                return {
                  id: Number(key),
                  name: spec.spec_values[key],
                  checked: false
                }
              })
            }
          }),
          productList: wxInfo.productList,
        });
          //设置默认值
          that.setDefSpecInfo(that.data.specificationList);
      });

  },

  clickSkuValue: function (event) {
    console.log(event.currentTarget.dataset);
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].spec_id == specNameId) {
        for (let j = 0; j < _specificationList[i].spec_values.length; j++) {
          if (_specificationList[i].spec_values[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].spec_values[j].checked) {
              _specificationList[i].spec_values[j].checked = false;
            } else {
              _specificationList[i].spec_values[j].checked = true;
            }
          } else {
            _specificationList[i].spec_values[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
    this.getCheckedProductItem();
  },

  // 重新计算哪些值不可以点击
  getCheckedProductItem: function (params) {
    const checkedSpec = this.getCheckedSpecValue().map(item => item.valueId ? this.data.goods.spec_value_skus[item.valueId] : []);
    console.log(checkedSpec); 
    let intersection = checkedSpec.shift() || [];
    console.log(intersection);
    // let intersection = arr1.filter(function (val) { return arr2.indexOf(val) > -1 })

    for (const s of checkedSpec) {
      intersection = intersection.filter((val) => s.indexOf(val) > -1)
    }
    console.log(intersection);
    this.setData({
      checkedProduct: intersection.length ? this.data.goods.skus[intersection[0]] : null
    });
    console.log(this.data.checkedProduct);
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].spec_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].spec_values.length; j++) {
        if (_specificationList[i].spec_values[j].checked) {
          _checkedObj.valueId = _specificationList[i].spec_values[j].id;
          _checkedObj.valueText = _specificationList[i].spec_values[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('_');
  },
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  // getCheckedProductItem: function (key) {
  //   return this.data.productList.filter(function (v) {
  //     if (v.goods_spec_ids.indexOf(key) > -1) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    var that = this;
    this.getGoodsInfo();
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr,
      });
    }
  },
  

  /**
   * 直接购买
   */
  buyGoods: function () {
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr,
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      // let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      // let checkedProduct = this.getCheckedProductItem();
      if (!this.data.checkedProduct) { //  || checkedProduct.length <= 0
        //找不到对应的product信息，提示没有库存
        return false;
      }

      //验证库存
      if (this.data.checkedProduct.stock < this.data.number) {
        //找不到对应的product信息，提示没有库存
        return false;
      }

      // 直接购买商品
      api.fetchPost(api.BuyAdd, { goodsId: this.data.goods.id, number: this.data.number, productId: this.data.checkedProduct.id }, "POST",'application/json')
        .then(function (res) {
          let _res = res;
          if (_res.errno == 0) {
            that.setData({
              openAttr: !that.data.openAttr,
            });
            wx.navigateTo({
              url: '/pages/shopping/checkout/checkout?isBuy=true',
            })
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });

    }
  },

  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },
    setDefSpecInfo: function (specificationList) {
        //未考虑规格联动情况
        let that = this;
        if (!specificationList)return;
        for (let i = 0; i < specificationList.length;i++){
            let specification = specificationList[i];
            let specNameId = specification.spec_id;
            //规格只有一个时自动选择规格
            if (specification.spec_values && specification.spec_values.length == 1){
                let specValueId = specification.spec_values[0].id;
                that.clickSkuValue({ currentTarget: { dataset: { "nameId": specNameId, "valueId": specValueId } } });
            }
        }
        specificationList.map(function(item){

        });

    }
})