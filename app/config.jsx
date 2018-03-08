var Server = 'http://122.224.248.26:7777/';
//var Server = 'http://192.168.1.107:8888/longteng/api/';

const FieldName = {
    ACCESS_TOKEN: 'admin_access_token',
    REFRESH_TOKEN: 'admin_refresh_token',
    TOKEN_EXPIRE: 'admin_expires_in',
    LAST_LOGIN_TIME: 'admin_last_login_time',
    LAST_REFRESH_TIME: 'admin_last_refresh_time',
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



export default {Server, cacheData, User};