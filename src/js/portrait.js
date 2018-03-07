if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var vm = new Vue({
    el: 'body',
    data: {
        chooseList: [],
        tagsMap: '',
        userTags: '',
        cardTags: '',
        appTags: '',
        restTags: '',
        acountTags: '',
        ebTags: '',
        carbill: '',
        channelbill: '',
        parking: '',
        cip: '',
        restaurant: '',
        lounge_service: '',
        membership: '',
        lounge: '',
        give_point: '',
        promotion: '',

        istoggle: true,
        req: {},
        userCount: 0,
        userList: '',
        option1: 0,
        options: '',
        subOption: '',
        option2: 0,

        thrOption: '',
        thrName: 0,

        tagsShow: false,
        portraitShow: false,
        portraitAllShow: false,
        listShow: false,
        willShow: true,
        noUserShow: false
    },
    methods: {
        toggle: function() {
            if (vm.istoggle) {
                vm.istoggle = false;
            }
            else {
                vm.istoggle = true;
            }
        },
        logout: function() {
            User.logout();
            document.location.href = 'login.html';
        },
        clear: function() {
            vm.chooseList = [];
            vm.req = {};
            vm.portraitShow = false;
            vm.listShow = false;
            vm.portraitAllShow = false;
            getTags();
            getEBTags();
        },
        choose: function(el) {
            el.display_name = el.name + '--' + vm.tagsMap[el.type];
            if (el.selected) {
                el.selected = false;
                vm.chooseList.removeElem(el);
            }
            else {
                el.selected = true;
                vm.chooseList.push(el);
            }
            if (vm.chooseList.length != 0) {
                vm.req = {};
                vm.chooseList.forEach(function(v) {
                    var type = v.type;
                    if (!vm.req[type]) {
                        vm.req[type] = [];
                        vm.req[type].push(v.id);
                    }
                    else {
                        vm.req[type].push(v.id);
                    }
                    vm.req[type] = unique(vm.req[type]);
                });

                getUserList(vm.req, function() {
                    getPortrait(vm.req)
                });

            };
            vm.portraitShow = false;
            vm.listShow = false;
            vm.portraitAllShow = false;
        },
        click: function() {
            if (vm.willShow) {
                if (!vm.option2 || vm.option2 == 0) {
                    alert('请正确选择');
                    return;
                }
                getPortrait(vm.req, vm.option2);
            }
            else {
                if (!vm.thrName || vm.thrName == 0) {
                    alert('请正确选择');
                    return;
                }
                getPortrait(vm.req, vm.thrName);
            }

        },
        change: function() {
            vm.option2 = 0;
            vm.thrName = 0;
            if (vm.option1 == '电商消费特征') {
                vm.willShow = false;
            }
            else {
                vm.willShow = true;
            }
            vm.options.forEach(function(el) {
                // console.log()
                if (vm.option1 == el.name) {
                    vm.subOption = el.children;
                    console.log(el.children)
                }
            })
        },
        change2: function() {
            vm.subOption.forEach(function(el) {
                if (vm.option2 == el.name) {
                    vm.thrOption = el.children;
                }
            })
        }
    }
});

getTags();
// getEBTags();
getOptions();

