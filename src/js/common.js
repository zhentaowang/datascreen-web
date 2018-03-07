var server = 'http://192.168.1.102:8080/api/';
//var server = 'http://192.168.1.107:8888/longteng/api/';

var FieldName = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    TOKEN_EXPIRE: 'expires_in',
    LAST_LOGIN_TIME: 'last_login_time',
    LAST_REFRESH_TIME: 'last_refresh_time',
}

//时间格式 时分秒
function getLocalTime(date) {
    return toDou(date.getHours()) + ':' + toDou(date.getMinutes()) + ':' + toDou(date.getSeconds());
}

//时间格式 年月日
function getLocalDay(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function getYueRi(date) {
    return (date.getMonth() + 1) + '-' + date.getDate();
}

function getNianYue(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1);
}

function toDou(n) {
    if (n < 10) {
        return '0' + n;
    }
    else {
        return n;
    }
}

//数字加逗号
function formatNumber(n) {
    var str = n.toString();
    var newStr = "";
    var count = 0;

    for (var i = str.length - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
            newStr = str.charAt(i) + "," + newStr;
        }
        else {
            newStr = str.charAt(i) + newStr;
        }
        count++;
    }
    return newStr;
}

//删除chooselist里的项
Array.prototype.removeElem = function(el) {
    var index = this.indexOf(el);
    this.splice(index, 1);
}

//数组去重
function unique(arr) {
    var newarr = [];
    var obj = {};
    arr.forEach(function(v) {
        if (!obj[v]) {
            obj[v] = 1;
            newarr.push(v);
        }
    });
    return newarr;
}

//获取url标签
function getUrlByName(name) {
    var url = location.href;
    var theRequest = {};
    if (url.indexOf("?") >= 0) {
        var str = url.split('?')[1];
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
    }
    if (!theRequest[name]) {
        return null;
    }
    else {
        return decodeURI(theRequest[name]);
    }
}

//添加标签的type
function tagType(tags) {
    for (key in tags) {
        tags[key].forEach(function(v) {
            v.type = key;
        })
    }
    return tags;
}

//本地存储
var CacheClass = function() {
    this.set = function(key, value) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
    this.get = function(key) {
        return localStorage.getItem(key);
    }
    this.remove = function(key) {
        localStorage.removeItem(key);
    }
}
var cacheData = new CacheClass();

//用户信息
var userClass = function() {
    var accessToken = cacheData.get(FieldName.ACCESS_TOKEN);
    var expire;
    var lastLoginTime;

    this.appendAccessToken = function(json) {
        if (!json) {
            json = {}
        }
        json['access_token'] = getAccessToken();
        return json;
    }

    this.getAccessToken = function() {
        return cacheData.get(FieldName.ACCESS_TOKEN);
    }

    this.login = function(data) {
        accessToken = data[FieldName.ACCESS_TOKEN];
        cacheData.set(FieldName.ACCESS_TOKEN, data[FieldName.ACCESS_TOKEN]);
        cacheData.set(FieldName.TOKEN_EXPIRE, data[FieldName.TOKEN_EXPIRE]);

        lastLoginTime = (new Date()).getTime();
        cacheData.set(FieldName.LAST_LOGIN_TIME, lastLoginTime);
    }

    this.isLogin = function() {
        if (!getAccessToken()) {
            return false;
        }
        else {
            init();
            var currentTime = (new Date()).getTime();
            if (currentTime - lastLoginTime >= expire * 1000) {
                this.logout();
                return false;
            }
            return true;
        }
    }

    this.logout = function() {
        accessToken = '';
        localStorage.clear();
    }

    init();

    function getAccessToken() {
        return cacheData.get(FieldName.ACCESS_TOKEN);
    }

    function init() {
        expire = parseInt(cacheData.get(FieldName.TOKEN_EXPIRE));
        lastLoginTime = parseInt(cacheData.get(FieldName.LAST_LOGIN_TIME));
    }
}
var User = new userClass();

$.ajaxSetup({　　
    contentType: 'application/json; charset=utf-8',
    dataType: 'json'
})

$(document).ajaxSuccess(function(event, xhr, options) {
    if (options.type === 'POST') {
        xhr.success(function(data) {
            if (data.code === 102) {
                document.location.href = 'login.html';
            }
            if (data.code === 100) {
                document.location.href = '/';
                alert('你没有权限');
            }
        })
    }
});
