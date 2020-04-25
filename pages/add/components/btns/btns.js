Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  // 组件初始数据
  data: {

  },
  // 组件方法列表
  methods: {
    tapEvent(e) {
      let index = +e.currentTarget.dataset.index;
      this.triggerEvent('click', { index }, {});
    }
  }
})