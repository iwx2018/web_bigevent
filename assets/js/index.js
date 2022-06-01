$(function() {
    getUserInfo();

    // 点击退出
    $("#btnLogout").on("click", function() {
        // 提示用户是否确认退出
        layer.confirm('确认退出?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
                // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index);
        });
    });
});

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    });
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username;
    // 2.渲染欢迎的文本
    $("#welcome").html(`欢迎您! ${name}`);
    var userPic = user.user_pic;
    if (userPic == null) {
        // 渲染文本头像
        var textPic = name[0].toUpperCase();
        $(".text-avatar").show().text(textPic).siblings("img").hide();
    } else {
        // 渲染图片头像
        $(".text-avatar").hide().siblings("img").attr('src', userPic).show();
    }
}