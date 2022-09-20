//格式化 ： http://tool.oschina.net/codeformat/js/
var pageindex=0;
var currentpageindex=0;
var pagetime = 0;
$(document).ready(function() {
	
	 // CanvasParticle();

	 
});


$(function() {
    if ($(window).width() < 768) {
        $(".headernav").css("display", "none");
    } else {
        $(".headernav").css("display", "block");
    }
});
//动态改变浏览器可视宽度判断
$(function() {
    $(window).resize(function() {
        var sw = $(window).width();
        if (sw < 768) {
            $(".headernav").css("display", "none");
        } else {
            $(".headernav").css("display", "block");
        }
    });
});
//控制 page高度
$(function() {
    var pageheight = $(window).height() - 50;
    $(".page").css("height", pageheight);
});
//手机按钮控制导航显示隐藏
var hbi = false;
$(function() {
    $("#headerbutton").on("click",
    function() {
        $(".headernav").toggle();
    });
});
//导航切换页面
$(function() {
    $(".headernav>ul>li").on("click",
    function() {
        var navulindex = $(this).index(); //所点击的li的索引
        
		    if ($(window).width() < 768) {
        $(".headernav").css("display", "none");
    }
        pageindex = navulindex;
        currentpageindex = pageindex;
        movepage(pageindex);
        $(this).siblings('li').removeClass('actives'); // 删除其他兄弟元素的样式
        $(this).addClass('actives'); // 添加当前元素的样式	
		
    });
});
// 鼠标滚轮滚动
$(function() {
    //使用on监听滚轮事件
    $('.main').on('mousewheel',
    function(event) {
        //输出滚轮事件响应结果
        var a = event.deltaY;
        if (new Date().getTime() < pagetime + 500) {
            return;
        }
        if (a == 1) {
            currentpageindex = currentpageindex - 1;
            if (currentpageindex == -1) {
                currentpageindex = 0;
            }
            movepage(currentpageindex);
        } else {
            currentpageindex = currentpageindex + 1;
            if (currentpageindex == 7) {
                currentpageindex = 6;
            }
            movepage(currentpageindex);
        }

    });
});

// 手机触摸
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });
$('body').bind('touchstart',
function(e) {
    startX = e.originalEvent.changedTouches[0].pageX,
    startY = e.originalEvent.changedTouches[0].pageY;
});
$('body').bind('touchmove',
function(e) {
    //获取滑动屏幕时的X,Y
    endX = e.originalEvent.changedTouches[0].pageX,
    endY = e.originalEvent.changedTouches[0].pageY;
    //获取滑动距离
    distanceX = endX - startX;
    distanceY = endY - startY;
    if (new Date().getTime() < pagetime + 500) {
        return;
    }
    //判断滑动方向
    if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {
        console.log('往右滑动');
    } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) {
        console.log('往左滑动');
    } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < 0) {
        currentpageindex = currentpageindex + 1;
        if (currentpageindex == 7) {
            currentpageindex = 6;
        }
        movepage(currentpageindex);
    } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0) {
        currentpageindex = currentpageindex - 1;
        if (currentpageindex == -1) {
            currentpageindex = 0;
        }
        movepage(currentpageindex);
    } else {
        console.log('点击未滑动');
    }

});


//页面切换
function movepage($movepages) {
    pagetime = new Date().getTime();
    var moveoffset = $(window).height() * $movepages;
    $(".main").css({
        "transition": "all 1s",
        "-moz-transition": "all 1s",
        "-webkit-transition": "all 1s"
    });
    $(".main").css("transform", "translate3D(0, -" + moveoffset + "px, 0)");
    $(".headernav>ul>li:not(li:eq(" + $movepages + "))").removeClass('actives'); // 删除其他兄弟元素的样式
    $(".headernav>ul>li:eq(" + $movepages + ")").addClass("actives");
};
// 点击导航以外区域，下拉收回
$(function() {
    $(document).click(function(e) {
        e = window.event || e;
        var obj = e.srcElement || e.target;
        if (!$(obj).is(".headernav>ul>li")) {
            if ($(window).width() < 768) {
                $(".headernav").css("display", "none");
            }
        }
    });
    // 阻止按钮的冒泡事件
    $("#headerbutton").click(function(event) {
        event.stopPropagation();
    });

});
//针对ios 移动设备 不能 event.stopPropagation(); http://www.cnblogs.com/xdoudou/p/3991163.html
$(function() {
    $("body").children().click(function() {
        //这里不要写任何代码
    });
});






/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));






 


