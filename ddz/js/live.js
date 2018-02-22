var v = {
    objectId: CommonJS.GetQueryString('videoId'),
    status: CommonJS.GetQueryString('status'),
    gifts_list: {}
};
var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
var clickEvt = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ? 'touchend' : 'click';

/*
 * 预加载图片
 */
var tomatoFinish = false;
var manifest = [];
for(var i=1;i<=41;i++){
    manifest.push({src:'./images/tomato/'+i+'.png',id:'image'});
}
var myPreload = new createjs.LoadQueue(true);
myPreload.installPlugin(createjs.Sound);
myPreload.on("fileload", handleFileLoad);
myPreload.on("progress", handleFileProgress);
myPreload.on("complete", loadComplete);
myPreload.on("error", loadError);
//处理单个文件加载
function handleFileLoad(event) {
    console.log("文件类型: " + event.item.id + " 加载成功");
}
//处理加载错误：大家可以修改成错误的文件地址，可在控制台看到此方法调用
function loadError(evt) {
    console.log("加载出错！",evt.text);
}
//已加载完毕进度
function handleFileProgress(event) {
    //console.log( "已加载 " + (myPreload.progress*100|0) + " %");
}
//全度资源加载完毕
function loadComplete(event) {
    console.log("已加载完毕全部资源");
    tomatoFinish = true;
}

/*
 * create video
 */
