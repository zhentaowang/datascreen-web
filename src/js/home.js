if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var vm = new Vue({
    el: 'body',
    data: {
        cardNumber: '',
        personNumber: '',
        time: '',
        rest: '',
        agency: ''
    }
});

startFade($('#leftFade'), true);
startFade($('#rightFade'), true);
startFade($('#bottomFade'));
getDayData();
getTenData();
getMinuteData((new Date('2016-12-6 ' + (new Date()).toTimeString())).getTime());

//获取时间
(function() {
    var timer;
    timer = setInterval(getTimeNow, 1000);

    $('.start-pause').click(function() {
        var paused = $('.pause').hasClass('start');
        if (paused) {
            $('.pause').removeClass('start');
            timer = setInterval(getTimeNow, 1000);
        }
        else {
            $('.pause').addClass('start');
            clearInterval(timer);
        }
    });

    function getTimeNow() {
        var date = new Date('2016-12-6 ' + (new Date()).toTimeString());
        vm.time = getLocalDay(date) + ' ' + getLocalTime(date);
        if (date.getHours() === 4 && date.getMinutes() === date.getSeconds() === 0) {
            getDayData();
        }
        if (date.getSeconds() === 0) {
            getMinuteData(date.getTime());
        }
    }
})();

//一分钟刷新一次
function getMinuteData(time) {
    var formData = User.appendAccessToken({
        date: time
    })

    $.ajax({
        url: server + 'custom/lounge/portrait',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        success: function(data) {
            worldMap(data.trafficsite);
            getRestInfo(data.continentTrafficSite);
        }
    });

    $.ajax({
        url: server + 'getDragonCardCount',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        success: function(data) {
            getNumber(data.count, 'cardNumber')
        }
    });

    $.ajax({
        url: server + 'getDragonCardCustomCount',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        success: function(data) {
            getNumber(data.count, 'personNumber')
        }
    })
}

//每天4点刷新一次
function getDayData() {
    var formData = User.appendAccessToken({
        date: (new Date('2016-12-6 ' + (new Date()).toTimeString())).getTime()
    })

    //图表
    $.ajax({
        url: server + 'evolutionDate',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        success: function(data) {
            getEvolutionMonth(data);
            getEvolutionDay(data);
        }
    });

    //来源
    $.ajax({
        url: server + 'dragonCardConsumeDateAgency',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        success: function(data) {
            getAgency(data);
        }
    });

    $.ajax({
        url: server + 'getAppOrderEvolutionDate',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        success: function(data) {
            fourCharts1(data);
            fourCharts2(data);
            fourCharts3(data);
            fourCharts4(data);
        }
    });
}

function fourCharts1(data) {
    var datax = data.date[0].data.map(function(v) {
        return getYueRi(new Date(v.date));
    });
    var data1 = data.date[0].data.map(function(v) {
        return v.data.annual_card_order_num;
    });
    var data2 = data.date[0].data.map(function(v) {
        return v.data.point_charge_order_num;
    });
    var data3 = data.date[0].data.map(function(v) {
        return v.data.give_point_order_num;
    });
    var data4 = data.date[0].data.map(function(v) {
        return v.data.lounge_service_order_num;
    });
    var myChart1 = echarts.init(document.getElementById('chart1'), 'macarons');
    var option = {
        title: {
            text: '日订单数',
            textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'normal'
            },
            x: 'center',
            bottom: 5
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#ff8162', '#9bc865', '#ffda5e', '#69c2e0'],
        legend: {
            textStyle: {
                color: '#fff'
            },
            top: 20,
            data: ['8点/年卡', '点数充值', '赠点', '休息室服务', ]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '13%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
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
        }],
        series: [{
            name: '8点/年卡',
            type: 'line',
            data: data1
        }, {
            name: '点数充值',
            type: 'line',
            data: data2
        }, {
            name: '赠点',
            type: 'line',
            data: data3
        }, {
            name: '休息室服务',
            type: 'line',
            data: data4
        }]
    };
    myChart1.setOption(option, true);
}

