RongIMClient.init(appKey);
var token = v.im_token;
var conversationtype = RongIMLib.ConversationType.CHATROOM;
var chatroomId = v.objectId;
var random = Math.floor(Math.random()*900000 + 100000);
var sendTimes = 0;
var cookie_nickname = sessionStorage.getItem('Nick')!=null&&sessionStorage.getItem('Nick')!=''?sessionStorage.getItem('Nick'):false;
var cookie_avatar = sessionStorage.getItem('HeadURL')!=null?sessionStorage.getItem('HeadURL'):false;
var times = 0;//经历时间
var localUid = null;

var merit = function (x,y) {
    return x != 'undefined' && x != null && x != '' ? x : y;
};

var connectError = function (t) {
    CommonJS.Toast(t);
};

var AbnormalMode = function () {
    pgc.parentNode.removeChild(pgc);
    giftContainer.parentNode.removeChild(giftContainer);
    zanContainer.parentNode.removeChild(zanContainer);
    dmContainer.parentNode.removeChild(dmContainer);
};

// 连接融云服务器。
RongIMClient.connect(token, {
    onSuccess: function(userId) {
        localUid = userId;
        console.log("Login successfully." + userId);
        RongIMClient.getInstance().joinChatRoom(chatroomId, 0, {
            onSuccess: function() {
                //console.log();
                // 加入聊天室成功。
            },
            onError: function(error) {
                console.log(error);
                // 加入聊天室失败
            }
        });
    },
    onTokenIncorrect: function() {
        console.log('token无效');
        debugMsg = 'token无效';
        AbnormalMode();
    },
    onError: function(errorCode) {
        var info = '';
        switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误';
            break;
        case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
            info = '不可接受的协议版本';
            break;
        case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
            info = 'appkey不正确';
            break;
        case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
            info = '服务器不可用';
            break;
        }
        console.log(errorCode);
        debugMsg = info;
    }
});

// 设置连接监听状态 （ status 标识当前连接状态）
// 连接状态监听器
RongIMClient.setConnectionStatusListener({
    onChanged: function(status) {
        switch (status) {
            //链接成功
            case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功');
                break;
            //正在链接
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接');
                break;
            //重新链接
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                connectError('IM已断开连接');
                AbnormalMode();
                break;
            //其他设备登录
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登录');
                connectError('其他设备登录');
                AbnormalMode();
                break;
            //网络不可用
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log('网络不可用');
                connectError('网络不可用');
                AbnormalMode();
                break;
        }
    }
});
// 消息监听器
RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function(message){
        // 判断消息类型
        switch(message.messageType){
            case RongIMClient.MessageType.TextMessage:
                // 发送的消息内容将会被打印
                addMsg(message);
                break;
            default:
                // 自定义消息
                // do something...
        }
    }
});

var isset = function (x) {
    if(typeof(x)!=undefined&&x!=undefined&&x!='undefined'&&x!=''&&x!=null){
        return true;
    }
    return false;
};

