if(sessionStorage.getItem('pk_video_prize')){
    if(parseInt(sessionStorage.getItem('pk_video_prize')) === 2){
        $('.pk-gift-get').text('已领取').addClass('disable');
    }
    else if(parseInt(sessionStorage.getItem('pk_video_prize')) === 0){
        $('.pk-gift-get').text('未中奖').addClass('disable');
    }
}

var _29sContent = new Swiper('.swiper-_29s-body', {
    slidesPerView: 'auto'
});

$.ajax({
    url: mainUrl + ddzUrl.home,
    type: "GET",
    data: {
        uin: CommonJS.GetQueryString('uin') ? CommonJS.GetQueryString('uin') : ''
    },
    dataType: 'json',
    success: function (response) {
        console.log(response);
        if(response.code===0){
            var res = response.data;

            var html = '';

            //PK结果
            if(res.pre_pk_video.length !== 2) {
                $('._pk').html('<img src="./images/hall/first-day.jpg" alt="">');
                $('#winer').html(' ');
            }
            else{
                var winIndex = res.pre_pk_video[0].likes > res.pre_pk_video[1].likes ? 0 : 1;
                var percent = res.pre_pk_video[0].likes + res.pre_pk_video[1].likes == 0 ? '50' : parseInt(res.pre_pk_video[0].likes)/parseInt(res.pre_pk_video[0].likes + res.pre_pk_video[1].likes) * 100;
                html += '<div class="_pk-content _pk-result">';
                for(var i=0;i<res.pre_pk_video.length;i++) {
                    if(i == winIndex) {
                        html += '<div class="_29s-item _pk-win">';
                        $('#winer .name').text(res.pre_pk_video[i].nick);
                    }
                    else{
                        html += '<div class="_29s-item _pk-lost">';
                    }

                    html += '<a href="./live.html?videoId='+ res.pre_pk_video[i].chatroom_id +'">' +
                        '<i style="background-image: url('+ CommonJS.ImageCompression(res.pre_pk_video[i].cover,144,192,60) +')"></i>' +
                        '<span class="topicDetail">' +
                        '<span class="topicTitle"><strong>#</strong>'+ res.pre_pk_video[i].topic +'</span>' +
                        '</span>' +
                        '</a>' +
                        '</div>';
                }

                html += '<div class="_pk-body">' +
                    '<div class="_pk-title">昨日PK结果</div>' +
                    '<div class="_pk-proportion">' +
                    '<b class="_pk-proportion-line" style="width: ' + percent + '%"></b>' +
                    '<dl>';

                html += '<dt>' +
                    '<span class="nick">'+ res.pre_pk_video[0].nick +'</span>' +
                    '<span class="number">'+ res.pre_pk_video[0].likes +'</span>' +
                    '</dt>';

                html += '<dt>' +
                    '<span class="number">'+ res.pre_pk_video[1].likes +'</span>' +
                    '<span class="nick">'+ res.pre_pk_video[1].nick +'</span>' +
                    '</dt>';

                html += '</dl>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $('._pk').html(html);
            }

            //29s秀内容 标题TAB
            html = '';
            for(var i=0;i<res.short_video.length;i++){
                if(i===0){
                    html += '<div class="swiper-slide active">';
                }
                else{
                    html += '<div class="swiper-slide">';
                }
                html += '<strong>#</strong>' + res.short_video[i].label + '</div>';
            }
            $('.swiper-short-video-title .swiper-wrapper').html(html);

            new Swiper ('.swiper-short-video-title', {
                slidesPerView: 'auto',
                spaceBetween: 0,
                roundLengths : true,
                slideToClickedSlide: true,
                onTap: function (swiper,event) {
                    if(swiper.clickedIndex == undefined || $('.swiper-short-video-title .swiper-slide.active').index() == swiper.clickedIndex) {
                        return;
                    }
                    var $o = $('.swiper-short-video-title .swiper-slide');
                    var $_o = $o.eq(swiper.clickedIndex);
                    $o.removeClass('active');
                    $_o.addClass('active');
                    $('.swiper-_29s-body .swiper-slide').hide();
                    $('.swiper-_29s-body').find('.swiper-slide').map(function (index,value) {
                        if(value.getAttribute('data-topic') == $_o.text().replace('#','')){
                            $(value).fadeIn('fast');
                            if(!$(value).find('.lazyload').hasClass('loaded')){

                                $(value).find('._29s-item').map(function (index,value) {
                                    $(value).find('.lazyload').css({
                                        'background-image': 'url('+ $(value).find('i').attr('data-background') +')'
                                    });
                                    $(value).find('.lazyload').addClass('loaded');
                                });
                            }
                        }
                    });
                    _29sContent.slideTo(0);
                    _29sContent.update();
                }
            });

            //29s秀内容 内容
            html = '';

            for(var i in res.short_video){
                for(var j =0;j<=res.short_video[i].list.length;j++){

                    if(j%2==0){
                        if(i==0){
                            html += '<div class="swiper-slide" data-topic="'+ res.short_video[i].label +'">';
                        }
                        else{
                            html += '<div class="swiper-slide" data-topic="'+ res.short_video[i].label +'" style="display: none">';
                        }
                    }
                    html += '<div class="_29s-item"><div class="_29s-item-body">';

                    if(j===res.short_video[i].list.length){
                        html += '<div class="_29s-item-mask"></div>';
                        html += '<a></a>';
                    }
                    else{
                        html += '<a href="./live.html?videoId='+ res.short_video[i].list[j].chatroom_id +'">';
                        if(i==0){
                            html += '<i style="background-image: url('+ CommonJS.ImageCompression(res.short_video[i].list[j].cover,188,250,60) +')"></i>';
                        }
                        else{
                            html += '<i class="lazyload" data-background="'+ CommonJS.ImageCompression(res.short_video[i].list[j].cover,188,250,60) +'"></i>';
                        }
                        html += '<span class="topicDetail">' +
                            '<span class="topicTitle"><strong>#</strong>'+ res.short_video[i].list[j].topic +'</span>' +
                            '<span class="topicLike">'+ res.short_video[i].list[j].like +'</span>' +
                            '</span>' +
                            '</a>';
                    }

                    if(j%2==1 || j === res.short_video[i].list.length){
                        html += '</div>';
                    }
                    html += '</div></div>';
                }
            }
            $('._29s-items .swiper-_29s-body .swiper-wrapper').html(html);
            _29sContent.update();


            //短视频 标题TAB
            html = '';
            for(var i=0;i<res.small_video.label.length;i++){
                if(i===0){
                    html += '<div class="swiper-slide active">';
                }
                else{
                    html += '<div class="swiper-slide">';
                }
                html += '<strong>#</strong>' + res.small_video.label[i] + '</div>';
            }
            $('.swiper-small-video-title .swiper-wrapper').html(html);
            new Swiper ('.swiper-small-video-title', {
                slidesPerView: 'auto',
                spaceBetween: 0,
                roundLengths : true,
                slideToClickedSlide: true,
                onTap: function (swiper) {
                    if(swiper.clickedIndex == undefined || $('.swiper-small-video-title .swiper-slide.active').index() == swiper.clickedIndex) {
                        return;
                    }
                    var $o = $('.swiper-small-video-title .swiper-slide');
                    var $_o = $o.eq(swiper.clickedIndex);
                    $o.removeClass('active');
                    $_o.addClass('active');
                    $('#small_video').find('li').hide();
                    if(swiper.clickedIndex == 0) {
                        $('#small_video').find('li').show();
                    }
                    else{
                        $('#small_video').find('li[data-topic="' + $_o.text().replace('#','') + '"]').fadeIn('fast');
                    }

                    $('.lazyload').trigger('sporty');
                }
            });

            //短视频 内容
            html = '';
            var myHTML = new HTML();
            for(var i=0;i<res.small_video.list.length;i++){
                var opt = {
                    uid: res.small_video.list[i].uid,
                    chatroom_id: res.small_video.list[i].chatroom_id,
                    status: 0,
                    viewer_num: res.small_video.list[i].like,
                    title: res.small_video.list[i].title,
                    poster: CommonJS.ImageCompression(res.small_video.list[i].cover,272,155,60),
                    url: res.small_video.list[i].url
                }
                $('#small_video').append('<li data-topic="' + (res.small_video.list[i].tag || '腾讯视频') + '">' + myHTML.itemHTML(opt,1,2) + '</li>');
            }

            $('.lazyload').lazyload({
                effect: 'fadeIn',
                event: 'scroll sporty'
            });

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

$(document).delegate('._pk-result a','click',function () {
    _hmt.push(['_trackEvent', '斗地主直播间-小视频页', '点击', '”PK结果“视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-小视频页", "‘PK结果‘视频", "点击", 0, "result"]);
});

$('._pk-_award-footer a').on('click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-小视频页', '点击', '来撩导量', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-小视频页", "来撩导量", "点击", 0, "29s_footer"]);
});

$(document).delegate('._29s-content a','click',function () {
    _hmt.push(['_trackEvent', '斗地主直播间-小视频页', '点击', '”29s秀“视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-小视频页", "‘29s秀‘视频", "点击", 0, "29s"]);
});

$(document).delegate('._29s-item-mask','click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-小视频页', '点击', '29s秀导量', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-小视频页", "‘29s秀’导量", "点击", 0, "29s_mask"]);
});

$(document).delegate('#small_video a','click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-小视频页', '点击', '"短视频"视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-小视频页", "’短视频‘视频", "点击", 0, "svideo"]);
});

