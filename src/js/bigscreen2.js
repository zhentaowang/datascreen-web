if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var vm = new Vue({
    el: 'body',
    data: {
        appNumber: '',
        personNumber: '',
        orderNumber: '',
        time: ''
    }
});

getNowData();
getMinuteData((new Date()).getTime() - 3600 * 48 * 1000);

//获取时间
(function() {
    var timer;
    timer = setInterval(getTimeNow, 1000);

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

    //APP累计注册用户数
    $.ajax({
        url: server + 'getAppMembershipNumber',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.personNumber = data.count;
        }
    });

    //APP订单今年订单总量
    $.ajax({
        url: server + 'getAppYearOrder',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.orderNumber = data.count;
        }
    });
}

function getNowData() {
    var formData = User.appendAccessToken({
        date: (new Date()).getTime() - 3600 * 48 * 1000
    });

    //app下载量
    $.ajax({
        url: server + 'getAppDownloadCount',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.appNumber = data.count;
        }
    });

    //新增用户活跃用户
    $.ajax({
        url: server + 'getAppUserDate',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            var xdata = data.data.map(function(v) {
                return getYueRi(new Date(v.statistic_date));
            })
            var data1 = data.data.map(function(v) {
                return v.add_user;
            })
            var data2 = data.data.map(function(v) {
                return v.active_user;
            })
            lineChart(data1, 'appAdd', xdata);
            lineChart(data2, 'appActive', xdata);
        }
    });

    //8个数据的接口
    $.ajax({
        url: server + 'getAppOrderEvolutionDate',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            lineChart(data.carbillData, 'carbillData');
            lineChart(data.chennelbill, 'chennelbill');
            lineChart(data.flash, 'flash');
            lineChart(data.cip, 'cip');
            lineChart(data.ecom2gMealTicketData, 'ecom2gMealTicketData');
            lineChart(data.membershipData, 'membershipData');
            lineChart(data.loungeData, 'loungeData');
            lineChart(data.lounge_service, 'lounge_service');
        }
    });

    //热门
    $.ajax({
        url: server + 'getHotProductDate',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            wordCloud(data.hot_lounge, 'wordCloud1');
            wordCloud(data.hot_restaurant, 'wordCloud2');
        }
    });
};

function wordCloud(data, id) {
    //data[0].value = 50;
    data = data.sort(function(a, b) {
        return b.value - a.value;
    })
    console.log(data);
    var myChart = echarts.init(document.getElementById(id));

    var option = {
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 8,

            textStyle: {
                normal: {
                    fontFamily: 'Microsoft YaHei',
                    // Color can be a callback function or a color string
                    color: function(params) {
                        // Random color
                        return 'rgb(' + [
                            Math.round(Math.random() * (73 - 24) + 24),
                            Math.round(Math.random() * (255 - 95) + 95),
                            Math.round(Math.random() * (255 - 187) + 187)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },

            // Data is an array. Each array item must have name and value property.
            data: data
        }]
    };

    myChart.setOption(option);
}

function lineChart(data, id, xdata) {
    if (!xdata) {
        xdata = data.map(function(v) {
            return getYueRi(new Date(v.order_date));
        });
        data = data.map(function(v) {
            return v.order_num;
        });
    }

    var myChart = echarts.init(document.getElementById(id), 'macarons');
    var option = {
        tooltip: {
            trigger: 'axis',
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
            name: '数量',
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
