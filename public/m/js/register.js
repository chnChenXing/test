var letao;
$(function() {
    letao = new Letao();
    // 调用获取验证码方法
    letao.getvCode();
    letao.register();
});
var vCode = '';
var Letao = function() {

}
Letao.prototype = {
    //获取验证码
    getvCode: function() {
        // 1. 给获取验证码按钮添加点击事件
        $('.btn-vCode').on('click', function() {
            // 2. 调用获取验证码的API
            $.ajax({
                url: '/user/vCode',
                success: function(data) {
                    console.log(data.vCode);
                    // 3. 判断是否拿到验证码
                    if (data.vCode) {
                        // 4. 如果拿到验证码就存储起来
                        vCode = data.vCode;
                    }
                }
            })
        });
    },
    //用户注册函数
    register: function() {
        // 1. 给注册按钮添加点击事件
        $('.btn-register').on('click', function() {
            // 2. 获取用户输入的注册信息
            var username = $('.username').val();
            var mobile = $('.mobile').val();
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            // 当前输入的验证码
            var nowVcode = $('.vCode').val();
            // 3. 判断各个文本框是否输入
            if (!username) {
                mui.toast('请输入用户名', { duration: 'long', type: 'div' })
                return;
            }
            if (!mobile) {
                mui.toast('请输入手机号', { duration: 'long', type: 'div' })
                return;
            }
            if (!password1) {
                mui.toast('请输入密码', { duration: 'long', type: 'div' })
                return;
            }
            if (!password2) {
                mui.toast('请输入确认密码', { duration: 'long', type: 'div' })
                return;
            }
            if (!nowVcode) {
                mui.toast('请输入验证码', { duration: 'long', type: 'div' })
                return;
            }
            // 4 .判断当前两次密码是否一致
            if (password1 !== password2) {
                mui.toast('两次输入的密码不一致', { duration: 'long', type: 'div' })
                return;
            }
            // 5. 判断当前输入的验证码和之前获取的验证码是否一致
            if(nowVcode !== vCode){
                 mui.toast('验证码输入错误', { duration: 'long', type: 'div' })
                return;
            }
            // 6. 调用注册的API去注册
            $.ajax({
                url:'/user/register',
                data:{'username':username,'password':password1,'mobile':mobile,'vCode':nowVcode},
                type:'post',
                success:function (data) {
                    if(data.error){
                         mui.toast(data.message, { duration: 'long', type: 'div' })
                    }else{
                        // 注册成功 跳转到登录页面
                        window.location.href = 'login.html';
                    }
                }
            })
        });
    }
}
