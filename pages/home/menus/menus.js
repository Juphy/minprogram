Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
    },
    // 组件初始数据
    data: {
        menuList: [
            {
                name: "每日签到",
                img: "../../../image/calendar.png",
                color1: "#16D3FF",
                color2: "#1D95EC",
            },
            {
                name: "兑换商城",
                img: "../../../image/goods.png",
                color1: "#04E2D7",
                color2: "#04CBA0",
            },
            {
                name: "幸运夺宝",
                img: "../../../image/lucky.png",
                color1: "#DF44FF",
                color2: "#AE46F3",
            },
            {
                name: "幸运大礼",
                img: "../../../image/present.png",
                color1: "#FF7260",
                color2: "#EA5750",
            },
        ]
    },
    // 组件方法列表
    methods: {
        selectMenu(e) {
            let index = +e.currentTarget.dataset.index;
            console.log(e);
            switch (index) {
                case 0:
                    break;
                case 1:
                    wx.navigateTo({
                        url: '../exchange-mall/exchange-mall'
                    });
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }
    }
})