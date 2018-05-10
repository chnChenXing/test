var letao;
$(function() {
    letao = new Letao();
    // 调用获取用户信息的方法
    letao.getUserMessage();
    letao.exit();
});

var Letao = function() {

}
Letao.prototype = {
    // 获取用户信息的 方法
    getUserMessage: function() {
        // 1. 请求获取用户信息的API
        $.ajax({
            url: '/user/queryUserMessage',
            success: function(data) {
                // 2. 如果返回数据有错误 就表示未登录
                if (data.error) {
                    // 3. 跳转到登录页面去登录
                    window.location.href = 'login.html';
                } else {
                    // 4. 如果已经登录就获取数据渲染页面
                    var html = template('userMessageTmp', data);
                    $('#main').html(html);
                }
            }
        })
    },
    // 退出登录
    exit: function() {
        // 1. 获取当前的退出登录按钮 添加点击事件 因为退出也是模板动态生成使用委托
        $('#main').on("click",'.btn-exit', function() {
            // 2. 调用退出的API
            $.ajax({
                url: '/user/logout',
                success: function(data) {
                    // 3. 判断当前返回值是否成功
                    if(data.success){
                        //4. 退出成功 跳转到登录页面
                        window.location.href = 'login.html';
                    }
                }
            })
        });
    }
}
