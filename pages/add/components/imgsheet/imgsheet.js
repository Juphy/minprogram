Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        showDialog: {
            type: Boolean,
            value: false
        }
    },
    // 组件初始数据
    data: {
        imgLists: [
            { name: '从手机相册选择', value: 1 },
            { name: '从在线图库选择', value: 2 },
            { name: '从微信回话选择', value: 3 }
        ]
    },
    // 组件方法列表
    methods: {
        tapEvent(e) {
            let index = +e.currentTarget.dataset.index;
            this.triggerEvent('click', { index }, {});
        },
        close(e) {
            let index = +e.currentTarget.dataset.index;
            this.triggerEvent('click', { index }, {});
        }
    }
})