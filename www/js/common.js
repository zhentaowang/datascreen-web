/*! longteng (c) 2016 
	Author: Renzhao
*/
function getLocalTime(e){return toDou(e.getHours())+":"+toDou(e.getMinutes())+":"+toDou(e.getSeconds())}function getLocalDay(e){return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()}function getYueRi(e){return e.getMonth()+1+"-"+e.getDate()}function getNianYue(e){return e.getFullYear()+"-"+(e.getMonth()+1)}function toDou(e){return e<10?"0"+e:e}function formatNumber(e){for(var t=e.toString(),n="",a=0,o=t.length-1;o>=0;o--)n=a%3==0&&0!=a?t.charAt(o)+","+n:t.charAt(o)+n,a++;return n}function unique(e){var t=[],n={};return e.forEach(function(e){n[e]||(n[e]=1,t.push(e))}),t}function getUrlByName(e){var t=location.href,n={};if(t.indexOf("?")>=0){var a=t.split("?")[1];strs=a.split("&");for(var o=0;o<strs.length;o++)n[strs[o].split("=")[0]]=strs[o].split("=")[1]}return n[e]?decodeURI(n[e]):null}function tagType(e){for(key in e)e[key].forEach(function(e){e.type=key});return e}var server="http://192.168.1.102:8080/api/",FieldName={ACCESS_TOKEN:"access_token",REFRESH_TOKEN:"refresh_token",TOKEN_EXPIRE:"expires_in",LAST_LOGIN_TIME:"last_login_time",LAST_REFRESH_TIME:"last_refresh_time"};Array.prototype.removeElem=function(e){var t=this.indexOf(e);this.splice(t,1)};var CacheClass=function(){this.set=function(e,t){"object"==typeof t&&(t=JSON.stringify(t)),localStorage.setItem(e,t)},this.get=function(e){return localStorage.getItem(e)},this.remove=function(e){localStorage.removeItem(e)}},cacheData=new CacheClass,userClass=function(){function e(){return cacheData.get(FieldName.ACCESS_TOKEN)}function t(){n=parseInt(cacheData.get(FieldName.TOKEN_EXPIRE)),a=parseInt(cacheData.get(FieldName.LAST_LOGIN_TIME))}var n,a,o=cacheData.get(FieldName.ACCESS_TOKEN);this.appendAccessToken=function(t){return t||(t={}),t.access_token=e(),t},this.getAccessToken=function(){return cacheData.get(FieldName.ACCESS_TOKEN)},this.login=function(e){o=e[FieldName.ACCESS_TOKEN],cacheData.set(FieldName.ACCESS_TOKEN,e[FieldName.ACCESS_TOKEN]),cacheData.set(FieldName.TOKEN_EXPIRE,e[FieldName.TOKEN_EXPIRE]),a=(new Date).getTime(),cacheData.set(FieldName.LAST_LOGIN_TIME,a)},this.isLogin=function(){if(e()){t();var o=(new Date).getTime();return!(o-a>=1e3*n)||(this.logout(),!1)}return!1},this.logout=function(){o="",localStorage.clear()},t()},User=new userClass;$.ajaxSetup({contentType:"application/json; charset=utf-8",dataType:"json"}),$(document).ajaxSuccess(function(e,t,n){"POST"===n.type&&t.success(function(e){102===e.code&&(document.location.href="login.html"),100===e.code&&(document.location.href="/",alert("你没有权限"))})});