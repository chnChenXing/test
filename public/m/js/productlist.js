var letao = null;
$(function() {
    letao = new Letao();
    // 调用初始化下拉刷新的函数
    letao.pullRefreshInit();
    letao.searchProductList();
    letao.sortProductList();
    letao.buyProduct();
    search = getQueryString('search');
});
var search = '';
var page = 1;
var Letao = function() {

};
Letao.prototype = {
    //下拉刷新初始化
    pullRefreshInit: function() {
        mui.init({
            pullRefresh: {　　
                container: ".mui-scroll-wrapper", //下拉刷新容器父容器选择器 (区域滚动的父容器)
                //下拉刷新
                down: {
                    contentdown: "往下拉的时候提示文字",
                    contentover: "下拉到底部的时候提示文字",
                    contentrefresh: "松开手的时候的提示文字",
                    auto: true, //可选,默认false.首次加载自动下拉刷新一次
                    //下拉刷新的回调函数  请求ajax刷新页面
                    callback: downCallback
                },
                //上拉加载
                　　up: {　　　　
                    contentrefresh: "松开手的时候的提示文字",
                    // 数据加载完毕的提示文字 必须得数据加载完毕才会显示
                    contentnomore: '数据加载完毕的提示文字',
                    //上拉加载的回调函数　请求ajax去加载更多　
                    callback: upCallback　
                }
            }
        });
        // 下拉刷新的回调函数  请求ajax刷新页面 当下拉的时候会触发的函数
        function downCallback() {
            // 调用功能获取商品的方法来获取数据 实现下拉刷新
            letao.getProductListData({
                proName: search,
                page: 1,
                pageSize: 2
            }, function(data) {
                //模拟网络延时 拿到了数据不给你等1秒再渲染
                setTimeout(function() {
                    //通过回调函数 等ajax请求完毕拿到数据了之后在传递给下拉刷新的实现数据渲染
                    var html = template('productListTmp', data);
                    $('.product-list-body').html(html);
                    //当数据刷新完毕结束下拉刷新 停止转圈圈
                    mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                    // 每次下拉刷新的时候要把page重置为1
                    page = 1;
                    // 上拉加载之前已经到底了 就无法再次上拉刷新 要重置上拉加载
                    mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                }, 1000);
            });
        }
        // 上拉加载更多的回调函数  请求ajax刷新页面  当上啦的时候会触发的函数
        function upCallback() {
            // 每次执行上拉加载更多的时候 page++
            page++;
            // 调用功能获取商品的数据 实现上拉刷新
            letao.getProductListData({
                proName: search,
                page: page,
                pageSize: 2
            }, function(data) {
                //模拟网络延时 拿到了数据不给你等1秒再渲染
                setTimeout(function() {
                    //通过回调函数 等ajax请求完毕拿到数据了之后在传递给下拉刷新的实现数据渲染
                    var html = template('productListTmp', data);
                    // 判断如果数据为空就表示没有更多数据了
                    if (data.data.length <= 0) {
                        // 结束上拉加载并且提示没有更多数据了
                        mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        return;
                    }
                    // 上拉加载更多往后面的追加
                    $('.product-list-body').append(html);
                    //当数据刷新完毕结束上拉加载 停止上拉的转圈圈
                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                }, 1000);
            });
        }
    },
    // 获取商品列表数据的函数  公共的方法
    getProductListData: function(options, callback) {
        // 默认如果不传入页码数 为1
        options.page = options.page || 1;
        // 默认不传入每页大小 为2
        options.pageSize = options.pageSize || 2;
        $.ajax({
            url: '/product/queryProduct',
            data: options,
            success: function(data) {
                /*if(callback){
                	callback(data);
                }*/
                //短路运算符
                callback && callback(data);
            }
        });
    },
    // 根据输入的商品搜索商品列表
    searchProductList: function() {
        // 给搜索按钮添加点击事件
        $('.btn-search').on('click', function() {
            //获取当前文本输入的内容
            search = $('.search-input input').val();
            letao.getProductListData({
                proName: search,
                page: 1,
                pageSize: 2
            }, function(data) {
                //通过回调函数 等ajax请求完毕拿到数据了之后在传递给下拉刷新的实现数据渲染
                var html = template('productListTmp', data);
                $('.product-list-body').html(html);
            });
        });
    },
    // 商品列表的排序
    sortProductList: function() {
        // 给所有排序按钮添加点击事件
        //在下拉刷新和上拉加载的内容里面添加点击事件会触发不了 在mui的插件里面阻止了点击事件
        //这只能添加轻触事件 但是轻触在模拟器会触发2次 真机不会 换成singleTap可以好一点
        $('.product-list-title .mui-row > div > a').on('tap', function() {
            $('.product-list-title .mui-row > div').removeClass('active');
            $(this).parent().addClass('active');
            // 1. 获取当前点击的a的排序方式是升序还是降序
            var sort = $(this).data('sort');
            //有时候tap点击会触发多次 测试的时候长按一下
            //判断当前的排序值是升序还是降序  1是升序 变成降序 2是降序 变成升序
            if (sort == 1) {
                sort = 2;
                // 给所有人都还原
                $('.product-list-title .mui-row > div a i').removeClass().addClass('fa fa-angle-down');
                //升序 变成降序
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                sort = 1;
                // 给所有人还原
                $('.product-list-title .mui-row > div a i').removeClass().addClass('fa fa-angle-down');
                //降序 变成升序
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            // 修改当前a上的排序值
            $(this).data('sort', sort);
            // 获取到当前点击的a的排序的类型
            var sortType = $(this).data('sort-type');
            if (sortType == 'price') {
                // 如果是价格就请求API传入价格排序
                letao.getProductListData({
                    proName: search,
                    page: 1,
                    pageSize: 2,
                    price: sort
                }, function(data) {
                    //通过回调函数 等ajax请求完毕拿到数据了之后在传递给下拉刷新的实现数据渲染
                    var html = template('productListTmp', data);
                    $('.product-list-body').html(html);
                });
            } else if (sortType == 'num') {
                //如果是数量就请求API传入数量的排序
                letao.getProductListData({
                    proName: search,
                    page: 1,
                    pageSize: 2,
                    num: sort
                }, function(data) {
                    //通过回调函数 等ajax请求完毕拿到数据了之后在传递给下拉刷新的实现数据渲染
                    var html = template('productListTmp', data);
                    $('.product-list-body').html(html);
                });
            }
        });
    },
    buyProduct:function () {
        $('body').on('tap','.btn-buy',function () {
            // 获取当前点击按钮的商品id传入到详情页面
           window.location.href = 'detail.html?id='+$(this).data('id'); 
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