function fourCharts2(data) {
    var datax = data.month[0].data.map(function(v) {
        return v.date;
    });
    var data1 = data.month[0].data.map(function(v) {
        return v.data.annual_card_order_num;
    });
    var data2 = data.month[0].data.map(function(v) {
        return v.data.point_charge_order_num;
    });
    var data3 = data.month[0].data.map(function(v) {
        return v.data.give_point_order_num;
    });
    var data4 = data.month[0].data.map(function(v) {
        return v.data.lounge_service_order_num;
    });
    var myChart2 = echarts.init(document.getElementById('chart2'), 'macarons');
    var option = {
        title: {
            text: '月累计订单数',
            textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'normal'
            },
            x: 'center',
            bottom: 5
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#ff8162', '#9bc865', '#ffda5e', '#69c2e0'],
        legend: {
            textStyle: {
                color: '#fff'
            },
            top: 20,
            data: ['8点/年卡', '点数充值', '赠点', '休息室服务', ]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '13%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
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
        }],
        series: [{
            name: '8点/年卡',
            type: 'line',
            data: data1
        }, {
            name: '点数充值',
            type: 'line',
            data: data2
        }, {
            name: '赠点',
            type: 'line',
            data: data3
        }, {
            name: '休息室服务',
            type: 'line',
            data: data4
        }]
    };
    myChart2.setOption(option, true);
}

function fourCharts3(data) {
    var datax = data.date[0].data.map(function(v) {
        return getYueRi(new Date(v.date));
    });
    var data1 = data.date[0].data.map(function(v) {
        return v.data.annual_card_amount_num;
    });
    var data2 = data.date[0].data.map(function(v) {
        return v.data.point_charge_amount_num;
    });
    var data3 = data.date[0].data.map(function(v) {
        return v.data.give_point_amount_num;
    });
    var data4 = data.date[0].data.map(function(v) {
        return v.data.lounge_service_amount_num;
    });
    var myChart3 = echarts.init(document.getElementById('chart3'), 'macarons');
    var option = {
        title: {
            text: '日金额',
            textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'normal'
            },
            x: 'center',
            bottom: 5
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#ff8162', '#9bc865', '#ffda5e', '#69c2e0'],
        legend: {
            textStyle: {
                color: '#fff'
            },
            top: 20,
            data: ['8点/年卡', '点数充值', '赠点', '休息室服务', ]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '13%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
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
        }],
        series: [{
            name: '8点/年卡',
            type: 'line',
            data: data1
        }, {
            name: '点数充值',
            type: 'line',
            data: data2
        }, {
            name: '赠点',
            type: 'line',
            data: data3
        }, {
            name: '休息室服务',
            type: 'line',
            data: data4
        }]
    };
    myChart3.setOption(option, true);
}

function fourCharts4(data) {
    var datax = data.month[0].data.map(function(v) {
        return v.date;
    });
    var data1 = data.month[0].data.map(function(v) {
        return v.data.annual_card_amount_num;
    });
    var data2 = data.month[0].data.map(function(v) {
        return v.data.point_charge_amount_num;
    });
    var data3 = data.month[0].data.map(function(v) {
        return v.data.give_point_amount_num;
    });
    var data4 = data.month[0].data.map(function(v) {
        return v.data.lounge_service_amount_num;
    });
    var myChart4 = echarts.init(document.getElementById('chart4'), 'macarons');
    var option = {
        title: {
            text: '月累计金额',
            textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'normal'
            },
            x: 'center',
            bottom: 5
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#ff8162', '#9bc865', '#ffda5e', '#69c2e0'],
        legend: {
            textStyle: {
                color: '#fff'
            },
            top: 20,
            data: ['8点/年卡', '点数充值', '赠点', '休息室服务', ]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '13%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
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
        }],
        series: [{
            name: '8点/年卡',
            type: 'line',
            data: data1
        }, {
            name: '点数充值',
            type: 'line',
            data: data2
        }, {
            name: '赠点',
            type: 'line',
            data: data3
        }, {
            name: '休息室服务',
            type: 'line',
            data: data4
        }]
    };
    myChart4.setOption(option, true);
}

//只能用10月份的数据
function getTenData() {
    var formData = User.appendAccessToken({
        date: (new Date('2016-10-10')).getTime()
    })

    $.ajax({
        url: server + 'getAppUserDate',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        success: function(data) {
            showCharts(data)
        }
    });

    function showCharts(data) {
        var xdate = data.data.map(function(v) {
            return getYueRi(new Date(v.statistic_date));
        });
        var data1 = data.data.map(function(v) {
            return v.active_user;
        });
        var data2 = data.data.map(function(v) {
            return v.add_user;
        });
        var myChart = echarts.init(document.getElementById('appUser'), 'macarons');
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            color: ['#ff8162', '#9bc865'],
            legend: {
                top: 20,
                textStyle: {
                    color: '#fff'
                },
                data: ['活跃用户', '新增用户']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
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
                data: xdate
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
                }
            },
            series: [{
                name: '活跃用户',
                type: 'line',
                areaStyle: {
                    normal: {}
                },
                data: data1
            }, {
                name: '新增用户',
                type: 'line',
                areaStyle: {
                    normal: {}
                },
                data: data2
            }]
        };
        myChart.setOption(option, true);
    }
}

