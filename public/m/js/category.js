window.addEventListener('load', function() {
    // 创建主页js对象
    var letao = new Letao();
    // 调用主页初始化区域滚动的方法
    letao.scrollInit();
    //获取左侧分类的数据
    letao.getCategoryLeft();
    //获取右侧分类的数据
    letao.getCategoryRight();
});

var Letao = function() {

}

Letao.prototype = {
    // 定义一个初始化区域滚动的方法
    scrollInit: function() {
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏 值越小滚动速度越快 值越大速度越慢
            bounce: true //是否启用回弹  弹簧
        });
    },
    getCategoryLeft: function() {
        // 1. ajax请求左侧分类API
        $.ajax({
            url: '/category/queryTopCategory',
            /*发送请求之前的回调函数*/
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data) {
                setTimeout(function() {
                    /*后台返回的都是json格式的字符串 只是zepto的ajax把字符串转换成了js对象
                JSON.parse()*/
                    console.log(data);
                    // 3. 调用模板引擎的方法生成模板html
                    var html = template('categoryLeftTmp', data);
                    // 4. 获取左侧分类的容器把模板拼到里面
                    $('.category-left ul').html(html);
                    // 给第一个li添加active类名
                    $('.category-left ul li').eq(0).addClass('active');
                    $('#loading').hide();
                }, 500);
            }
        });
    },
    getCategoryRight: function() {
        /*1.注意 如果页面的元素的动态生成的在别的地方添加事件需要使用事件委托的方式
        on('事件名','真正触发事件的元素',回调函数)*/
        $('.category-left').on('click', 'ul li a', function() {
            // 2. 删除所有li的active类名 给当前添加active类名
            $('.category-left ul li').removeClass('active');
            $(this).parent().addClass('active');
            var id = $(this).data('id');
            // 3. 得拿到当前点击的li的分类id 
            getData(id);
        });
        getData(1);

        function getData(id) {
            $.ajax({
                url: '/category/querySecondCategory',
                data: { 'id': id },
                success: function(data) {
                    console.log(data);
                    var html = template('categoryRightTmp', data);
                    $('.category-list').html(html);
                }
            })
        }
    }
}
