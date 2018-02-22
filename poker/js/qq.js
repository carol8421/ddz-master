var v = {
    objectId: getQueryString('videoId'),
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

var qqvideo = document.getElementsByTagName('video')[0];
qqvideo.setAttribute('webkit-playsinline',true);
qqvideo.setAttribute('playsinline',true);
qqvideo.setAttribute('x-webkit-airplay',true);
if(GlobalFun.android&&isQQBrowser){
    qqvideo.setAttribute('x5-video-player-type','h5');
    qqvideo.setAttribute('x5-video-player-fullscreen',true);
    qqvideo.setAttribute('x5-video-orientation','landscape|portrait');
    qqvideo.setAttribute('x5-video-ignore-metadata',true);
}
alert(qqvideo)