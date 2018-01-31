var letao = null;
var id = 0;
$(function() {
    //id先获取之后
    id = getQueryString('id');
    letao = new Letao();

    //再根据id获取商品详情
    letao.getProductDetail();
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
            }
        })
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
