var letao;
$(function() {
    letao = new Letao();
    // 调用登录
    letao.login();
});

var Letao = function() {

}
Letao.prototype = {
    // 登录方法
    login: function() {
        // 1. 获取登录按钮添加点击事件
        $('.btn-login').on('click', function() {
            // 2. 获取当前输入的用户名和密码
            var username = $('.username').val();
            var password = $('.password').val();
            // 3. 判断当前用户名和密码是否输入		
            if (!username) {
                // mui的 消息提示框
                // 第一个参数是提示的内容第二个是对象是一些配置参数 duration提示时间 type提示框的标签类型
                mui.toast('请输入用户名', { duration: 'long', type: 'div' })
                return;
            }
            // 4. 判断密码是否输入 
            if (!password) {
                // mui的 消息提示框
                // 第一个参数是提示的内容第二个是对象是一些配置参数 duration提示时间 type提示框的标签类型
                mui.toast('请输入密码', { duration: 'long', type: 'div' })
                return;
            }
            // 5. 调用登录的API验证用户名和密码是否存在 请求方式是post (提交表单操作都是post)
            $.ajax({
                url: '/user/login',
                data: { 'username': username, 'password': password },
                type: 'post',
                success: function(data) {
                    // 6. 判断如果返回值有error就表示出错 提示错误信息
                    if (data.error) {
                        //7. 把data.message的错误提示 提示给用户看
                        mui.toast(data.message, { duration: 'long', type: 'div' })
                    }else{
                    		//就是登录成功
                    		window.location.href = "user.html";
                    }                    
                }
            })
        });
    }
}
