if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var vm = new Vue({
    el: 'body',
    data: {
        vipNumber: '',
        personNumber: '',
        time: '',
        rest: '',
        agency: '',
        specialConsumeDate: [],
        specialAirPortDate: []
    }
});

// getNowData();
drawChartMap()
startFade($('#leftFade'), true);
startFade($('#rightFade'), true);
getMinuteData((new Date()).getTime() - 3600 * 48 * 1000);

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
        var date = new Date((new Date()).getTime() - 3600 * 48 * 1000);
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

    //休息室
    $.ajax({
        url: server + 'custom/lounge/portrait',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            getRestInfo(data.continentTrafficSite);
        }
    });

    //总服务人次
    $.ajax({
        url: server + 'getCustomDataCount',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.personNumber = data.count;
        }
    });

    //开卡数
    $.ajax({
        url: server + 'getDragonCardCount',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.vipNumber = data.count;
        }
    });

    //机构信息
    $.ajax({
        url: server + 'dragonCardConsumeDateAgency',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.agency = data;
        }
    });
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

//获取开卡数和休息室人数图
function getNowData() {
    var formData = User.appendAccessToken({
        date: (new Date()).getTime() - 3600 * 48 * 1000
    })
    $.ajax({
        url: server + 'evolutionDate',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            var xdata = data.dayNum.map(function(v) {
                return getYueRi(new Date(v.date));
            });
            var consumeData = data.dayNum.map(function(v) {
                return v.consumeNum;
            });
            var mdate = data.monthNum.map(function(v) {
                return getNianYue(new Date(v.date));
            });
            var cardData = data.monthNum.map(function(v) {
                return v.cardNum;
            });
            lineChart(xdata, consumeData, 'consumeChart');
            lineChart(mdate, cardData, 'cardChart');
        }
    });

    $.ajax({
        url: server + 'getEcom2gCustomDataCount',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            var xdata = data.carbill.map(function(v) {
                return getYueRi(new Date(v.consume_time));
            });
            var data1 = data.carbill.map(function(v) {
                return v.order_num;
            });
            var data2 = data.channelbill.map(function(v) {
                return v.order_num;
            });
            var data3 = data.restaurant.map(function(v) {
                return v.order_num;
            });
            lineChart(xdata, data1, 'carbill');
            lineChart(xdata, data2, 'channelbill');
            lineChart(xdata, data3, 'restaurant');
        }
    });

    $.ajax({
        url: server + 'getSpecialLoungeConsumeEvolutionDate',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            var xdata = data.data.map(function(v) {
                return getYueRi(new Date(v.date));
            });
            data = data.data.map(function(v) {
                return v.num;
            });
            lineChart(xdata, data, 'specialConsumeChart');
        }
    });

    $.ajax({
        url: server + 'getSpecialAirPortConsumeEvolutionDate',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            var xdata = data.data.map(function(v) {
                return getYueRi(new Date(v.date));
            });
            data = data.data.map(function(v) {
                return v.num;
            });
            lineChart(xdata, data, 'specialAirPortChart');
        }
    });

    $.ajax({
        url: server + 'getSpecialLoungeConsumeDate',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            data.data.forEach(function(el) {
                vm.specialConsumeDate.push(el);
            });
        }
    });

    $.ajax({
        url: server + 'getSpecialAirPortConsumeDate ',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            data.data.forEach(function(el) {
                vm.specialAirPortDate.push(el);
            });
        }
    });
}

function lineChart(xdata, data, id) {
    var myChart = echarts.init(document.getElementById(id), 'macarons');
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br />{c}'
        },
        backgroundColor: '#0a284e',
        color: ['#fa836d', '#a6d25f'],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
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
            data: xdata
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
        series: [{
            name: '',
            type: 'line',
            smooth: true,
            markPoint: {
                data: [{
                    name: '',
                    value: data[data.length - 1],
                    xAxis: data.length - 1,
                    yAxis: data[data.length - 1],
                    symbolOffset: [0, 20]
                }]
            },
            data: data
        }]
    };
    myChart.setOption(option, true);
}


//轮播
function startFade($selector, interval) {
    var $channelList = $selector.children('.float-right').children('li')
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

    $channelList.click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $channelList.index(this);
        slide(index);
    });

    function slide(index) {
        $content.eq(index).stop(true, false).animate({
            opacity: '1'
        }, 300).siblings().stop(true, false).animate({
            opacity: '0'
        }, 300);
        $channelList.eq(index).addClass('active').siblings().removeClass('active');
    }
}


function randomData() {
    return Math.round(Math.random()*2500);
}

