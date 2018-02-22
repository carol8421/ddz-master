var v = {
    objectId: getQueryString('videoId'),
    status: getQueryString('status'),
    gifts_list: {}
};
var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
var clickEvt = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ? 'touchend' : 'click';
var _czc = window._czc || new Array();
var Dasheng = window.Dasheng || null;
var websiteHost = window.location.hostname;
var isTest = websiteHost.match(/test/);
var x5 = false;
var ua = navigator.userAgent;
var uaArray = ua.split(' ');
var isQQBrowser = false;
var isWx = ua.toLowerCase().match(/MicroMessenger/i)=='micromessenger';
for(var i=0;i<uaArray.length;i++){
    if(uaArray[i].indexOf('TBS/')>-1){
        isQQBrowser = true;
        if(parseFloat(uaArray[i].substring(4))>36849){
            x5 = true;
        }
    }
    else if(uaArray[i].indexOf('MQQBrowser')>-1){
        isQQBrowser = true;
        if(parseFloat(uaArray[i].substring(11))>7.1){
            x5 = true;
        }
    }
}
var websiteHost = window.location.hostname;
var isDist = websiteHost.match(/web.ddz.dasheng.tv/);

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
 * tips
 */
var tipsTime = 0;
var tipsIn = false;
var tips = function(text){
    tipsTime = 0;
    var _tips = document.getElementsByClassName('msg-tips')[0];
    _tips.innerHTML = text;
    _tips.classList.add('show');
    var t = setInterval(function(){
        tipsTime += 33;
        if(tipsTime>=1300){
            clearInterval(t);
            _tips.classList.remove('show');
            tipsIn = false;
        }
    },33);
};

/*
 * global function
 */
