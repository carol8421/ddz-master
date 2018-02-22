var websiteHost = window.location.hostname;
var isDist = websiteHost.match(/web.ttdz.dasheng.tv/);
var isPreDist = websiteHost.match(/123.207.77.220/);
var mainUrl = isDist ? 'https://api.ddz.dasheng.tv' : isPreDist ? 'https://api.ddz.dasheng.tv:4429' : 'http://123.207.77.220:9001';
var appKey = isDist || isPreDist ? 'p5tvi9dstt364' : '4z3hlwrv4zv0t';

var v = {};
var removeObjByClass = function (a) {
    if(a.length!=undefined){
        for(i in a){
            document.getElementsByClassName(a[i])[0].parentNode.removeChild(document.getElementsByClassName(a[i])[0]);
        }
    }
    else{
        document.getElementsByClassName(a)[0].parentNode.removeChild(document.getElementsByClassName(a)[0]);
    }
};

var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return encodeURI(r[2]); return null;
};

var getScript = function(mainUrl, callback) {
    'use strict';
    var oScript = document.createElement('script');
    oScript.src = mainUrl;
    if (oScript.readyState) {
        oScript.onreadystatechange = function() {
            if (oScript.readyState == 'loaded' || oScript.readyState == 'complete') {
                oScript.onreadystatechange = null;
                if (callback) {
                    callback();
                }
            }
        }
    } else {
        oScript.onload = function() {
            if (callback) {
                callback();
            }
        }
    }
    document.getElementsByTagName('body').item(0).appendChild(oScript);
};

/*
 * html
 */
(function () {
    window.HTML = function () {
        this._video = null;
        this.options = {
            poster: v.poster,
            textTrackDisplay: false,
            loadingSpinner: true,
            bigPlayButton: false,
            controls: true,
            errorDisplay: true,
            textTrackSettings: false,
            preload: 'none'
        };
    };
    HTML.prototype = {
        buildPlayer_old: function () {
            var _this = this;
            var html = '<a href="./live.html?videoId='+v.chatroom_id+'">';
            if(v.status==1){
                html += '<b>直播</b>';
            }
            else{
                html += '<b>重播</b>';
            }
            /*html += '<strong>'+v.viewer_num+'人</strong>';*/
            html += '<span>'+v.title+'</span></a>';
            $('#videoTitle').append(html);

            _this._video =  document.createElement('video');
            _this._video.setAttribute('webkit-playsinline',true);
            _this._video.setAttribute('playsinline',true);
            _this._video.setAttribute('x-webkit-airplay',true);
            _this._video.setAttribute('controls',true);
            var source = document.createElement('source');
            source.src = v.playUrl;
            source.setAttribute('type','application/x-mpegURL');
            _this._video.appendChild(source);
            document.getElementById('video').appendChild(_this._video);

            myPlayer = videojs(_this._video, _this.options, function onPlayerReady() {
                document.getElementsByTagName('video')[0].setAttribute('controls',true);
                //this.play();
            });
        },
        buildPlayer: function () {

            var html = '';
            html += '<a href="./live.html?videoId='+v.chatroom_id+'" class="home-video">' +
                '<span class="home-title home-video-header ' + (v.status === 1 ? 'icon-live' : 'icon-playback') + '">' + v.title + (v.status === 1 ? '<b>' + v.watch_num + '</b>' : '') + '</span>' +
                '<i class="home-video-poster" style="background-image: url('+v.poster+')"></i>' +
                '</a>';
            $('.home-left').append(html);
        },
        itemHTML: function (videoId,cover,status,viewerNum,title,ext) {
            var html = '';
            if(!ext){
                html += '<li>'
            }
            html += '<a href="./live.html?videoId='+videoId+'">';
            if(ext == 2) {
                html += '<i class="swiper-lazy" data-background="'+cover+'">';
            }
            else{
                html += '<i style="background-image: url('+cover+')">';
            }
            /*if(viewerNum != -1){
                if(status==2){
                    html += '<em class="live"><span></span><span></span><span></span>'+viewerNum+'人</em>';
                }
                else{
                    html += '<em class="playback">'+viewerNum+'次</em>';
                }
            }*/
            html += '</i>';
            html += '<p>'+title+'</p>';
            html += '</a>';
            if(!ext){
                html += '</li>'
            }
            return html;
        },
        detailHTML: function (icon,title,desc) {
            var html = '<div class="detail">';
            html += '<img src="'+icon+'" alt="">';
            html += '<h2>'+title+'</h2>';
            html += '<p>'+desc+'</p>';
            html += '</div>';
            return html;
        }
    };
})();

/*
 * dialog
 */
