$('.nav ul').delegate('li','click',function () {
    var i = $(this).index();
    var uid = parseInt($(this).attr('data-uid'));
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
    html += myHTML.detailHTML(videoJson.tab[video_type][i].icon,videoJson.tab[video_type][i].name,videoJson.tab[video_type][i].desc);
    html += '<div class="quote">';
    html += '<div class="list l-3">';
    html += '<ul>';
    for(var j=0;j<videoJson.videos.length;j++){
        if(videoJson.videos[j].uid==uid){
            html += myHTML.itemHTML(videoJson.videos[j].videoId,compress(videoJson.videos[j].cover,360,200,75),0,videoJson.videos[j].viewer_num,videoJson.videos[j].title);
        }
    }
    html += '</ul></div></div></div>';

    $('.main').append(html);
};

$.ajax({
    url: './list.json',
    type: "GET",
    dataType: 'json',
    success: function (response) {
        if(response.code==0){
            var res = response.data;

            videoJson = res;

            myHTML = new HTML();
            for(var i=0;i<res.tab[video_type].length;i++) {
                if (i == 0) {
                    $('.nav ul').append('<li class="current" data-uid="'+ videoJson.tab[video_type][i].uid +'">' + videoJson.tab[video_type][i].name + '</li>');
                }
                else {
                    $('.nav ul').append('<li data-uid="'+ videoJson.tab[video_type][i].uid +'">' + videoJson.tab[video_type][i].name + '</li>');
                }

            }

            createQuote(0,videoJson.tab[video_type][0].uid);
        }

    },
    error: function (error) {
        console.log(error);
    }
});