$(function() {
    var form = layui.form;
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        nickname: function(value) {
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{1,6}$").test(value)) {
                return '昵称长度必须在6 个字符以内，不能包含特殊字符！';
            }
        },
    });
    initUserInfo();
    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息获取失败！')
                }
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 重置表单的数据
    $("#btnReset").on("click", function(e) {
        // 阻止默认重置
        e.preventDefault();
        initUserInfo();
    });

    // 更新用户信息
    $(".layui-form").on("submit", function(e) {
        // 阻止默认提交
        e.preventDefault();
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
            }
        });

        // 调用父页面中的方法，重新渲染头像和用户信息
        window.parent.getUserInfo();
    });

});