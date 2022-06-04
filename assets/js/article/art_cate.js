$(function() {
    var form = layui.form;
    initArtCateList();
    // 获取文章类别信息
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);
                // layer.msg(res.message);
            }
        })
    }

    // 点击添加文章类别
    var indexAdd = null;
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg(res.message);
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });

    // 编辑
    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var Id = $(this).data('id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data);
            }
        });
    });

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });

    // 点击删除
    $("tbody").on("click", ".btn-delete", function() {
        var Id = $(this).data('id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList();
                }
            });
            layer.close(index);
        });
    });
});