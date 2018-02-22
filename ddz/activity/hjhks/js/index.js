(function(doc,win){
    psdW = 1334;
    docEl = doc.documentElement;
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    recalc = function () {
        docW = docEl.clientWidth;
        nowR = docW/psdW > 1 ? 1 : docW/psdW;
        docEl.style.fontSize = nowR*100 + 'px';
    };
    if (!doc.addEventListener){
        return;
    }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document,window);

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
                document.getElementsByClassName(classArray[i])[0].parentNode.removeChild(document.getElementsByClassName(classArray[i])[0]);
            }
        }
        else{
            document.getElementsByClassName(classArray)[0].parentNode.removeChild(document.getElementsByClassName(classArray)[0]);
        }
    },
    ImageCompression: function (imageSrc, width, height, quality, format) {
        quality = quality ? quality : 80;
        format = format ? format : 'jpg';
        if(imageSrc.indexOf('dasheng.tv')>0){
            return imageSrc.replace('file','img') + '?imageView2/w/' + width + '/h/' + height + '/' + format + '/' + quality;
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
    }
};

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
    appApk: 'https://api.dasheng.tv:4431/v1/app/download?market=doudizhufulisai',
    iphoneDownUrl: '//itunes.apple.com/cn/app/id1219919483',
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

var websiteHost = window.location.hostname;
var isDist = websiteHost.match(/web.ddz.dasheng.tv/);
var hostUrl = isDist ? 'https://api.dasheng.tv:4431' : 'https://api.ttt.dasheng.tv:4433';

$('.button').on('click',function () {

    if(localStorage.loginPhone!=undefined && localStorage.loginPhone!='undefined' && localStorage.loginPhone){
        $('.sucess code').text(localStorage.loginPhone);
        $('.mask, .sucess').show();
    }
    else{
        $('.mask, .login').show();
    }

    _hmt.push(['_trackEvent', '斗地主黄金回馈赛领票页', '点击', '马上领取', 1]);
    _czc.push(["_trackEvent", "斗地主", "马上领取", "福利赛领门票", 0, "download"]);
});

var msgSended = false;
$('.getCode').on('click',function () {
    if(msgSended) {
        return;
    }
    var phone = document.getElementById('phone');
    if(phone.value == null || phone.value == '' || !(/^1[3|4|5|7|8]\d{9}$/.test(phone.value))){
        CommonJS.Toast('请输入正确的手机号码');
    }
    else {
        $.ajax({
            url: hostUrl + '/v1/activity/ddz/send-captcha',
            type: "GET",
            data: {
                phone: phone.value
            },
            dataType: 'json',
            beforeSend: function () {
                msgSended = true;
            },
            success: function (response) {
                if(response.code==0) {
                    CommonJS.Toast('请注意查收短信');

                    $('.getCode').addClass('disable');
                    var times = 60;
                    var t = setInterval(function(){
                        if(times<=0){
                            $('.getCode').removeClass('disable');
                            $('.getCode').text('重新发送');
                            msgSended = false;
                            clearInterval(t);
                        }
                        else{
                            times -= 1;
                            $('.getCode').text('重新发送('+times+')');
                        }
                    },1000);
                }
                else{
                    CommonJS.Toast(response.msg);
                    msgSended = false;
                }
            },
            error: function (error) {
                msgSended = false;
                CommonJS.Toast(error);
            }
        });
    }
});

var logined = false;
$('.sure').on('click',function () {
    if(logined){
        return;
    }
    else{
        $.ajax({
            url: hostUrl + '/v1/activity/ddz/check-captcha',
            type: "GET",
            data: {
                phone: phone.value,
                captcha: code.value
            },
            dataType: 'json',
            beforeSend: function () {
                logined = true;
            },
            success: function (response) {
                if(response.code==0) {

                    $('.sucess code').text(phone.value);
                    $('.login').hide();
                    $('.sucess').show();

                    localStorage.loginPhone = phone.value;

                }
                else{
                    CommonJS.Toast(response.msg);
                }
                logined = false;
            },
            error: function (error) {
                logined = false;
                CommonJS.Toast(error);
            }
        });
    }
});

$('.close').on('click',function () {
    $('.mask').hide();
    $(this).parent().hide();
});

$('.download').on('click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主黄金回馈赛领票页', '点击', '下载大圣Live', 1]);
    _czc.push(["_trackEvent", "斗地主", "下载跳转量", "福利赛领门票", 0, "download"]);
});