(function () {
    window.Dialog = function () {
    };
    Dialog.prototype = {
        createDialog: function (x,p,opt) {
            var dialog = document.createElement('div');
            dialog.className = 'dialog d' + x;
            p.appendChild(dialog);
            var close = document.createElement('a');
            close.className = 'close closeIt';
            dialog.appendChild(close);

            var p = document.createElement('p');
            if(x==1){
                p.innerHTML = '在<strong>大圣Live</strong>上预约即可收到节目开播通知还有更多精彩节目等着你！';
            }
            else if(x==2){
                p.innerHTML = '前往<strong>大圣Live</strong>即可领取免费门票，还有更多精彩内容等着你！';
            }
            else if(x==3) {
                var title = document.createElement('h3');
                title.innerHTML = opt.title;
                dialog.appendChild(title);

                var img = document.createElement('img');
                img.src = './src/images/hall/gift.png';
                dialog.appendChild(img);

                p.innerHTML = '登录<strong>大圣Live</strong>，即可每日在个人中心-游戏礼包中心领取得分加成、记牌器等道具奖品';
            }

            dialog.appendChild(p);

            var button = document.createElement('a');
            button.className = 'button';
            //button.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.appgame.mktv';
            button.innerHTML = '<b>'+opt.btnTitle+'</b>';
            dialog.appendChild(button);
        },
        openDialog: function (x,opt) {

            if(document.getElementsByClassName('mask').length>0){
                if(document.getElementsByClassName('d'+x).length<=0){
                    this.createDialog(x,document.getElementsByClassName('mask')[0],opt);
                }
            }
            else{
                var mask = document.createElement('div');
                mask.className = 'mask m-' + x;
                document.getElementsByTagName('body')[0].appendChild(mask);
                this.createDialog(x,mask,opt);
            }
            document.getElementsByClassName('mask')[0].className = 'mask m-'+x;
        },
        updateDialog: function (x,opt) {
            document.getElementsByClassName('d'+x)[0].getElementsByClassName('button')[0].classList.add(opt.btnClass);
            document.getElementsByClassName('d'+x)[0].getElementsByClassName('button')[0].innerHTML = '<b>'+opt.btnTitle+'</b>'
            document.getElementsByClassName('mask')[0].className = 'mask m-'+x;

        },
        closeDialog: function () {
            document.getElementsByClassName('mask')[0].className = 'mask';
        }
    };
})();

var compress = function (img,w,h,q) {
    return img + '?imageView2/0/w/' + w + '/h/' + h + '/format/jpg/interlace/1/q/' + q;
};

var APPCommon = {
    ua: navigator.userAgent,
    MQQBrowser: function () {
        var uaArray = this.ua.split(' ');
        var isMQQBrowser = false;
        for(var i=0;i<uaArray.length;i++){
            if(uaArray[i].indexOf('TBS/')>-1){
                isMQQBrowser = true;
            }
            else if(uaArray[i].indexOf('MQQBrowser')>-1){
                isMQQBrowser = true;
            }
        }
        return isMQQBrowser;
    },
    MSDK: navigator.userAgent.indexOf('MSDK') > -1? true : false,
    weixin: navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=='micromessenger'?true:false,
    android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1 ? true : false,
    appSchema: 'mktv://stream',
    appApk: 'https://api.dasheng.tv:4431/v1/app/download?market=tiantiandezhouzhibojian',
    iphoneDownUrl: '//itunes.apple.com/cn/app/%E5%A4%A7%E5%9C%A3-%E5%8F%AF%E4%BB%A5%E7%8E%A9%E7%9A%84%E5%B0%8F%E8%A7%86%E9%A2%91/id1327268860?ls=1&mt=8',
    sjqqDownUrl: '//a.app.qq.com/o/simple.jsp?pkgname=com.appgame.mktv',
    openApp: function(){
        var this_ = this;
        var loadDateTime = new Date();

        if(APPCommon.android){
            if(APPCommon.weixin){
                window.location = this.sjqqDownUrl;
            }
            else if(APPCommon.MSDK){
                window.location = this.appApk;
            }
            else{
                window.location = this_.appSchema;
                window.setTimeout(function() {
                    var timeOutDateTime = new Date();
                    if(timeOutDateTime - loadDateTime < 1200) {
                        window.location = this_.appApk;
                    } else {
                        window.close();
                    }
                },33);
            }
        }
        else{
            window.location = this_.iphoneDownUrl;
        }
    }
};

$(document).delegate('a.button','click',function () {
    APPCommon.openApp()
});

if(getQueryString('Nick')&&getQueryString('Nick')!='--'){
    localStorage.Nick = decodeURI(getQueryString('Nick'));
}