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

var teachingJson = null;

var createQuote = function (i,uid) {
    var html = '';
    html += '<div class="part part_'+i+'">';
    html += myHTML.detailHTML(teachingJson.teaching_tab[i].icon,teachingJson.teaching_tab[i].name,teachingJson.teaching_tab[i].desc);
    html += '<div class="quote">';
    html += '<div class="list l-3">';
    html += '<ul>';
    for(var j=0;j<teachingJson.videos.length;j++){
        if(teachingJson.videos[j].uid==uid){
            html += myHTML.itemHTML(teachingJson.videos[j].chatroom_id,compress(teachingJson.videos[j].cover,360,200,75),teachingJson.videos[j].status,teachingJson.videos[j].viewer_num,teachingJson.videos[j].title);
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

            teachingJson = res;

            myHTML = new HTML();
            for(var i=0;i<res.teaching_tab.length;i++) {
                if (i == 0) {
                    $('.nav ul').append('<li class="current" data-uid="'+ teachingJson.teaching_tab[i].uid +'">' + teachingJson.teaching_tab[i].name + '</li>');
                }
                else {
                    $('.nav ul').append('<li data-uid="'+ teachingJson.teaching_tab[i].uid +'">' + teachingJson.teaching_tab[i].name + '</li>');
                }

            }

            createQuote(0,teachingJson.teaching_tab[0].uid);
        }

    },
    error: function (error) {
        console.log(error);
    }
});