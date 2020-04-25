Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        lucky: {
            type: Number
        },
        money: {
            type: Number
        }
    },
    // 组件初始数据
    data: {

    },
    // 组件方法列表
    methods: {
        tapEvent(e) {
            let index = +e.currentTarget.dataset.index;
            switch (index) {
                case 1:
                    break;
                case 2:
                    break;
            }
        }
    }
})