var GIFT_NAME = ['记牌器×2','超级加倍×3','连胜符×3','道具包','得分加成×3'];
var userInfo = {
    activeTimes: 0, //领取次数
    type: 1, //奖品类型
    todayActive: false, //今天是否领取过
    codeList: [],
    dbWelfareActive: false, //是否领取过斗宝福利
    isVoted: false, //是否投票
    step: 0 //0=未确定 1=PK领奖 2=登录领奖
};

/*
 * 获取本地用户信息
 */
var getLocalUserInfo = function (callback) {
    $.ajax({
        url: mainUrl + signApiUrl.getInfo,
        type: "GET",
        data: {
            uin: uin
        },
        dataType: 'json',
        success: function (response) {
            console.log(response)
            if(response.code===0) {

                userInfo = {
                    activeTimes: response.data.today_info.received ? response.data.today_info.day : response.data.today_info.day - 1, //领取次数
                    type: response.data.today_info.received ? response.data.today_info.info.type : response.data.today_info.day,
                    todayActive: response.data.today_info.received, //今天是否领取过
                    codeList: response.data.last_7days_info,
                    dbWelfareActive: response.data.pk_video_prize,
                    isVoted: response.data.today_like_pk_video,
                    time: new Date(response.data.time*1000).Format('yyyyMMdd')
                };

                sessionStorage.setItem('pk_video_prize',userInfo.dbWelfareActive);

                for(var i=0;i<userInfo.activeTimes;i++){
                    $('.sign-home .block').eq(i).addClass('active');
                    if(i==2){
                        $('.sign-home .block').eq(i).addClass('cur_' + parseInt(userInfo.type + 1));
                    }
                }
                if(!userInfo.todayActive && userInfo.activeTimes != 3){
                    $('.sign-home .block').eq(userInfo.activeTimes).addClass('normal');
                }
                else{
                    $('.getGift').addClass('disable');
                    $('.getGift').addClass('normal');
                }

                $('.sign-record ul').empty();
                if(userInfo.codeList.length>0){
                    for(var i=0;i<userInfo.codeList.length;i++){
                        $('.sign-record ul').append('<li class="w2"><time>' + new Date(userInfo.codeList[i].time*1000).Format("yyyy/M/d hh:mm") + '</time><code>' + userInfo.codeList[i].cdkey + '</code><button class="copy" data-clipboard-text="' + userInfo.codeList[i].cdkey + '">复制</button></li>');
                    }
                }
                else{
                    $('.sign-record ul').append('<span>暂无记录</span>');
                }

                var clipboard = new Clipboard('.copy');

                clipboard.on('success', function(e) {
                    CommonJS.Toast('复制成功');
                });

                clipboard.on('error', function(e) {
                    CommonJS.Toast('长按兑换码选择复制');
                });

                callback ? callback() : function () {
                    
                };

            }
            else{
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            if(error.status !== 0) {
                CommonJS.Toast('用户初始化接口异常');
            }
            else{
                CommonJS.Toast('请刷新重试');
            }
        }
    });
};

var countDown = false;
if(new Date().getFullYear() === 2018 && new Date().getMonth() === 0 && !sessionStorage.getItem('opendiv')){
    if(new Date().getDate() === 17 || new Date().getDate() === 18 || new Date().getDate() === 19 || new Date().getDate() === 20 || new Date().getDate() === 26){
        countDown = true;
        var img = document.createElement('img');
        img.alt = '倒计时';
        switch (new Date().getDate()){
            case 17:
                img.src = './images/open/l-3.png';
                break;
            case 18:
                img.src = './images/open/l-2.png';
                break;
            case 19:
                img.src = './images/open/l-1.png';
                break;
            case 20:
                img.src = './images/open/l-0.png';
                break;
            case 26:
                img.src = './images/open/5.png';
                break;
        }
        document.getElementsByClassName('opendiv')[0].appendChild(img);
        sessionStorage.setItem('opendiv',true);
    }
}
if(uin){
    getLocalUserInfo(function () {

        if(userInfo.dbWelfareActive === 1){
            $('.signBtn').addClass('icon-get');
            !countDown && $('.pk-box').show();
        }
        else if(!userInfo.todayActive){
            $('.signBtn').addClass('icon-login');
            !countDown && $('.sign-home').show();
        }
        
        if(countDown){
            $('.sign').show();
            $('.opendiv').show();
            $('.sign-aside').addClass('show');
        }
        else{
            if(CommonJS.getCookie('ddz_login_'+userInfo.time+'_' + uin)) {
                $('.sign-aside').addClass('show');
            }
            else{
                $('.sign').show();
            }
        }

        CommonJS.setCookie('ddz_login_'+userInfo.time+'_' + uin, true, 1);
    });
}


/*
 * 获取短信验证码 - 获取图形验证码
 */
var msgSended = false;
var jsCreated = false;
var getSend = function (phpne) {
    var capOption = {callback:cbfn, showHeader:true};
    capInit(document.getElementById("TCaptcha"), capOption);
    document.getElementById("TCaptcha").style.display = 'block';
    //回调函数：验证码页面关闭时回调
    function cbfn(retJson) {
        document.getElementById("TCaptcha").style.display = 'none';
        if (retJson.ret == 0) {
            // 用户验证成功
            getMsg(retJson.ticket,phpne);
        }
        else {
            CommonJS.Toast('验证失败');
            msgSended = false
        }
    }
};

$('.getCode').on('click',function () {
    if(msgSended) {
        return;
    }
    var phone = document.getElementById('phone');
    if(phone.value == null || phone.value == '' || !(/^1[3|4|5|7|8]\d{9}$/.test(phone.value))){
        CommonJS.Toast('请输入正确的手机号码');
    }
    else {

        if(jsCreated){
            getSend(phone.value);
        }
        else{
            $.ajax({
                url: hostUrl + signApiUrl.getJsUrl,
                type: "GET",
                data: {
                    client_type: 1
                },
                dataType: 'json',
                beforeSend: function () {
                    msgSended = true;
                },
                success: function (response) {
                    if(response.code===0) {

                        CommonJS.CreateScript(response.data.url,function () {
                            jsCreated = true;
                            getSend(phone.value);
                        });
                    }
                    else{
                        CommonJS.Toast(response.msg);
                        msgSended = false
                    }

                },
                error: function (error) {
                    if(error.status !== 0) {
                        CommonJS.Toast('获取验证码JS接口异常');
                    }
                    else{
                        CommonJS.Toast('请刷新重试');
                    }
                    msgSended = false;
                }
            });
        }

    }
});

/*
 * 获取短信验证码 - 获取短信
 */
function getMsg(ticket,phonenum) {
    $.ajax({
        url: hostUrl + signApiUrl.getMsg,
        type: "GET",
        data: {
            ticket: ticket,
            phonenum: phonenum

        },
        dataType: 'json',
        success: function (response) {
            if(response.code===0) {
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
            if(error.status !== 0) {
                CommonJS.Toast('获取短信接口异常');
            }
            else{
                CommonJS.Toast('请刷新重试');
            }
            msgSended = false;
        }
    });
}

/*
 * 登录
 */
var fromButton = 1;
$('.login').on('click',function () {
    var phone = document.getElementById('phone');
    var msgCode = document.getElementById('msgCode');

    if(!uin){
        CommonJS.Toast('请前往斗地主直播间登录领取');
    }
    else if(phone.value == null || phone.value == '' || !(/^1[3|4|5|7|8]\d{9}$/.test(phone.value))){
        CommonJS.Toast('请输入正确的手机号码');
    }
    else if(msgCode.value == null || msgCode.value == ''){
        CommonJS.Toast('请输入短信验证码');
    }
    else {
        $.ajax({
            url: mainUrl + signApiUrl.login,
            type: "GET",
            data: {
                uin: uin,
                phone: phone.value,
                captcha: msgCode.value

            },
            dataType: 'json',
            success: function (response) {
                if(response.code===0) {

                    //返回TOKEN
                    var user = new Object();
                    user.uin = uin;
                    user.TOKEN = response.data.token;
                    TOKEN = user.TOKEN;
                    var localUser = [];
                    if(localStorage.user!=undefined && localStorage.user!='undefined' && localStorage.user){
                        localUser = JSON.parse(localStorage.user);
                    }
                    localUser.push(user);
                    localStorage.user = JSON.stringify(localUser);

                    $('.sign-login').hide();

                    if(fromButton === 1){
                        getGiftB();
                    }
                    else{
                        getLocalUserInfo(function () {
                            getGift();
                        });
                    }

                }
                else{
                    CommonJS.Toast(response.msg);
                }

            },
            error: function (error) {
                if(error.status !== 0) {
                    CommonJS.Toast('登录接口异常');
                }
                else{
                    CommonJS.Toast('请刷新重试');
                }
            }
        });
    }
});

 /*
  * 获取礼品
  */
var getGift = function () {
    $.ajax({
        url: mainUrl + signApiUrl.sign,
        type: "GET",
        data: {
            uin: uin,
            token: TOKEN
        },
        dataType: 'json',
        success: function (response) {
            if(response.code===0) {

                userInfo.activeTimes = userInfo.activeTimes + 1;
                userInfo.type = response.data.cdkey_type;
                userInfo.todayActive = true;
                userInfo.code = response.data.cdkey;
                userInfo.step = 1;

                $('.sign').show();
                $('.sign-home').hide();

                $('.sign .main-page.sign-home .sMain .block').eq(userInfo.activeTimes-1).removeClass('normal').addClass('active');
                if(userInfo.activeTimes == 3){
                    $('.sign .main-page.sign-home .sMain .block').eq(userInfo.activeTimes-1).addClass('cur_' + parseInt(userInfo.type + 1));
                }
                $('.getGift').addClass('disable');

                var html = '';
                html += '<div class="gift"><i style="background-image: url(./images/sign/g-' + userInfo.type + '.png)"></i><p>' + GIFT_NAME[userInfo.type-1] + '</p></div><code><span>' + userInfo.code + '</span>';
                html += '<button class="copy" data-clipboard-text="' + userInfo.code + '">复制</button></code><p>点击复制兑换码，在直播大厅“cdkey兑换”中兑换</p>';

                if(userInfo.codeList.length==0){
                    $('.sign-record ul span').remove();
                }
                $('.sign-record ul').prepend('<li class="w2"><time>' + new Date().Format("yyyy/M/d hh:mm") + '</time><code>' + userInfo.code + '</code><button class="copy" data-clipboard-text="' + userInfo.code + '">复制</button></li>');

                if(!userInfo.todayActive && userInfo.activeTimes != 3){
                    $('.sign-home .block').eq(userInfo.activeTimes).addClass('normal');
                }

                if($('.sign-box .gift')){
                    $('.sign-box .gift,.sign-box code,.sign-box p').remove();
                }
                $('.sign-box .light').after(html);

                $('.sign-box').show();

                $('.signBtn').removeClass('icon-login');

                var clipboard = new Clipboard('.copy');

                clipboard.on('success', function(e) {
                    CommonJS.Toast('复制成功');
                });

                clipboard.on('error', function(e) {
                    CommonJS.Toast('长按兑换码选择复制');
                });

                _hmt.push(['_trackEvent', '斗地主直播间-首页', '成功领取', '登录奖励', 1]);
                _czc.push(["_trackEvent", "斗地主直播间-首页", "登录奖励", "成功领取", 0, "gift"]);

            }
            else if(response.code == 100005 || response.code == 100008 ||  response.code == 20000 || response.code == 20003 || response.code == 20006) {
                $('.sign-home').hide();
                $('.sign-login').show();

                var localUser = JSON.parse(localStorage.user);
                for(var key in localUser){
                    if(localUser[key].TOKEN == TOKEN) {
                        localUser.splice(key,1);
                    }
                }
                localStorage.user = JSON.stringify(localUser);
            }
            else{
                CommonJS.Toast(response.msg);
            }

        },
        error: function (error) {
            if(error.status !== 0) {
                CommonJS.Toast('登录领奖接口异常');
            }
            else{
                CommonJS.Toast('请刷新重试');
            }
        }
    });
};
$('.getGift').on('click',function () {
    fromButton = 2;
    if($(this).hasClass('disable')){
        CommonJS.Toast('今日已领取');
        return;
    }
    if(!uin){
        CommonJS.Toast('请前往斗地主直播间登录领取');
    }
    else if(TOKEN == null || TOKEN == ''){

        $('.sign-home').hide();
        $('.sign,.sign-login').show();

    }
    else {
        getGift();
    }

    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '登录领取', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "登录领取", "点击", 0, "getGift"]);
});

