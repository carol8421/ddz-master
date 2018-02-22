(function(jQuery) {
    'use strict';
    jQuery.fn.extend({
        Scroll: function(opt, callback) {
            //滚动函数

            //参数初始化
            var defaults = {
                direction: opt.direction || 'up', //滚动的方向
                _btnUp: jQuery('#' + opt.up), //向上滚动按钮
                _btnDown: jQuery('#' + opt.down), //向下滚动按钮
                _this: this, //滚动容器
                element: opt.element || 'li', //滚动元素
                timer: opt.timer || 2000, //滚动的时间间隔（毫秒）
                speed: opt.speed ? parseInt(opt.speed, 10) : 500, //卷动速度，数值越大，速度越慢（毫秒）
                line: opt.line ? parseInt(opt.line, 10) : parseInt(this.height() / lineH, 10) //每次滚动的行数，默认为一屏，即父容器高度
            };

            var direction = defaults.direction,
                _btnUp = defaults._btnUp,
                _btnDown = defaults._btnDown,
                _this = defaults._this,
                ele = defaults.element,
                timer = defaults.timer,
                speed = defaults.speed,
                line = defaults.line;

            if (!opt) var options = {};
            if (defaults.line === 0) line = 1;
            var lineH = _this.find(ele).first().height(), //获取行高
                timerID,
                upHeight = 0 - line * lineH;


            //向上翻页函数
            var scrollUp = function() {
                direction = 'up';
                _btnUp.unbind('click', scrollUp); //取消向上按钮的函数绑定
                _this.animate({
                    marginTop: upHeight
                }, speed, function() {
                    for (var i = 1; i <= line; i++) {
                        _this.find(ele).first().appendTo(_this);
                    }
                    _this.css({
                        marginTop: 0
                    });
                    _btnUp.bind('click', scrollUp); //绑定向上按钮的点击事件
                });
            };
            //向下翻页函数
            var scrollDown = function() {
                direction = 'down';
                _btnDown.unbind('click', scrollDown);
                for (var i = 1; i <= line; i++) {
                    _this.find(ele).last().show().prependTo(_this);
                }
                _this.css({
                    marginTop: upHeight
                });
                _this.animate({
                    marginTop: 0
                }, speed, function() {
                    _btnDown.bind('click', scrollDown);
                });
            };
            //自动播放
            var autoPlay = function() {
                if (timer) timerID = window.setInterval(function() {
                    if (direction == 'up') {
                        scrollUp();
                    } else {
                        scrollDown();
                    }
                }, timer);
            };
            var autoStop = function() {
                if (timer) window.clearInterval(timerID);
            };
            //鼠标事件绑定
            _this.hover(autoStop, autoPlay).mouseout();
            _btnUp.css('cursor', 'pointer').click(scrollUp).hover(autoStop, autoPlay); //向上向下鼠标事件绑定
            _btnDown.css('cursor', 'pointer').click(scrollDown).hover(autoStop, autoPlay);
        }
    });
})(jQuery);