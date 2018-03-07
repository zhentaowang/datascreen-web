if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var vm = new Vue({
    el: 'body',
    data: {
        id: getUrlByName('id'),
        user: ''
    }
});

Vue.filter('kong', function(value) {
    if (!value && value != 0) {
        return '--';
    }
    else {
        return value;
    }
})

$.ajax({
    url: server + 'user/detail',
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(User.appendAccessToken({
        user_id: vm.id
    })),
    dataType: 'json',
    success: function(data) {
        console.log(data);
        vm.user = data.user;
    }
});
