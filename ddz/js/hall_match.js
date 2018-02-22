$('.nav ul').delegate('li','click',function () {
    var i = $(this).index();
    var uid = parseInt($(this).attr('data-uid'));
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
            html += myHTML.detailHTML(videoJson[key].cover,videoJson[key].title,videoJson[key].introduce,videoJson[key].enroll_url);


            html += '<div class="content">';
            html += '<p class="p1"><b>赛事奖励：</b>'+videoJson[key].rewards+'</p>';
            html += '<p class="p2"><b>赛事规则：</b>'+videoJson[key].rule+'</p>';
            html += '<p class="p3"><b>比赛赛程：</b>'+videoJson[key].schedule+'</p>';
            html += '</div>';

            if(videoJson[key].other!=''&&videoJson[key].other!=null&&videoJson[key].other!=undefined){
                html += '<div class="desc">';
                html += '<p>其他详情</p>';
                html += '<p>'+videoJson[key].other+'</p>';
                html += '</div>';
            }
        }
    }

    html += '</ul></div></div></div>';

    $('nav').after(html);
};

$.ajax({
    url: mainUrl + ddzUrl.home,
    type: "GET",
    dataType: 'json',
    success: function (response) {
        if(response.code===0) {
            var res = response.data.games;
            videoJson = res;

            var i = 0;
            var curKey = 0;
            myHTML = new HTML();
            if(res.length!=1){
                for (var key in res) {

                    if (i == 0) {
                        curKey = key;
                        $('.nav ul').append('<li class="current" data-uid="' + key + '"><i style="background-image: url('+res[key].cover_thumb+')"></i>' + res[key].title + '</li>');
                    }
                    else {
                        $('.nav ul').append('<li data-uid="' + key + '"><i style="background-image: url('+res[key].cover_thumb+')"></i>' + res[key].title + '</li>');
                    }


                    i++;
                }
            }
            createQuote(0, curKey);
        }
        else {
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

$(document).delegate('.matchBtn','click',function () {
    _czc.push(["_trackEvent", "斗地主", "报名参赛", "点击", 0, "matchBtn"]);
});

$(document).delegate('.list a','click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-赛事页', '点击', '视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-赛事页", "视频", "点击", 0, "video"]);
});