(function () {
    window.Video = function () {
        this._video = null;
        this.options = {
            poster: v._29s ? false : v.poster,
            textTrackDisplay: false,
            loadingSpinner: true,
            bigPlayButton: false,
            controls: v._29s ? false : true,
            errorDisplay: true,
            textTrackSettings: false,
            preload: 'metadata',
            inactivityTimeout: v._29s ? 2000 : 5000,
            controlBar: v._29s || v.status == 1 ? false : true
        };
    };
    Video.prototype = {
        init: function () {
            this._video =  document.createElement('video');
            this._video.id = 'video';
            this._video.setAttribute('webkit-playsinline',true);
            this._video.setAttribute('playsinline',true);
            this._video.setAttribute('x-webkit-airplay',true);
            if(CommonAPP.android && CommonAPP.MQQBrowser()){
                this._video.setAttribute('x5-video-player-type','h5');
                this._video.setAttribute('x5-video-player-fullscreen',true);
                this._video.setAttribute('x5-video-orientation','landscape');
                this._video.setAttribute('x5-video-ignore-metadata',true);
            }
            var source = document.createElement('source');
            source.src = v.playUrl;
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

                listenX5Video();

                subTitle = document.createElement('div');
                subTitle.className = 'vjs-title';
                subTitle.innerHTML = v._29s ? v._29s.topic : v.title;
                document.getElementById('video').appendChild(subTitle);

                if(!CommonAPP.android && CommonJS.GetQueryString('compatibleVersion')==1 || !CommonAPP.android && sessionStorage.getItem('compatibleVersion')==1 || v._29s){
                }
                else{
                    liveDownloadBtn = document.createElement('a');
                    liveDownloadBtn.className = 'downloadBtn';
                }


                countDown = document.createElement('div');
                countDown.className = 'countDown';

                if(uin){
                    CommonJS.CreateScript('./js/countdown.js',function () {

                    });
                }
                else{
                    if(!v._29s){
                        subTitle.appendChild(liveDownloadBtn);
                    }
                }

                dmContainer = document.createElement('div');
                dmContainer.className = 'vjs-container-danmu';
                document.getElementById('video').appendChild(dmContainer);
                myDanmu = new Danmu(dmContainer);

                if(v.status==0){
                    CommonJS.RemoveObjByClass(['vjs-audio-button','vjs-captions-button','vjs-subtitles-button','vjs-descriptions-button','vjs-chapters-button','vjs-playback-rate','vjs-volume-menu-button']);
                }
                else{
                    zanContainer = document.createElement('div');
                    zanContainer.className = 'vjs-container-zan';
                    document.getElementById('video').appendChild(zanContainer);
                    myZan = new Zan(zanContainer);

                    var dmCtrl = document.createElement('div');
                    dmCtrl.className = 'vjs-control-danmu';
                    document.getElementById('video').appendChild(dmCtrl);
                    playBtn = document.createElement('a');
                    playBtn.className = 'vjs-control-playbtn';
                    dmCtrl.appendChild(playBtn);
                    dmBtn = document.createElement('a');
                    dmBtn.className = 'vjs-control-dmbtn';
                    //dmCtrl.appendChild(dmBtn);

                    dmInput = document.createElement('div');
                    dmInput.setAttribute('title','发表评论');
                    dmInput.className = 'vjs-control-dminput';
                    dmCtrl.appendChild(dmInput);

                    var dmWhite = document.createElement('input');
                    dmWhite.setAttribute('placeholder','吐个槽呗~');
                    dmWhite.id = 'send_msg_text';
                    dmInput.appendChild(dmWhite);

                    var dmSend = document.createElement('a');
                    dmSend.innerHTML = '发送';
                    dmSend.className = 'vjs-control-dmSend';
                    dmInput.appendChild(dmSend);

                    dmWhite.onkeypress = function (event) {
                        if(event.keyCode==13){
                            sendComment(dmWhite.value);
                        }
                    }

                    dmWhite.onclick = function () {
                        //$('.mask').addClass('m-1');
                    }

                    dmSend.onclick = function () {
                        sendComment(dmWhite.value);
                        //$('.mask').addClass('m-1');
                    }

                    var giftCtr = document.createElement('div');
                    giftCtr.className = 'vjs-control-gift';
                    //dmCtrl.appendChild(giftCtr);

                    giftCtr.onclick = function () {
                        document.getElementsByClassName('mask')[0].classList.add('m-1');
                    };

                    commentList = document.createElement('div');
                    commentList.className = 'vjs-control-commentList';
                    commentList.innerHTML = '<a>666</a><a>2333</a><a>厉害了主播</a><a>你的牌打得也太好了</a><a>快点啊，等到花儿都谢了</a><a>搞事情</a><a>扎心了</a>';
                    dmCtrl.appendChild(commentList);

                    var commentCtr = document.createElement('div');
                    commentCtr.className = 'vjs-control-comment';
                    dmCtrl.appendChild(commentCtr);

                    commentCtr.onclick = function () {
                        $(commentList).toggleClass('show');
                    };

                    setInterval(function () {
                        if($(commentList).hasClass('show')){
                            myPlayer.userActivity_ = true;
                        }
                    },4000);

                    var caiCtr = document.createElement('div');
                    caiCtr.className = 'vjs-control-cai';
                    dmCtrl.appendChild(caiCtr);


                    var tomato = document.getElementById('tomato');
                    caiCtr.onclick = function () {
                        if(!tomatoFinish || tomato.className.match(new RegExp("(\\s|^)show(\\s|$)"))){
                            return;
                        }

                        sendTomato('向主播扔了一个番茄');
                    };

                    var zanCtr = document.createElement('div');
                    zanCtr.className = 'vjs-control-zan';
                    dmCtrl.appendChild(zanCtr);

                    $(document).delegate('.vjs-control-zan',clickEvt, function () {
                        zan();
                        $(commentList).removeClass('show');
                    });

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

                    playBtn.onclick = function () {
                        if(this.className.match(new RegExp("(\\s|^)paused(\\s|$)"))){
                            myPlayer.play();
                            this.classList.remove('paused');
                        }
                        else {
                            myPlayer.pause();
                            this.classList.add('paused');
                        }
                    };

                    dmBtn.onclick = function () {
                        if(this.className.match(new RegExp("(\\s|^)close(\\s|$)"))){
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

                    CommonJS.CreateScript('//cdn.ronghub.com/RongIMLib-2.2.4.min.js',function () {
                        CommonJS.CreateScript('./js/im_live.js',function () {
                            console.log('IM消息加载完毕');
                        });
                    });
                }

                setInterval(function () {
                    var _aside = document.getElementsByTagName('aside')[0];
                    if(CommonAPP.android && CommonAPP.MQQBrowser() && _x5enter){
                        var _video = document.getElementById('video');
                        if(_video.className.match(new RegExp("(\\s|^)vjs-user-inactive(\\s|$)"))||_video.className.match(new RegExp("(\\s|^)vjs-paused(\\s|$)"))){
                            _aside.classList.add('hide');
                        }
                        else{
                            _aside.classList.remove('hide');
                        }
                    }
                    else{
                        _aside.classList.remove('hide');
                    }
                },33);

                var _29sBody = null;
                var _29s = v._29s ? true : false;

                if(_29s && !_29sBody){
                    _29sBody = document.createElement('div');
                    _29sBody.className = 'vjs-29sBody';
                    document.getElementById('video').appendChild(_29sBody);

                    var _29sLeftSide = document.createElement('div');
                    _29sLeftSide.className = 'vjs-29sLeftSide shadow';
                    _29sBody.appendChild(_29sLeftSide);

                    _29sAbout(_29sLeftSide,v._29s.recommend_list);


                    var _29ContentWidth = 544/960*document.documentElement.clientHeight;
                    _29sContent = document.createElement('div');
                    _29sContent.className = 'vjs-29sContent';
                    if(_29ContentWidth > 0){
                        _29sContent.style.width = _29ContentWidth + 'px';
                    }
                    _29sBody.appendChild(_29sContent);

                    _29sTime = document.createElement('div');
                    _29sTime.className = 'vjs-29sContent-time';
                    _29sContent.appendChild(_29sTime);

                    _29sTotalTime = Math.floor(this.duration()) || 29;
                    _29sTime.innerHTML = '<img src="./images/number/2.png" alt=""><img src="./images/number/9.png" alt="">';

                    var _29sText = document.createElement('div');
                    _29sText.className = 'vjs-29sContent-text';
                    _29sContent.appendChild(_29sText);

                    var _29sPosterCtr = document.createElement('div');
                    _29sPosterCtr.className = 'vjs-29sContent-poster';
                    _29sContent.appendChild(_29sPosterCtr);

                    var _29sPoster = document.createElement('i');
                    _29sPoster.style.backgroundImage = 'url(' + v.poster + ')';
                    _29sPosterCtr.appendChild(_29sPoster);

                    _29sPosterCtr.onclick = function () {
                        if(myPlayer.paused()){
                            myPlayer.play();
                        }
                        else{
                            myPlayer.pause();
                        }
                    };

                    var _29sTopic = document.createElement('div');
                    _29sTopic.className = 'vjs-29sContent-topic';
                    _29sTopic.innerHTML = '<b>#</b> ' + v._29s.topic + ' <b>#</b>';
                    _29sText.appendChild(_29sTopic);

                    var _29sDrama = document.createElement('div');
                    _29sDrama.className = 'vjs-29sContent-drama';
                    _29sDrama.innerHTML = v._29s.drama;
                    if(v._29s.drama!==''){
                        _29sText.appendChild(_29sDrama);
                    }

                    var _29sRightSide = document.createElement('div');
                    _29sRightSide.className = 'vjs-29sRightSide shadow';
                    _29sBody.appendChild(_29sRightSide);

                    var _29sAuthor = document.createElement('a');
                    _29sAuthor.className = 'vjs-29sRightSide-avator';
                    _29sAuthor.style.backgroundImage = 'url(' + v._29s.avator + ')';
                    _29sRightSide.appendChild(_29sAuthor);

                    var _29sAuthorNick = document.createElement('span');
                    _29sAuthorNick.className = 'vjs-29sRightSide-nick';
                    _29sAuthorNick.innerHTML = v._29s.nick;
                    _29sAuthor.appendChild(_29sAuthorNick);

                    var _29sAuthorUid = document.createElement('span');
                    _29sAuthorUid.className = 'vjs-29sRightSide-uid';
                    _29sAuthorUid.innerHTML = '大圣ID：' + v._29s.uid;
                    _29sAuthor.appendChild(_29sAuthorUid);

                    _29sAuthor.onclick = function () {
                        _hmt.push(['_trackEvent', '斗地主直播间', '点击', '主播头像', 1]);
                        _czc.push(["_trackEvent", "斗地主直播间", "下载跳转量", "主播头像", 0, "_29sAuthor"]);
                        CommonAPP.openApp();
                    };

                    var _29sDownload = document.createElement('a');
                    _29sDownload.className = 'vjs-29sRightSide-download';
                    _29sDownload.innerHTML = '下载大圣Live 与她更多互动'
                    _29sRightSide.appendChild(_29sDownload);
                }

                this.on('play',function () {

                    if(_29s){

                    }

                });

                this.on('timeupdate',function () {

                    if(_29s && _29sTime){
                        var _29sSurplusTime = Math.ceil(_29sTotalTime - this.currentTime());
                        if(_29sSurplusTime < 1){
                            _29sTime.style.display = 'none';
                            return;
                        }
                        else{
                            _29sTime.style.display = 'block';
                        }
                        _29sTime.innerHTML = _29sTotalTime >= 10 ? '<img src="./images/number/' + Math.floor(_29sSurplusTime/10) + '.png" alt=""><img src="./images/number/' + Math.floor(_29sSurplusTime%10) + '.png" alt="">' : '<img src="./images/number/0.png" alt=""><img src="./images/number/' + _29sSurplusTime + '.png" alt="">';
                    }
                    if(v.status==0){
                    }
                });

                this.on('ended',function () {

                    if(_29s) {
                        _29sTime.style.display = 'block';
                        _29sTime.innerHTML = '<img src="./images/number/2.png" alt=""><img src="./images/number/9.png" alt="">';


                        if(v._29s.today_pk_video){
                            $('.mask').addClass('m-5');
                            $('.support').on('click',function (e) {
                                e.stopPropagation();
                                $.ajax({
                                    url: mainUrl + pkApiUrl.vote,
                                    type: "GET",
                                    data: {
                                        video_id: v.objectId,
                                        uin: uin
                                    },
                                    dataType: 'json',
                                    success: function (response) {
                                        if(response.code == 0){
                                            CommonJS.Toast('支持成功');
                                            $('.mask').removeClass('m-5');

                                        }
                                        else{
                                            CommonJS.Toast(response.msg);
                                            $('.mask').removeClass('m-5');
                                        }
                                    },
                                    error: function (error) {
                                        CommonJS.Toast(error);
                                        $('.mask').removeClass('m-5');
                                    }
                                });
                            });

                            $('.mask').on('click',function () {
                                $(this).removeClass('m-5');
                            });
                        }

                    }

                });

            });
        }
    };
})();

