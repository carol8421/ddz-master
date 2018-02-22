/**
 * Created by guohamy on 2017/10/30.
 */

var uin = CommonJS.GetQueryString('uin') ?  CommonJS.GetQueryString('uin') : sessionStorage.getItem('ddz_uin');
uin = uin ? uin.replace('o','') : false;
var prizeList = [1,2,3,4]; //默认奖品列表
var countTime = 60; //倒计时时长
var waitTimes = 60; //等待时长

var hostUrl = window.location.href.match(/web.ddz.dasheng.tv/) ? 'https://api.dasheng.tv:4431' : 'https://api.ttt.dasheng.tv:4433';
var prizeListUrl = '/v1/activity/ddz-angel-prize/get-prize-list'; //初始化
var reportUrl = '/v1/activity/ddz-angel-prize/count-down'; //报告时长
var getPrizeUrl = '/v1/activity/ddz-angel-prize/prize'; //获取奖品
var getCaptcha = '/v1/user/auth/captcha'; //获取短信验证码
var login = '/v1/activity/auth/login'; //用户登录

var prize_id = 0;
var isGet = false;

var getPrizeList = function () {

    $.ajax({
        url: hostUrl + prizeListUrl,
        type: "GET",
        headers:{
            "token": localStorage.tsawz_token
        },
        dataType: 'json',
        success: function (response) {

            if(response.code == 0 ){
                if(response.data['switch'] == 1 ){

                    prizeList = response.data.list ? response.data.list : prizeList;
                    prizeQueue = prizeList.slice();

                    document.getElementById('video').appendChild(countDown);
                    showPrizeList(countDown);
                }
                else{
                    if(!v._29s){
                        subTitle.appendChild(liveDownloadBtn);
                    }
                }
            }
            else{
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            CommonJS.Toast(error);
        }
    });

};

//展示信息
var countDownGift = null, countDownTime = null;
var showPrizeList = function (o) {

    isGet = false;
    jumpWait = false;

    if(prizeQueue.length ==0 ){
        prizeQueue = prizeList.slice();
    }

    prize_id = prizeQueue.shift();
    if(!countDownGift){
        countDownGift = document.createElement('div');
        o.appendChild(countDownGift);
    }
    countDown.classList.add('disable');
    countDownGift.className = 'countDownGift g_' + prize_id;

    if(!countDownTime){
        countDownTime = document.createElement('time');
        o.appendChild(countDownTime);
    }

    report(prize_id);

    var times = countTime;
    countDownTime.innerHTML = '<strong>' +times + '</strong>秒可领取';

    var t = setInterval(function () {
        if(times>0){
            times--;
            countDownTime.innerHTML = '<strong>' +times + '</strong>秒后领取';
        }
        else{
            countDown.classList.remove('disable');
            countDownTime.innerHTML = '<strong>可领取</strong>';
            isGet = true;
            wait();
            clearInterval(t);
        }
    },1000);
};

// 等待计时
var jumpWait = false;
var wait = function () {
    var times = waitTimes;
    var t = setInterval(function () {
        times--;
        if(times<=0 || jumpWait){
            if(prizeList.length!=0){
                showPrizeList(countDown);
            }
            else{
                countDown.parentNode.removeChild(countDown);
            }
            clearInterval(t);
        }
    },1000);
};

// 报告时长
var report = function (prize_id) {
    $.ajax({
        url: hostUrl + reportUrl,
        type: "GET",
        data: {
            uin: uin,
            prize_id: prize_id
        },
        dataType: 'json',
        success: function (response) {
            if(response.code != 0) {
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            CommonJS.Toast(error);
        }
    });
};

countDown.onclick = function () {
    if(!isGet){
        return;
    }
    getPrize();
};

//领奖
var getPrize = function () {
    if(localStorage.tsawz_phone!=undefined && localStorage.tsawz_phone!='undefined' &&localStorage.tsawz_phone){
        $.ajax({
            url: hostUrl + getPrizeUrl,
            type: "GET",
            data: {
                prize_type: prize_id,
                uin: uin
            },
            headers:{
                "token": localStorage.tsawz_TOKEN
            },
            dataType: 'json',
            success: function (response) {
                if(response.code == 0){

                    for(var i=0;i<prizeList.length;i++){
                        if(prizeList[i] == prize_id){
                            prizeList.splice(i,1);
                        }
                    }
                    jumpWait = true;

                    $('.box code').html(localStorage.tsawz_phone);
                    $('.box').addClass('show');
                }
                else{
                    if(response.code == 20003 || response.code == 20006 || response.code == 20000) {
                        $('.login').addClass('show');
                    }
                    else{
                        CommonJS.Toast(response.msg);
                    }
                }
            },
            error: function (error) {
                CommonJS.Toast(error);
            }
        });
    }
    else{
        $('.login').addClass('show');
    }
};

//获取短信验证码
var sendedMsg = false;
$('.getCode').on('click',function () {
    if(sendedMsg){
        return;
    }

    var phone = document.getElementById('phone').value;
    $.ajax({
        url: hostUrl + getCaptcha,
        type: "GET",
        data: {
            phonenum: phone
        },
        dataType: 'json',
        beforeSend: function () {
            sendedMsg = true;
        },
        success: function (response) {
            if(response.code == 0) {

                CommonJS.Toast('请注意查收短信');

                var times = 60;
                var t = setInterval(function (){
                    if(times<=0){
                        sendedMsg = false;
                        $('.getCode').html('重新发送');
                        clearInterval(t);
                    }
                    else{
                        times -= 1;
                        $('.getCode').html('重新发送(' + times + ')');
                    }
                },1000)

            }
            else{
                sendedMsg = false;
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            sendedMsg = false;
            CommonJS.Toast(error);
        }
    });

});

//登录
var loginClick = false;
$('.loginBtn').on('click',function () {
    if(loginClick){
        return;
    }

    var phone = document.getElementById('phone').value;
    var code = document.getElementById('code').value;
    $.ajax({
        url: hostUrl + login,
        type: "POST",
        data: {
            phonenum: phone,
            phone_captcha: code
        },
        dataType: 'json',
        beforeSend: function () {
            loginClick = true;
        },
        success: function (response) {
            if(response.code == 0) {
                localStorage.tsawz_TOKEN = response.data.token;
                localStorage.tsawz_phone = phone;
                $('.login').hide();
                CommonJS.Toast('登录成功！',2000);
            }
            if(response.code == 20006){
                loginClick = false;
                CommonJS.Toast('亲，你还没有注册哦，请点击 ↓',3000);
            }
            else{
                loginClick = false;
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            loginClick = false;
            CommonJS.Toast(error);
        }
    });

});

//注册,下载
$('.registerBtn, .download').on('click',function () {
    CommonAPP.openApp();
});

//关闭登录框
$('.login .close').on('click',function () {
    $('.login').removeClass('show');
});

//关闭领取成功提示框
$('.box .close').on('click',function () {
    $('.box').removeClass('show');
});

if(uin){
    getPrizeList();
}