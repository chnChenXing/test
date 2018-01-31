window.addEventListener('load', function() {
    // 创建js对象
    var letao = new Letao();
    // 调用添加历史记录方法
    letao.addHistory();
    // 调用查询历史记录方法
    letao.queryHistory();
    // 调用删除历史记录方法
    letao.deleteHistory();
    // 调用清空历史记录方法
    letao.clearHistory();
});

var Letao = function() {

}

Letao.prototype = {
    // 添加历史记录
    addHistory: function() {
        // 1. 添加搜索历史记录 ： 
        //   当前搜索框输入内容 点击搜索按钮 会搜索的内容添加到搜索历史记录的列表
        //   1. 给搜索按钮添加点击事件
        //   2. 获取当前输入输入的内容
        //   3. 获取本地存储对象 如果没有就设置为一个空数组
        //   4. 把当前输入的内容 添加到数组里面
        //   5. 把数组重新存储到本地存储里面
        $('.btn-search').on('click', function() {
            var search = $('.search-input input').val();
            // 根据本地存储的键获取值  当获取的时候把字符串 要转成数组 JSON.parse
            var historyData = JSON.parse(localStorage.getItem('historyData') || '[]');
            // 如果没有输入内容就提示输入
            if (!search) {
                alert('请输入搜索的商品')
                return false;
            }
            //添加的时候除了要添加当前的搜索的内容还要定义一个id id就是数组的长度  
            // 获取最后一个对象的id+1如果没有这个对象就默认为1
            var id = 0;
            if (historyData.length == 0) {
                id = 1;
            } else {
                id = historyData[historyData.length - 1].id + 1;
            }
            var obj = { id: id, 'search': search };
            /*如果有输入内容就添加到数组里面*/
            historyData.push(obj);
            // JSON.parse(字符串) 把字符串转换成数组
            // JSON.stringify(数组) 把数组转成字符串
            // 往本地存储里面设置当前的搜索历史 本地存储的值都是字符串 把数组转成字符串存入
            //当要存储的时候要把数组转成字符串来存储JSON.stringify
            localStorage.setItem('historyData', JSON.stringify(historyData));
            // 重新渲染页面
            var letao = new Letao();
            letao.queryHistory();
            // 点击搜素的时候存储历史记录同时跳转到商品列表页面把搜索的内容跟上
            window.location.href = 'productlist.html?search='+search;
        });
    },
    // 查询历史记录
    queryHistory: function() {
        // 2. 查询搜索历史记录：
        //    查询搜索历史记录渲染到列表里面
        //    1. 获取本地存储的历史记录 （转成数组）
        //    2. 使用数组渲染页面
        // 根据本地存储的键获取值  当获取的时候把字符串 要转成数组 JSON.parse
        var historyData = JSON.parse(localStorage.getItem('historyData') || '[]');
        // 如果需要反转 把数组反转一下
        historyData = historyData.reverse();
        // 必须要把数组包装到一个对象的属性上 因为模板只支持传入对象        
        var html = template('historyListTmp', { 'rows': historyData });
        $('.search-history-body').html(html);
    },
    // 删除搜索历史记录
    deleteHistory: function() {
        // 3. 删除搜索历史记录 
        // 点击x的时候要删除当前行的搜索历史记录
        // 1. 要给所有x添加点击事件
        // 2. 拿到当前点击的x对应的搜索历史的id
        // 3. 从所有的数组里面查找这个id 把当前的值删除掉
        // 4. 重新把删除后的数组保存到本地存储里面
        // 5. 删完之后重新渲染页面（要重新查询一次）
        $('.search-history-body').on('click', '.fa-close', function() {
            //获取当前要删除的元素的id
            var id = $(this).parent().data('id');
            // 获取所有的历史记录
            var historyData = JSON.parse(localStorage.getItem('historyData') || '[]');
            for (var i = historyData.length - 1; i >= 0; i--) {
                if (historyData[i].id == id) {
                    /*splice方法是删除数组中的的一个元素 第一个参数是要删除的元素的索引第二个是要删除几个*/
                    historyData.splice(i, 1);
                }
            }
            // 把删除完后的数组重新保存到本地存储里面
            localStorage.setItem('historyData', JSON.stringify(historyData));
            // 重新渲染页面
            var letao = new Letao();
            letao.queryHistory();
        })
    },
    //清空所有历史记录
    clearHistory: function() {
        // 把this存储一下 当前的this就是表示当前的对象可以直接调用他的方法 例如 this.queryHistory()
        var that = this;
        $('.clear-history').on('click', function() {            
            // localStorage.setItem('historyData', '');
            localStorage.removeItem('historyData');
            // 重新渲染页面        
            that.queryHistory();
        });
    }
}