//获取柱状图与地图的数据
function getPortrait(data, type) {
    console.log(data)
    var formData = User.appendAccessToken({
        data: data,
        portrait_type: !type ? null : [type]
    });
    $.ajax({
        url: server + 'user/portrait',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        dataType: 'json',
        success: function(data) {
            if (data.status === 0) {

                if (!type) {
                    drawChart1(data.user.dragoncard_bank);
                    drawChart2(data.user.lounge_consume_count);
                    drawChart3(data.user.sex_type);
                    drawChart4(data.user.generation);
                    drawChartMap(data.user.mobile_phone_location_province);
                }
                else {
                    userChart(data.user.data);
                    vm.portraitShow = true;
                }
            }
            else {
                vm.portraitShow = false;
                //alert('暂无画像结果');
            }
        }
    });
}
//图表初始化
function userChart(data) {
    var datax = data.map(function(v) {
        return v.name;
    });
    var datay = data.map(function(v) {
        return parseInt(v.value);
    })
    var myChart = echarts.init(document.getElementById('userChart'), 'macarons');
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} "
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '25%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
                interval: 0,
                rotate: 30
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            data: datax
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false
            }
        }],
        series: [{
            name: '用户个数',
            type: 'bar',
            barMaxWidth: 150,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#007fff'
                        }, {
                            offset: 1,
                            color: '#043266'
                        }]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2378f7'
                        }, {
                            offset: 0.7,
                            color: '#2378f7'
                        }, {
                            offset: 1,
                            color: '#83bff6'
                        }]
                    )
                }
            },
            data: datay
        }]
    };
    myChart.setOption(option, true);
}
//渲染用户画像中的字段（除电商消费特征外）
function getTags() {
    vm.userTags = tagType(data.user_tags);//基本信息
    vm.cardTags = tagType(data.user_dragoncard_tags);//业务特征
    vm.appTags = tagType(data.app_feature_tags);//两舱服务使用特征
    vm.restTags = tagType(data.vvip_feature_tags);//要客服务使用特征
    // var formData = User.appendAccessToken({
    //     data: {}
    // })
    // $.ajax({
    //     url: server + 'user/portrait/tags',
    //     type: 'POST',
    //     contentType: 'application/json; charset=utf-8',
    //     data: JSON.stringify(formData),
    //     dataType: 'json',
    //     success: function(data) {
    //         vm.userTags = tagType(data.user_tags);
    //         vm.cardTags = tagType(data.user_dragoncard_tags);
    //         vm.appTags = tagType(data.app_feature_tags);
    //         vm.restTags = tagType(data.lounge_feature_tags);
    //         vm.acountTags = tagType(data.account_equity_feature_tags);
    //     }
    // });
}
//电商消费特征中字段的渲染
function getEBTags() {
    var formData = User.appendAccessToken({
        data: {}
    })
    $.ajax({
        url: server + 'user/portrait/ecom_tags',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        dataType: 'json',
        success: function(data) {
            vm.carbill = tagType(data.e_commerce_carbill);
            vm.channelbill = tagType(data.e_commerce_channelbill);
            vm.parking = tagType(data.e_commerce_parking);
            vm.cip = tagType(data.e_commerce_cip);
            vm.restaurant = tagType(data.e_commerce_restaurant);
            vm.lounge_service = tagType(data.e_commerce_lounge_service);
            vm.membership = tagType(data.e_commerce_membership);
            vm.lounge = tagType(data.e_commerce_lounge);
            vm.give_point = tagType(data.e_commerce_give_point);
            vm.promotion = tagType(data.e_commerce_promotion);
        }
    });
}

function getOptions() {
    vm.options = dataKey.portrait_type;
    vm.tagsMap = {};
    dataKey.portrait_type.forEach(function(el) {
        el.children.forEach(function(v) {
            if (v.children) {
                v.children.forEach(function(n) {
                    vm.tagsMap[n.type] = n.name;
                })
            }
            else {
                vm.tagsMap[v.type] = v.name;
            }
        })
    });
    vm.options.forEach(function(el) {
        for (var i = 0; i < el.children.length; i++) {
            switch (el.children[i].type) {
                case 'dragoncard_register_time':
                case 'dragoncard_register_year':
                case 'app_register_time':
                case 'lastest_consume_date_for_in_range':
                case 'lastest_consume_date_for_not_in_range':
                    el.children.removeElem(el.children[i]);
                    i--;
                    break;
            }
        }
    })
    vm.tagsShow = true;
//     var formData = User.appendAccessToken({
//         data: {}
//     })
//     $.ajax({
//         url: server + 'user/portrait/types',
//         type: 'POST',
//         contentType: 'application/json; charset=utf-8',
//         data: JSON.stringify(formData),
//         dataType: 'json',
//         success: function(data) {
//             vm.options = data.portrait_type;

//             vm.tagsMap = {};
//             data.portrait_type.forEach(function(el) {
//                 el.children.forEach(function(v) {
//                     if (v.children) {
//                         v.children.forEach(function(n) {
//                             vm.tagsMap[n.type] = n.name;
//                         })
//                     }
//                     else {
//                         vm.tagsMap[v.type] = v.name;
//                     }

//                 })
//             });
//             vm.options.forEach(function(el) {
//                 if (el.name == '电商消费特征') {
//                     el.children.forEach(function(v) {
//                         for (var i = 0; i < v.children.length; i++) {
//                             if (v.children[i].type.indexOf('latest_date_consume') >= 0 || v.children[i].type.indexOf('last_order_time') >= 0) {
//                                 v.children.removeElem(v.children[i]);
//                                 i--;
//                             }
//                         }
//                     })
//                 }
//                 else {
//                     for (var i = 0; i < el.children.length; i++) {
//                         switch (el.children[i].type) {
//                             case 'dragoncard_register_time':
//                             case 'dragoncard_register_year':
//                             case 'app_register_time':
//                             case 'lastest_consume_date_for_in_range':
//                             case 'lastest_consume_date_for_not_in_range':
//                                 el.children.removeElem(el.children[i]);
//                                 i--;
//                                 break;
//                         }
//                     }
//                 }
//             })
//             vm.tagsShow = true;
//         }
//     });
}

