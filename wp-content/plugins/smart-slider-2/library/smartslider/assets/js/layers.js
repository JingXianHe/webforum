;
(function ($, scope, undefined) {

    scope.ssLayers = NClass.extend({
        slide: null,
        $slide: null,
        layers: null,
        init: function (slider, slide, options) {
            var _this = this;
            this.options = {};

            this.slider = slider;
            this.slide = slide;
            this.$slide = $(slide);

            $.extend(this.options, options);

            this.refresh();

            this.$slide.on('ssanimatelayersin',function () {
                _this.animateIn();
            }).on('ssanimatelayerssetinstart',function () {
                    _this.setInStart();
                }).on('ssanimatelayerssetoutstart',function () {
                    _this.setOutStart();
                }).on('ssanimatelayersresetin',function () {
                    _this.resetIn();
                }).on('ssanimatelayersresetout',function () {
                    _this.resetOut();
                }).on('ssanimatelayersout',function () {
                    _this.animateOut();
                }).on('ssanimatestop', function () {
                    _this.stop();
                });
        },
        refresh: function () {
            var _this = this;

            this.layers = $([]);

            var _layers = $('.smart-slider-layer', this.slide);
            /*
             this.mainlayer = _layers.filter('.smart-slider-main-layer');
             if (!this.options.mainlayer) {
             _layers = _layers.not(this.mainlayer);
             }

             this.$slide.data('ssmainlayer', this.mainlayer);
             */
            _layers.each(function () {
                var $layer = $(this);
                if ($layer.data('animation') !== undefined) {
                    $layer.css('display', 'none');
                    _this.layers.push(this);
                    $layer.data('slide', _this.slide);
                    $layer.data('layermanager', _this);

                    var motionin = _this.getMotionIn($layer);
                    $layer.data('motionin', motionin);
                    var motionout = _this.getMotionOut($layer);
                    $layer.data('motionout', motionout);

                    if (window.ssadmin === 1) {
                        motionout.setOutStart();
                        motionout.reset();
                        motionin.reset();
                    }
                }
            });
            return this;
        },
        stop: function () {
            this.layers.each(function () {
                $(this).data('motionin').stop();
                $(this).data('motionout').stop();
            });
            return this;
        },
        resetIn: function () {
            this.layers.each(function () {
                $(this).data('motionin').reset();
            });
            return this;
        },
        resetOut: function () {
            this.layers.each(function () {
                $(this).data('motionout').reset();
            });
            return this;
        },
        animateIn: function () {
            if (this.layers.length === 0) {
                $(this.slide).trigger('noanimation');
            } else {
                this.layers.each(function () {
                    $(this).data('motionin').animateIn();
                });
            }
            return this;
        },
        setInStart: function () {
            this.layers.each(function () {
                $(this).data('motionout').setOutStart();
                $(this).data('motionin').setInStart();
            });
            return this;
        },
        animateOut: function () {
            if (this.layers.length === 0) {
                $(this.slide).trigger('noanimation');
            } else {
                this.layers.each(function () {
                    $(this).data('motionout').animateOut();
                });
            }
            return this;
        },
        setOutStart: function () {
            this.layers.each(function () {
                $(this).data('motionout').setOutStart();
            });
            return this;
        },
        setHiddenState: function () {
            this.layers.each(function () {
                $(this).data('motionout').setHiddenState();
            });
            return this;
        },
        getMotionIn: function ($layer) {
            var options = this.options;
            return ssAnimationManager.getAnimation($layer.data('animationin'), $layer, {
                width: options.width,
                height: options.height,
                intervalIn: parseInt($layer.data('durationin')),
                easingIn: $layer.data('easingin'),
                delayIn: parseInt($layer.data('delayin')),
                parallaxIn: parseFloat($layer.data('parallaxin'))
            });
        },
        getMotionOut: function ($layer) {
            var options = this.options;
            return ssAnimationManager.getAnimation($layer.data('animationout'), $layer, {
                width: options.width,
                height: options.height,
                intervalOut: parseInt($layer.data('durationout')),
                easingOut: $layer.data('easingout'),
                delayOut: parseInt($layer.data('delayout')),
                parallaxOut: parseFloat($layer.data('parallaxout'))
            });
        }
    });
})(njQuery, window);