function drawChartMap() {
    /*data = data.map(function(v) {
        v.value = !v.value ? 0 : ~~(v.value);
        return v;
    })*/

    // var valueList = data.map(function(v) {
    //     return ~~(v.value)
    // })

    var myChart = echarts.init(document.getElementById('chinaMap'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}'
        },
        visualMap: {
            // x: 'right',
            // y: 260,
            seriesIndex: 0,
            min: 0,
            max: 2500,
            left:'left',
            top:'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            // textStyle: {
            //     color: '#00ccff'
            // },
            // inRange: {
            //     color: ['#6f95bb', '#70bc7d', '#e0d37a', '#fe8463']
            // }
        },
        grid: {
            height: 200,
            width: 8,
            right: 80,
            bottom: 10
        },
        xAxis: {
            type: 'category',
            data: [],
            splitNumber: 1,
            show: false
        },
        yAxis: {
            position: 'right',
            min: 0,
            max: 20,
            splitNumber: 20,
            inverse: true,
            axisLabel: {
                show: true
            },
            axisLine: {
                show: false  
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            data: []
        },
        series: [{
            zlevel: 1,
            name: '中国',
            type: 'map',
            mapType: 'china',
            selectedMode : 'multiple',
            roam: true,
            left: '10%',
            right: '15%',
            // itemStyle: {
            //     normal: {
            //         areaColor: '#6f95bb',
            //         borderColor: '#42c0e4',
            //         areaStyle: {
            //             color: '#3a434f'
            //         }
            //     },
            //     emphasis: {
            //         label: {
            //             show: true,
            //             textStyle: {
            //                 color: '#fff'
            //             }
            //         },
            //         areaStyle: {
            //             color: '#9fb156'
            //         }
            //     }
            // },
            label: {
                normal: {
                    show: false
                    // textStyle: {
                    //     color: '#fff'
                    // }
                },
                emphasis: {
                    show: true
                }
            },
            data: [
                {name: '北京',value: randomData() },
                {name: '天津',value: randomData() },
                {name: '上海',value: randomData() },
                {name: '重庆',value: randomData() },
                {name: '河北',value: randomData() },
                {name: '河南',value: randomData() },
                {name: '云南',value: randomData() },
                {name: '辽宁',value: randomData() },
                {name: '黑龙江',value: randomData() },
                {name: '湖南',value: randomData() },
                {name: '安徽',value: randomData() },
                {name: '山东',value: randomData() },
                {name: '新疆',value: randomData() },
                {name: '江苏',value: randomData() },
                {name: '浙江',value: randomData() },
                {name: '江西',value: randomData() },
                {name: '湖北',value: randomData() },
                {name: '广西',value: randomData() },
                {name: '甘肃',value: randomData() },
                {name: '山西',value: randomData() },
                {name: '内蒙古',value: randomData() },
                {name: '陕西',value: randomData() },
                {name: '吉林',value: randomData() },
                {name: '福建',value: randomData() },
                {name: '贵州',value: randomData() },
                {name: '广东',value: randomData() },
                {name: '青海',value: randomData() },
                {name: '西藏',value: randomData() },
                {name: '四川',value: randomData() },
                {name: '宁夏',value: randomData() },
                {name: '海南',value: randomData() },
                {name: '台湾',value: randomData() },
                {name: '香港',value: randomData() },
                {name: '澳门',value: randomData() }
            ]
        }]
    };
    myChart.setOption(option);
}


/**
 * 根据值获取线性渐变颜色
 * @param  {String} start 起始颜色
 * @param  {String} end   结束颜色
 * @param  {Number} max   最多分成多少分
 * @param  {Number} val   渐变取值
 * @return {String}       颜色
 */
// function getGradientColor (start, end, max, val) {
//     var rgb = /#((?:[0-9]|[a-fA-F]){2})((?:[0-9]|[a-fA-F]){2})((?:[0-9]|[a-fA-F]){2})/;
//     var sM = start.match(rgb);
//     var eM = end.match(rgb);
//     var err = '';
//     max = max || 1
//     val = val || 0
//     if (sM === null) {
//         err = 'start';
//     }
//     if (eM === null) {
//         err = 'end';
//     }
//     if (err.length > 0) {
//         throw new Error('Invalid ' + err + ' color format, required hex color');	
//     }
//     var sR = parseInt(sM[1], 16),
//         sG = parseInt(sM[2], 16),
//         sB = parseInt(sM[3], 16);
//     var eR = parseInt(eM[1], 16),
//         eG = parseInt(eM[2], 16),
//         eB = parseInt(eM[3], 16);
//     var p = val / max;
//     var gR = Math.round(sR + (eR - sR) * p).toString(16),
//         gG = Math.round(sG + (eG - sG) * p).toString(16),
//         gB = Math.round(sB + (eB - sB) * p).toString(16);
//     return '#' + gR + gG + gB;
// }

// setTimeout(function() {
//     var TOPN = 25
    
//     var option = myChart.getOption()
//     // 修改top
//     option.grid[0].height = TOPN * 20
//     option.yAxis[0].max = TOPN
//     option.yAxis[0].splitNumber = TOPN
//     option.series[1].data[0] = TOPN
//     // 排序
//     var data = option.series[0].data.sort(function(a, b) {
//         return b.value - a.value
//     })
    
//     var maxValue = data[0].value,
//         minValue = data.length > TOPN ? data[TOPN - 1].value : data[data.length - 1].value
    
//     var s = option.visualMap[0].controller.inRange.color[0],
//         e = option.visualMap[0].controller.inRange.color.slice(-1)[0]
//     var sColor = getGradientColor(s, e, maxValue, minValue)
//     var eColor = getGradientColor(s, e, maxValue, maxValue)
    
//     option.series[1].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//         offset: 1,
//         color: sColor
//     }, {
//         offset: 0,
//         color: eColor
//     }])
    
//     // yAxis
//     var newYAxisArr = []
//     echarts.util.each(data, function(item, i) {
//         if (i >= TOPN) {
//             return false
//         }
//         var c = getGradientColor(sColor, eColor, maxValue, item.value)
//         newYAxisArr.push({
//             value: item.name,
//             textStyle: {
//                 color: c
//             }
//         })
//     })
//     option.yAxis[0].data = newYAxisArr
//     option.yAxis[0].axisLabel.formatter = (function(data) {
//         return function(value, i) {
//             if (!value) return ''
//             return value + ' ' + data[i].value
//         }
//     })(data)
//     myChart.setOption(option)
// }, 0);