(function() {
    window.GlobalFun = {
        weibo: navigator.userAgent.toLowerCase().match(/WeiBo/i) == "weibo",
        docWidth: function() {
            return document.documentElement.clientWidth || document.body.clientWidth;
        },
        docHeight: function() {
            return document.documentElement.clientHeight || document.body.clientHeight;
        },
        screenWidth: function() {
            return window.screen.width;
        },
        screenHeight: function() {
            return window.screen.height;
        },
        orientation: function() {
            if (window.orientation === 90 || window.orientation === -90) {
                return 'landscape';
            } else if (window.orientation === 0 || window.orientation === 0) {
                return 'portrait';
            } else {
                return null;
            }
        },
        hasClass: function(ele, cName) {
            return !! ele.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
        },
        toggleClass: function (ele, cName) {
            if(GlobalFun.hasClass(ele,cName)){
                ele.classList.remove(cName);
            }
            else{
                ele.classList.add(cName);
            }
        },
        android: (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1),
        removeClass: function(ele, cName) {
            if (window.GlobalFun.hasClass(ele, cName)) {
                ele.className = ele.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
            }
        },
        whichTransitionEvent: function(type) {
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
        xTranS:function(x){
            return x>9999?(x/10000).toFixed(1)+'万':x;
        },
        isLandscape: function() {
            var supportOrientation = (typeof window.orientation === 'number' && typeof window.onorientationchange === 'object');
            if (supportOrientation && !GlobalFun.android) {
                var ostatus = window.orientation;
                switch (ostatus) {
                    case 90:
                    case - 90 : ostatus = 'landscape';
                        break;
                    default:
                        ostatus = 'portrait';
                        break;
                }
            } else {
                ostatus = (window.innerWidth > window.innerHeight) ? 'landscape': 'portrait';
            }
            return ostatus == 'landscape' ? true: false;
        },
        toShort: function (n) {
            if(n>10000){
                n = Math.floor(n/10000) + Math.ceil((n%10000/1000))/10 + '万';
            }
            return n;
        },
        setStyle: function (o,json) {
            for(i in json){
                o.style[i] = json[i];
            }
        },
        removeObjByClass: function (a) {
            if(a.length!=undefined){
                for(i in a){
                    document.getElementsByClassName(a[i])[0].parentNode.removeChild(document.getElementsByClassName(a[i])[0]);
                }
            }
            else{
                document.getElementsByClassName(a)[0].parentNode.removeChild(document.getElementsByClassName(a)[0]);
            }
        }
    };
})();

/*
 * create video
 */
(function () {
    window.Video = function () {
        this._video = null;
        this.options = {
            poster: v.poster,
            textTrackDisplay: false,
            loadingSpinner: true,
            bigPlayButton: false,
            controls: true,
            errorDisplay: true,
            textTrackSettings: false,
            preload: 'metadata',
            controlBar: v.status==1?false:true
        };
    };
    Video.prototype = {
        init: function () {
            this._video =  document.createElement('video');
            this._video.id = 'video';
            this._video.setAttribute('webkit-playsinline',true);
            this._video.setAttribute('playsinline',true);
            this._video.setAttribute('x-webkit-airplay',true);
            if(GlobalFun.android&&isQQBrowser){
                this._video.setAttribute('x5-video-player-type','h5');
                this._video.setAttribute('x5-video-player-fullscreen',true);
                this._video.setAttribute('x5-video-orientation','landscape|portrait');
                this._video.setAttribute('x5-video-ignore-metadata',true);
            }
            var source = document.createElement('source');
            source.src = v.playUrl;
            /*if(v.status==1){
             source.setAttribute('type','application/x-mpegURL');
             }
             else{
             source.setAttribute('type','video/mp4');
             }*/
            if(v.playUrl.indexOf('m3u8')>0){
                source.setAttribute('type','application/x-mpegURL');
            }
            else{
                source.setAttribute('type','video/mp4');
            }
            this._video.appendChild(source);
            document.getElementsByClassName('d-video')[0].appendChild(this._video);
            this.buildPlayer();
        },
        buildPlayer: function () {
            var _this = this;
            myPlayer = videojs(_this._video, _this.options, function onPlayerReady() {

                if(v.status==1){
                    //$('.vjs-control-bar').remove()
                }

                listenX5Video();

                subTitle = document.createElement('div');
                subTitle.className = 'vjs-title';
                subTitle.innerHTML = v.title;
                document.getElementById('video').appendChild(subTitle);


                if(v.source == 1){
                    var download = document.createElement('a');
                    download.className = 'downloadBtn';
                    //download.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.appgame.mktv';
                    subTitle.appendChild(download);

                    download.onclick = function () {
                        _czc.push(["_trackEvent", "斗地主", "下载跳转量", "播放页下载按钮", 0, "downloadBtn"]);
                        APPCommon.openApp();
                    }
                }

                dmContainer = document.createElement('div');
                dmContainer.className = 'vjs-container-danmu';
                document.getElementById('video').appendChild(dmContainer);
                myDanmu = new Danmu(dmContainer);

                if(v.status==0){
                    GlobalFun.removeObjByClass(['vjs-fullscreen-control','vjs-audio-button','vjs-captions-button','vjs-subtitles-button','vjs-descriptions-button','vjs-chapters-button','vjs-playback-rate','vjs-volume-menu-button']);
                }
                else {

                    var dmCtrl = document.createElement('div');
                    dmCtrl.className = 'vjs-control-danmu';
                    document.getElementById('video').appendChild(dmCtrl);
                    playBtn = document.createElement('a');
                    playBtn.className = 'vjs-control-playbtn';
                    dmCtrl.appendChild(playBtn);

                    playBtn.onclick = function () {
                        if(GlobalFun.hasClass(this,'paused')){
                            myPlayer.play();
                            this.classList.remove('paused');
                        }
                        else {
                            myPlayer.pause();
                            this.classList.add('paused');
                        }
                    };

                    if(v.source == 1) {
                        zanContainer = document.createElement('div');
                        zanContainer.className = 'vjs-container-zan';
                        document.getElementById('video').appendChild(zanContainer);
                        myZan = new Zan(zanContainer);

                        dmBtn = document.createElement('a');
                        dmBtn.className = 'vjs-control-dmbtn';
                        //dmCtrl.appendChild(dmBtn);

                        dmInput = document.createElement('div');
                        dmInput.setAttribute('title','发表评论');
                        dmInput.className = 'vjs-control-dminput';
                        dmCtrl.appendChild(dmInput);

                        var dmWhite = document.createElement('input');
                        dmWhite.setAttribute('placeholder','发表评论');
                        dmWhite.id = 'send_msg_text';
                        dmInput.appendChild(dmWhite);

                        var dmSend = document.createElement('a');
                        dmSend.innerHTML = '发送';
                        dmSend.className = 'vjs-control-dmSend';
                        dmInput.appendChild(dmSend);

                        dmWhite.onkeypress = function (event) {
                            if(event.keyCode==13){
                                sendComment();
                            }
                        }

                        dmWhite.onclick = function () {
                            //APPCommon.openApp()
                        }

                        dmSend.onclick = function () {
                            sendComment();
                            //APPCommon.openApp()
                        }


                        /*dmInput.onclick = function () {
                         //弹窗
                         document.getElementsByClassName('mask')[0].classList.add('m-1');
                         };*/

                        giftContainer = document.createElement('div');
                        giftContainer.className = 'vjs-container-gift';
                        document.getElementById('video').appendChild(giftContainer);
                        var giftContainerCenter = document.createElement('div');
                        giftContainerCenter.className = 'vjs-container-gift-center';
                        giftContainer.appendChild(giftContainerCenter);
                        giftContainerBody = document.createElement('div');
                        giftContainerBody.id = 'gift';
                        giftContainerCenter.appendChild(giftContainerBody);
                        myGift = new Gift('#gift');

                        pgc = document.createElement('div');
                        pgc.className = 'vjs-container-pgc';
                        document.getElementById('video').appendChild(pgc);

                        dmBtn.onclick = function () {
                            if(GlobalFun.hasClass(this,'close')){
                                this.classList.remove('close');
                                dmContainer.classList.remove('hide');
                            }
                            else {
                                this.classList.add('close');
                                dmContainer.classList.add('hide');
                            }
                        };

                        document.getElementsByClassName('closeMask')[0].onclick = function () {
                            document.getElementsByClassName('mask')[0].classList.remove('m-1');
                        };

                        getScript('//cdn.ronghub.com/RongIMLib-2.2.4.min.js',function () {
                            getScript('./js/im_live.js',function () {
                                console.log('IM消息加载完毕');
                            });
                        });
                    }

                    setInterval(function () {
                        if(GlobalFun.android&&isQQBrowser&&_x5enter){
                            if(GlobalFun.hasClass(document.getElementById('video'),'vjs-user-inactive')){
                                document.getElementsByTagName('aside')[0].classList.add('hide');
                            }
                            else{
                                document.getElementsByTagName('aside')[0].classList.remove('hide');
                            }
                        }
                        else{
                            document.getElementsByTagName('aside')[0].classList.remove('hide');
                        }
                    },33);
                }


                this.on('timeupdate',function () {
                    if(v.status==0){
                        /*var time = Math.floor(myPlayer.currentTime());
                         myTextData.init(time);
                         for(x in myTextData.commentQueue){
                         if(time == myTextData.commentQueue[x].time){
                         myDanmu.addDanmu(myTextData.commentQueue[x]._lctext, myTextData.commentQueue[x].nickname);
                         myTextData.commentQueue.splice(x,1);
                         }
                         }*/
                    }
                });
            });
        }
    };
})();

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2])); return null;
}


