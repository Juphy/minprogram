Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        data: {
            type: Object
        }
    },
    // 组件初始数据
    data: {
        image: '',
        prizeFlag: false,
        name: '',
        num: 0,
        type: 1,  // 1 奖品 2 红包 3 随机
        class: 1, // 1 拼手气 2 普通
        draw_mode: 1, // 1 定时开奖 2 手动开奖 3 满人开将
        end_time: '',
        constraint_max_num: 0,
        constraint_sex: 0, // 0 不限 1 男生 2 女生
        constraint_realname: 0, // 0 不实名  1 实名
        chaptcha: '', // 口令
        shop_name: ''
    },
    // 生命周期
    lifetimes: {
        ready() {
            let data = this.data.data;
            let prize_info = JSON.parse(data.prize_info);
            console.log(prize_info);
            this.setData({
                image: prize_info[0]['image'],
                name: prize_info[0]['name'],
                num: 999 || prize_info[0]['total_num'],
                type: prize_info[0]['type'],
                class: prize_info[0]['class'],
                prizeFlag: prize_info.length > 1,
                draw_mode: data.draw_mode,
                constraint_max_num: data.constraint_max_num,
                constraint_sex: data.constraint_sex,
                constraint_realname: data.constraint_realname,
                chaptcha: data.chaptcha,
                end_time: data.end_time,
                shop_name: data.shop_name || '泉美小屋'
            })
        }
    },


    // 组件方法列表
    methods: {

    }
})