var has_un_token = 0;
if(localStorage.im_token!=undefined && localStorage.im_token!='undefined' && localStorage.im_token){
    has_un_token = 1;
}
$.ajax({
    url: mainUrl + ddzUrl.info,
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
        v.playUrl = CommonJS.RemoveProtocol(res.url);
        v.poster = res.cover;
        v.im_token = res.im_token;
        if(localStorage.im_token!=undefined && localStorage.im_token!='undefined' && localStorage.im_token){
            v.im_token = localStorage.im_token;
        }
        else{
            v.im_token = res.im_token;
            localStorage.im_token = res.im_token;
        }

        v._29s = false;
        if(res.type!=undefined&&res.type=='normal_29s'){
            v._29s = {
                type: 'normal',
                topic: res.topic,
                drama: res.drama,
                avator: res.avator,
                nick: res.nick || '大圣用户',
                uid: res.uid || '暂无',
                recommend_list: res.recommend_list,
                today_pk_video: res.today_pk_video || 0
            };


            if(v._29s.today_pk_video){
                $.ajax({
                    url: mainUrl + ddzUrl.watch,
                    type: "GET",
                    data: {
                        video_id: v.objectId,
                        uin: uin
                    },
                    dataType: 'json',
                    success: function (response) {
                        
                    }
                });
            }

        }

        if(res.status==1){
            myPreload.loadManifest(manifest);
        }

        /*v.status = 1;
        v.objectId = 'z1.appphp.59e46a49d425e163333d50d5';
        v.playUrl = "http://pili-live-hls.api.ttt.dasheng.tv/appphp/59e46a49d425e163333d50d5.m3u8";
        v.im_token = 'dY9jgRNiRu38sKxGMxPWBZmjEG5jvVwFAhqOhoeLE7gbgArBjoCLLC1Oi6cYS9aY29DckhH4//eLRUdZ5n9KWUJAwQvVH2lL';*/

        document.getElementsByTagName('meta')[7].setAttribute('content',v.title);

        myVideo = new Video();
        myVideo.init();
    },
    error: function () {
        if(error.status !== 0) {
            CommonJS.Toast('视频接口异常');
        }
        else{
            CommonJS.Toast('请刷新重试');
        }
    }
});