var has_un_token = 0;
if(localStorage.im_token!=undefined&&localStorage.im_token!='undefined'&&localStorage.im_token){
    has_un_token = 1;
}
$.ajax({
    url: mainUrl + '/ttdz/room',
    type: "GET",
    data: {
        chatroom_id: v.objectId,
        has_im_token: has_un_token
    },
    dataType: 'json',
    success: function (response) {
        console.log(response)
        var res = response.data;
        v.status = res.status;
        v.objectId = res.chatroom_id;
        v.title = res.title;
        v.playUrl = res.url;
        v.poster = res.cover;
        v.source = res.source != undefined ? res.source : 1;
        if(localStorage.im_token!=undefined&&localStorage.im_token!='undefined'&&localStorage.im_token){
            v.im_token = localStorage.im_token;
        }
        else{
            v.im_token = res.im_token;
            localStorage.im_token = res.im_token;
        }

        document.getElementsByTagName('meta')[7].setAttribute('content',v.title);

        myVideo = new Video();
        myVideo.init();
    }
});


/*if(v.status==1){
 var has_un_token = 0;
 if(localStorage.im_token){
 has_un_token = 1;
 }
 $.ajax({
 //url: 'https://api.ddz.dasheng.tv/ddz/room',
 url: 'http://123.207.77.220:9001/ddz/room',
 type: "GET",
 data: {
 chatroom_id: v.objectId,
 has_im_token: has_un_token
 },
 dataType: 'json',
 success: function (response) {
 console.log(response)
 var res = response.data;
 v.objectId = res.chatroom_id;
 v.title = res.title;
 v.playUrl = res.url;
 v.poster = res.cover;
 if(!localStorage.im_token){
 v.im_token = res.im_token;
 localStorage.im_token = res.im_token;
 }
 else{
 v.im_token = localStorage.im_token;
 }

 document.getElementsByTagName('meta')[7].setAttribute('content',v.title);

 myVideo = new Video();
 myVideo.init();
 }
 });
 }
 else{
 v.playUrl = getQueryString('videoId');
 v.poster = getQueryString('poster');
 v.title = decodeURI(getQueryString('title'));
 v.status = getQueryString('status');
 v.token = null;
 v.viewerNum = 0;
 v.im_token = null;

 document.getElementsByTagName('meta')[7].setAttribute('content',v.title);

 myVideo = new Video();
 myVideo.init();
 }*/


/*
 * danmu
 */
(function() {
    window.Danmu = function(element, opt) {
        this._element = element;
    };
    Danmu.prototype = {
        getPath: function() {
            var i = Math.floor(Math.random() * 5) + 1;
            var atf = 'linear';
            switch (i) {
                case 1:
                    atf = 'linear';
                    break;
                case 2:
                    atf = 'ease';
                    break;
                case 3:
                    atf = 'ease-in';
                    break;
                case 4:
                    atf = 'ease-out';
                    break;
                case 5:
                    atf = 'ease-in-out';
                    break;
                default:
                    atf = 'linear';
                    break;
            }
            return atf;
        },
        getTop:function(){
            var _1n = document.getElementsByClassName('dd-item-1').length;
            var _2n = document.getElementsByClassName('dd-item-2').length;
            var _3n = document.getElementsByClassName('dd-item-3').length;
            if(_1n===0||_1n<=_2n&&_1n<=_3n){
                return 1;
            }
            else if(_2n===0||_2n<_1n&&_2n<=_3n){
                return 2;
            }
            else{
                return 3;
            }
        },
        addDanmu: function(msg, name) {
            var t = this.getTop();
            var danmu = document.createElement('div');
            danmu.className = 'dd-item dd-item-' + t;
            GlobalFun.setStyle(danmu,{
                top: (t-1)*0.52+'rem',
                animationTimingFunction: this.getPath(),
                webkitAnimationTimingFunction: this.getPath()
            });
            var b = document.createElement('b');
            b.innerHTML = name;
            danmu.appendChild(b);
            var text = document.createElement('span');
            text.innerHTML = msg;
            danmu.appendChild(text);
            this._element.appendChild(danmu);
            this.removeDanmu(danmu);
        },
        removeDanmu: function(o) {
            var self = this;
            var transitionEvent = GlobalFun.whichTransitionEvent('animation');
            if(transitionEvent){
                o.addEventListener(transitionEvent, function() {
                    o.parentNode.removeChild(o);
                });
            }
        }
    };
})();

/*
 * zan
 */