var compontentData = {
    vote: function (data) {
        var opt = {
            vote_option: isset(data.vote_data.vote_option) ? data.vote_data.vote_option : 0,
            name: isset(data.vote_data.name) ? data.vote_data.name : 0,
            top_user: isset(data.top_user) ? data.top_user : [],
            count_down: isset(data.vote_data.count_down) ? data.vote_data.count_down : 0,
            vote_id: isset(data.vote_data.vote_id) ? parseInt(data.vote_data.vote_id) : 0,
            vote_type: isset(data.vote_data.vote_type) ? parseInt(data.vote_data.vote_type) : 0,
            ans_option_id: isset(data.vote_data.ans_option_id) ? data.vote_data.ans_option_id : 0,
            result: isset(data.result_data.result) ? data.result_data.result : 0,
            status: isset(data.result_data.status) ? data.result_data.status : 0,
        };
        myVote.init(pgc,opt);
    },
    punishment: function (data) {
        console.log(data)
        var opt = {
            status: data.status,
            punishment_id: parseInt(data.punish_id),
            title: data.title,
            user: {
                u1: {
                    nick: data.extra_data.result_data[0].nickname,
                    total: data.extra_data.result_data[0].top_count
                },
                u2: {
                    nick: data.extra_data.result_data[1].nickname,
                    total: data.extra_data.result_data[1].top_count
                }
            },
            count_down: data.extra_data.count_down,
            score: isset(data.score) ? data.score : [0,0]
        };
        console.log(opt)
        myPunishment.init(pgc,opt);
    },
    lottery: function (data) {
        var opt = {
            type: isset(data.lottery_data.type) ? data.lottery_data.type : 0,
            lottery_id: isset(data.lottery_data.lottery_id) ? parseInt(data.lottery_data.lottery_id) : 0,
            title: isset(data.lottery_data.title) ? data.lottery_data.title : 0,
            stages: isset(data.lottery_data.stages) ? parseInt(data.lottery_data.stages) : 0,
            price: isset(data.lottery_data.price) ? data.lottery_data.price : 0,
            result_data: !$.isEmptyObject(data.result_data) ? data.result_data : false
        };
        myLottery.init(pgc,opt);
    }
};

//聊天页面增加一条消息
function addMsg(msg) {

    var msg_obj = typeof(msg.content.content) == 'string' ? JSON.parse(msg.content.content) : msg.content.content;

    //业务可以自定义设置消息的显示样式
    switch (msg_obj.type) {
        case 1:
            var nickname = merit(msg_obj.data.nick,'游客' + random);
            var msg_text = merit(msg_obj.data.text,'支持一下~');
            msg_text = msg_text.replace(/[<>&"]/g, function(c) {
                return {
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                    '"': '&quot;'
                } [c];
            });
            var regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
            var regsite = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if(regex.test(msg_text)||regsite.test(msg_text)){
                msg_text = '支持一下~';
            }
            else{
                msg_text = msg_text.replace(/共产党/g,function(str){
                    var result='';
                    for(var i=0;i<str.length;i++){
                        result+='*';
                    }
                    return result;
                });
            }
            myDanmu.addDanmu(msg_text, nickname);
            break;
        case 2:
            /* 进来了 */
            break;
        case 3:
            /* 离开 */
            break;
        case 4:
            myZan.init();
            break;
        case 101:
            myPlayer.pause();
            break;
        case 52:
            /*送礼*/
            /*var nickname = merit(msg_obj.data.from_user.nick,'游客' + random);
            var headUrl = merit(msg_obj.data.from_user.photo_url,'./share.png');
            var opt = {
                avatar: headUrl,
                name: nickname,
                bundleNum: msg_obj.data.bundle_num,
                giftName: v.gift_list[msg_obj.data.gift_id].gift_name,
                giftImage: v.gift_list[msg_obj.data.gift_id].im_url,
                giftImageGifUrl: v.gift_list[msg_obj.data.gift_id].gif_url,
                type: v.gift_list[msg_obj.data.gift_id].combo != 1 ? 'fill': 'normal',
                uid: msg_obj.data.gift_id,
                num: msg_obj.data.add_combo + msg_obj.data.combo_start
            };*/
            //myGift.addGift(opt);
            break;
        case 200:
            //开始投票
        case 201:
            //投票更新
        case 209:
            //投票结果
            compontentData.vote(msg_obj.data);
            break;
        case 231:
            //惩罚开始
        case 232:
            //惩罚更新
        case 234:
            //惩罚结束
            compontentData.punishment(msg_obj.data);
            break;
        case 226:
            //开始抽奖
        case 221:
            //同步抽奖
        case 222:
            //抽奖结果
        case 227:
            //关闭抽奖
            compontentData.lottery(msg_obj.data);
            break;
        case 1010:
            // 宝箱开启
            break;
        default:
            break;
    }
}

