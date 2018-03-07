if (!User.isLogin()) {
    document.location.href = 'login.html';
}

var vm = new Vue({
    el: 'body',
    data: {
        activityList: '',
        activityDetail: '',
        selected: 0,
        rates: 0,
        name: ''
    },
    methods: {
        logout: function() {
            User.logout();
            document.location.href = 'login.html';
        },
        change: function(el) {
            console.log(el);
            getActivityDetail(el);
        }
    }
});
getActivityList();

function getActivityList() {
    var formData = User.appendAccessToken({
        data: {}
    })
    $.ajax({
        url: server + 'abtest/list',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        dataType: 'json',
        success: function(data) {
            if (data.code === 100) {
                alert('你没有权限');
                document.location.href = '/';
                return;
            }
            vm.activityList = data.ABTestList;
            vm.selected = vm.activityList[0].abtest_id;
            getActivityDetail(vm.selected);
            $(".index").html("<li>过去1月人均使用次数</li><li>使用过国外机场比例</li><li>使用过高铁休息室比例</li><li>有过携伴比例</li><li>绑定app比例</li>");
        }
    });
}

function getActivityDetail(data) {
    var formData = User.appendAccessToken({
        data: {},
        abtest_id: data
    })
    $.ajax({
        url: server + 'abtest/detail',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formData),
        dataType: 'json',
        success: function(data) {
            if (data.code === 100) {
                alert('你没有权限');
                document.location.href = '/';
                return;
            }
            vm.activityDetail = data.values;
            vm.rates = data.rates;
        }
    });
}
