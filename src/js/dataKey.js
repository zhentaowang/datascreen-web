var dataKey = {
    portrait_type:[
        {
            children:[
                {
                    name:'旅客籍贯城市等级',
                    type:'id_city_level'
                },{
                    name:'旅客籍贯城市地区',
                    type:'mobile_phone_location_area'
                },{
                    name:'旅客籍贯城市',
                    type:'mobile_phone_location_province'
                },{
                    name:'姓名信息有效性',
                    type:'has_name'
                },{
                    name:'性别',
                    type:'sex_type'
                },{
                    name:'年龄段',
                    type:'generation'
                }
            ],
            name:"基本信息"
        },{
            children:[
                {
                    name:'客户类型',
                    type:'client_type'
                },{
                    name:'协议类型',
                    type:'protocol_type'
                },{
                    name:'产品类型',
                    type:'product_type'
                }
            ],
            name:"业务特征"
        },{
            children:[
                {
                    name:'休息室类型',
                    type:'lounge_type'
                },{
                    name:'累计使用次数',
                    type:'lounge_consume_count'
                },{
                    name:'近期使用情况',
                    type:'lastest_consume_date_for_in_range_lounge'
                },{
                    name:'近期未使用情况',
                    type:'lastest_consume_date_for_not_in_range_lounge'
                },{
                    name:'服务人次',
                    type:'service_num'
                }
            ],
            name:"两舱服务使用特征"
        },{
            children:[
                // {
                //     name:'贵宾厅类型',
                //     type:'vvip_type'
                // },
                {
                    name:'累计使用次数',
                    type:'vvip_consume_count'
                },{
                    name:'近期使用情况',
                    type:'lastest_consume_date_for_in_range_vvip'
                },{
                    name:'近期未使用情况',
                    type:'lastest_consume_date_for_not_in_range_vvip'
                },{
                    name:'服务人次',
                    type:'service_num'
                }
            ],
            name:"要客服务使用特征"
        }
    ]
}