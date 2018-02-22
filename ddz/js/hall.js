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

var websiteHost = window.location.hostname;
var isDist = websiteHost.match(/web.ddz.dasheng.tv/);
var isPreDist = websiteHost.match(/123.207.77.220/);
var mainUrl = isDist ? 'https://api.ddz.dasheng.tv' : isPreDist ? 'https://api.ddz.dasheng.tv:4429' : 'http://123.207.77.220:9001';
var appKey = isDist || isPreDist ? 'p5tvi9dstt364' : '4z3hlwrv4zv0t';
var hostUrl = isDist || isPreDist ? 'https://api.dasheng.tv:4431' : 'https://api.ttt.dasheng.tv:4433';

//斗地主接口
var ddzUrl = {
    home: '/ddz/home',
    info: '/ddz/info',
    watch: '/v1/ddz-home/add-watch-num'
};

//PK接口
var pkApiUrl = {
    init: '/v1/activity/ddz/init-page',
    vote: '/v1/ddz-home/like-pk-video',
    getGift: '/v1/ddz-home/receive-pk-video-gift'
};

//签到接口
var signApiUrl = {
    getJsUrl: '/v2/user/auth/get-js-url',
    getMsg: '/v2/user/auth/captcha',
    login: '/v1/ddz-home/get-token',
    getInfo: '/v1/ddz-home/init-page',
    sign: '/v1/ddz-home/sign-prize'
};

var v = {};

