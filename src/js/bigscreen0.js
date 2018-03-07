if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};
option = null;

//机场名及所在的经纬度
var geoCoordMap = {};
/*geoCoordMap = {
 "Beijing": [116.407395,39.904211],
 "Berlin": [13.404954,52.520007],
 "London": [-0.127758,51.507351],
 "Tokyo": [139.691706,35.689487]
 };*/

//使用人次数据
var rawData = new Array();
/* rawData = [
 ["Beijing",3000],
 ["Berlin",80],
 ["London",70],
 ["Tokyo",40]
 ];*/

var vm = new Vue({
    el: 'body',
    data: {
        vipNumber: '',
        personNumber: ''
    }
});

getMinuteData((new Date()).getTime() - 3600 * 48 * 1000);

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

        if (date.getSeconds() === 0) {//一分钟刷新一次
            getMinuteData(date.getTime());
        }
    }
})();


function getMinuteData(time) {
    var formData = User.appendAccessToken({
        date: time
    })
    console.log("timer:" + time);
    //从后台获取数据
   /* var timestamp = new Date().getTime();
    timestamp = timestamp - 2*24*60*60*1000;
    console.log("timestamp:" + timestamp);
    var formData = User.appendAccessToken({
        date: timestamp
    });*/

    //总服务人次
    $.ajax({
        url: server + 'getCustomDataCount',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.personNumber = data.count;
            console.log("personNumber:" + vm.personNumber);
        }
    });

    //总开卡数
    $.ajax({
        url: server + 'getDragonCardCount',
        type: 'POST',
        data: JSON.stringify(formData),
        success: function(data) {
            vm.vipNumber = data.count;
            console.log("vipNumber:" + vm.vipNumber);
        }
    });

    $.ajax({
        url: server + 'custom/lounge/portrait',
        type:"post",
        dataType:'json',
        timeout :60000,
        async:false,
        data:JSON.stringify(formData),
        success:function(data) {

            if (data.trafficsite != null) {
                console.log("get data success");
                var objArray = eval(data.trafficsite);
                for (var i in objArray){
                    var airportName = objArray[i].name;
                    var values = objArray[i].value;
                    var num = values[2];
                    values.pop();
                    if (values[1] <= 90) {//纬度 < 90
                        //设置机场经纬度 "Beijing": [116.407395,39.904211],
                        geoCoordMap[airportName] = values;
                        rawData.push([airportName, num]);
                    }

                }
            }

        },
        error:function(){
            alert("ajax error");
        }
    });    
}

//加载地图数据
function makeMapData(rawData) {
    var mapData = [];
    for (var i = 0; i < rawData.length; i++) {
        var geoCoord = geoCoordMap[rawData[i][0]];//根据城市获取经纬度

        if (geoCoord) {
            mapData.push({
                name: rawData[i][0],
                value: geoCoord.concat(rawData[i].slice(1))
            });
        }
    }

    return mapData;
};

function makeParallelAxis(schema) {
    var parallelAxis = [];
    for (var i = 1; i < schema.length; i++) {
        parallelAxis.push({dim: i, name: schema[i]});
    }
    return parallelAxis;
}

//样式显示设置
option = {
    backgroundColor: new echarts.graphic.RadialGradient(0.5, 0.5, 0.4, [{
        offset: 0,
        color: '#14296d'//地图背景
    }, {
        offset: 1,
        color: '#14296d'//地图背景
    }]),
    title: {
        text:'',
        subtext:'',
        sublink:'',
        left: 'center',
        top: 5,
        itemGap: 0,
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            var value = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];

            return  params.name + '<br/>' + "使用人次：" + getPersonNum(params.name); //+ ' : ' + value;
        }
    },
    toolbox: {
        show: true,
        left: 'right',
        iconStyle: {
            normal: {
                borderColor: '#ddd'
            }
        },
        feature: {
        }
    },
    geo: {
        show:'true',
        map: 'world',
        silent: true,
        label: {
            emphasis: {
                show: true,
                areaColor: '#eee'
            }
        },
        itemStyle: {
            normal: {
                borderWidth: 0.2,
                borderColor: '#404a59',
                areaColor: '#8fafcc'//陆地颜色
            }
        },
        selectedMode:'single',
        left: '1%',
        top: 150,
        bottom: '20%',
        right: '1%',
        roam:false,//移动
        scaleLimit:{//缩放
            min:0.85,
            max:5
        },
    },

    series: [
        {
            name: '',
            type: 'scatter',
            coordinateSystem: 'geo',
            //  symbolSize: 12,
            symbol:'circle',
            data: makeMapData(rawData),
            activeOpacity: 1,
            hoverAnimation:true,
            label: {
                emphasis: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            symbolSize: function (data) {
                if (data[2] < 100 ){
                    return 8;
                }else if(data[2] < 300){
                    return 13;
                }
                return 15 + data[2]/30;
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    color: '#8ef82e',//设置圆点颜色
                }
            }
        }
    ]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
//获取使用人次
function getPersonNum(airportName){

    for (var i = 0; i < rawData.length; i++){
        var arr = rawData[i];
        if (arr[0] == airportName){
            return arr[1];
        }
    }
}