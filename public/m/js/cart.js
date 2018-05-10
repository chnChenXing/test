var letao;
$(function() {
    letao = new Letao();
    letao.getCartProduct();
    letao.deleteCartProduct();
    letao.editCartProduct();
    letao.getCount();
});

var Letao = function() {

};
Letao.prototype = {
    //获取购物车的商品
    getCartProduct: function() {
        // 1. 请求获取购物车商品的API
        $.ajax({
            url: '/cart/queryCart',
            //发送请求之前显示加载中效果
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data) {
                setTimeout(function() {
                    console.log(data);
                    // 2. 判断当前的数据是否报错
                    if (data.error) {
                        // 3. 未登录跳转到登录页面
                        window.location.href = 'login.html';
                    } else {
                        data = data.reverse();
                        // 4. 如果请求成功就渲染页面
                        // 注意当前购物车API返回的数据不是一个对象而是一个数组 要包装一下
                        var html = template('cartProductTmp', { 'rows': data });
                        $('#main').html(html);
                        if (data.length <= 0) {
                            $('#main').html('<p>穷B请卸载乐淘</p>');
                        }
                    }
                    //请求数据完毕 隐藏加载中效果
                    $('#loading').hide();
                }, 500);
            }
        })
    },
    // 删除购物车的商品
    deleteCartProduct: function() {
        // 1. 获取删掉按钮添加点击事件
        $('#main').on('click', '.btn-delete', function() {
            //获取当前点击删除按钮的对应的商品id
            var id = $(this).parent().data('id');
            // 2. 弹出是否删除的确定框
            mui.confirm('是否要删除商品', '温馨提示', ['是', '否'], function(e) {
                // 3. 判断当前点击是是还是否  index==0就表示点击了第一个 是
                if (e.index == 0) {
                    // 4. 调用删除API删除商品 但是需要传入当前要删除的商品的id
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: { 'id': id },
                        success: function(data) {
                            // 5. 判断如果删除返回成功就重新刷新页面
                            console.log(data);
                            if (data.success) {
                                // 6. 重新调用查询渲染页面
                                letao.getCartProduct();
                            }
                        }
                    })
                }
            })
        });
    },
    // 编辑购物车的商品
    editCartProduct: function() {
        // 1. 给所有编辑按钮添加点击事件
        $('#main').on('click', '.btn-edit', function() {
            var product = $(this).parent();
            //获取当前点击编辑按钮的对应的商品id
            var id = $(this).parent().data('id');
            // 2. 弹出是否删除的确定框 并且把当前商品的尺码和数量的选择放到编辑框里面
            // var editHtml = template('editCartProductTmp');
            // 3. 获取当当前商品的所有尺码 和 当前商品选择的尺码 还有当前商品的所有数量 以及选择的数量
            // var productSize = product.data('product-size');
            // var nowSize = product.data('now-size');
            // var productNum = product.data('product-num');
            // var nowNum = product.data('now-num');
            var productData = {
                productSize: product.data('product-size'),
                nowSize: product.data('now-size'),
                productNum: product.data('product-num'),
                nowNum: product.data('now-num')
            };
            var start = productData.productSize.split('-')[0];
            var end = productData.productSize.split('-')[1];
            productData.productSize = [];
            for (var i = start; i <= end; i++) {
                productData.productSize.push(parseInt(i));
            }
            // 4. 调用模板生成尺码和数量的模板html
            var html = template('editCartProductTmp', productData);
            //去掉所有br标签
            html = html.replace(/(\r)?\n/g, "");
            // 5. 把生成的模板html放到确认框的内容里面
            mui.confirm(html, '温馨提示', ['是', '否'], function(e) {
                //获取当前在确定框里面的选择的尺码
                var newSize = $('.btn-size.active').data('size');
                // 获取当前在确定框里面选择的数量
                var newNum = mui('.mui-numbox').numbox().getValue();
                // 6. 判断当前点击了是
                if (e.index == 0) {
                    // 7. 调用编辑的API去编辑商品
                    $.ajax({
                        url: '/cart/updateCart',
                        data: { 'id': id, 'size': newSize, 'num': newNum },
                        type: 'post',
                        success: function(data) {
                            // 8. 判断当前是否成功编辑
                            if (data.success) {
                                // 9. 成功编辑重新调用查询渲染页面
                                letao.getCartProduct();
                            }
                        }
                    })
                }
            });
            //等100毫秒去初始化数字框
            setTimeout(function() {
                mui('.mui-numbox').numbox();
            }, 100);
            // 让尺码支持点击
            $('body').on('click', '.btn-size', function() {
                $('.btn-size').removeClass('active');
                $(this).addClass('active');
            });
        });
    },
    //计算总金额
    getCount: function() {
        // 1. 给所有的复选框添加改变事件
        $('#main').on('change', '.product-options input', function() {
            // 2. 获取页面上所有被选中的复选框
            var checkdProduct = $('input:checked');
            // 总金额
            var sum = 0;
            // 3. 遍历所有被选中的复选框
            for (var i = 0; i < checkdProduct.length; i++) {
                // 4. 拿到当前被选中的复选框的价格和数量
                var price = $(checkdProduct[i]).data('price');
                var num = $(checkdProduct[i]).data('num');
                var count = price * num;
                sum += count;
            }
            console.log(parseInt(sum * 10) / 10);
            $('.count').html(parseInt(sum * 10) / 10)
        });
    }
}
