njQuery.fn.ssdata = function (key, value) {
    if (value === null) {
        this.removeAttr('data-' + key);
        return this;
    } else if (value === undefined) {
        return this.attr('data-' + key);
    } else {
        njQuery(this).data(key, value);
        this.attr('data-' + key, value);
        return this;
    }
};
njQuery.fireEvent = function (el, eventName) {
    var event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
    } else if (document.createEventObject) {// IE < 9
        event = document.createEventObject();
        event.eventType = eventName;
    }
    event.eventName = eventName;
    if (el.dispatchEvent) {
        el.dispatchEvent(event);
    } else if (el.fireEvent && htmlEvents['on' + eventName]) {// IE < 9
        el.fireEvent('on' + event.eventType, event);// can trigger only real event (e.g. 'click')
    } else if (el[eventName]) {
        el[eventName]();
    } else if (el['on' + eventName]) {
        el['on' + eventName]();
    }
};

window.ssadmin = 1;

;
(function ($, scope, undefined) {

    window.SmartSliderAdminSlide = function (id, active, hidden, layouturl) {
        scope.adminSlide = new scope.ssadminSlideClass(id, active, hidden, layouturl);
    };


    scope.ssadminSlideClass = NClass.extend({
        ss: null,
        outplayed: false,
        init: function (id, active, hidden, layouturl) {
            var $this = this;

            var ie = this.isIE();
            if(ie && ie < 10){
                alert('The editor was tested under Internet Explorer 10, Firefox and Chrome. Please use one of the tested browser!');
            }
            
            window.nextendtime = $.now();
            window.nextendsave = false;

            this.hidden = $('#' + hidden);
            this.$slider = $('#' + id);
            
            this.initBG();
            
            this.$slide = this.$slider.find('.smart-slider-canvas').eq(active);
            this.editAndList();
            this.ssadminLayers = scope.ssadminLayers = new ssadminLayersClass(this.$slide, this, layouturl);

            $('#smartslider-form').submit(function () {
                if ($this.$slide[0].ssanimation === 0) {
                    $('.smartslider-slide-advanced-layers').remove();
                    $this.hidden.val(Base64.encode($this.ssadminLayers.getHTML()));
                    window.nextendsave = true;
                    return true;
                } else {
                    return false;
                }
            });

            this.initTopbar();
        },
        isIE: function () {
            var myNav = navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
        },
        initBG: function(){
            var $this = this,
                bgimage = this.$slider.find('.nextend-slide-bg'),
                canvas = this.$slider.find('.smart-slider-bg-colored');
            $('#slidebackground').on('change', function(){
                var s = this.value.split('|*|');
                
                if(s[1] == ''){
                    bgimage.css('display', 'none');
                }else{
                    bgimage.css('display', 'block');
                    bgimage.attr('src', s[1]);
                }
                if(s[0].substr(6,8) == '00'){
                    canvas.css('background', '');
                }else{
                    canvas.css('background', '#'+s[0].substr(0,6));
                    canvas.css('background', hex2rgba(s[0]));
                }
            });
        },
        initTopbar: function () {
            var $this = this;

            this.playing = 0;
            this.playbtn = $('.smartslider-toolbar-play').on('click', function () {
                $this.switchPlay();
            });

            this.$slide.on('ssanimationsended', function () {
                setTimeout(function () {
                    $this.playEnded();
                }, 300);
            });
        },
        getSS: function () {
            if (this.ss === null) {
                this.ss = this.$slider.data('smartslider').slider.mainslider;
            }
            return this.ss;
        },
        switchPlay: function () {
            var $this = this;
            if (!this.playing && this.$slide[0].ssanimation === 0) {
                this.playing = 1;
                slideconsole.set('Playing in animations - edit and save disabled', 2, 0);
                this.playbtn.addClass('active');
                var layers = this.$slide[0].layers;
                layers.refresh().setInStart().animateIn();
                setTimeout(function () {
                    $this.playEnded();
                }, 300);
            }
        },
        playOut: function () {
            var $this = this,
                layers = this.$slide[0].layers;
            this.outplayed = true;
            slideconsole.set('Playing out animations - edit and save disabled', 2, 0);
            layers.animateOut();
            setTimeout(function () {
                $this.playEnded();
            }, 300);
        },
        playEnded: function () {
            if (this.$slide[0].ssanimation === 0 && this.playbtn.hasClass('active')) {
                if (this.outplayed === false) {
                    var $this = this;
                    slideconsole.set('In animations ended - edit and save disabled', 2);
                    setTimeout(function () {
                        $this.playOut();
                    }, 2000);
                } else {
                    var layers = this.$slide[0].layers;
                    layers.refresh().resetOut().resetIn();
                    this.outplayed = false;
                    this.playbtn.removeClass('active');
                    slideconsole.set('Animations ended - edit and save enabled', 2);
                    this.playing = 0;
                }
            }
        },
        editAndList: function () {
            var $toolbox = $('#smartslider-slide-toolbox'),
                $list = $('.smartslider-toolbar-list'),
                $edit = $('.smartslider-toolbar-edit'),
                classes = ['smartslider-slide-toolbox-sliders-active', 'smartslider-slide-toolbox-slide-active'],
                extra = 0;
            
            if(typeof window.wp != 'undefined'){
                extra = 28;
            }
            $edit.on('click', function () {
                $toolbox.addClass(classes[1]).removeClass(classes[0]);
            });
            $list.on('click', function () {
                $toolbox.addClass(classes[0]).removeClass(classes[1]);
            });
            this.switchToEdit = function () {
                $toolbox.addClass(classes[1]).removeClass(classes[0]);
            }


            var maxOffset = parseInt($('.smartslider-slide-console').siblings('h3').offset().top),
                minOffset = parseInt($toolbox.offset().top)
            scrollFn = function () {
                var st = $(this).scrollTop()+extra;
                if (st < minOffset) {
                    $toolbox.css('marginTop', 0);
                } else if (st > maxOffset) {
                    $toolbox.css('marginTop', maxOffset - minOffset);
                } else {
                    $toolbox.css('marginTop', st - minOffset);
                }
                window.nextendsmartslidercolresize();
            };

            $(window).scroll(scrollFn);
            scrollFn();
        }
    });

})(njQuery, window);

function hex2rgba(hex) {
    var r = hexdec(hex.substr(0, 2));
    var g = hexdec(hex.substr(2, 2));
    var b = hexdec(hex.substr(4, 2));
    var a = (intval(hexdec(hex.substr(6, 2)))) / 255;
    a = a.toFixed(3);
    var color = r + "," + g + "," + b + "," + a;
    return 'RGBA(' + color + ')';
}

function hexdec(hex_string) {
    hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
    return parseInt(hex_string, 16);
}

function intval(mixed_var, base) {
    var tmp;
    var type = typeof(mixed_var);
    if (type === 'boolean') {
        return +mixed_var;
    } else if (type === 'string') {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
    } else if (type === 'number' && isFinite(mixed_var)) {
        return mixed_var | 0;
    } else {
        return 0;
    }
}