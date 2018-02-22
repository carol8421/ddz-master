$('.nav ul').delegate('li','click',function () {
    var i = $(this).index();
    var uid = $(this).attr('data-uid');
    $('.nav li').removeClass('current');
    $(this).addClass('current');
    if($('.part_'+i).length==0){
        createQuote(i,uid);
    }
    $('.part').hide();
    $('.part_'+i).show();
});

var videoJson = null;

var createQuote = function (i,uid,type) {
    var html = '';
    html += '<div class="part part_'+i+'">';

    for(var key in videoJson){
        if(uid==key){
            html += myHTML.detailHTML(videoJson[key].cover,videoJson[key].title,videoJson[key].introduce);
            html += '<div class="quote">';
            html += '<ul class="list">';

            for(var i in videoJson[key]['list']){
                if(i!='cover'&&i!='title'&&i!='introduce'){
                    var opt = {
                        url: videoJson[key]['list'][i].url,
                        chatroom_id: videoJson[key]['list'][i].chatroom_id,
                        poster: CommonJS.ImageCompression(videoJson[key]['list'][i].cover,272,155,60),
                        status: videoJson[key]['list'][i].status,
                        viewer_num: videoJson[key]['list'][i].viewer_num,
                        title: videoJson[key]['list'][i].title
                    }
                    html += myHTML.itemHTML(opt,0);
                }
            }
        }
    }

    html += '</ul></div></div>';

    $('.main').append(html);
};

$.ajax({
    url: mainUrl + ddzUrl.home,
    type: "GET",
    dataType: 'json',
    success: function (response) {
        if(response.code===0) {
            var res = response.data.video;
            videoJson = res;

            var i = 0;
            var curKey = 0;
            myHTML = new HTML();
            for (var key in res) {

                if (i == 0) {
                    curKey = key;
                    $('.nav ul').append('<li class="current" data-uid="' + key + '">' + res[key].title + '</li>');
                }
                else {
                    $('.nav ul').append('<li data-uid="' + key + '">' + res[key].title + '</li>');
                }

                i++;
            }
            createQuote(0, curKey);
        }
        else{
            CommonJS.Toast(response.msg);
        }
    },
    error: function (error) {
        if(error.status !== 0) {
            CommonJS.Toast('HOME接口异常');
        }
        else{
            CommonJS.Toast('请刷新重试');
        }
    }
});

$(document).delegate('.list a','click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-视频页', '点击', '视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-视频页", "视频", "点击", 0, "video"]);
});