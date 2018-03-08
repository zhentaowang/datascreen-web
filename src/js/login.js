var vm = new Vue({
    el: 'body',
    data: {
        username: '',
        password: '',
        message: '',
        errorShow: false,
        flag: false
    },
    methods: {
        login: function() {
            if (!vm.username) {
                vm.errorShow = true;
                vm.message = '请输入用户名';
                return;
            }
            if (!vm.password) {
                vm.errorShow = true;
                vm.message = '请输入密码';
                return;
            }
            if (!vm.flag) {
                vm.flag = true;
                $.ajax({
                    url: server + 'lj-datascreen/queryLogin',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    data: {
                        username: vm.username,
                        userpwd: vm.password
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data.status === 1) {
                            vm.message = data.display_message;
                            vm.errorShow = true;
                        }
                        else {
                            User.login(data);
                            cacheData.set('user_role', data.role_id);
                            document.location.href = '/';
                        }
                        vm.flag = false;
                    }
                });
            }
        }
    }
});
