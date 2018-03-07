if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var vm = new Vue({
    el: 'body',
    data: {
        userList: JSON.parse(cacheData.get('user_list')),
    }
});