//开卡数
function getNumber(data, type) {
    var number = formatNumber(data);
    var list = number.split('');
    numberList = list.map(function(v) {
        if (v == ',') {
            return {
                name: v,
                type: 'point'
            }
        }
        else {
            return {
                name: v,
                type: 'num'
            }
        }
    });
    if (type == 'cardNumber') {
        vm.cardNumber = numberList;
    }
    else {
        vm.personNumber = numberList;
    }
};

//机构信息
function getAgency(data) {
    vm.agency = data;
}

//获取休息室
function getRestInfo(data) {
    data.forEach(function(val) {
        val.data.forEach(function(v) {
            if (v.increase === 1) {
                v.type = 'up';
            }
            else {
                v.type = 'down';
                v.style = {
                    transform: 'rotate(180deg)'
                }
            }
        })
    })
    vm.rest = data;
};

//轮播
function startFade($selector, interval) {
    var $nav = $selector.children('.nav').children('li');
    var $content = $selector.children('.content').children('li');
    var len = $content.length;
    var sWidth = $selector.width;
    var index = 0;
    var picTimer;
    clearInterval(picTimer);

    if (interval) {
        $selector.hover(function() {
            clearInterval(picTimer);
        }, function() {
            picTimer = setInterval(function() {
                slide(index);
                index++;
                if (index == len) {
                    index = 0;
                }
            }, 10000);
        }).trigger("mouseleave");
    }

    $nav.click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $nav.index(this);
        slide(index);
    });

    function slide(index) {
        $content.eq(index).stop(true, false).animate({
            opacity: '1'
        }, 300).siblings().stop(true, false).animate({
            opacity: '0'
        }, 300);
        $nav.eq(index).addClass('active').siblings().removeClass('active');
    }
}

//演进图 月
function getEvolutionMonth(data) {
    var xdate = data.monthNum.map(function(v) {
        return v.date;
    });
    var data1 = data.monthNum.map(function(v) {
        return v.cardNum;
    });
    var data2 = data.monthNum.map(function(v) {
        return v.consumeNum;
    });
    var myChart = echarts.init(document.getElementById('evolutionMonth'), 'macarons');
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        color: ['#fa836d', '#a6d25f'],
        legend: {
            textStyle: {
                color: '#fff'
            },
            data: ['开卡数', '休息室使用人次']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
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
            data: xdate
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
            }
        },
        series: [{
            name: '开卡数',
            type: 'line',
            data: data1
        }, {
            name: '休息室使用人次',
            type: 'line',
            data: data2
        }]
    };
    myChart.setOption(option, true);
}
//演进图 日
function getEvolutionDay(data) {
    var xdate = data.dayNum.map(function(v) {
        return getLocalDay(new Date(v.date));
    });
    var data1 = data.dayNum.map(function(v) {
        return v.cardNum;
    });
    var data2 = data.dayNum.map(function(v) {
        return v.consumeNum;
    });
    var myChart = echarts.init(document.getElementById('evolutionDay'), 'macarons');
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            textStyle: {
                color: '#fff'
            },
            data: ['开卡数', '休息室使用人次']
        },
        color: ['#fa836d', '#a6d25f'],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
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
            data: xdate
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
            }
        },
        series: [{
            name: '开卡数',
            type: 'line',
            data: data1
        }, {
            name: '休息室使用人次',
            type: 'line',
            data: data2
        }]
    };
    myChart.setOption(option, true);
}

//获取地图信息
function worldMap(data) {
    var myChart = echarts.init(document.getElementById('charts'), 'macarons');
    var option = {
        title: {
            text: '',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        geo: {
            map: 'world',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#3279a0',
                    borderColor: '#3279a0'
                },
                emphasis: {
                    areaColor: '#05c8f2'
                }
            }
        },
        series: [{
            name: '休息室人数',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: data,
            symbolSize: function(val) {
                return Math.log(val[2]);
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#7eff00',
                    shadowBlur: 1,
                    shadowColor: '#fff'
                }
            }
        }, {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: data.sort(function(a, b) {
                return b.value[2] - a.value[2];
            }).slice(0, 5),
            symbolSize: function(val) {
                return Math.log(val[2]);
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#7eff00',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }]
    }
    myChart.setOption(option, true);
}