(function() {
    window.Zan = function(element) {
        this.obj = element;
    };
    Zan.prototype = {
        getPath: function() {
            var i = Math.floor(Math.random() * 5) + 1;
            var atf = 'linear';
            switch (i) {
                case 1:
                    atf = 'linear';
                    break;
                case 2:
                    atf = 'ease';
                    break;
                case 3:
                    atf = 'ease-in';
                    break;
                case 4:
                    atf = 'ease-out';
                    break;
                case 5:
                    atf = 'ease-in-out';
                    break;
            }
            return atf;
        },
        getType: function() {
            return Math.floor(Math.random() * 5) + 1;
        },
        getName: function() {
            return Math.floor(Math.random() * 2) === 1 ? '_moveX': 'moveX';
        },
        creatZan: function() {
            var zanObj = document.createElement('div');
            zanObj.className = 'zan_item zan' + this.getType();
            zanObj.style.webkitAnimationName = this.getName();
            zanObj.style.animationName = this.getName();
            zanObj.style.webkitAnimationTimingFunction = this.getPath();
            zanObj.style.animationTimingFunction = this.getPath();
            zanObj.style.opacity = (Math.floor(Math.random()*6)+5)/10;
            return zanObj;
        },
        removeObj: function(o) {
            var transitionEvent = GlobalFun.whichTransitionEvent('animation');
            var f = false;
            if(transitionEvent){
                o.addEventListener(transitionEvent, function() {
                    if (f) {
                        return;
                    }
                    o.parentNode.removeChild(o);
                    f = true;
                });
            }
        },
        init: function() {
            var zanObj = this.creatZan();
            this.obj.appendChild(zanObj);
            this.removeObj(zanObj);
        }
    };
})();

/*
 * gift
 */
(function() {
    window.Gift = function(element) {
        this.$element = $(element); // 父元素
        this.queueNum = 0; // 当前队列数量
        this.nextQueue = []; //待进行动画的元素
        this.leftGiftQueue = []; //左侧gif
        this.avatar = '/Vss/images/share_1_4/header.jpg';
        this.name = '大圣Live用户';
        this.giftName = '';
        this.bundleNum = 1;
        this.giftImage = '';
        this.giftImageGifUrl = '';
        this.type = 'type';
        this.uid = 1;
    };
    Gift.prototype = {
        init: function() {
            this.popGift();
        },
        popGift: function() {
            var t = this;
            setInterval(function() {
                if (t.nextQueue.length === 0) {
                    return;
                }
                if (t.queueNum < 2 || t.checkSameUser(t.nextQueue[0].name, t.nextQueue[0].uid) !== null) {
                    avatar = t.nextQueue[0].avatar;
                    name = t.nextQueue[0].name;
                    giftName = t.nextQueue[0].giftName;
                    giftImage = t.nextQueue[0].giftImage;
                    giftId = t.nextQueue[0].uid;
                    giftImageGifUrl = t.nextQueue[0].giftImageGifUrl;
                    t.addGift(t.nextQueue[0]);
                    t.nextQueue.splice(0, 1);
                }
            }, 150);
        },
        checkSameUser: function(opt) {
            var sameUserObj = null;
            this.$element.find('.gift').each(function(index, element) {
                if ($(element).attr('data-name') === opt.name && parseInt($(element).attr('data-uid')) === opt.uid) {
                    sameUserObj = $(element);
                }
            });
            return sameUserObj;
        },
        addGift: function(opt) {
            opt.avatar = typeof opt.avatar !== 'undefined' ? opt.avatar: this.avatar;
            opt.name = typeof opt.name !== 'undefined' ? opt.name: this.name;
            opt.bundleNum = typeof opt.bundleNum !== 'undefined' ? opt.bundleNum: this.bundleNum;
            opt.giftName = typeof opt.giftName !== 'undefined' ? opt.giftName: this.giftName;
            opt.giftImage = typeof opt.giftImage !== 'undefined' ? opt.giftImage: this.giftImage;
            opt.giftImageGifUrl = typeof opt.giftImageGifUrl !== 'undefined' ? opt.giftImageGifUrl: this.giftImageGifUrl;
            opt.type = typeof opt.type !== 'undefined' ? opt.type: this.type;
            opt.uid = typeof opt.uid !== 'undefined' ? opt.uid: this.uid;
            //判断同一用户
            var sameUserObj = this.checkSameUser(opt);
            if (sameUserObj !== null) {
                this.$element.data('gift_' + opt.uid + '_time', 0);
                var b = sameUserObj.find('b');
                var n = parseInt(b.text()) + 1;
                if(n>=100){
                    b.parent().addClass('_100');
                }
                else if(n>=50){
                    b.parent().addClass('_50');
                }
                else if(n>=20){
                    b.parent().addClass('_20');
                }
                else{
                }
                b.html(n);
                b.addClass('numBounceIn');
                var transitionEvent = GlobalFun.whichTransitionEvent('animation');
                if(transitionEvent){
                    b[0].addEventListener(transitionEvent, function() {
                        b.removeClass('numBounceIn');
                    });
                }
            } else if (this.queueNum < 2) {
                this.createGift(opt);
            } else {
                this.nextQueue.push(opt);
            }
        },
        createGift: function(opt) {

            var gift = document.createElement('div');
            gift.className = 'gift';
            if (opt.type == 'fill') {
                gift.classList.add('fill');
            }
            gift.setAttribute('data-name', opt.name);
            gift.setAttribute('data-uid', opt.uid);
            var table = document.createElement('table');
            gift.appendChild(table);
            var tr = document.createElement('tr');
            table.appendChild(tr);
            var td = document.createElement('td');
            tr.appendChild(td);
            var i = document.createElement('i');
            i.style.backgroundImage = 'url(' + opt.avatar + ')';
            td.appendChild(i);
            var td = document.createElement('td');
            tr.appendChild(td);
            var em = document.createElement('em');
            em.innerHTML = opt.name;
            td.appendChild(em);
            var cite = document.createElement('cite');
            cite.innerHTML = '送出 <span>' +opt.bundleNum+ '</span>个' + opt.giftName;
            td.appendChild(cite);
            var td = document.createElement('td');
            tr.appendChild(td);
            var img = document.createElement('img');
            img.src = opt.giftImage;
            td.appendChild(img);
            var td = document.createElement('td');
            tr.appendChild(td);
            var strong = document.createElement('strong');
            strong.innerHTML = '×';
            td.appendChild(strong);
            var b = document.createElement('b');
            b.innerHTML = '1';
            td.appendChild(b);

            var giftImageGif = document.createElement('img');
            $(giftImageGif).addClass("giftImageGif");
            $(giftImageGif).attr("src", opt.giftImageGifUrl);

            if (opt.type == 'fill') {
                $(giftImageGif).css({
                    "display": "block",
                    "max-width": "80%",
                    "max-height": "80%",
                    "position": "fixed",
                    "left": "50%",
                    "top": "50%",
                    "-webkit-transform": 'translate3d(-50%,-50%,0)',
                    "transform": 'translate3d(-50%,-50%,0)',
                    "z-index": 10001
                });
            } else {
                $(giftImageGif).css({
                    "opacity": 0,
                    "width": "2.4rem",
                    "margin-bottom": "-0.3rem",
                    "margin-left": "1rem",
                    "display": "none"
                });
            }
            this.sendGift(opt, gift, giftImageGif);
        },
        sendGift: function(opt, gift, giftImageGif) {
            this.$element.prepend($(gift));
            if (opt.type == 'fill') {
                $('body').prepend($(giftImageGif));
            } else {
                this.$element.prepend($(giftImageGif));
            }
            $(giftImageGif).addClass('giftFadeIn');
            this.leftGiftQueue.push(giftImageGif);
            if (this.queueNum > 0) {
                $(this.leftGiftQueue[0]).css({
                    'visibility': 'hidden',
                    'display': 'none'
                });
                this.leftGiftQueue.splice(0, 1);
            }
            gift.classList.add('giftIn');
            this.$element.data('gift_' + opt.uid + '_time', 0);
            this.queueNum += 1;
            this.countDown($(gift), giftImageGif, opt);
        },
        countDown: function(gift, giftImageGif, opt) {
            var t = this;
            var cd = setInterval(function() {
                var time = 'gift_' + opt.uid + '_time';
                t.$element.data(time, parseInt(t.$element.data(time)) + 33);
                if (parseInt(t.$element.data(time)) >= 3000) {
                    gift[0].classList.add('giftOut');
                    giftImageGif.classList.remove('giftFadeIn');
                    t.giftEnd(gift[0], giftImageGif, opt);
                    clearInterval(cd);
                }
            }, 33);
        },
        giftEnd: function(gift, giftImageGif, opt) {
            var t = this;
            var transitionEvent = GlobalFun.whichTransitionEvent('animation');
            transitionEvent && gift.addEventListener(transitionEvent,
                function() {
                    gift.parentNode.removeChild(gift);
                    giftImageGif ? giftImageGif.parentNode.removeChild(giftImageGif) : false;
                    t.$element.data('gift_' + opt.uid + '_time', 0);
                    for (var i = 0; i < t.leftGiftQueue.length; i++) {
                        if (t.leftGiftQueue[i] == giftImageGif) {
                            t.leftGiftQueue.splice(i, 1);
                            break;
                        }
                    }
                    t.queueNum -= 1;
                });
        }
    };
})();