function getUserList(data, callback) {
    var formData = User.appendAccessToken({
        data: data
    })
    $.ajax({
        url: server + 'user/portrait/userList',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        dataType: 'json',
        success: function(data) {
            if (data.status === 0) {
                vm.userCount = data.total;
                cacheData.set('user_list', data.userList);
                vm.portraitAllShow = true;
                vm.noUserShow = false;
                callback();
            }
            else {
                vm.noUserShow = true;
            }
        }
    });
}

(function() {
    $('.tabs-nav li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $('.tabs-nav li').index(this);
        if (index == 5) {
            $(".tabs-nav1").show();
            $(".tabs-content").css("padding", "0px");
            $(".tags-tabs .tabs-nav").css("borderBottom", "none")
        }
        else {
            $(".tabs-nav1").hide();
            $(".tabs-content").css("padding", "25px");
            $(".tags-tabs .tabs-nav").css("borderBottom", "1px solid #045ea3")
        }
        $('.tabs-content .item').eq(index).show().siblings().hide();
    });
    $('.tabs-nav1 li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $('.tabs-nav1 li').index(this);
        $('.tabs-content .item1').eq(index).show().siblings().hide();
        $(".tabs-nav1").show()
    });
})();

function drawChart1(data) {
    data = data.sort(function(a, b) {
        return b.value - a.value;
    })
    var myChart = echarts.init(document.getElementById('chart1'), 'macarons');
    var option = {
        backgroundColor: '#0a274d',
        legend: {
            orient: 'vertical',
            left: 'left',
            padding: 10,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: '#fff'
            },
            data: data.map(function(v) {
                return v.name
            })
        },
        color: ['#007ffe', '#fe8463', '#c3e641', '#47d6e0', '#9d466b', '#fad860'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
            name: '银行个数',
            type: 'pie',
            center: ['60%', '50%'],
            label: {
                normal: {
                    show: false,
                },
            },
            data: data
        }]
    };
    myChart.setOption(option, true);
}

function drawChart2(data) {
    var myChart = echarts.init(document.getElementById('chart2'), 'macarons');
    var option = {
        backgroundColor: '#0a274d',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '12%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(function(v) {
                return v.name;
            }),
            axisLabel: {
                interval: 0,
                rotate: 30,
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} "
        },
        series: [{
            name: '用户个数',
            type: 'bar',
            barMaxWidth: 25,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#007fff'
                        }, {
                            offset: 1,
                            color: '#043266'
                        }]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2378f7'
                        }, {
                            offset: 0.7,
                            color: '#2378f7'
                        }, {
                            offset: 1,
                            color: '#83bff6'
                        }]
                    )
                }
            },
            data: data
        }]
    };
    myChart.setOption(option, true);
}

function drawChart3(data) {
    var myChart = echarts.init(document.getElementById('chart3'), 'macarons');
    var option = {
        backgroundColor: '#0a274d',
        color: ['#007ffe', '#fe8463', '#c3e641', '#47d6e0', '#9d466b'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
            name: '用户个数',
            type: 'pie',
            data: data
        }]
    };
    myChart.setOption(option, true);
}

function drawChart4(data) {
    var myChart = echarts.init(document.getElementById('chart4'), 'macarons');
    var option = {
        backgroundColor: '#0a274d',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '2%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(function(v) {
                return v.name;
            }),
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} "
        },
        series: [{
            name: '用户个数',
            type: 'bar',
            barMaxWidth: 25,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#007fff'
                        }, {
                            offset: 1,
                            color: '#043266'
                        }]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2378f7'
                        }, {
                            offset: 0.7,
                            color: '#2378f7'
                        }, {
                            offset: 1,
                            color: '#83bff6'
                        }]
                    )
                }
            },
            data: data
        }]
    };
    myChart.setOption(option, true);
}

function drawChartMap(data) {
    /*data = data.map(function(v) {
        v.value = !v.value ? 0 : ~~(v.value);
        return v;
    })*/

    var valueList = data.map(function(v) {
        return ~~(v.value)
    })

    var myChart = echarts.init(document.getElementById('chinaMap'), 'macarons');
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}'
        },
        dataRange: {
            x: 'right',
            y: 260,
            min: 0,
            max: Math.max.apply(null, valueList),
            text: ['High', 'Low'], // 文本，默认为数值文本
            calculable: true,
            textStyle: {
                color: '#00ccff'
            },
            inRange: {
                color: ['#6f95bb', '#70bc7d', '#e0d37a', '#fe8463']
            }
        },
        series: [{
            name: '中国',
            type: 'map',
            mapType: 'china',
            itemStyle: {
                normal: {
                    areaColor: '#6f95bb',
                    borderColor: '#42c0e4',
                    areaStyle: {
                        color: '#3a434f'
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    areaStyle: {
                        color: '#9fb156'
                    }
                }
            },
            label: {
                normal: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                },
                emphasis: {
                    show: true
                }
            },
            data: data
        }]
    };
    myChart.setOption(option, true);
}
