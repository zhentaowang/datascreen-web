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
        userTotal:0,
        lounge :0,
        concierge :0,
        specialConsumeDate: [],
        specialAirPortDate: []
    }
});

// getNowData();
// drawChartMap()
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
    console.log(time)
    var formData = User.appendAccessToken({
        date: time
    })

    //丽江机场热门休息室/贵宾厅
    $.ajax({
        url: server + 'lj-datascreen/queryServiceDetail',
        type: 'GET',
        // data: JSON.stringify(formData),
        success: function(data) {
            if(data.status==200){
                var newArr = [];
                data.data.map((k,index)=>{
                    if(index<10){
                        newArr.push(k)
                    }
                })
                getRestInfo(newArr);
            }
        }
    });

    //用户总数
    $.ajax({
        url: server + 'lj-datascreen/queryUserTotal',
        type: 'GET',
        data: {type:'userTotal'},
        success: function(data) {
            if(data.status == 200){
                vm.userTotal = data.data.numbers;
            }
            
        }
    });
    //两舱服务使用次数
    $.ajax({
        url: server + 'lj-datascreen/queryUserTotal',
        type: 'GET',
        data: {type:'lounge'},
        success: function(data) {
            if(data.status == 200){
                vm.lounge = data.data.numbers;
            }
            
        }
    });
    //要客服务使用次数
    $.ajax({
        url: server + 'lj-datascreen/queryUserTotal',
        type: 'GET',
        data: {type:'concierge'},
        success: function(data) {
            if(data.status == 200){
                vm.concierge = data.data.numbers;
            }
            
        }
    });

    // //开卡数
    // $.ajax({
    //     url: server + 'getDragonCardCount',
    //     type: 'POST',
    //     data: JSON.stringify(formData),
    //     success: function(data) {
    //         vm.vipNumber = data.count;
    //     }
    // });

    //来源渠道
    $.ajax({
        url: server + 'lj-datascreen/querySourceChannel',
        type: 'GET',
        // data: JSON.stringify(formData),
        success: function(data) {
            vm.agency = data.data;
            vm.agency.a = []
            vm.agency.b = []
            vm.agency.c = []
            data.data.map((k,index)=>{
                if(k.type=='航司'){
                    if(vm.agency.a.length<10){
                        vm.agency.a.push(k)
                    }
                }
                else if(k.type=='第三方'){
                    if(vm.agency.b.length<10){
                        vm.agency.b.push(k)
                    }
                }
                else if(k.type=='协议单位'){
                    if(vm.agency.c.length<10){
                        vm.agency.c.push(k)
                    }
                }
            })
        }
    });

    getPortrait('arr')//目的地旅客分布
    // getPortrait('dep')//出发地旅客分布
    // getPortrait('guest')//旅客分布
}

//获取休息室
function getRestInfo(data) {
    data.forEach(function(val) {
        if(val.isUp==1){
            val.isUp='up'
        }
        else{
            val.isUp='down'
            val.style = {
                transform: 'rotate(180deg)'
            }
        }
    })
    vm.rest = data;
};

//获取地图的数据
function getPortrait(type) {
    // console.log(data)
    // var formData = User.appendAccessToken({
    //     data: data,
    //     portrait_type: !type ? null : [type]
    // });
    $.ajax({
        url: server + 'lj-datascreen/queryGuest',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {type:type},
        dataType: 'json',
        success: function(data) {
            if (data.status ==200) {
                data.data.map(k=>{
                    k.name = k.city;
                    k.value = k.numbers;
                })
                drawChartMap(data.data);
            }
            else {
                // vm.portraitShow = false;
                //alert('暂无画像结果');
            }
        }
    });
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

    // $nav.click(function() {
    //     $(this).addClass('active').siblings().removeClass('active');
    //     var index = $nav.index(this);
    //     slide(index);
    // });

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

function drawChartMap(data) {
    console.log(data)
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