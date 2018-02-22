$('.nav ul').delegate('li','click',function () {
    var i = $(this).index();
    var uid = $(this).attr('data-uid');
    $('.nav li').removeClass('current');
    $(this).addClass('current');
    if($('.part_'+i).length==0){
        createQuote(i,uid);
    }
    $('.part').hide();
    $('.part_'+i).show();
});

var videoJson = null;

var createQuote = function (i,uid,type) {
    var html = '';
    html += '<div class="part part_'+i+'">';

    for(var key in videoJson){
        if(uid==key){
            console.log(key)
            html += myHTML.detailHTML(videoJson[key].cover,videoJson[key].title,videoJson[key].introduce);
            html += '<div class="quote">';
            html += '<div class="list l-3">';
            html += '<ul>';

            for(var i in videoJson[key]){
                if(i!='cover'&&i!='title'&&i!='introduce'){
                    html += myHTML.itemHTML(videoJson[key][i].chatroom_id,videoJson[key][i].cover,videoJson[key][i].status,videoJson[key][i].viewer_num,videoJson[key][i].title);
                }
            }
            console.log(videoJson[key])
        }
    }

    html += '</ul></div></div></div>';

    $('.main').append(html);
};

$.ajax({
    url: 'https://api.ttdz.dasheng.tv/ttdz/list',
    type: "GET",
    dataType: 'json',
    success: function (response) {
        if(response.code==0) {
            var res;
            switch (video_type){
                case 'video':
                    res = response.data.video;
                    break;
                case 'match':
                    res = response.data.video;
                    break;
                case 'teaching':
                    res = response.data.video;
                    break;
            }
            videoJson = res;

            var i = 0;
            var curKey = 0;
            myHTML = new HTML();
            for (var key in res) {

                if (i == 0) {
                    curKey = key;
                    $('.nav ul').append('<li class="current" data-uid="' + key + '">' + res[key].title + '</li>');
                }
                else {
                    $('.nav ul').append('<li data-uid="' + key + '">' + res[key].title + '</li>');
                }


                i++;
            }

            console.log(curKey)
            createQuote(0, curKey);
        }

    },
    error: function (error) {
        console.log(error);
    }
});