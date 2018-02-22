/**
 * Created by guohamy on 2017/11/14.
 */
//投票
var vote = function (id,position) {
    $.ajax({
        url: mainUrl + pkApiUrl.vote,
        type: "GET",
        data: {
            video_id: id,
            uin: uin
        },
        dataType: 'json',
        success: function (response) {
            if(response.code === 0){

                $('._pk-proportion dl dt').show();
                $('[data-id='+ id +']').append('<b class="add"></b>');
                var voteNum = parseInt($('._pk-proportion dl dt').eq(parseInt(position)).text());
                $('._pk-proportion dl dt').eq(parseInt(position)).text(voteNum + 1);
                var proportion = parseInt($('._pk-proportion dl dt').eq(0).text()) / (parseInt($('._pk-proportion dl dt').eq(0).text()) + parseInt($('._pk-proportion dl dt').eq(1).text())) * 100 + '%';
                $('._pk-proportion-line').css({
                    width: proportion
                });
            }
            else{
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            if(error.status !== 0) {
                CommonJS.Toast('点赞接口异常');
            }
            else{
                CommonJS.Toast('请刷新重试');
            }
        }
    });
};

$(document).delegate('._pk-control','click',function() {
    vote($(this).attr('data-id'),$(this).data('position'));
});

//领取奖励
var getGiftB = function () {
    $.ajax({
        url: mainUrl + pkApiUrl.getGift,
        type: "GET",
        data: {
            uin: uin,
            token: TOKEN
        },
        dataType: 'json',
        success: function (response) {
            if(response.code === 0){

                userInfo.step = 2;

                $('.pk-box').hide();

                var codeList = response.data.cdkey;

                var html = '';
                html += '<div class="gift" style="width: 3.3rem"><i style="background-image: url(./images/sign/g-4.png)"></i><p style="font-size: 0.2rem">记牌器×2,连胜符×3,超级加倍×3</p></div>';

                for(var i=0;i<codeList.length;i++){
                    if(i<codeList.length-1){
                        html += '<code style="margin-bottom: 0.1rem">';
                    }
                    else{
                        html += '<code>';
                    }
                    html += '<span>' + codeList[i].cdkey  + '</span>';
                    //if(CommonAPP.android){
                        html += '<button class="copy" data-clipboard-text="' + codeList[i].cdkey  + '">复制</button>'
                    //}
                    html += '</code>';
                }
                html += '<p>点击复制兑换码，在直播大厅“cdkey兑换”中兑换</p>';

                if(userInfo.codeList.length==0){
                    $('.sign-record ul span').remove();
                }

                for(var i=0;i<codeList.length;i++){
                    $('.sign-record ul').prepend('<li class="w2"><time>' + new Date().Format("yyyy/M/d hh:mm") + '</time><code>' + codeList[i].cdkey + '</code><a class="copy" data-clipboard-text="' + codeList[i].cdkey + '">复制</a></li>');
                }

                if($('.sign-box .gift')){
                    $('.sign-box .gift,.sign-box code,.sign-box p').remove();
                }
                $('.sign-box .light').after(html);

                $('.sign-box').show();

                userInfo.dbWelfareActive = true;
                $('.signBtn').removeClass('icon-get');

                var clipboard = new Clipboard('.copy');

                clipboard.on('success', function(e) {
                    CommonJS.Toast('复制成功');
                });

                clipboard.on('error', function(e) {
                    CommonJS.Toast('长按兑换码选择复制');
                });

                _hmt.push(['_trackEvent', '斗地主直播间-首页', '成功领取', 'PK奖励', 1]);
                _czc.push(["_trackEvent", "斗地主直播间-首页", "PK奖励", "成功领取", 0, "gift"]);

            }
            else{
                $('.pk-box').show();
                $('.pk-gift-get').addClass('disable');
                CommonJS.Toast(response.msg);
            }
        },
        error: function (error) {
            if(error.status !== 0) {
                CommonJS.Toast('PK领奖接口异常');
            }
            else{
                CommonJS.Toast('请刷新重试');
            }
        }
    });
};


//领取奖励
$('.pk-gift-get').on('click',function () {
    fromButton = 1;
    if($(this).hasClass('disable')){
        CommonJS.Toast('今日已领取');
        return;
    }
    if(!uin){
        CommonJS.Toast('请前往斗地主直播间登录领取');
    }
    else if(TOKEN == null || TOKEN == ''){

        $('.pk-box').hide();
        $('.sign,.sign-login').show();

    }
    else {
        getGiftB();
    }

    _hmt.push(['_trackEvent', '斗地主直播间-首页', '点击', 'PK奖励', 1]);
    _czc.push(["_trackEvent", "斗地主直播间-首页", "PK奖励", "点击", 0, "gift"]);
});