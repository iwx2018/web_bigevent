$(function() {
    var form = layui.form;
    // 表单验证
    form.verify({
        password: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        newpassword: function(value) {
            var oldPwd = $('[name=oldPwd]').val();
            if (value === oldPwd) {
                return '新旧密码不能相同！'
            }
        },
        repassword: function(value) {
            var newPwd = $('[name=newPwd]').val();
            if (value !== newPwd) {
                return '两次密码不一致！'
            }
        }
    });

    // 提交修改密码信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    });

});