/*
 * 查看兑换记录
 */
$('.getRecord').on('click',function () {
    $('.sign-home').hide();
    $('.sign-record').show();
});

/*
 * 关闭
 */
$('.close').on('click',function () {
    if($(this).hasClass('back') && userInfo.step === 2){
        $('.global-box').hide();
        $('.sign-home').show();
    }
    else{
        $('.sign, .global-box').hide();
        $('.sign-aside').addClass('show');
    }
});

$('.signBtn').on('click',function () {
    if($(this).hasClass('icon-get')) {
        $('.sign, .pk-box').show();
        $('.sign-aside').removeClass('show');
        _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '领取奖励', 1]);
        _czc.push(["_trackEvent", "斗地主直播间-首页", "领取奖励", "点击", 0, "signBtn"]);
    }
    else if($(this).hasClass('icon-login')){
        $('.sign, .sign-home').show();
        $('.sign-aside').removeClass('show');
        _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '登录有礼', 1]);
        _czc.push(["_trackEvent", "斗地主直播间-首页", "登录有礼", "点击", 0, "signBtn"]);
    }
    else{
        $('.sign, .sign-record').show();
        $('.sign-aside').removeClass('show');
        _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', '查看奖励', 1]);
        _czc.push(["_trackEvent", "斗地主直播间-首页", "查看奖励", "点击", 0, "signBtn"]);
    }
});

$('.sign-aside .close').on('click',function () {
    $('.sign-aside').removeClass('show');
});