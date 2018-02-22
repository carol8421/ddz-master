var appKey = 'p5tvi9dstt364';
RongIMClient.init(appKey);
var token = v.im_token;
var conversationtype = RongIMLib.ConversationType.CHATROOM;
var chatroomId = v.objectId;
var random = Math.floor(Math.random()*900000 + 100000);
var sendTimes = 0;
var cookie_nickname = decodeURI(localStorage.Nick) || getQueryString('Nick');
var cookie_avatar = getQueryString('avatar');
var times = 0;//经历时间
var localUid = null;

var merit = function (x,y) {
    return x != 'undefined' && x != null && x != '' ? x : y;
};

var connectError = function (t) {
    tips(t);
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
            var nickname = merit(msg_obj.data.from_user.nick,'游客' + random);
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
            };
            //myGift.addGift(opt);
            break;
        case 200:
            //开始投票
            if(msg_obj._attachment.show.name=='vote'){
                var opt = {
                    vote_option: msg_obj._attachment.vote_data.vote_option,
                    name: msg_obj._attachment.vote_data.name,
                    top_user: msg_obj._attachment.top_user,
                    count_down: msg_obj._attachment.vote_data.count_down,
                    vote_id: parseInt(msg_obj._attachment.vote_data.vote_id),
                    vote_type: parseInt(msg_obj._attachment.vote_data.vote_type)
                }
                //myVote.init(pgc,opt);
            }
            //开始抽奖
            if(msg_obj._attachment.show.name=='lottery'){
                var opt = {
                    type: msg_obj._attachment.lottery_data.type,
                    lottery_id: parseInt(msg_obj._attachment.lottery_data.lottery_id),
                    title: msg_obj._attachment.lottery_data.title,
                    stages: parseInt(msg_obj._attachment.lottery_data.stages),
                    price: msg_obj._attachment.lottery_data.price,
                    result_data: !$.isEmptyObject(msg_obj._attachment.result_data) ? msg_obj._attachment.result_data : false
                };
                //myLottery.init(pgc,opt);
            }
            break;
        case 201:
            //投票更新
            if(msg_obj._attachment.show.name=='vote'){
                var opt = {
                    vote_option: msg_obj._attachment.vote_data.vote_option,
                    name: msg_obj._attachment.vote_data.name,
                    top_user: msg_obj._attachment.top_user,
                    count_down: msg_obj._attachment.vote_data.count_down
                }
                //myVote.init(pgc,opt);
            }
            //抽奖更新
            if(msg_obj._attachment.show.name=='lottery'){
                var opt = {
                    type: msg_obj._attachment.lottery_data.type,
                    lottery_id: parseInt(msg_obj._attachment.lottery_data.lottery_id),
                    title: msg_obj._attachment.lottery_data.title,
                    stages: parseInt(msg_obj._attachment.lottery_data.stages),
                    price: msg_obj._attachment.lottery_data.price,
                    result_data: !$.isEmptyObject(msg_obj._attachment.result_data) ? msg_obj._attachment.result_data : false
                };
                //myLottery.init(pgc,opt);
            }
            break;
        case 205:
            //投票结果
            if(msg_obj._attachment.show.name=='vote'){
                var opt = {
                    vote_option: msg_obj._attachment.vote_data.vote_option,
                    name: msg_obj._attachment.vote_data.name,
                    top_user: msg_obj._attachment.top_user,
                    count_down: msg_obj._attachment.vote_data.count_down,
                    ans_option_id: msg_obj._attachment.vote_data.ans_option_id,
                    result: msg_obj._attachment.result_data.result
                }
                //myVote.end(opt);
            }
            //开始抽奖
            if(msg_obj._attachment.show.name=='lottery'){
                var opt = {
                    type: msg_obj._attachment.lottery_data.type,
                    lottery_id: parseInt(msg_obj._attachment.lottery_data.lottery_id),
                    title: msg_obj._attachment.lottery_data.title,
                    stages: parseInt(msg_obj._attachment.lottery_data.stages),
                    price: msg_obj._attachment.lottery_data.price,
                    result_data: !$.isEmptyObject(msg_obj._attachment.result_data) ? msg_obj._attachment.result_data : false
                };
                //myLottery.init(pgc,opt);
            }
            break;
        case 207:
            //关闭抽奖
            if(msg_obj._attachment.show.name=='lottery'){
                //myLottery.close();
            }
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

function sendMsg() {
    //获取消息内容
    var origin_txt = $('#send_msg_text').val();
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
    var _nickname = merit(cookie_nickname,'天天德州用户'+ random);
    _nickname = _nickname.replace(/[<>&"]/g, function(c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        } [c];
    });
    var _avatar = merit(cookie_avatar,'https://web.ttdz.dasheng.tv/images/hall/share.png');
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

function sendComment(){
    if($('#send_msg_text').val()==null||$('#send_msg_text').val()==''){
        return false;
    }
    if(sendTimes==0){
        timing = true;
    }

    if(sendTimes>=3&&times<10000){
        times = 0;
        forbidStart = true;
        tips('刷屏的不是乖宝宝，歇会吧~');
    }
    else{
        sendTimes++;
        sendMsg();
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
        timing = false;
    }
    tipsed = false;
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