var letao = null;
var id = 0;
$(function() {
    //id先获取之后
    id = getQueryString('id');
    letao = new Letao();

    //再根据id获取商品详情
    letao.getProductDetail();
    letao.addCart();
});
var Letao = function() {

};

Letao.prototype = {
    // 定义主页轮播图初始化方法
    sliderInit: function() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    // 获取商品详情的函数
    getProductDetail: function() {
        $.ajax({
            url: '/product/queryProductDetail',
            data: { 'id': id },
            success: function(data) {
                // 1. 渲染轮播图
                var html = template('slideDetailTmp', data);
                $('.mui-slider').html(html);
                // 1. 获取第一张张轮播图 克隆一份来追加到最后面 同时要添加mui轮播图的重复类名
                var first = $('.mui-slider-group .mui-slider-item:first-of-type').clone().addClass('mui-slider-item-duplicate');
                // 2. 获取最后一张图 克隆一份来追加到最前面 同时要添加mui轮播图的重复类名
                var last = $('.mui-slider-group .mui-slider-item:last-of-type').clone().addClass('mui-slider-item-duplicate');
                // 把第一张添加到最后一张
                $('.mui-slider-group').append(first);
                // 把最后一张添加到第一张
                $('.mui-slider-group .mui-slider-item:first-of-type').before(last);
                // 等轮播图渲染完毕再初始化轮播
                // 初始化轮播图插件
                letao.sliderInit();
                // split()表示字符串分割
                // var str = '2018/02/02';
                // var arr = str.split('/');
                // console.log(arr);['2018','02','02'];
                // var size = "40-50";
                // var arr = size.split('-');
                // console.log(arr);['40','50'];
                // 2. 渲染商品的详情
                // 截取尺码的-之前的数字作为起点
                var start = data.size.split('-')[0];
                // 截取尺码-后面的数字作为终点
                var end = data.size.split('-')[1];
                // 把尺码定义成一个空数组 要等截取完成后才赋值为空
                data.size = [];
                // 循环从起点开始 到终点 
                for (var i = start; i <= end; i++) {
                    // 把每个尺码添加到尺码的数组里面
                    data.size.push(parseInt(i));
                }
                var html = template('productDetailTmp', data);
                $('.product').html(html);
                //初始化数字框 传入数字框容器的选择器 
                mui('.mui-numbox').numbox();
                // 让尺码支持点击
                $('.btn-size').on('click', function() {
                    $('.btn-size').removeClass('active');
                    $(this).addClass('active');
                });
            }
        })
    },
    //添加购物车
    addCart: function() {
        // 1. 给加入购物车按钮添加点击事件
        $('.btn-add-cart').on('click', function() {
            // 2. 拿到当前商品的id 数量 和 尺码
            // 获取尺码
            var size = $('.btn-size.active').data('size');
            // 获取数量
            var num = mui('.mui-numbox').numbox().getValue();
            // 3. 判断当前是否选择了尺码和数量
            if (!size) {
                mui.toast('请选择尺码', { duration: 'long', type: 'div' })
                return;
            }
            if (!num) {
                mui.toast('请选择数量', { duration: 'long', type: 'div' })
                return;
            }
            // 4. 调用添加购物车的API加入到购物车
            $.ajax({
                url:'/cart/addCart',
                data:{'productId':id,'size':size,'num':num},
                type:'post',
                success:function (data) {
                    // 5. 判断返回值是否报错
                    if(data.error){
                        // 6. 未登录跳转到登录页面
                         window.location.href = 'login.html';
                    }else{
                        //7. 如果不报错就是成功 跳转到购物车去购买（问一下是否要去购物车结算）
                        // mui的确认框
                        mui.confirm('是否去购物车结算','温馨提示的标题',['不去','去'],function (e) {
                            //点了第一个按钮
                            if(e.index == 0){
                                  mui.toast('您为什么不去', { duration: 'long', type: 'div' })
                            }
                            //点了第二个按钮
                            if(e.index == 1){
                                  mui.toast('正在进入购物车', { duration: 'long', type: 'div' });
                                  //跳转到购物车
                                  window.location.href = 'cart.html';
                            }
                        });
                    }
                }
            })
        });
    }
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}
