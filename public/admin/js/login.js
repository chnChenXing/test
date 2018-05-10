var letao;
$(function() {
    letao = new Letao();
    letao.login();
    $('[data-toggle="popover"]').popover();
});

var Letao = function() {

};
Letao.prototype = {
    login: function() {
        // 1. 给登录按钮添加点击事件
        $('.btn-login').on('click', function() {
            // 2. 获取当前输入的用户名和密码
            var username = $('#username').val();
            var password = $('#password').val();
            if (!username) {
                //jquery的data只能取值 不能设置值
                $(this).attr('data-content', '请输入用户名');
                return;
            }
            if (!password) {
                $(this).attr('data-content', '请输入密码');
                return;
            }
            var that = this;
            // 3. 调用登录的API接口实现登录功能
            $.ajax({
                url: '/employee/employeeLogin',
                data: { 'username': username, 'password': password },
                type: 'post',
                success: function(data) {
                    console.log(data);
                    // 4. 判断如果返回值有错误
                    if (data.error) {
                        console.log(data.message);
                        $(that).attr('data-content', data.message);
                        return;
                    }else{
                        // 5.登录成功 跳转到主页
                        window.location.href = 'index.html';
                    }
                }
            })
        });
    }
}
