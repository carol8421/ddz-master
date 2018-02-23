(function Init(url) {
    $.ajax({
        url: mainUrl + ddzUrl.home,
        type: "GET",
        data: {
            uin: CommonJS.GetQueryString('uin') ? CommonJS.GetQueryString('uin') : ''
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);
            // return;
            if (response.code === 0) {
                var res = response.data;

                var myHTML = new HTML();

                var cdkeyLink = 'https://huanle.qq.com/hlddz_cdkey/cdkey.shtml';
                if (document.location.href.split('?')[1]) {
                    cdkeyLink = cdkeyLink + '?' + document.location.href.split('?')[1];
                    if (localStorage.url == undefined && window.name == '') {
                        if (window.Storage && window.localStorage && window.localStorage instanceof Storage) {
                            localStorage.url = document.location.href.split('?')[1];
                        }
                        else {
                            window.name = document.location.href.split('?')[1];
                        }
                    }
                }
                else {
                    if (localStorage.url != undefined || window.name != '') {
                        cdkeyLink += '?' + (localStorage.url || window.name);
                    }
                }

                // 添加button
                $('.buttonList').append('<a href="' + cdkeyLink + '" class="cdkey"><img src="./images/hall/cdkey_new.png" alt=""></a><a class="yscq" style="cursor: pointer"><img src="./images/hall/mrlb_new.png" alt=""></a>');

                //首页pk
                var html = '';

                if (res.pk_video.length === 2) {
                    var percent = res.pk_video[0].likes + res.pk_video[1].likes == 0 ? '50' : parseInt(res.pk_video[0].likes) / parseInt(res.pk_video[0].likes + res.pk_video[1].likes) * 100;
                    for (var i = 0; i < res.pk_video.length; i++) {
                        html += '<div class="_29s-item">' +
                            '<a href="./live.html?videoId=' + res.pk_video[i].chatroom_id + '">' +
                            '<i style="background-image: url(' + CommonJS.ImageCompression(res.pk_video[i].cover, 144, 192, 60) + ')"></i>' +
                            '<span class="topicDetail">' +
                            '<span class="topicTitle"><strong>#</strong>' + res.pk_video[i].topic + '</span>' +
                            '</span>' +
                            '</a>' +
                            '</div>';
                    }
                    html += '<div class="_pk-body">' +
                        '<div class="_pk-message">' +
                        '<ul id="lhhjmd">' +
                        '<li>主播胜利就能获得奖励哦</li>' +
                        '<li>次日进入直播大厅即可领取</li>' +
                        '</ul>' +
                        '</div>' +
                        '<a class="_pk-control _pk-control-orange" data-position="0" data-id="' + res.pk_video[0].chatroom_id + '" data-name="' + res.pk_video[0].nick + '"></a>' +
                        '<div class="_pk-proportion">' +
                        '<b class="_pk-proportion-line" style="width: ' + percent + '%"></b>' +
                        '<dl>' +
                        '<dt>' + res.pk_video[0].likes + '</dt>' +
                        '<dt>' + res.pk_video[1].likes + '</dt>' +
                        '</dl>' +
                        '</div>' +
                        '<a class="_pk-control _pk-control-blue" data-position="1" data-id="' + res.pk_video[1].chatroom_id + '" data-name="' + res.pk_video[1].nick + '"></a>' +
                        '</div>';
                    $('#pk_main').append(html);

                    if (userInfo.isVoted) {
                        $('._pk-proportion dl dt').show();
                    }

                    $("#lhhjmd").Scroll({
                        line: 1,
                        speed: 500,
                        timer: 2000,
                        autoPlay: true,
                        direction: 'up',
                        element: 'li',
                        up: '',
                        down: ''
                    });
                }
                else {
                    $('.part-doubao .body').html('<img src="./images/hall/error.png">');
                }


                //对局视频
                for (var i = 0; i < 40 && i < res.small_video.list.length; i++) {
                    var opt = {
                        uid: res.small_video.list[i].uid,
                        chatroom_id: res.small_video.list[i].chatroom_id,
                        status: 0,
                        viewer_num: res.small_video.list.totalViewersNum,
                        title: res.small_video.list[i].title,
                        poster: CommonJS.ImageCompression(res.small_video.list[i].cover, 366, 206, 60),
                        url: res.small_video.list[i].url
                    }
                    if (i < 4) {
                        $('.swiper-svideo .video-list').append('<div class="video-list-item">' + myHTML.itemHTML(opt, 1) + '</div>');
                    }
                    else {
                        $('.swiper-svideo .video-list').append('<div class="video-list-item">' + myHTML.itemHTML(opt, 1) + '</div>');
                    }
                }
                // mySVideoSwiper.update();

                //轮播图
                for (var i = 0; i < res.banner.length; i++) {
                    if (i == 0) {
                        $('.swiper-banner .swiper-wrapper').append('<div class="swiper-slide" style="background-image: url(' + CommonJS.ImageCompression(res.banner[i].pic, 554, 255, 60) + ')"><a href="' + res.banner[i].url + '"></a></div>');
                    }
                    else {
                        $('.swiper-banner .swiper-wrapper').append('<div class="swiper-slide swiper-lazy" data-background="' + CommonJS.ImageCompression(res.banner[i].pic, 554, 255, 60) + '"><a href="' + res.banner[i].url + '"></a></div>');
                    }
                }
                myBannerSwiper.update();

                //热门直播
                if (res.live.length == 0) {
                    $('.part-live').remove();
                }
                else {
                    for (var i = 0; i < res.live.length; i++) {
                        var opt = {
                            uid: res.live[i].uid,
                            chatroom_id: res.live[i].chatroom_id,
                            status: 1,
                            viewer_num: res.live[i].viewer_num,
                            title: res.live[i].title,
                            poster: CommonJS.ImageCompression(res.live[i].cover, 366, 206, 60),
                            url: res.live[i].url
                        }
                        if (i < 5) {
                            $('.swiper-live .swiper-wrapper').append('<div class="swiper-slide">' + myHTML.itemHTML(opt, 1) + '</div>');
                        }
                        else {
                            $('.swiper-live .swiper-wrapper').append('<div class="swiper-slide">' + myHTML.itemHTML(opt, 1, 1) + '</div>');
                        }
                    }
                }
                myLiveSwiper.update();

                //精彩视频
                for (var i = 0; i < 20 && i < res.playback.length; i++) {
                    var opt = {
                        uid: res.playback[i].uid,
                        chatroom_id: res.playback[i].chatroom_id,
                        status: res.playback[i].status,
                        viewer_num: res.playback[i].viewer_num,
                        title: res.playback[i].title,
                        poster: CommonJS.ImageCompression(res.playback[i].cover, 366, 206, 60),
                        url: res.playback[i].url
                    }
                    if (i < 5) {
                        $('.swiper-playback .playback-video').append('<div class="video-list-item">' + myHTML.itemHTML(opt, 1) + '</div>');
                    }
                    else {
                        $('.swiper-playback .playback-video').append('<div class="video-list-item">' + myHTML.itemHTML(opt, 1) + '</div>');
                    }
                }
                // myPlaybackSwiper.update();
            }
            else {
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            if (error.status !== 0) {
                CommonJS.Toast('HOME接口异常');
            }
            else {
                CommonJS.Toast('请刷新重试');
            }
        }
    });
    $('.luck-day-month').html(new Date().getMonth() + 1 + '月');
    $('.luck-day-date').html(new Date().getDate());
})();


