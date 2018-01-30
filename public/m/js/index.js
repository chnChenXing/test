window.addEventListener('load', function() {
    // 创建主页js对象
    var letaoindex = new letaoIndex();
    // 调用主页js对象里面的初始化轮播图方法
    letaoindex.sliderInit();
    // 调用主页初始化区域滚动的方法
    letaoindex.scrollInit();
});

var letaoIndex = function() {

}

letaoIndex.prototype = {
    // 定义主页轮播图初始化方法
    sliderInit: function() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    // 定义一个初始化区域滚动的方法
    scrollInit: function() {
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: true, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏 值越小滚动速度越快 值越大速度越慢
            bounce: true //是否启用回弹  弹簧
        });
    }
}
