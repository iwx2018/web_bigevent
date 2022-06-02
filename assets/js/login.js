$(function() {
    // 注册 登录页面切换
    $(".links #link-reg").on("click", function() {
        $(".reg-box").show();
        $(".login-box").hide();
    });
    $(".links #link-login").on("click", function() {
        $(".reg-box").hide();
        $(".login-box").show();
    });

    // 密码显示或隐藏
    $(".pwdeye").on("click", function() {
        var open = $(this).hasClass("openeye");
        console.log(open);
        if (!open) {
            $(this).siblings("input").attr("type", "text");
        } else {
            $(this).siblings("input").attr("type", "password");
        }
        $(this).toggleClass("openeye");

    });

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
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,
        password: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repassword: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault();
        // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        $.post('/api/reguser', data, function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            // 模拟人的点击行为
            $('#link-login').click();
        });
    });
    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        });
    });
    // 记住密码
    if (localStorage.getItem('username') && localStorage.getItem('password')) {
        $("#form_login [name=username]").val(localStorage.getItem('username'));
        $("#form_login [name=password]").val(localStorage.getItem('password'));
        $("#remember").prop("checked", true);
    }
    $("#remember").on("change", function() {
        if ($(this).prop("checked")) {
            localStorage.setItem('username', $("#form_login [name=username]").val());
            localStorage.setItem('password', $("#form_login [name=password]").val());
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
    });
});