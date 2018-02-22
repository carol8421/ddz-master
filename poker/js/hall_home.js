Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

$.ajax({
    url: mainUrl + '/ttdz/list',
    type: "GET",
    dataType: 'json',
    success: function (response) {
        console.log(response)
        if(response.code==0){
            var res = response.data;
            v.status = res.top.status;
            v.chatroom_id = res.top.chatroom_id;
            v.poster = res.top.cover;
            v.title = res.top.title;
            v.viewer_num = res.top.viewer_num;
            v.watch_num = res.top.watch_num;
            myHTML = new HTML();
            myHTML.buildPlayer();

            //热门直播
            for(var i=0;i<res.live.length;i++){
                if(i>2){
                    $('.swiper-live .swiper-wrapper').append('<div class="swiper-slide">' + myHTML.itemHTML(res.live[i].chatroom_id,compress(res.live[i].cover,276,154,75),0,res.live[i].viewer_num,res.live[i].title,2) + '</div>');
                }
                else{
                    $('.swiper-live .swiper-wrapper').append('<div class="swiper-slide">' + myHTML.itemHTML(res.live[i].chatroom_id,compress(res.live[i].cover,276,154,75),0,res.live[i].viewer_num,res.live[i].title,1) + '</div>');
                }
            }
            mySwiper.update();

            var bannerLink = res.banner[0].url;
            var bannerLinkSuffix = '';
            if(document.location.href.split('?')[1]) {
                bannerLinkSuffix = document.location.href.split('?')[1];
                if(localStorage.url==undefined && window.name ==''){
                    if(window.Storage && window.localStorage && window.localStorage instanceof Storage){
                        localStorage.url = document.location.href.split('?')[1];
                    }
                    else{
                        window.name = document.location.href.split('?')[1];
                    }
                }
            }
            else{
                if(localStorage.url!=undefined||window.name!=''){
                    bannerLinkSuffix = (localStorage.url || window.name);
                }
            }

            //轮播图
            if(res.banner[0].url.indexOf('?assemble=1') && bannerLinkSuffix!== ''){
                bannerLink = bannerLink.split('?assemble=1')[0] + '?' + bannerLinkSuffix;
            }
            $('.home-video').after('<a href="'+bannerLink+'" class="home-banner" style="background-image: url('+res.banner[0].pic+')"></a>');

        }
    },
    error: function (error) {
        console.log(error);
    }
});

var mySwiper = new Swiper ('.swiper-live', {
    direction: 'vertical',
    slidesPerView: 'auto',
    watchSlidesVisibility: true,
    lazyLoading: true
});

$('.home').on('click',function () {
    $('.main').removeClass('videoCurrent');
    $('.more-live').show();
    $('.liveUl').parent().removeClass('l-3').addClass('l-4');
});

$('.more-live').on('click',function () {
    $(this).hide();
    $('.main').addClass('videoCurrent');
    $('.liveUl').parent().removeClass('l-4').addClass('l-3');
    $('html,body').animate({scrollTop:0},300);
});

/*
 * code to code
 */
$(document).delegate('.yscq','click',function () {
    myDialog.openDialog(3,{
        title: '发现每日神秘礼包',
        btnClass: 'disable',
        btnTitle: '领取礼包'
    });
});

var myDialog = new Dialog();

$(document).delegate('.book','click',function () {
    myDialog.openDialog(1,{
        btnTitle: '马上预约'
    });
});

$(document).delegate('.closeIt','click',function () {
    myDialog.closeDialog();
});

$(document).delegate('.d1 .button','click',function () {
    _czc.push(["_trackEvent", "天天德州", "下载跳转量", "预约", 0, "book"]);
});

$(document).delegate('.d3 .button','click',function () {
    _czc.push(["_trackEvent", "天天德州", "下载跳转量", "领取礼包", 0, "giftpacket"]);
});

$(document).delegate('.qqbao','click',function () {
    _czc.push(["_trackEvent", "天天德州", "下载跳转量", "大按钮", 0, "qqbao"]);
});