function _29sAbout(ele, data) {
    var w = document.documentElement.clientHeight/3*0.75;
    var html = '';
    for (var i=0;i<data.length;i++){
        html += '<div class="vjs-29sLeftSide-item"><a href="./live.html?videoId=' + data[i].chatroom_id + '" style="width: ' + w + 'px"><i style="background-image: url(' + data[i].cover + ')"></i><b><span><strong>#</strong>' + data[i].topic + '</span><span><em>' + data[i].viewer_num + '</em></span></b></a></div>';
    }
    $(ele).append(html);
}

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
            CommonJS.SetStyle(danmu,{
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
            var transitionEvent = CommonJS.WhichTransitionEvent('animation');
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
            var transitionEvent = CommonJS.WhichTransitionEvent('animation');
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
                var transitionEvent = CommonJS.WhichTransitionEvent('animation');
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
            var transitionEvent = CommonJS.WhichTransitionEvent('animation');
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
            if(opt.status==4){
                this.end(opt);
            }
            else if(self.voted){
                self.update(opt);
            }
            else{
                if(self.voteId!=0&&self.voteId!=opt.vote_id){

                    if(self.voteBtn!=null && self.voteBtn.parentNode.className.match(new RegExp("(\\s|^)stretch(\\s|$)"))){
                        self.voteBtn.parentNode.classList.remove('stretch');
                    }
                    if(self.container!=null && self.container.voteBody.className.match(new RegExp("(\\s|^)stretch(\\s|$)"))){
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
        createEvent: function () {
            var self = this;
            self.voteBtn.onclick = function () {
                self.voteBtn.parentNode.classList.remove('stretch');
                self.container.voteBody.classList.add('stretch');
            };

            self.container.voteBody.onclick = function () {
                downloadType = '投票组件';
                document.getElementsByClassName('mask')[0].classList.add('m-1');
            };

            self.container.voteClose.onclick = function (e) {
                e.stopPropagation();
                self.container.voteBody.classList.remove('stretch');
                if(self.container.voteBody.className.match(new RegExp("(\\s|^)end(\\s|$)"))){
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

                var img = document.createElement('img');
                img.src = opt.top_user[i].photo_url;
                img.onload = function () {
                    dt_i[i].style.backgroundImage = 'url(' + opt.top_user[i].photo_url + ')';
                }
                img.onerror = function () {
                    dt_i[i].style.backgroundImage = 'url(./images/hall/header.jpg)';
                }

                dt[i].appendChild(dt_i[i]);
                dt_p[i] = document.createElement('p');
                dt_p[i].innerHTML = this.toCount(opt.top_user[i].top_count);
                dt[i].appendChild(dt_p[i]);
            }

            for(var i=opt.top_user.length;i<3;i++) {
                dt[i] = document.createElement('dt');
                dl.appendChild(dt[i]);
                dt_i[i] = document.createElement('i');
                dt_i[i].style.backgroundImage = 'url(./images/vote/mask@2x.png)';
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
            var voteNum = this.container.voteNum;
            var topUser = this.container.topUser;
            for(var i=0;i<opt.vote_option.length;i++){
                voteNum[i].innerHTML = opt.vote_option[i].vote_count;
            }
            for(var i=0;i<opt.top_user.length;i++){
                var img = document.createElement('img');
                img.src = opt.top_user[i].avatar;
                img.onload = function () {
                    topUser.avatar[i].style.backgroundImage = 'url(' + opt.top_user[i].avatar + ')';
                }
                img.onerror = function () {
                    topUser.avatar[i].style.backgroundImage = 'url(./images/hall/header.jpg)';
                }
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
        this.lotteryStatus = [0,0,0,0]; //创建，抽奖，结果，结束
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

            //未创建组件的话创建组件
            if(!self.lotteryStatus[0]){
                self.create(p,opt);
            }
            else{
                //创建过组件的 - 出结果
                if(opt.result_data){
                    //未有结果状态
                    if(!self.lotteryStatus[2]){
                        self.end(opt.result_data);
                    }
                }
                else{
                    //关闭组件
                    if(opt.stages==4){
                        //创建过
                        if(self.lotteryStatus[0]){
                            self.destroy();
                        }
                    }
                    else if(opt.stages==3){
                        //未有正在抽奖状态
                        if(!self.lotteryStatus[1]){
                            self.lottery(self.container.label,self.container.lotteryBody,self.container.join);
                        }
                    }
                    else if(opt.stages==2){
                        self.wait(self.container.label,self.container.lotteryBody,self.container.join);
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

            self.container.lotteryBody.onclick = function (e) {
                e.stopPropagation();
                document.getElementsByClassName('mask')[0].classList.add('m-1');
            };

            self.container.lotteryClose.onclick = function (e) {
                e.stopPropagation();
                self.container.lotteryBody.classList.remove('stretch');
                if(self.container.lotteryBody.className.match(new RegExp("(\\s|^)end(\\s|$)"))){
                    setTimeout(function () {
                        self.container.lotteryBody.parentNode.removeChild(self.container.lotteryBody);
                        self.lotteryBtn.parentNode.removeChild(self.lotteryBtn);
                        self.lotteryBtn = null;
                        self.container = null;
                        self.lotteryStatus = [0,0,0,0];
                        self.lotteryId = 0;
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
            else if(opt.stages==2){
                lotteryButton.innerHTML = '等待抽奖';
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

            var bgtype = ['diamond','gold','total'];

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
            if(opt.stages==1){
                join = document.createElement('a');
                join.className = 'vjs-lottery-join';
                join.innerHTML = '点击参与';
                body.appendChild(join);
            }

            var pull = null;

            if(opt.stages==2){
                container.classList.add('lottery-status-lotterying');
                label.innerHTML = '<span>等待抽奖</span>';
            }
            else if(opt.stages==3){
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
                    label.innerHTML = '<span>消耗'+opt.price+'</span><span>'+(opt.type==1 ? '钻石' : '大圣币')+'</span>';
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

            /*var pull = document.createElement('a');
            pull.className = 'pull';
            owner.appendChild(pull);*/
            var pull = null;

            var avatar = document.createElement('div');
            avatar.className = 'avatar';
            owner.appendChild(avatar);

            var img = document.createElement('img');
            img.src = opt.photo_url;
            img.onload = function () {
                i.style.backgroundImage = 'url('+opt.photo_url+')';
            };
            img.onerror = function () {
                i.style.backgroundImage = 'url(./images/lottery/header.jpg)';
            };

            var i = document.createElement('i');
            avatar.appendChild(i);

            var img = document.createElement('img');
            img.src = './images/lottery/ticket@2x.png';
            avatar.appendChild(img);

            var p = document.createElement('p');
            p.innerHTML = opt.nick + '<br>@' + opt.uid;
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
                join.parentNode.removeChild(join);
                this.container.join = null;
            }
            this.lotteryStatus[1] = 1;
        },
        wait: function (label,lotteryBody,join) {
            this.lotteryBtn.innerHTML = '等待抽奖';

            label.innerHTML = '<span>等待抽奖</span>';
            lotteryBody.classList.add('lottery-status-lotterying');
            if(join!=null){
                join.parentNode.removeChild(join);
                this.container.join = null;
            }
        },
        end: function (opt) {
            this.container.lotteryBody.classList.add('end');
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
                if(self.lotteryBtn.className.match(new RegExp("(\\s|^)stretch(\\s|$)"))){
                    self.lotteryBtn.classList.remove('stretch');
                }
                setTimeout(function () {
                    self.lotteryBtn.parentNode.removeChild(self.lotteryBtn);
                    self.lotteryBtn = null;
                },300);
            }
            if(self.container.lotteryBody){
                if(self.container.lotteryBody.className.match(new RegExp("(\\s|^)stretch(\\s|$)"))){
                    self.container.lotteryBody.classList.remove('stretch');
                }
                setTimeout(function () {
                    self.container.lotteryBody.parentNode.removeChild(self.container.lotteryBody);
                    self.container = null;
                },300);
            }
            self.lotteryStatus = [0,0,0,0];
            self.lotteryId = 0;
        },
        destroy: function () {
            var self = this;
            if(self.container.lotteryBody.className.match(new RegExp("(\\s|^)stretch(\\s|$)"))){
                self.container.lotteryBody.classList.remove('stretch');
            }
            if(self.lotteryBtn.className.match(new RegExp("(\\s|^)stretch(\\s|$)"))){
                self.lotteryBtn.classList.remove('stretch');
            }
            setTimeout(function () {
                self.container.lotteryBody.parentNode.removeChild(self.container.lotteryBody);
                self.lotteryBtn.parentNode.removeChild(self.lotteryBtn);
                self.lotteryBtn = null;
                self.container = null;
                self.lotteryStatus = [0,0,0,0];
                self.lotteryId = 0;
            },300);
        }
    }
})();

var myLottery = new Lottery();

/*
 * punishment
 */
(function () {
    window.Punishment = function () {
        this.punishmented = false;
        this.container = null;
        this.totalTime = 0;
        this.punishmentId = 0;
        this.finish = false;
        this.w1 = 50;
        this.w2 = 50;
    };
    Punishment.prototype = {
        create: function (p,opt) {
            var self = this;
            self.container = self.createContainer(p,opt);
            setTimeout(function () {
                self.container.body.classList.add('stretch');
            },100);
            self.countDown();
            //self.add();
            //self.move();
            this.punishmented = true;
        },
        init:function (p,opt) {
            var self = this;
            if(self.punishmented){
                if(opt.status==1){
                    self.update(opt);
                }
                else{
                    self.end(opt);
                }
            }
            else{
                if(opt.status==1){
                    self.create(p,opt);
                }
            }
        },
        createContainer: function (p,opt) {

            var container = document.createElement('div');
            container.className = 'vjs-container-punishment';
            container.id = 'punishment_' + opt.punishment_id;
            this.punishmentId = opt.punishment_id;
            p.appendChild(container);

            var title = document.createElement('div');
            title.className = 'vjs-punishment-title';
            title.innerHTML = opt.title;
            container.appendChild(title);

            var tips_left = document.createElement('div');
            tips_left.className = 'vjs-punishment-tips tips_left';
            container.appendChild(tips_left);
            var tips_left_nick = document.createElement('span');
            tips_left_nick.innerHTML = opt.user.u1.nick;
            tips_left.appendChild(tips_left_nick);
            var tips_left_num = document.createElement('span');
            if(parseInt(opt.user.u1.total)!=0){
                tips_left_num.innerHTML = opt.user.u1.total;
            }
            tips_left.appendChild(tips_left_num);

            var tips_right = document.createElement('div');
            tips_right.className = 'vjs-punishment-tips tips_right';
            container.appendChild(tips_right);
            var tips_right_nick = document.createElement('span');
            tips_right_nick.innerHTML = opt.user.u2.nick;
            tips_right.appendChild(tips_right_nick);
            var tips_right_num = document.createElement('span');
            if(parseInt(opt.user.u2.total)!=0){
                tips_right_num.innerHTML = opt.user.u2.total;
            }
            tips_right.appendChild(tips_right_num);

            var left_p = '50%',right_p = '50%';
            if(parseInt(opt.score[1])+parseInt(opt.score[0])!=0){
                left_p = parseInt(opt.score[1])/(parseInt(opt.score[1])+parseInt(opt.score[0]))*100 +'%';
                right_p = parseInt(opt.score[0])/(parseInt(opt.score[1])+parseInt(opt.score[0]))*100 +'%';
            }

            var lineText = document.createElement('div');
            lineText.className = 'vjs-punishment-lineText';
            container.appendChild(lineText);
            var line_left = document.createElement('span');
            line_left.className = 'line line_left';
            line_left.style.width = left_p;
            lineText.appendChild(line_left);
            var line_right = document.createElement('span');
            line_right.className = 'line line_right';
            line_right.style.width = right_p;
            lineText.appendChild(line_right);
            var text_left = document.createElement('span');
            text_left.className = 'text text_left';
            text_left.innerHTML = opt.score[1]||0 + '票';
            lineText.appendChild(text_left);
            var text_right = document.createElement('span');
            text_right.className = 'text text_right';
            text_right.innerHTML = opt.score[0]||0 + '票';
            lineText.appendChild(text_right);
            
            var consume_left = document.createElement('div');
            consume_left.className = 'vjs-punishment-consume consume_left';
            consume_left.innerHTML = '<span class="diamond">1<b>送小刀</b></span>';
            container.appendChild(consume_left);

            var consume_right = document.createElement('div');
            consume_right.className = 'vjs-punishment-consume consume_right';
            consume_right.innerHTML = '<span class="diamond"><b>送护盾</b>1</span>';
            container.appendChild(consume_right);

            var time = document.createElement('div');
            time.className = 'vjs-punishment-time';
            time.innerHTML = '距结束';
            container.appendChild(time);
            var times = document.createElement('span');
            times.innerHTML = this.toTime(opt.count_down);
            this.totalTime = opt.count_down;
            time.appendChild(times);

            container.onclick = function () {
                downloadType = '惩罚组件';
                document.getElementsByClassName('mask')[0].classList.add('m-1');
            };

            return {
                body: container,
                u1_nick: tips_left_nick,
                u1_count: tips_left_num,
                u2_nick: tips_right_nick,
                u2_count: tips_right_num,
                text_left: text_left,
                text_right: text_right,
                line_left: line_left,
                line_right: line_right,
                consume_left: consume_left,
                consume_right: consume_right,
                countTime: times
            };
        },
        update: function (opt) {
            this.container.u1_nick.innerHTML = opt.user.u1.nick;
            if(parseInt(opt.user.u1.total)!=0){
                this.container.u1_count.innerHTML = opt.user.u1.total;
            }
            this.container.u2_nick.innerHTML = opt.user.u2.nick;
            if(parseInt(opt.user.u2.total)!=0){
                this.container.u2_count.innerHTML = opt.user.u2.total;
            }
            this.container.text_left.innerHTML = opt.score[1] + '票';
            this.container.text_right.innerHTML = opt.score[0] + '票';

            var left_p = '50%',right_p = '50%';
            if(parseInt(opt.score[1])+parseInt(opt.score[0])){
                left_p = parseInt(opt.score[1])/(parseInt(opt.score[1])+parseInt(opt.score[0]))*100 +'%';
                right_p = parseInt(opt.score[0])/(parseInt(opt.score[1])+parseInt(opt.score[0]))*100 +'%';
            }

            this.container.line_left.style.width = left_p;
            this.container.line_right.style.width = right_p;
            //this.totalTime = opt.count_down;
        },
        move: function () {
            var self = this;
            var dir = -1;
            setInterval(function () {
                if(self.finish){
                    return;
                }
                if(self.w1==48){
                    dir = 1
                }
                if(self.w1==52){
                    dir = -1;
                }
                if(self.w1>45&&dir==-1){
                    self.w1 -= 1;
                    self.w2 += 1;
                }
                else{
                    self.w1 += 1;
                    self.w2 -= 1;
                }
                self.container.line_left.style.width = self.w1 +'%';
                self.container.line_right.style.width = self.w2 +'%';
            },100);
        },
        add: function () {
            var self = this;
            setTimeout(function () {
                self.container.consume_left.classList.add('add');
                self.remove(self.container.consume_left);
                self.container.consume_right.classList.add('add');
                self.remove(self.container.consume_right);
            },2000);
        },
        remove: function(o) {
            var t = this;
            var transitionEvent = CommonJS.WhichTransitionEvent('animation');
            transitionEvent && o.addEventListener(transitionEvent, function() {
                    o.classList.remove('add');
                    t.add();
                });
        },
        end: function (opt) {

            this.punishmented = false;
            this.w1 = 50;
            this.w2 = 50;
            this.finish = true;
            this.container.body.parentNode.removeChild(this.container.body);
            if(opt.score[0]>opt.score[1]){
                //sucess
                this.result(1);
            }
            else if(opt.score[0]==opt.score[1]){
                //eq
                this.result(2);
            }
            else{
                //fail
                this.result(3);
            }
        },
        result: function (i) {
            var mask = document.createElement('div');
            mask.className = 'punishment-mask';
            document.getElementsByTagName('body')[0].appendChild(mask);
            var img = document.createElement('img');
            switch (i){
                case 1:
                    img.src = './images/punishment/sucess.png';
                    break;
                case 2:
                    img.src = './images/punishment/eq.png';
                    break;
                case 3:
                    img.src = './images/punishment/fail.png';
                    break;
            }
            mask.appendChild(img);
            
            mask.onclick = function () {
                mask.parentNode.removeChild(mask);
            }
        },
        toTime:function (t) {
            var t = parseInt(t),h = 0,m = 0,s = 0;
            h = Math.floor(t/60/60);
            m = Math.floor(t/60)%60;
            s = t%60;
            h = h>0?(h>9?h:'0'+h):0;
            m = m>0?(m>9?m:'0'+m):'00';
            s = s>0?(s>9?s:'0'+s):'00';
            return m + ":" + s;
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

var myPunishment = new Punishment();

var myDialog = new Dialog();

/*
 * 监听同层播放器
 * 进入同层播放器 需重置视频大小为设备宽高度
 * 同层播放器视频随设备旋转 需监听resize重设宽高度
 * 退出同层播放器 释放宽高度为默认 显示播放按钮
 */
_x5enter = false;
var listenX5Video = function(){
    myVideo._video.addEventListener('x5videoenterfullscreen',function(){
        _x5enter = true;
        $('#video').addClass('vjs-x5');
        $('.main').addClass('x5');
    });
    myVideo._video.addEventListener('x5videoexitfullscreen',function(){
        _x5enter = false;
        $('#video').removeClass('vjs-x5');
        $('.main').removeClass('x5');
        myVideo._video.style.width = '100%';
        myVideo._video.style.height = '100%';
        if(!v._29s){
            playBtn.classList.add('paused');
        }
    });
};

window.addEventListener('resize',function(){
    myVideo._video.style['object-position'] = "50% 50%";
    if(_x5enter){
        myVideo._video.style.width = CommonJS.ScreenWidth() + 'px';
        myVideo._video.style.height = CommonJS.ScreenHeight() + 'px';
    }
    if(v._29s){
        _29sContent.style.width = 544/960*document.documentElement.clientHeight + 'px';
        $('.vjs-29sLeftSide-item a').css('width',document.documentElement.clientHeight/3*0.75+'px');
    }
},false);

$(document).delegate('.vjs-control-commentList a','click',function () {
    $(commentList).removeClass('show');
    sendComment($(this).text());
});

var downloadType = '';

$(document).delegate('.d1 .button','click',function () {
    CommonAPP.openApp();
});

$('.close').on('click',function () {
    $('.mask').removeClass('m-1');
});

if(CommonJS.GetQueryString('compatibleVersion') && CommonJS.GetQueryString('compatibleVersion')==1 || localStorage.compatibleVersion==1){
    localStorage.compatibleVersion == 1;
}

$(document).delegate('.downloadBtn','click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-播放页', '点击', '普通视频导量', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-播放页", "普通视频导量", "点击", 0, "download"]);
});

$(document).delegate('.vjs-29sRightSide-download','click',function () {
    CommonAPP.openApp();
    _hmt.push(['_trackEvent', '斗地主直播间-播放页', '点击', '29s导量', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-播放页", "29s导量", "点击", 0, "download"]);
});

$(document).delegate('.vjs-29sLeftSide a','click',function () {
    _hmt.push(['_trackEvent', '斗地主直播间-播放页', '点击', '推荐视频', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-播放页", "推荐视频", "点击", 0, "video"]);
});