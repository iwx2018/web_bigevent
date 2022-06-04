$(function() {
    $("#quit").on('click', function() {
        var quitEdit = window.parent.document.querySelector("#artList");
        quitEdit.href = './article/art_list.html';
        location.href = '/article/art_list.html';
    });
});