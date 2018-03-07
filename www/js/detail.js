/*! longteng (c) 2016 
	Author: Renzhao
*/
User.isLogin()||(document.location.href="login.html");var vm=new Vue({el:"body",data:{id:getUrlByName("id"),user:""}});Vue.filter("kong",function(e){return e||0==e?e:"--"}),$.ajax({url:server+"user/detail",type:"POST",contentType:"application/json; charset=utf-8",data:JSON.stringify(User.appendAccessToken({user_id:vm.id})),dataType:"json",success:function(e){console.log(e),vm.user=e.user}});