var CommonJS = {
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return r[2];
        }
        return false;
    },
    CreateScript: function (mainUrl, callback) {
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
    },
    RemoveProtocol: function (url) {
        if(url!=null && url!=''){
            return url.replace('https:','').replace('http:','');
        }
        return url;
    },
    RemoveObjByClass: function (classArray) {
        if(classArray.length!=undefined){
            for(i in classArray){
                if(document.getElementsByClassName(classArray[i])[0]){
                    document.getElementsByClassName(classArray[i])[0].parentNode.removeChild(document.getElementsByClassName(classArray[i])[0]);
                }
            }
        }
        else{
            if(document.getElementsByClassName(classArray)[0]){
                document.getElementsByClassName(classArray)[0].parentNode.removeChild(document.getElementsByClassName(classArray)[0]);
            }
        }
    },
    ImageCompression: function (imageSrc, width, height, quality, format) {
        quality = quality ? quality : 80;
        format = format ? format : 'jpg';
        if(imageSrc.indexOf('dasheng.tv')>0){
            return imageSrc.replace('file','img') + '?imageView2/1/w/' + width + '/h/' + height + '/' + format + '/' + quality;
        }
        return imageSrc;
    },
    Toast: function (text, sendTotalTimes, callback) {
        var _toast;
        if(document.getElementById('toast')!=null){
            _toast = document.getElementById('toast');
        }
        else{
            _toast = document.createElement('div');
            _toast.id = 'toast';
            document.getElementsByTagName('body')[0].appendChild(_toast);
        }
        _toast.innerHTML = text;
        currentTimes = 0;
        totalTimes = sendTotalTimes ? sendTotalTimes : 1300;
        if(!_toast.className.match(new RegExp( "(\\s|^)show(\\s|$)"))){
            _toast.className = 'show';
            var countTime = setInterval(function () {
                currentTimes += 33;
                if(currentTimes >= totalTimes) {
                    clearInterval(countTime);
                    _toast.classList.remove('show');
                    callback ? callback() : '';
                }
            },33);
        }
    },
    AppendStr: function(str, x) {
        var arr = str.split('');
        if(arr[arr.length-1]=='/'){
            return str + x;
        }
        else{
            return str + '/' + x;
        }
    },
    WhichTransitionEvent: function(type) {
        var el = document.createElement('fakeelement');
        var transitions = type === 'animation' ? {
            WebkitTransition: 'webkitAnimationEnd',
            MozTransition: 'animationend',
            OTransition: 'oAnimationEnd oAnimationend',
            transition: 'animationend'
        }: {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd oTransitionend',
            transition: 'transitionend'
        };
        for (var t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    },
    ScreenWidth: function() {
        return window.screen.width;
    },
    ScreenHeight: function() {
        return window.screen.height;
    },
    SetStyle: function (o,json) {
        for(i in json){
            o.style[i] = json[i];
        }
    },
    Copy: function(str, call) {
        var save = function (e) {
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        }
        document.addEventListener('copy', save);
        document.execCommand('copy');
        document.removeEventListener('copy', save);
        if (call) {
            call();
        }
        else {
            CommonJS.Toast('复制成功');
        }
    },
    GetRequest: function() {
       var url = location.search; //获取url中"?"符后的字串
       var theRequest = new Object();
       if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
          }
       }
       return theRequest;
    },
    getUinItem: function(str){
        if (str.indexOf('o') == 0) {
            return parseInt(str.replace('o',''));
        } else {
            return parseInt(str);
        }
    },
    setCookie: function(c_name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : "; expires="+exdate.toGMTString());
    },
    getCookie: function(c_name){
        if (document.cookie.length>0){
            c_start=document.cookie.indexOf(c_name + "=")
            if (c_start!=-1){
                c_start=c_start + c_name.length+1;
                c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1){
                    c_end=document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    }
};

var uin = CommonJS.GetQueryString('uin') ? CommonJS.GetQueryString('uin') : sessionStorage.getItem('ddz_uin');
uin = uin ? Math.floor(uin.replace('o','')) : false;

var TOKEN = null;

/*
 * 获取本地用户TOKEN
 */
if(localStorage.user!=undefined && localStorage.user!='undefined' && localStorage.user){
    var localUser = JSON.parse(localStorage.user);
    for(var key in localUser){
        if(localUser[key].uin == uin) {
            TOKEN = localUser[key].TOKEN;
        }
    }
}

var CommonAPP = {
    ua: navigator.userAgent,
    MQQBrowser: function () {
        var uaArray = this.ua.split(' ');
        var isMQQBrowser = false;
        for(var i=0;i<uaArray.length;i++){
            if(uaArray[i].indexOf('TBS/')>-1){
                isMQQBrowser = true;
            }
            else if(uaArray[i].indexOf('MQQBrowser')>-1){
                if(parseFloat(uaArray[i].substring(11))>7.1){
                    isMQQBrowser = true;
                }
            }
        }
        return isMQQBrowser;
    },
    MSDK: navigator.userAgent.indexOf('MSDK') > -1? true : false,
    weixin: navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=='micromessenger'?true:false,
    android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1 ? true : false,
    appSchema: 'mktv://stream',
    appApk: 'https://api.dasheng.tv:4431/v1/app/download?market=doudizhuzhibojian',
    iphoneDownUrl: '//itunes.apple.com/cn/app/%E5%A4%A7%E5%9C%A3-%E5%8F%AF%E4%BB%A5%E7%8E%A9%E7%9A%84%E5%B0%8F%E8%A7%86%E9%A2%91/id1327268860?ls=1&mt=8',
    sjqqDownUrl: '//a.app.qq.com/o/simple.jsp?pkgname=com.appgame.mktv',
    openApp: function(apkUrl){
        var this_ = this;
        var loadDateTime = new Date();
        apkUrl = apkUrl ? apkUrl : this.appApk;

        if(CommonAPP.android){
            if(CommonAPP.weixin){
                window.location = this.sjqqDownUrl;
            }
            else if(CommonAPP.MSDK){
                window.location = apkUrl;
            }
            else{
                window.location = this_.appSchema;
                window.setTimeout(function() {
                    var timeOutDateTime = new Date();
                    if(timeOutDateTime - loadDateTime < 1200) {
                        window.location = apkUrl;
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
            preload: 'none',
            controlBar: !CommonAPP.android
        };
    };
    HTML.prototype = {
        buildPlayer: function (v) {
            var html = '<a href="./live.html?videoId='+v.chatroom_id+'" onClick="_hmt.push([\'_trackEvent\', \'斗地主直播间\', \'标题进入\', \'主直播间 - '+v.title+', 1]);_czc.push([\'_trackEvent\', \'斗地主\', \'主直播间' + v.title + '\', 0, \'play\']);">';
            if(v.status==1){
                html += '<b>直播</b>';
            }
            else{
                html += '<b>重播</b>';
            }
            html += '<span>'+v.title+'</span></a>';
            $('#videoTitle').append(html);

            var video =  document.createElement('video');

            if(!CommonAPP.android){
                video.setAttribute('webkit-playsinline',true);
                video.setAttribute('playsinline',true);
                video.setAttribute('x-webkit-airplay',true);
            }

            var source = document.createElement('source');
            if(v.url.indexOf('m3u8')>0){
                source.setAttribute('type','application/x-mpegURL');
            }
            else{
                source.setAttribute('type','video/mp4');
            }
            source.src = v.url;
            video.appendChild(source);
            document.getElementsByClassName('video')[0].appendChild(video);

            mainVideo = videojs(video, this.options, function onPlayerReady() {
                if(CommonAPP.android){
                    document.getElementsByTagName('video')[0].setAttribute('controls',true);
                }

                this.on('play',function () {
                    _hmt.push(['_trackEvent', '斗地主直播间', '播放', '主直播间 - '+v.title, 1]);
                    _czc.push(["_trackEvent", "斗地主", "主直播间", v.title, 0, "play"]);
                })

                $('button.vjs-fullscreen-control').remove();
                $('.vjs-control-bar').append('<a href="./live.html?videoId='+v.chatroom_id+'" onClick="_hmt.push([\'_trackEvent\', \'斗地主直播间\', \'全屏进入\', \'主直播间 - '+v.title+', 1]);" class="vjs-fullscreen-control"></a>');
            });
        },
        itemHTML: function (opt,ext,lazyload) {
            var html = '';
            if(ext==1){
                html += '';
            }
            else if(ext==2){
                html += '<li class="shrinkage">';
            }
            else{
                html += '<li>'
            }
            if(opt.url.indexOf('qq.html')>-1){
                html += '<a href="'+opt.url+'" class="item">';
            }
            else{
                html += '<a href="./live.html?videoId='+opt.chatroom_id+'" class="item">';
            }
            if(lazyload==1){
                html += '<i class="swiper-lazy" data-background="'+opt.poster+'">';
            }
            else if(lazyload==2){
                html += '<i class="lazyload" data-original="'+opt.poster+'">';
            }
            else{
                html += '<i style="background-image: url('+opt.poster+')">';
            }
            // if(opt.status==2){
            //     html += '<em class="live"><span></span><span></span><span></span>'+opt.viewer_num+'人</em>';
            // }
            // else{
            //     html += '<em class="playback">'+opt.viewer_num+'次</em>';
            // }
            html += '</i>';
            html += '<p>'+opt.title+'</p>';
            html += '</a>';
            if(ext==1){
                html += '';
            }
            else{
                html += '</li>'
            }
            return html;
        },
        detailHTML: function (icon,title,desc,link) {
            var html;
            if(link&&link!=''){
                html = '<div class="detail detail-match">';
            }
            else{
                html = '<div class="detail">';
            }
            html += '<img src="'+icon+'" alt="">';
            html += '<h2>'+title+'</h2>';
            html += '<p>'+desc+'</p>';
            if(link){
                html += '<a class="matchBtn" href="'+link+'"></a>';
            }
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
                /*var title = document.createElement('h3');
                title.innerHTML = opt.title;
                dialog.appendChild(title);

                p.innerHTML = '登录<strong>大圣Live</strong>，即可每日在<strong>个人中心-游戏礼包中心</strong>领取得分加成、记牌器等道具奖品';*/
            }

            if(x!=3){
                dialog.appendChild(p);
            }

            var button = document.createElement('a');
            button.className = 'button b_' + x;
            button.innerHTML = '<b>'+opt.btnTitle+'</b>';
            dialog.appendChild(button);
            if(x==3&&CommonAPP.android){
                var tips = document.createElement('div');
                tips.innerHTML = '如已安装请直接打开大圣Live';
                tips.style.fontSize = '0.18rem';
                tips.style.color = '#704428';
                tips.style.textAlign = 'center';
                tips.style.lineHeight = 2;
                tips.style.margin = '0.1rem 0 -0.1rem';
                //dialog.appendChild(tips);
            }

            button.onclick = function () {
                _hmt.push(['_trackEvent', '斗地主直播间', '点击', opt.btnTitle, 1]);
                _czc.push(["_trackEvent", "斗地主直播间-首页", opt.btnTitle, "点击", 0, "yscq"]);
            }
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

$(document).delegate('a.button','click',function () {
    CommonAPP.openApp()
});

if(CommonJS.GetQueryString('Nick')&&CommonJS.GetQueryString('Nick')!='--'&&CommonJS.GetQueryString('Nick')!=null){
    sessionStorage.setItem('Nick',decodeURI(CommonJS.GetQueryString('Nick')));
}

if(CommonJS.GetQueryString('HeadURL')&&CommonJS.GetQueryString('HeadURL')!=null){
    var HeadUrl = CommonJS.GetQueryString('HeadURL');
    if(HeadUrl.indexOf('wx.qlogo')!=-1){
        HeadUrl = CommonJS.AppendStr(HeadUrl,'96');
    }
    else if(HeadUrl.indexOf('q.qlogo')!=-1){
        HeadUrl = CommonJS.AppendStr(HeadUrl,'100');
    }
    sessionStorage.setItem('HeadURL',HeadUrl);
}

if(CommonJS.GetQueryString('compatibleVersion')&&CommonJS.GetQueryString('compatibleVersion')==1){
    sessionStorage.setItem('compatibleVersion',CommonJS.GetQueryString('compatibleVersion'));
}

if(CommonJS.GetQueryString('uin')){
    sessionStorage.setItem('ddz_uin',CommonJS.GetQueryString('uin'));
}