function onSendMsg(msg) {
    RongIMClient.getInstance().sendMessage(conversationtype, chatroomId, msg, {
        onSuccess: function(message) {
            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            addMsg(message);
            $('#send_msg_text').val('');
            //console.log("Send successfully", t);
        },
        onError: function(errorCode, message) {
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                    info = '在黑名单中，无法向对方发送消息';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                    info = '不在讨论组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                    info = '不在群组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                    info = '不在聊天室中';
                    break;
                default:
                    info = errorCode;
                    break;
            }
            console.log('发送失败:' + info);
        }
    });
}

function sendMsg(text) {
    //获取消息内容
    var origin_txt = text;
    var msgtosend = origin_txt.replace(/[<>&"]/g, function(c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }[c];
    });
    if (msgtosend.length < 1) {
        return;
    }
    var _nickname = merit(cookie_nickname,'斗地主用户'+ random);
    _nickname = _nickname.replace(/[<>&"]/g, function(c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        } [c];
    });
    var _avatar = merit(cookie_avatar,'https://web.ddz.dasheng.tv/images/hall/share.png');
    var msg_body = {
        type: 1,
        data: {
            uid: 1,
            nick: _nickname,
            photo_url: _avatar,
            text: msgtosend
        }
    };
    msgtosend = JSON.stringify(msg_body);

    var msg = new RongIMLib.TextMessage({
        content: msgtosend
    });
    onSendMsg(msg);
}

var forbidStart = false;
function sendComment(text){
    if(text==null||text==''){
        return false;
    }
    if(sendTimes==0){
        timing = true;
    }

    if(sendTimes>=3&&times<=10000){
        if(!forbidStart){
            times = 0;
            forbidStart = true;
        }
        $(commentList).removeClass('show');
        CommonJS.Toast('刷屏的不是乖宝宝，歇 '+Math.ceil((10000-times)/1000)+' 秒吧~');
    }
    else{
        sendTimes++;
        sendMsg(text);
    }
}
var timing = false;//计时开始
setInterval(function(){
    if(!timing){
        return;
    }
    times += 33;
    if(times>=10000){
        sendTimes = times = 0;
        timing = forbidStart = false;
    }
    tipsed = false;
},33);

var tomatoForbidStart = false;
function sendTomato(text){
    if(text==null||text==''){
        return false;
    }
    if(tomatoSendTimes==0){
        tomatoTiming = true;
    }

    if(tomatoSendTimes>=3&&tomatoTimes<=15000){
        if(!tomatoForbidStart){
            tomatoForbidStart = true;
            tomatoTimes = 0;
        }
        CommonJS.Toast('是有多大的仇，歇 '+Math.ceil((15000-tomatoTimes)/1000)+' 秒吧~');

    }
    else{
        tomatoSendTimes++;

        tomato.classList.add('show');
        tomatoFinish = false;
        var transitionEvent = CommonJS.WhichTransitionEvent('animation');
        if(transitionEvent){
            tomato.addEventListener(transitionEvent, function() {
                tomato.classList.remove('show');
                tomatoFinish = true;
            });
        }

        //sendMsg(text,true);
    }
}
var tomatoTiming = false;//计时开始
var tomatoTimes = 0;
var tomatoSendTimes = 0;
setInterval(function(){
    if(!tomatoTiming){
        return;
    }
    tomatoTimes += 33;
    if(tomatoTimes>=15000){
        tomatoSendTimes = tomatoTimes = 0;
        tomatoTiming = tomatoForbidStart =false;
    }
},33);

function zan() {
    var msg_body = {
        type: 4,
        data: {
            color_index: Math.floor(Math.random()*7) + 1
        }
    };

    var msgtosend = JSON.stringify(msg_body);
    var msg = new RongIMLib.TextMessage({
        content: msgtosend
    });
    onSendMsg(msg);
}