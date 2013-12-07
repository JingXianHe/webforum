;
(function ($, scope, undefined) {
    scope.ssTypeBase = NClass.extend({
        $this: null,
        $slider: null,
        slideList: null,
        _parent: null,
        _active: -1,
        _lastActive: -1,
        _animating: false,
        _runningAnimations: 0,
        lastAvailableWidth: 0,
        init: function (parent, $el, options) {
            this.options = {
                syncAnimations: 1,
                translate3d: 1,
                mainlayer: true,
                playfirstlayer: 0,
                mainafterout: 1,
                inaftermain: 1,
                fadeonscroll: 0,
                autoplay: 0,
                autoplayConfig: {
                    duration: 5000,
                    counter: 0,
                    autoplayToSlide: 0,
                    stopautoplay: {
                        click: 1,
                        mouseenter: 1,
                        slideplaying: 1
                    },
                    resumeautoplay: {
                        mouseleave: 0,
                        slideplayed: 1
                    }
                },
                responsive: {
                    downscale: 0,
                    upscale: 0
                },
                controls: {
                    scroll: 0,
                    touch: 0
                },
                blockrightclick: 0
            };
            this.slideDimension = {
                w: 0,
                h: 0
            };
            
             
            var _this = this;
            this._parent = parent;

            $.extend(this.options, options);
            this.options.syncAnimations = this.options.mainafterout;

            this.$slider = $el;
            if (this.options.translate3d && nModernizr && nModernizr.csstransforms3d) {
                this.$slider.css(nModernizr.prefixed('transform'), 'translate3d(0,0,0)');
                this.$slider.css(nModernizr.prefixed('perspective'), '1000');
            }
            
            if(this.options.blockrightclick && window.ssadmin !== 1){
                this.$slider.bind("contextmenu",function(e){
                    e.preventDefault();
                }); 
            }

            this.id = $el.attr('id');

            this.$this = $(this);

            this.slideList = $('.smart-slider-canvas', $el);

            this.slideDimension.w = this.slideList.width();
            this.slideDimension.h = this.slideList.height();

            for (var i = 0; i < this.slideList.length; i++) {
                var slide = this.slideList[i];

                // syncronize layer animations with the slide changing
                slide.ssanimation = 0;
                this.slideList.eq(i).on('incrementanimation.ssanimation',function () {
                    this.ssanimation++;
                }).on('decrementanimation.ssanimation',function () {
                        this.ssanimation--;
                        if (this.ssanimation === 0) {
                            $(this).trigger('ssanimationsended');
                        }
                    }).on('noanimation.ssanimation', function () {
                        if (this.ssanimation === 0) {
                            $(this).trigger('ssanimationsended');
                        }
                    });

                // init layers
                slide.layers = new scope.ssLayers(this, slide, {
                    width: this.slideDimension.w,
                    height: this.slideDimension.h,
                    mainlayer: this.options.mainlayer
                });
            }
            
            this.slidebgList = $('.nextend-slide-bg', $el);
            this.slidebgList.width(this.slideDimension.w);

            this._active = this.slideList.index($('.' + this._parent.slideActive, $el));
            
            this.sizeInited();

            this._bullets = this.$slider.find('.nextend-bullet-container > .nextend-bullet');
            this._bullets.removeClass('active');
            this._bullets.eq(this._active).addClass('active');

            this._bar = this.$slider.find('.nextend-bar-slide');
            this._bar.removeClass('active');
            this._bar.eq(this._active).addClass('active');


            this._thumbnails = window[this.id + '-thumbnail'];
            this.changeThumbnail(this._active);


            if (window.ssadmin !== 1) {
                _this._animating = true;
                
                $(this).on('load.first', function () {
                    $(this).off('load.first');
                    
                    var show = function(){
                        _this.$slider.addClass('nextend-loaded');
                        $('#'+_this.id+'-placeholder').remove();
                        
                        _this.$slider.trigger('loaded');
                        
                        _this._animating = false;
                        if (_this.options.playfirstlayer) {
                            var canvas = $(_this.slideList[_this._active]);
                            canvas.on('ssanimationsended.first',function () {
                                $(this).off('ssanimationsended.first');
                            }).trigger('ssanimatelayersin');
                        }
                        _this.startAutoplay();
                    };
                    
                    if(_this.options.fadeonscroll){
                        var w = $(window),
                            t = _this.$slider.offset().top+_this.$slider.outerHeight()/2;
                        if(w.scrollTop()+w.height() > t){
                            show();
                        }else{
                            w.on('scroll.'+_this.id, function(){
                                if(w.scrollTop()+w.height() > t){
                                    w.off('scroll.'+_this.id);
                                    show();
                                }
                            });
                        }
                    }else{
                        show();
                    }
                });
                
                if (this.options.responsive.downscale || this.options.responsive.upscale) {
                    this.storeDefaults();
                    this.onResize();

                    $(window).on('resize', function () {
                        _this.onResize();
                    });
                    if(typeof artxJQuery != "undefined"){
                        artxJQuery(window).on('responsive', function () {
                            _this.onResize();
                        });
                    }
                } else {
                    this.$slider.waitForImages(function () {
                        $(_this).trigger('load');
                    });
                }

                if (!this.options.playfirstlayer) {
                    this.slideList[this._active].layers.setOutStart();
                }

                this.initAutoplay();
                this.initWidgets();
                this.initScroll();
                this.initTouch();
				this.initEvents();

            } else {
                $(this).trigger('load');
            }
        },
        sizeInited: function(){
        
        },
        storeDefaults: function () {

        },
        onResize: function () {
            var _this = this;
            this.$slider.waitForImages(function () {
                $(_this).trigger('load');
            });
        },
        initWidgets: function () {
            var timeout = null,
                widgets = this.$slider.find('.nextend-widget-hover');
            if (widgets.length > 0) {
                this.$slider.on('mouseenter',function () {
                    var slide = this;
                    if (timeout) clearTimeout(timeout);
                    widgets.css('visibility', 'visible');
                    setTimeout(function () {
                        $(slide).addClass('nextend-widget-hover-show');
                    }, 50);
                }).on('mouseleave', function () {
                        var slide = this;
                        if (timeout) clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            $(slide).removeClass('nextend-widget-hover-show');
                            timeout = setTimeout(function () {
                                widgets.css('visibility', 'hidden');
                            }, 400);
                        }, 500);
                    });
            }
        },
        initScroll: function () {
            if (this.options.controls.scroll == 0) return;
            var _this = this;
            this.$slider.on('mousewheel', function (e, delta, deltaX, deltaY) {
                if (delta < 0) {
                    _this.next();
                } else {
                    _this.previous();
                }
                e.preventDefault();
            });
        },
        initTouch: function () {
            if (this.options.controls.touch == '0') return;
            var _this = this;
            var mode = this.options.controls.touch;
            this.$slider.swipe({
                swipe: function (event, direction, distance, duration, fingerCount) {
                    if (mode == 'horizontal') {
                        if (direction == 'right') {
                            _this.previous();
                        } else if (direction == 'left') {
                            _this.next();
                        }
                    } else if (mode == 'vertical') {
                        if (direction == 'down') {
                            _this.previous();
                        } else if (direction == 'up') {
                            _this.next();
                        }
                    }
                },
                fallbackToMouseEvents: false,
                allowPageScroll: (mode == 'horizontal' ? 'vertical' : 'horizontal')
            });
        },
    		initEvents: function(){
    			this.$slider.find("*[data-click]").each(function(){
    				var thisme = $(this);
    				if(thisme.data('click')!=""){
    					thisme.on("click", function(){eval(thisme.data('click'));});
    				}
    			});
    			this.$slider.find("*[data-enter]").each(function(){
    				var thisme = $(this);
    				if(thisme.data('enter')!=""){
    					thisme.on("mouseenter", function(){eval(thisme.data('enter'));});
    				}
    			});
    			this.$slider.find("*[data-leave]").each(function(){
    				var thisme = $(this);
    				if(thisme.data('leave')!=""){
    					thisme.on("mouseleave", function(){eval(thisme.data('leave'));});
    				}
    			});
    		},
        next: function (autoplay) {
            var i = this._active + 1;
            if (i === this.slideList.length)
                i = 0;
            return this.changeTo(i, false, autoplay);
        },
        previous: function (autoplay) {
            var i = this._active - 1;
            if (i < 0)
                i = this.slideList.length - 1;
            return this.changeTo(i, true, autoplay);
        },
        changeTo: function (i, reversed, autoplay) {
            if (window.ssadmin || i === this._active || this._animating)
                return false;
            if (!this.options.syncAnimations) {
                if (this._lastActive != i) this.slideList.eq(this._lastActive).trigger('ssanimatestop');
                this.slideList.eq(this._active).trigger('ssanimatestop');
            }

            var _this = this;

            this.pauseAutoPlay(true);

            this._animating = true;

            if (this.options.syncAnimations) _this._runningAnimations++;

            this._nextActive = i;

            this.changeBullet(i);

            $(this).trigger('mainanimationstart');

            var $currentactiveslide = this.slideList.eq(this._active),
                $nextactiveslide = this.slideList.eq(i),
                playin = function () {

                    if (_this.options.inaftermain) {

                        $nextactiveslide.trigger('ssanimatelayerssetinstart');

                        _this.$this.on('mainanimationinend.inaftermain', function () {
                            _this.$this.off('mainanimationinend.inaftermain');
                            $nextactiveslide.trigger('ssanimatelayersin');
                        });
                        _this._runningAnimations++;
                        _this.animateIn(i, reversed);
                    } else {
                        _this._runningAnimations++;
                        _this.animateIn(i, reversed);
                        $nextactiveslide.trigger('ssanimatelayersin');
                    }
                };


            if (this.options.mainafterout) {
                $currentactiveslide.on('ssanimationsended.ssinaftermain', function () {
                    $currentactiveslide.off('ssanimationsended.ssinaftermain');
                    _this._runningAnimations++;
                    _this.animateOut(_this._active, reversed);
                    playin();
                });

                if (this.options.syncAnimations) {
                    $currentactiveslide.trigger('ssanimatelayersout');
                }
            } else {
                this._runningAnimations++;
                this.animateOut(this._active, reversed);

                if (this.options.syncAnimations) {
                    $currentactiveslide.trigger('ssanimatelayersout');
                }

                playin();
            }

        },
        animateOut: function (i, reversed) {
            var _this = this;
            this._lastActive = i;
            var $slide = this.slideList.eq(i);

            var motion = ssAnimationManager.getAnimation('no', $slide);
            $slide.on('ssanimationsended.ssmainanimateout',function () {
                $slide.off('ssanimationsended.ssmainanimateout');
                _this.$this.trigger('mainanimationoutend');
                _this.mainanimationended();
            }).trigger('ssoutanimationstart');
            motion.animateOut();
        },
        animateIn: function (i, reversed) {
            var _this = this;
            this._active = i;
            var $slide = this.slideList.eq(i);
            var motion = ssAnimationManager.getAnimation('no', $slide);
            $slide.on('ssanimationsended.ssmainanimatein',function () {
                $slide.off('ssanimationsended.ssmainanimatein');
                _this.$this.trigger('mainanimationinend');
                _this.mainanimationended();
                _this.mainanimationended();
            }).trigger('ssinanimationstart');
            motion.animateIn();
        },
        mainanimationended: function () {
            this._runningAnimations--;
            if (this._runningAnimations === 0) {
                this.slideList.eq(this._lastActive).removeClass(this._parent.slideActive);
                this.slideList[this._lastActive].layers.setHiddenState();
                this.slideList.eq(this._active).addClass(this._parent.slideActive);
                this._animating = false;
                this.$this.trigger('mainanimationend');
                this.startAutoplay();
            } else if (this._runningAnimations < 0) {
                this._runningAnimations = 0;
            }
        },
        changeBullet: function (i) {
            this._bullets.removeClass('active');
            this._bullets.eq(i).addClass('active');
            this._bar.removeClass('active');
            this._bar.eq(i).addClass('active');

            this.changeThumbnail(i);
        },
        changeThumbnail: function (i) {
            if (this._thumbnails) this._thumbnails.change(i);
        },

        initAutoplay: function () {
            var _this = this;
            this.indicator = window[this.id + '-indicator'];
            if (!this.indicator) {
                this.indicator = {
                    hide: function () {
                    },
                    show: function () {
                    },
                    refresh: function (val) {
                    }
                };
            }
            this.indicator.reset = function () {
                _this.indicatorProgress = 0;
                this.refresh(0);
            }
            this.autoplayTimer = null;
            var autoplay = this.options.autoplayConfig;
            if (autoplay.stopautoplay.click) {
                this.$slider.find('> div').eq(0).on('click', function () {
                    _this.pauseAutoPlay();
                });
            }
            if (autoplay.stopautoplay.mouseenter) {
                this.$slider.find('> div').eq(0).on('mouseenter', function () {
                    _this.pauseAutoPlay();
                });
            }
            if (autoplay.stopautoplay.slideplaying) {
                this.$slider.on('ssplaystarted', function () {
                    _this.pauseAutoPlay();
                });
            }
            if (autoplay.resumeautoplay.mouseleave) {
                this.$slider.on('mouseleave', function () {
                    if (!_this.autoplayTimer)
                        _this.reStartAutoPlay();
                });
            }
            if (autoplay.resumeautoplay.slideplayed) {
                this.$slider.on('ssplayended', function () {
                    if (!_this.autoplayTimer)
                        _this.reStartAutoPlay();
                });
            }

            if (!this.autoplaybutton) this.autoplaybutton = this.$slider.find('.nextend-autoplay-button');
            if (!this.indicatorEl) this.indicatorEl = $('<div></div>');

            if (this.options.autoplay) {
                this.startAutoplay = this.startAutoplayWorking;
                this.startAutoplay();
            } else {
                this.pauseAutoPlay();
            }

        },

        startAutoplay: function () {

        },

        startAutoplayWorking: function () {
            var _this = this,
                duration = this.options.autoplayConfig.duration;

            if (this.autoplayTimer) {
                clearTimeout(this.autoplayTimer);
                this.autoplayTimer = null;
            }

            if (this.indicator) {
                var shift = 0,
                    d = duration,
                    prevProgress = 0,
                    invPrevProgress = 1;
                if (this.indicatorEl.data('animating') && _this.indicatorProgress) {
                    d *= (1 - _this.indicatorProgress);
                    prevProgress = _this.indicatorProgress;
                    invPrevProgress = 1 - prevProgress;
                } else {
                    this.indicator.refresh(0);
                }
                this.indicatorEl.animate({
                    width: 1
                }, {
                    duration: d,
                    progress: function (e, i) {
                        var j = prevProgress + invPrevProgress * i;
                        _this.indicator.refresh(j * 100);
                        _this.indicatorProgress = j;
                    },
                    complete: function () {
                        _this.options.autoplayConfig.counter++;
                        _this.next(true);
                        _this.indicatorEl.data('animating', false);
                        _this.indicatorEl.stop(true);
                        _this.indicatorProgress = 0;
                        if(!_this.options.autoplayConfig.autoplayToSlide || _this.options.autoplayConfig.counter < _this.options.autoplayConfig.autoplayToSlide-1) _this.reStartAutoPlay();
                    }
                });
                this.indicatorEl.data('animating', true);
            } else {

                this.autoplayTimer = setTimeout(function () {
                    this.options.autoplayConfig.counter++;
                    _this.next(true);
                    _this.indicatorEl.stop(true);

                    _this.indicator.refresh(100);
                    if(!_this.options.autoplayConfig.autoplayToSlide || _this.options.autoplayConfig.counter < _this.options.autoplayConfig.autoplayToSlide-1) _this.reStartAutoPlay();
                }, duration);
            }
        },

        pauseAutoPlay: function (reset) {
            if (this.autoplayTimer) {
                clearTimeout(this.autoplayTimer);
                this.autoplayTimer = null;
            }
            this.autoplaybutton.addClass('paused');
            this.indicatorEl.stop(true);
            if (reset) {
                this.indicator.reset();
            }
            this.startAutoplay = function () {
            };
        },
        reStartAutoPlay: function () {
            this.autoplaybutton.removeClass('paused');
            this.startAutoplay = this.startAutoplayWorking;
            if (this._runningAnimations === 0) this.startAutoplay();
        }
    });

})(njQuery, window);