/* load text zan */
(function () {
    window.TextData = function () {
        this.index = 0;
        //this.zanQueue = [];
        this.commentQueue = [];
        this.queue = -1;
    };
    TextData.prototype = {
        init: function (time) {
            if(Math.floor(time/300) != this.queue){
                this.queue = Math.floor(time/300);
                this.index = this.queue;
                this.getZip();
            }
            else{
                //console.log('加载过');
            }
        },
        getZip: function () {
            var t = this;
            $.ajax({
                url: '//dasheng.test.appgame.com/share/getDanmuUrlByIndex',
                type: "POST",
                data: {
                    videoId: v.objectId,
                    index: t.index
                },
                dataType: 'json',
                success: function (response) {
                    if (response.error === 1) {
                        console.log(response.msg);
                    }
                    else {
                        t.getData(response.data.url);
                    }
                    t.index += 1;
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
        getData: function (url) {
            var t = this;
            t.commentQueue.splice(0,t.commentQueue.length);
            $.ajax({
                url: '//dasheng.test.appgame.com/share/ajaxGetDanmu',
                type: 'GET',
                data: {
                    danmu_url: url,
                    create_time: create_time
                },
                dataType: 'json',
                timeout: 3000,
                success: function (response) {
                    var data = response.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].content._lctype == 21) {
                            //t.zanQueue.push(data[i].time);
                        }
                        else if (data[i].content._lctype == -1) {
                            var opt = {
                                time: data[i].time,
                                avatar: data[i].content._lcattrs.avatar,
                                nickname: data[i].content._lcattrs.nickname,
                                _lctext: data[i].content._lctext,
                            };
                            t.commentQueue.push(opt);
                        }
                    }
                }
            });
        }
    };
})();

/*
 * vote
 */
(function () {
    window.Vote = function () {
        this.voted = false;
        this.container = null;
        this.voteBtn = null;
        this.totalTime = 0;
        this.voteId = 0;
    };
    Vote.prototype = {
        create: function (p,opt) {
            var self = this;
            self.voteBtn = self.createButton(p);
            setTimeout(function () {
                self.voteBtn.parentNode.classList.add('stretch');
            },100);
            self.container = self.createContainer(p,opt);
            self.createEvent();
            if(opt.vote_type==1){
                self.countDown();
            }
            self.voted = true;
        },
        init:function (p,opt) {
            var self = this;
            if(self.voted){
                self.update(opt);
            }
            else{
                if(self.voteId!=0&&self.voteId!=opt.vote_id){

                    if(self.voteBtn!=null&&GlobalFun.hasClass(self.voteBtn.parentNode,'stretch')){
                        self.voteBtn.parentNode.classList.remove('stretch');
                    }
                    if(self.container!=null&&GlobalFun.hasClass(self.container.voteBody,'stretch')){
                        self.container.voteBody.classList.remove('stretch');
                    }
                    setTimeout(function () {
                        if(self.voteBtn!=null){
                            self.voteBtn.parentNode.parentNode.removeChild(self.voteBtn.parentNode);
                        }
                        if(self.container!=null){
                            self.container.voteBody.parentNode.removeChild(self.container.voteBody);
                        }
                        self.create(p,opt);
                    },300);
                }
                else{
                    self.create(p,opt);
                }
                self.voted = true;
            }
        },
        createEvent: function (voteBtn,voteBody,voteClose) {
            var self = this;
            self.voteBtn.onclick = function () {
                self.voteBtn.parentNode.classList.remove('stretch');
                self.container.voteBody.classList.add('stretch');
            };

            self.container.voteBody.onclick = function () {
                document.getElementsByClassName('mask')[0].classList.add('m-1');
            };

            self.container.voteClose.onclick = function (e) {
                e.stopPropagation();
                self.container.voteBody.classList.remove('stretch');
                if(GlobalFun.hasClass(self.container.voteBody,'end')){
                    setTimeout(function () {
                        self.container.voteBody.parentNode.removeChild(self.container.voteBody);
                        self.voteBtn.parentNode.parentNode.removeChild(self.voteBtn.parentNode);
                        self.voteBtn = null;
                        self.container = null;
                    },300);
                }
                else{
                    self.voteBtn.parentNode.classList.add('stretch');
                }
            };
        },
        createButton: function (p) {
            var voteButton = document.createElement('div');
            voteButton.className = 'vjs-vote-button';
            p.appendChild(voteButton);
            var voteBtn = document.createElement('a');
            voteButton.appendChild(voteBtn);
            return voteBtn;
        },
        createContainer: function (p,opt) {

            var container = document.createElement('div');
            container.className = 'vjs-container-vote';
            container.id = 'vote_' + opt.vote_id;
            this.voteId = opt.vote_id;
            container.classList.add('vjs-container-item-' + opt.vote_option.length);
            p.appendChild(container);

            var voteClose = document.createElement('a');
            voteClose.className = 'vjs-vote-close';
            container.appendChild(voteClose);

            var subTitle = document.createElement('div');
            subTitle.className = 'vjs-vote-subTitle';
            subTitle.innerHTML = '投票';
            container.appendChild(subTitle);

            var pubTitle = document.createElement('div');
            pubTitle.className = 'vjs-vote-pubTitle';
            if(opt.vote_type!=1){
                pubTitle.classList.add('pd29');
            }
            pubTitle.innerHTML = opt.name;
            container.appendChild(pubTitle);

            if(opt.vote_type==1){
                var countTime = document.createElement('div');
                countTime.className = 'vjs-vote-countTime';
                countTime.innerHTML = this.toTime(opt.count_down);
                container.appendChild(countTime);
                this.totalTime = opt.count_down;
            }

            var ul = document.createElement('ul');
            container.appendChild(ul);

            var li = [], li_p = [], li_i = [];
            for(var i=0;i<opt.vote_option.length;i++){
                li[i] = document.createElement('li');
                ul.appendChild(li[i]);
                li_p[i] = document.createElement('p');
                li_p[i].innerHTML = opt.vote_option[i].name;
                li[i].appendChild(li_p[i]);
                li_i[i] = document.createElement('i');
                li_i[i].innerHTML = opt.vote_option[i].vote_count;
                li[i].appendChild(li_i[i]);
            }

            var rankTitle = document.createElement('div');
            rankTitle.className = 'vjs-vote-rankTitle';
            rankTitle.innerHTML = '贡献榜';
            container.appendChild(rankTitle);

            var dl = document.createElement('dl');
            container.appendChild(dl);

            var dt = [], dt_i = [], dt_p = [];
            for(var i=0;i<opt.top_user.length;i++){
                dt[i] = document.createElement('dt');
                dt[i].setAttribute('uid',opt.top_user[i].uid);
                dl.appendChild(dt[i]);
                dt_i[i] = document.createElement('i');
                dt_i[i].style.backgroundImage = 'url(' + opt.top_user[i].avatar + ')';
                dt[i].appendChild(dt_i[i]);
                dt_p[i] = document.createElement('p');
                dt_p[i].innerHTML = this.toCount(opt.top_user[i].top_count);
                dt[i].appendChild(dt_p[i]);
            }

            for(var i=opt.top_user.length;i<3;i++) {
                dt[i] = document.createElement('dt');
                dl.appendChild(dt[i]);
                dt_i[i] = document.createElement('i');
                dt_i[i].style.backgroundImage = 'url(../src/images/vote/mask@2x.png)';
                dt[i].appendChild(dt_i[i]);
                dt_p[i] = document.createElement('p');
                dt_p[i].innerHTML = '抢占';
                dt[i].appendChild(dt_p[i]);
            }

            return {
                voteClose: voteClose,
                voteBody: container,
                items: ul,
                voteNum: li_i,
                topUser: {
                    avatar: dt_i,
                    count: dt_p
                },
                countTime: countTime,
                subTitle: subTitle
            };
        },
        update: function (opt) {
            console.log('update' + new Date().getTime());
            var voteNum = this.container.voteNum;
            var topUser = this.container.topUser;
            for(var i=0;i<opt.vote_option.length;i++){
                voteNum[i].innerHTML = opt.vote_option[i].vote_count;
            }
            for(var i=0;i<opt.top_user.length;i++){
                topUser.avatar[i].style.backgroundImage = 'url(' + opt.top_user[i].avatar + ')';
                topUser.count[i].innerHTML = this.toCount(opt.top_user[i].top_count);
            }
        },
        end: function (opt) {
            var self = this;
            if(opt.ans_option_id==0&&opt.result[0]==0){
                return;
            }
            if(!self.voted) {
                self.init(opt);
            }
            else{
                self.update(opt);
            }
            self.voteBtn.parentNode.classList.add('end');
            self.container.voteBody.classList.add('end');
            if(opt.ans_option_id==0){
                self.container.voteBody.classList.add('end-1');
                for(var i=0;i<opt.result.length;i++){
                    self.container.voteBody.classList.add('ans-' + opt.result[i]);
                }
            }
            else{
                self.container.voteBody.classList.add('end-2');
                self.container.voteBody.classList.add('ans-' + opt.ans_option_id);
            }
            self.container.subTitle.innerHTML = '结果';
            self.voted = false;
        },
        toTime:function (t) {
            var t = parseInt(t),h = 0,m = 0,s = 0;
            h = Math.floor(t/60/60);
            m = Math.floor(t/60)%60;
            s = t%60;
            h = h>0?(h>9?h:'0'+h):0;
            m = m>0?(m>9?m:'0'+m):'00';
            s = s>0?(s>9?s:'0'+s):'00';
            if(h!=0){
                return h + ":" + m + ":" + s;
            }
            else{
                return m + ":" + s;
            }
        },
        toCount: function (c) {
            var c = parseInt(c);
            if(c>10000){
                c = (c/10000).toFixed(1) + 'W';
            }
            else if(c>1000){
                c = (c/1000).toFixed(1) + 'K';
            }
            return c;
        },
        countDown: function () {
            var self = this;
            setInterval(function () {
                if(self.totalTime==0){
                    return;
                }
                self.totalTime--;
                self.container.countTime.innerHTML = self.toTime(self.totalTime);
            },1000);
        }
    }
})();

var myVote = new Vote();

/*
 * lottery
 */
(function () {
    window.Lottery = function () {
        this.lotteryStatus = [0,0,0]; //创建，抽奖，结果
        this.container = null;
        this.lotteryBtn = null;
        this.lotteryId = 0;
    };
    Lottery.prototype = {
        create: function (p,opt) {
            var self = this;
            self.createButton(p,opt);
            setTimeout(function () {
                self.lotteryBtn.classList.add('stretch');
            },100);
            self.container = self.createContainer(p,opt);
            self.createEvent();
        },
        init:function (p,opt) {
            var self = this;

            if(!self.lotteryStatus[0]){
                self.create(p,opt);
            }
            else{
                if(opt.result_data){
                    if(!self.lotteryStatus[2]){
                        self.end(opt.result_data);
                    }
                    else{
                        console.log('已出结果');
                    }
                }
                else{
                    if(opt.stages==3){
                        if(!self.lotteryStatus[1]){
                            self.lottery(self.container.label,self.container.lotteryBody,self.container.join);
                        }
                        else{
                            console.log('正在抽奖');
                        }
                    }
                    else{
                        console.log('正在报名');
                    }
                }
            }
        },
        createEvent: function () {
            var self = this;
            self.lotteryBtn.onclick = function () {
                self.lotteryBtn.classList.remove('stretch');
                self.container.lotteryBody.classList.add('stretch');
            };

            self.container.lotteryBody.onclick = function () {
                document.getElementsByClassName('mask')[0].classList.add('m-1');
            };

            self.container.lotteryClose.onclick = function (e) {
                e.stopPropagation();
                self.container.lotteryBody.classList.remove('stretch');
                if(GlobalFun.hasClass(self.container.lotteryBody,'end')){
                    setTimeout(function () {
                        self.container.lotteryBody.parentNode.removeChild(self.container.lotteryBody);
                        self.lotteryBtn.parentNode.removeChild(self.lotteryBtn);
                        self.lotteryBtn = null;
                        self.container = null;
                    },300);
                }
                else{
                    self.lotteryBtn.classList.add('stretch');
                }
            };
        },
        createButton: function (p,opt) {
            var lotteryButton = document.createElement('div');
            lotteryButton.className = 'vjs-lottery-button';
            if(opt.result_data){
                lotteryButton.innerHTML = '中奖结果';
            }
            else if(opt.stages==3){
                lotteryButton.innerHTML = '正在抽奖';
            }
            else{
                lotteryButton.innerHTML = '点击参加';
            }
            p.appendChild(lotteryButton);
            this.lotteryBtn = lotteryButton;
            return lotteryButton;
        },
        createContainer: function (p,opt) {

            this.lotteryStatus[0] = 1;

            var bgtype = ['gold','diamond','total'];

            var container = document.createElement('div');
            container.className = 'vjs-container-lottery';
            container.id = 'lottery_' + opt.lottery_id;
            this.lotteryId = opt.lottery_id;
            container.classList.add('vjs-container-lottery-' + bgtype[opt.type-1]);
            p.appendChild(container);

            var body = document.createElement('div');
            body.className = 'vjs-lottery-body';
            container.appendChild(body);

            var lotteryClose = document.createElement('a');
            lotteryClose.className = 'vjs-lottery-close';
            lotteryClose.innerHTML = '收起';
            body.appendChild(lotteryClose);

            var subTitle = document.createElement('h3');
            subTitle.innerHTML = opt.title;
            body.appendChild(subTitle);

            var label = document.createElement('label');
            body.appendChild(label);

            var join = null;
            if(opt.stages!=3){
                join = document.createElement('a');
                join.className = 'vjs-lottery-join';
                join.innerHTML = '点击参与';
                body.appendChild(join);
            }

            var pull = null;

            if(opt.stages==3){
                container.classList.add('lottery-status-lotterying');

                if(opt.result_data){
                    label.innerHTML = '<span>中奖结果</span>';
                    pull = this.createOwner(container,opt.result_data);
                }
                else{
                    this.lottery(label,lotteryBody,join);
                }
            }
            else{
                if(opt.type==1||opt.type==2){
                    label.innerHTML = '<span>消化'+opt.price+'</span><span>'+(opt.type==1 ? '大圣币' : '钻石')+'</span>';
                }
                else{
                    label.innerHTML = '<span>0消耗</span><span>参与</span>';
                }
            }


            return {
                lotteryBody: container,
                lotteryClose: lotteryClose,
                label: label,
                join: join,
                pull: pull
            };
        },
        createOwner: function (p,opt) {
            var owner = document.createElement('div');
            owner.className = 'vjs-lottery-owner';
            p.appendChild(owner);

            var pull = document.createElement('a');
            pull.className = 'pull';
            owner.appendChild(pull);

            var avatar = document.createElement('div');
            avatar.className = 'avatar';
            owner.appendChild(avatar);

            var i = document.createElement('i');
            i.style.backgroundImage = 'url('+opt.avatar+')';
            avatar.appendChild(i);

            var img = document.createElement('img');
            img.src = '../src/images/lottery/ticket@2x.png';
            avatar.appendChild(img);

            var p = document.createElement('p');
            p.innerHTML = opt.nickname + '<br>@' + opt.uid;
            owner.appendChild(p);

            var span = document.createElement('span');
            span.innerHTML = opt.win_content;
            owner.appendChild(span);

            this.lotteryStatus[2] = 1;

            return pull;
        },
        lottery: function (label,lotteryBody,join) {
            this.lotteryBtn.innerHTML = '开始抽奖';

            label.innerHTML = '<span>抽奖中...</span>';
            lotteryBody.classList.add('lottery-status-lotterying');
            if(join!=null){
                join.parentNode.removeChild(this.container.join);
            }
            this.lotteryStatus[1] = 1;
        },
        end: function (opt) {
            this.lotteryBtn.innerHTML = '中奖结果';
            this.container.lotteryBody.classList.add('lottery-status-lotterying');
            this.container.label.innerHTML = '中奖结果';
            if(this.container.join){
                this.container.join.parentNode.removeChild(this.container.join);
            }
            this.createOwner(this.container.lotteryBody,opt);
        },
        close: function () {
            var self = this;
            if(self.lotteryBtn){
                if(GlobalFun.hasClass(self.lotteryBtn,'stretch')){
                    self.lotteryBtn.classList.remove('stretch');
                }
                setTimeout(function () {
                    self.lotteryBtn.parentNode.removeChild(self.lotteryBtn);
                    self.lotteryBtn = null;
                },300);
            }
            if(self.container.lotteryBody){
                if(GlobalFun.hasClass(self.container.lotteryBody,'stretch')){
                    self.container.lotteryBody.classList.remove('stretch');
                }
                setTimeout(function () {
                    self.container.lotteryBody.parentNode.removeChild(self.container.lotteryBody);
                    self.container = null;
                },300);
            }
            self.lotteryStatus = [0,0,0];
            self.lotteryId = 0;
        }
    }
})();

var myLottery = new Lottery();

/*
 * 监听同层播放器
 * 进入同层播放器 需重置视频大小为设备宽高度
 * 同层播放器视频随设备旋转 需监听resize重设宽高度
 * 退出同层播放器 释放宽高度为默认 显示播放按钮
 */
var listenX5Video = function(){
    _x5enter = false;
    myVideo._video.addEventListener('x5videoenterfullscreen',function(){
        _x5enter = true;
        $('#video').addClass('vjs-x5');
        $('.main').addClass('x5');
        myVideo._video.style.width = GlobalFun.screenWidth() + 'px';
        myVideo._video.style.height = GlobalFun.screenHeight() + 'px';
    });
    myVideo._video.addEventListener('x5videoexitfullscreen',function(){
        _x5enter = false;
        $('#video').removeClass('vjs-x5');
        $('.main').removeClass('x5');
        playBtn.classList.add('paused');
        myVideo._video.style.width = '100%';
        myVideo._video.style.height = '100%';
    });
    window.addEventListener('resize',function(){
        if(_x5enter){
            myVideo._video.style.width = GlobalFun.screenWidth() + 'px';
            myVideo._video.style.height = GlobalFun.screenHeight() + 'px';
        }
    },false);
};

window.addEventListener('resize',function(){
    myVideo._video.style['object-position'] = "50% 50%";
},false);

$('.d1 .button').on('click',function () {
    _czc.push(["_trackEvent", "斗地主", "下载跳转量", "弹幕评论", 0, "dmcomment"]);
    APPCommon.openApp()
});