var myBannerSwiper = new Swiper('.swiper-banner', {
    // autoplay: 1000,
    watchSlidesVisibility: true,
    lazyLoading: true,
    // loop:true
});

// var mySVideoSwiper = new Swiper('.swiper-svideo', {
//     slidesPerView: 'auto',
//     paginationClickable: true,
//     spaceBetween: 0,
//     watchSlidesVisibility: true,
//     lazyLoading: true
// });

var myLiveSwiper = new Swiper('.swiper-live', {
    slidesPerView: 'auto',
    paginationClickable: true,
    spaceBetween: 0,
    watchSlidesVisibility: true,
    lazyLoading: true
});

// var myPlaybackSwiper = new Swiper('.swiper-playback', {
//     slidesPerView: 'auto',
//     paginationClickable: true,
//     spaceBetween: 0,
//     watchSlidesVisibility: true,
//     lazyLoading: true
// });

var myDialog = new Dialog();

$('.bannerDownload').on('click', function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', 'banner导量', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "banner导量", "点击", 0, "bannerDownload"]);
});

$(document).delegate('.swiper-banner a', 'click', function () {
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', 'banner链接', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "banner链接", "点击", 0, "banner"]);
});

$(document).delegate('#pk_main a', 'click', function () {
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '”今日斗宝“视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "’今日斗宝‘视频", "点击", 0, "pk_main"]);
});

$(document).delegate('.swiper-svideo a', 'click', function () {
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '”小视频“视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "‘小视频‘视频", "点击", 0, "svideo"]);
});

$(document).delegate('.swiper-live a', 'click', function () {
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '”正在直播“视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "‘正在直播‘视频", "点击", 0, "svideo"]);
});

$(document).delegate('.swiper-playback a', 'click', function () {
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '”精彩视频“视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "‘精彩视频‘视频", "点击", 0, "svideo"]);
});

$(document).delegate('.cdkey', 'click', function () {
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', 'CDKEY按钮', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "CDKEY按钮", "点击", 0, "cdkey"]);
});

$(document).delegate('.yscq', 'click', function () {
    myDialog.openDialog(3, {
        title: '发现每日神秘礼包',
        btnClass: 'disable',
        btnTitle: '领取礼包'
    });
    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '每日礼包按钮', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "每日礼包按钮", "点击", 0, "yscq"]);
});

$(document).delegate('.closeIt', 'click', function () {
    myDialog.closeDialog();
});