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

var matchJson = null;

var createQuote = function (i,uid) {
    var html = '';
    html += '<div class="part part_'+i+'">';
    html += myHTML.detailHTML(matchJson.match_tab[i].icon,matchJson.match_tab[i].name,matchJson.match_tab[i].desc);
    html += '<div class="quote">';
    html += '<div class="list l-3">';
    html += '<ul>';
    for(var j=0;j<matchJson.videos.length;j++){
        if(matchJson.videos[j].uid==uid){
            html += myHTML.itemHTML(matchJson.videos[j].chatroom_id,compress(matchJson.videos[j].cover,360,200,75),matchJson.videos[j].status,matchJson.videos[j].viewer_num,matchJson.videos[j].title);
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

            matchJson = res;

            myHTML = new HTML();
            for(var i=0;i<res.match_tab.length;i++) {
                if (i == 0) {
                    $('.nav ul').append('<li class="current" data-uid="'+ matchJson.match_tab[i].uid +'">' + matchJson.match_tab[i].name + '</li>');
                }
                else {
                    $('.nav ul').append('<li data-uid="'+ matchJson.match_tab[i].uid +'">' + matchJson.match_tab[i].name + '</li>');
                }

            }

            createQuote(0,matchJson.match_tab[0].uid);
        }

    },
    error: function (error) {
        console.log(error);
    }
});