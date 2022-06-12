$(function() {
    var params = new URLSearchParams(location.search)
    var artId = params.get('id')
    var form = layui.form;

    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                getArticleById();
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();

            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    function getArticleById() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + artId,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var art = res.data;
                // 为表单赋初始值
                form.val('formEdit', {
                    Id: art.Id,
                    title: art.title,
                    cate_id: art.cate_id,
                    content: art.content
                });
                // 初始化富文本编辑器
                initEditor();

                // 设置图⽚路径
                $image.attr('src', `http://www.liulongbin.top:3007${art.cover_img}`);
                // 初始化裁剪区域
                $image.cropper(options);
            }
        });

    }

    // 选择封面
    $("#btnChooseImage").on("click", function(e) {
        e.preventDefault();
        $("#coverFile").click();

    });
    $("#coverFile").on("change", function(e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    // 发布状态
    var art_status = '已发布';
    $("#btnSave2").on("click", function() {
        art_status = '草稿';
    });

    // 点击发布
    $("#form-pub").on("submit", function(e) {
        e.preventDefault();

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 2. 基于 form 表单，快速创建一个 FormData 对象
                var fd = new FormData($("#form-pub")[0]);
                // 3. 将文章的发布状态，存到 fd 中
                fd.append('state', art_status);
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
                console.log(fd);
            });
    });

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html';
                window.parent.document.querySelector("#artList").click();
            }
        })
    }

    // 点击退出编辑
    $("#quit").on('click', function() {
        // 跳转页面
        location.href = '/article/art_list.html';
    });

});