(function ($, scope, undefined) {
    scope.ssadminLayersClass = NClass.extend({
        active: false,
        init: function (slide, slideobj, layouturl) {
            var $this = this;
            this.slide = slide;

            this.layercanvas = slide.find('> .smart-slider-canvas-inner');
            if (this.layercanvas.length === 0) this.layercanvas = slide;

            this.parent = slideobj;
            this.slideSize = {
                width: slide.width(),
                height: slide.height()
            };
            this.zindex = [];
            this.activeLayer = $({});
            this.initToolbox();
            this.views = $('.smartslider-slide-view');
            this.toolboxviews = $('.smartslider-slide-toolbox-view');
            this.layerClass = '.smart-slider-layer';
            this.refreshLayers();

            this.layouts = new ssadminLayoutsClass(this, layouturl);

            this.items = new ssadminItemsClass(this);
            this.sortableItems = '> .smart-slider-items, > .smart-slider-item-container';

            this.makeDummyLayerSortable();
            this.layers.each(function () {
                $this.makeLayerResizeable(this);
                $this.makeLayerDraggable(this);
                $this.makeLayerDeletable(this);
                $this.makeLayerZindexable(this);
                $this.makeLayerSortable(this);
                $this.formAddLayer(this);
                $this.items.initLayer(this);
            });
            this.refreshSortableConnectWith();
            this.views.eq(1).on('click', function () {
                $this.switchToLayerTab();
            });
            $('.smartslider-createlayer').on('click', function () {
                $this.createLayer();
                slideconsole.set('Layer created', 2);
            });

            $('#smartslider-slide-toolbox-layer').on('mouseenter',function () {
                $('#smartslider-admin').addClass('smartslider-layer-highlight-active');
            }).on('mouseleave', function () {
                    $('#smartslider-admin').removeClass('smartslider-layer-highlight-active');
                });

            if (this.getParameterByName('action') == 'create') {
                this.layouts.switchToLayoutTab();
            } else {
                this.switchToLayerTab();
            }

            this.enableLayerMode();
            this.items.enableItemMode();

            this.initAdvancedView();

        },
        getParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        switchToLayerTab: function () {
            this.views.removeClass('active');
            this.views.eq(1).addClass('active');
            this.toolboxviews.parent().css((window.nextendDir == 'rtl' ? 'marginRight' : 'marginLeft'), '-100%');
            this.parent.switchToEdit();
            $('#smartslider-admin').removeClass('smartslider-item-mode-active');
            $('#smartslider-admin').addClass('smartslider-layer-mode-active');
            $(window).trigger('resize');
        },
        enableLayerMode: function () {
            if (this.active === true)
                return;
            this.active = true;
            this.layerModeChanged();
        },
        disableLayerMode: function () {
            if (this.active === false)
                return;
            this.active = false;
            this.layerModeChanged();
        },
        layerModeChanged: function () {
            var $this = this;
            this.layers.each(function () {
                if ($this.active) {
                    $(this).draggable("enable");
                } else {
                    $(this).draggable("disable");
                }
            });
            if (this.active) {
                this.slide.addClass('smartslider-layer-mode');
            } else {
                this.slide.removeClass('smartslider-layer-mode');
                if (this.leaveborder) {
                    this.slide.addClass('smartslider-layer-border-mode');
                    this.leaveborder = false;
                }
            }
        },
        createLayer: function () {
            var $layer = $('<div class="smart-slider-layer" style="top: 0%; left: 0%; width: 20%; height: 20%; position: absolute;" data-animation="slide">'),
                layer = $layer[0];
            this.layercanvas.append($layer);
            this.makeLayerResizeable(layer);
            this.makeLayerDraggable(layer);
            this.makeLayerDeletable(layer);
            this.makeLayerZindexable(layer);
            this.makeLayerSortable(layer);
            this.refreshLayers();
            this.formAddLayer(layer);
            this.items.refreshSortableConnect();
            this.refreshSortableConnectWith();
            this.switchToLayerTab();
            this.setActiveLayer($(layer));
        },
        addLayer: function (node) {
            var $layer = $(node).clone(),
                layer = $layer[0];
            $layer.find('[class^=ui-]').remove();
            $layer.find('.active').removeClass('active');
            $layer.find('.ui-resizable').removeClass('ui-resizable');
            $layer.find('.ui-draggable').removeClass('ui-draggable');
            $layer.find('.ui-sortable').removeClass('ui-sortable');
            this.layercanvas.append($layer);
            this.makeLayerResizeable(layer);
            this.makeLayerDraggable(layer);
            this.makeLayerDeletable(layer);
            this.makeLayerZindexable(layer);
            this.makeLayerSortable(layer);
            this.refreshLayers();
            this.formAddLayer(layer);
            this.items.initLayer(layer);
            this.items.refreshSortableConnect();
            this.refreshSortableConnectWith();
            return $layer;
        },
        refreshLayers: function () {
            this.layers = this.slide.find(this.layerClass);
        },
        makeLayerResizeable: function (layer) {
            var $this = this,
                $layer = $(layer);
            $layer.resizable({
                /*disabled: !this.active,*/
                handles: 'n, e, s, w, ne, se, sw, nw',
                containment: this.layercanvas,
                start: function () {
                    $('#smartslider-admin').addClass('smartslider-layer-highlight-active-2');
                },
                stop: function () {
                    $('#smartslider-admin').removeClass('smartslider-layer-highlight-active-2');
                    $this.makeLayerToPercent(this, true, true);
                }
            });

            $layer.find('> .ui-resizable-handle').on('mouseenter',function () {
                slideconsole.set('Resize layer - drag', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerDeletable: function (layer) {
            var $this = this;
            var removeLayer = $('<div class="ui-removelayer-handle" style="z-index: 92;"></div>');
            $(layer).append(removeLayer);
            removeLayer.on('click',function () {
                $this.deleteLayer(layer);
                slideconsole.set('Layer deleted', 2);
            }).on('mouseenter',function () {
                    slideconsole.set('Delete layer - click', 1, 0);
                }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerZindexable: function (layer) {
            var $this = this,
                $layer = $(layer),
                forward = $('<div class="ui-forward-handle" style="z-index: 91;"></div>'),
                backward = $('<div class="ui-backward-handle" style="z-index: 91;"></div>'),
                $zindex = $('<div class="ui-zindex-handle" style="z-index: 91;"></div>');

            var i = parseInt($layer.css('zIndex'));
            if (!i) {
                i = this.zindex.length > 0 ? this.zindex.length : 1;
            }
            while (this.zindex[i]) {
                i++;
            }
            this.zindex[i] = $layer;
            $layer.css('zIndex', i);

            $layer.data('sszIndex', $zindex);

            $zindex.html(i);
            $layer.append(forward)
                .append($zindex)
                .append(backward);
            forward.on('click',function () {
                var i1 = parseInt($layer.css('zIndex')),
                    i2 = i1 + 1,
                    tmp = undefined;
                if ($this.zindex[i2]) {
                    tmp = $this.zindex[i2];
                    tmp.css('zIndex', i1);
                    tmp.data('sszIndex').html(i1);
                }
                $this.zindex[i2] = $layer;
                $this.zindex[i1] = tmp;
                $layer.css('zIndex', i2);
                $zindex.html(i2);
                //$this.layers.removeClass('smart-slider-main-layer');
                //$($this.zindex[1]).addClass('smart-slider-main-layer');
            }).on('mouseenter',function () {
                    $this.slide.addClass('smart-slider-showzindex');
                }).on('mouseleave', function () {
                    $this.slide.removeClass('smart-slider-showzindex');
                });
            backward.on('click',function () {
                var i1 = parseInt($layer.css('zIndex')),
                    i2 = i1 - 1,
                    tmp = undefined;
                if (i2 < 1)
                    return;
                if ($this.zindex[i2]) {
                    tmp = $this.zindex[i2];
                    tmp.css('zIndex', i1);
                    tmp.data('sszIndex').html(i1);
                }
                $this.zindex[i2] = $layer;
                $this.zindex[i1] = tmp;
                $layer.css('zIndex', i2);
                $zindex.html(i2);
                //$this.layers.removeClass('smart-slider-main-layer');
                //$($this.zindex[1]).addClass('smart-slider-main-layer');
            }).on('mouseenter',function () {
                    $this.slide.addClass('smart-slider-showzindex');
                }).on('mouseleave', function () {
                    $this.slide.removeClass('smart-slider-showzindex');
                });

            $zindex.on('mouseenter',function () {
                $this.slide.addClass('smart-slider-showzindex');
            }).on('mouseleave', function () {
                    $this.slide.removeClass('smart-slider-showzindex');
                });


            forward.on('mouseenter',function () {
                slideconsole.set('Increment z-index - click', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });

            backward.on('mouseenter',function () {
                slideconsole.set('Decrement z-index - click', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });

            $zindex.on('mouseenter',function () {
                slideconsole.set('Current z-index', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerDraggable: function (layer) {
            var $this = this,
                $layer = $(layer),
                handle = $('<div class="ui-movable-handle" style="z-index: 91;"></div>');
            $layer.draggable({
                disabled: !this.active,
                containment: this.layercanvas,
                create: function () {
                    $(this).append(handle);
                },
                start: function () {
                    $('#smartslider-admin').addClass('smartslider-layer-highlight-active-2');
                },
                stop: function () {
                    $('#smartslider-admin').removeClass('smartslider-layer-highlight-active-2');
                    $this.makeLayerToPercent(this, true);
                },
                handle: '.ui-movable-handle'
            });
            handle.on('mouseenter',function () {
                slideconsole.set('Move layer - drag', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerToPercent: function (layer, position, size) {
            var $layer = $(layer);
            if (position) {
                $layer.css('left', (parseFloat($layer.css('left')) / this.slideSize.width * 100).toFixed(3) + '%');
                $layer.css('top', (parseFloat($layer.css('top')) / this.slideSize.height * 100).toFixed(3) + '%');
            }
            if (size) {
                $layer.width(Math.ceil(1000 * $layer.width() / this.slideSize.width * 100) / 1000 + '%');
                $layer.height(Math.ceil(1000 * $layer.height() / this.slideSize.height * 100) / 1000 + '%');
            }
            this.updatePositionField(layer);
        },
        makeLayerSortable: function (layer) {
            var $this = this;
            $(layer).nextendSortable({
                disabled: !this.items.active,
                items: this.sortableItems,
                zIndex: 120000,
                helper: "clone",
                placeholder: "sortable-placeholder",
                forcePlaceholderSize: true,
                tolerance: "pointer",
                appendTo: this.layercanvas,
                handle: '.ui-movableitem-handle',
                update: function (event, ui) {
                    $this.items.updateItem(ui);
                },
                start: function () {
                    $this.slide.addClass('smartslider-layer-border-mode');
                    slideconsole.set('Drop the item into a layer', 2, 0);
                },
                stop: function () {
                    $this.slide.removeClass('smartslider-layer-border-mode');
                    slideconsole.set('Item dropped into the layer', 2);
                }
            });
        },
        makeDummyLayerSortable: function () {
            var $this = this;

            this.dummyLayer = $('#smart-slider-layer-dummy');
            this.dummyLayer.nextendSortable({
                items: this.sortableItems,
                zIndex: 12,
                helper: "clone",
                tolerance: "pointer",
                appendTo: 'body',
                handle: '.ui-movableitem-handle',
                update: function (event, ui) {

                }
            });
            window.dummySortable = this.dummyLayer.data('ui-sortable');
        },
        deleteLayers: function () {
            var $this = this;
            this.layers.each(function (i, layer) {
                $this.deleteLayer(layer);
            });
        },
        deleteLayer: function (layer) {
            var $layer = $(layer);
            //$layer.data('sszIndex');
            this.zindex[parseInt($layer.css('zIndex'))] = null;

            $layer.resizable('destroy');
            $layer.draggable('destroy');
            $layer.nextendSortable('destroy');
            var option = $layer.data('ssoption'),
                select = option.parent()[0],
                optgroup = $layer.data('ssoptgroup'),
                optgroupselect = optgroup.parent()[0];
            select.selectedIndex = optgroupselect.selectedIndex = 0;
            $.fireEvent(optgroupselect, 'change');
            $.fireEvent(select, 'change');
            option.remove();
            optgroup.remove();
            $layer.remove();
            this.refreshLayers();
            this.refreshSortableConnectWith();
            this.items.refreshSortableConnect();
        },
        refreshSortableConnectWith: function () {
            this.layers.nextendSortable('option', 'connectWith', this.layers.add(this.items.items).add(this.dummyLayer));
        },
        destroy: function () {
            /*
             * Use getHTML instead
             * 
             */
            this.layers.resizable('destroy');
            this.layers.draggable('destroy');
            this.layers.nextendSortable('destroy');
            this.slide.find('[class^=ui-]').remove();
            this.slide.find('.active').removeClass('active');
        },
        getHTML: function () {
            var slide = this.layercanvas.clone();
            slide.find('[class^=ui-]').remove();
            slide.find('.active').removeClass('active');
            slide.find('.ui-resizable').removeClass('ui-resizable');
            slide.find('.ui-draggable').removeClass('ui-draggable');
            slide.find('.ui-sortable').removeClass('ui-sortable');
            slide.appendTo($('body'));
            slide.children().removeAttr('aria-disabled');
            var html = slide.html();
            slide.remove();

            return $.trim(html)/*.replace(/\\/g,'\\\\')*/;
        },
        initToolbox: function () {
            var $this = this;
            this.toolbox = $('#smartslider-slide-toolbox-layer');
            this.form = {};
            this.form.tabs = this.toolbox.find('.nextend-tab').slice(1);
            this.form.layers = $('#layerlayer').on('change', function (e) {
                $this.changeActiveLayer(e);
            });
            this.form.layersSelect = $(this.form.layers[0].select).css('float', 'left');
            var deleteLayer = $('<a href="#" class="smartslider-icon smartslider-icon-trash"></a>');
            var selectparent = this.form.layersSelect.parent();
            deleteLayer.css({
                float: 'left',
                marginTop: '2px'
            });
            deleteLayer.appendTo(selectparent);
            deleteLayer.on('click', function (e) {
                e.preventDefault();
                var si = $this.form.layersSelect[0].selectedIndex;
                if (si) {
                    if (confirm('Are you sure that you want to delete the layer?')) {
                        var layer = $($this.form.layersSelect[0].options[si]).data('sslayer');
                        $this.deleteLayer(layer);
                    }
                } else {
                    alert('Layer not selected!');
                }
            });

            var duplicateLayer = $('<a href="#" class="smartslider-icon smartslider-icon-duplicate"></a>');
            duplicateLayer.css({
                float: 'left',
                marginTop: '2px'
            });
            duplicateLayer.appendTo(selectparent);
            duplicateLayer.on('click', function (e) {
                e.preventDefault();
                var si = $this.form.layersSelect[0].selectedIndex;
                if (si) {
                    var $layer = $this.addLayer($($this.form.layersSelect[0].options[si]).data('sslayer'));
                    $this.setActiveLayer($layer);
                } else {
                    alert('Layer not selected!');
                }
            });

            this.form.defaults = {};
            this.form.fields = this.toolbox.find('[name^="layer"]').slice(1);
            this.form.positionfields = this.form.fields.slice(1, 5);

            this.form.positionfields.eq(0).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'left', this.value);
            });
            this.form.positionfields.eq(1).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'top', this.value);
            });
            this.form.positionfields.eq(2).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'width', this.value);
            });
            this.form.positionfields.eq(3).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'height', this.value);
            });

            this.form.fields = this.form.fields.not(this.form.positionfields);

            this.form.fields.each(function () {
                var $el = $(this);
                $el.data('name', $el.attr('name').match(/layer\[(.*?)\]/)[1]);
            });
            this.form.fields.slice(1).each(function () {
                var $el = $(this),
                    $name = $el.data('name');
                $this.form.defaults[$name] = $el.val();
                $el.on('change', function () {
                    $this.changeActiveLayerData($name, $el.val());
                });
            });
            this.form.fields.eq(0).on('change keyup', function (e) {
                var name = e.currentTarget.value,
                    option = $this.activeLayer.data('ssoption')[0],
                    $options = $($this.form.layersSelect[0].options),
                    namecheckfn = function () {
                        if (this.value == name && this != option) {
                            name += ' - copy';
                            $options.each(namecheckfn);
                            return false;
                        }
                    };
                if (name == '') name = 'empty';
                $options.each(namecheckfn);
                e.currentTarget.value = name;
                $this.changeActiveLayerName(e.currentTarget.value);
            });
            this.form.layers.trigger('change');
        },
        formAddLayer: function (layer) {
            var $layer = $(layer);
            if ($layer.ssdata('name') === undefined) {
                $layer.ssdata('name', 'Layer #' + (this.form.layersSelect[0].options.length));
            }
            var name = $layer.ssdata('name'),
                $options = $(this.form.layersSelect[0].options),
                namecheckfn = function () {
                    if (this.value == name) {
                        name += ' - copy';
                        $layer.ssdata('name', name);
                        $options.each(namecheckfn);
                        return false;
                    }
                };
            $options.each(namecheckfn);

            var $option = $('<option value="' + name + '">' + $layer.ssdata('name') + '</option>');
            this.form.layersSelect.append($option);
            $layer.data('ssoption', $option);
            $option.data('sslayer', $layer);
            var $optgroup = $('<optgroup label="' + $layer.ssdata('name') + '"></optgroup>');
            this.items.form.select.append($optgroup);
            $layer.data('ssoptgroup', $optgroup);
            $optgroup.data('sslayer', $layer);
            this.makeLayerActivable($layer);
        },
        makeLayerActivable: function ($layer) {
            var $this = this;
            $layer.on('mousedown', function (e) {
                $this.setActiveLayer($layer, e);
                slideconsole.set('Layer selected', 1);
            });
        },
        changeActiveLayer: function (e) {
            var select = e.currentTarget.select;
            if (select.selectedIndex === 0) {
                this.form.tabs.css('display', 'none');
                this.activeLayer.removeClass('active');
                this.activeLayer = $({});
                this.form.fields.eq(0).val('Choose a layer');
            } else {
                this.setActiveLayer($(select.options[select.selectedIndex]).data('sslayer'), e);
                this.form.tabs.css('display', 'block');
                $(window).trigger('resize');
            }
        },
        setActiveLayer: function ($layer, e) {
            if (e) {
                if (e.type === 'change' && !this.active) {
                    return;
                } else if (!this.items.clicked) {
                    this.switchToLayerTab();
                }
            }
            if ($layer === this.activeLayer)
                return;
            var $form = this.form,
                $this = this,
                layer = $layer[0];
            this.activeLayer.removeClass('active');
            this.activeLayer = $layer;
            this.activeLayer.addClass('active');
            var option = $layer.data('ssoption');

            if (option.val() !== $form.layers.val()) {
                $form.layers.val(option.val());
                $.fireEvent($form.layers[0], 'change');
            }

            this.updatePositionField(layer);

            this.form.fields.each(function () {
                var $el = $(this),
                    name = $el.data('name');
                $this.changeFormValueFromData($el, name, $layer);
            });

        },
        updatePositionField: function (layer) {
            this.form.positionfields.eq(0).val(layer.style.left);
            this.form.positionfields.eq(1).val(layer.style.top);
            this.form.positionfields.eq(2).val(layer.style.width);
            this.form.positionfields.eq(3).val(layer.style.height);
        },
        setPositionField: function (layer, prop, v) {
            if (v.match(/^[0-9]*\.?[0-9]*%$/) !== null) {
                layer.style[prop] = v;
            } else if (v.match(/^[0-9]*px$/) !== null) {
                layer.style[prop] = v;
                this.makeLayerToPercent(layer, (prop === 'top' || prop === 'left'), (prop === 'width' || prop === 'height'));
            } else if (parseInt(v) === 0) {
                layer.style[prop] = '0%';
            }
            return layer.style[prop];
        },
        changeFormValueFromData: function ($el, name, $layer) {
            var layerValue = $layer.ssdata(name);
            if (layerValue === undefined) {
                $layer.ssdata(name, this.form.defaults[name]);
                layerValue = this.form.defaults[name];
            }
            if ($el.val() !== layerValue) {
                $el.val(layerValue);
                $.fireEvent($el[0], 'change');
            }
        },
        changeActiveLayerName: function (name) {
            if (this.activeLayer.length === 0)
                return;
            this.activeLayer.ssdata('name', name).data('ssoption').val(name).text(name);
            this.activeLayer.data('ssoptgroup').attr('label', name);
            this.form.layers.val(name);
        },
        changeActiveLayerData: function (name, value) {
            this.activeLayer.ssdata(name, value);
        },

        initAdvancedView: function () {
            var $this = this,
                $admin = $('#smartslider-admin'),
                options = $('.smartslider-advanced-layers .smartslider-toolbar-options'),
                classes = ['smartslider-advanced-layers-simple-active', 'smartslider-advanced-layers-advanced-active'],
                tableContainer = $('.smartslider-slide-advanced-layers').css('display', 'none');
            table = $('<table><thead><th>Layer name</th><th>Left<br>Top</th><th>Width<br>Height</th><th></th><th>Animation</th><th>Duration</th><th>Easing</th><th>Delay</th><th>Parallax</th><th>Play out</th></thead><tbody></tbody></table>')
            tbody = table.find('tbody');

            tableContainer.append(table);

            options.eq(0).on('click', function () {
                $admin.addClass(classes[0]).removeClass(classes[1]);
                tableContainer.css('display', 'none');
                $('.ui-layer-overlay').remove();
                tbody.children().remove();
                $(window).trigger('resize');
            });
            options.eq(1).on('click', function () {
                var activeTRs = $([]);
                $admin.addClass(classes[1]).removeClass(classes[0]);
                var select = $this.form.layersSelect;
                select[0].selectedIndex = 0;
                NfireEvent(select[0], 'change');

                var animationSelect = $($this.form.fields.get(1).select).clone().removeAttr('id'),
                    easingSelect = $($this.form.fields.get(3).select).clone().removeAttr('id'),
                    msInput = $this.form.fields.eq(2).parent().clone(),
                    onoff = $this.form.fields.eq(6).parent().clone();

                msInput.find('input').removeAttr('id');
                onoff.find('input').removeAttr('id');

                var layers = $this.layers;
                layers.each(function (i) {

                    var layer = this,
                        $el = $(this),
                        $tr = $('<tr class="n-in ' + (i % 2 ? 'even' : 'odd') + '"></tr>'),
                        $tr2 = $('<tr class="n-out ' + (i % 2 ? 'even' : 'odd') + '"></tr>');

                    $el.append($('<div class="ui-layer-overlay"></div>').on('click', function(){
                        activeTRs.removeClass('active');
                        activeTRs = $.merge($tr, $tr2).addClass('active');
                    }));

                    $tr.append($('<td rowspan="2" class="rs2">' +
                        '<div class="nextend-text">' +
                        '<input type="text" autocomplete="off" value="' + $el.data('name') + '" name="row-' + i + '-name">' +
                        '</div>' +
                        '</td>'));
                    $tr.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.left + '" name="row-' + i + '-left">' +
                        '</div>' +
                        '</td>'));
                    $tr2.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.top + '" name="row-' + i + '-top">' +
                        '</div>' +
                        '</td>'));
                    $tr.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.width + '" name="row-' + i + '-width">' +
                        '</div>' +
                        '</td>'));
                    $tr2.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.height + '" name="row-' + i + '-height">' +
                        '</div>' +
                        '</td>'));
                    $tr.append($('<td class="t-label">In</td>'));
                    $tr2.append($('<td class="t-label">Out</td>'));

                    $tr.append($('<td></td>').append(animationSelect.clone().attr('name', 'row-' + i + '-animationin').val($el.data('animationin'))));
                    $tr2.append($('<td></td>').append(animationSelect.clone().attr('name', 'row-' + i + '-animationout').val($el.data('animationout'))));

                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-durationin').val($el.data('durationin'));
                    $tr.append($('<td></td>').append(ms));
                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-durationout').val($el.data('durationout'));
                    $tr2.append($('<td></td>').append(ms));


                    $tr.append($('<td></td>').append(easingSelect.clone().attr('name', 'row-' + i + '-easingin').val($el.data('easingin'))));
                    $tr2.append($('<td></td>').append(easingSelect.clone().attr('name', 'row-' + i + '-easingout').val($el.data('easingout'))));


                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-delayin').val($el.data('delayin'));
                    $tr.append($('<td></td>').append(ms));
                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-delayout').val($el.data('delayout'));
                    $tr2.append($('<td></td>').append(ms));

                    $tr.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input  type="text" autocomplete="off" value="' + $el.data('parallaxin') + '" name="row-' + i + '-parallaxin">' +
                        '</div>' +
                        '</td>'));
                    $tr2.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + $el.data('parallaxout') + '" name="row-' + i + '-parallaxout">' +
                        '</div>' +
                        '</td>'));

                    var playoutid = 'row-' + i + '-playoutafter';
                    var playout = onoff.clone();
                    playout.find('input').attr('id', playoutid).attr('name', 'row-' + i + '-playoutafter').val($el.data('playoutafter'));
                    $tr.append($('<td></td>').append(playout));
                    $tr2.append($('<td></td>'));

                    tbody.append($tr);
                    tbody.append($tr2);

                    new NextendElementOnoff({
                        hidden: playoutid
                    });

                });

                tbody.find('input, select').on('change', function () {
                    var $el = $(this),
                        field = $el.attr('name').match(/row-([0-9]+)-(.*)/);
                    if (field.length == 3) {
                        field[1] = parseInt(field[1]);

                        var $layer = $this.layers.eq(field[1]);

                        switch (field[2]) {
                            case 'left':
                            case 'top':
                            case 'width':
                            case 'height':
                                $el.val($this.setPositionField($layer[0], field[2], $el.val()));
                                break;
                            case 'name':
                                var name = $el.val(),
                                    option = $layer.data('ssoption')[0],
                                    $options = $($this.form.layersSelect[0].options),
                                    namecheckfn = function () {
                                        if (this.value == name && this != option) {
                                            name += ' - copy';
                                            $options.each(namecheckfn);
                                            return false;
                                        }
                                    };
                                if (name == '') name = 'empty';
                                $options.each(namecheckfn);
                                $this.setActiveLayer($layer);
                                $this.changeActiveLayerName(name);
                                select[0].selectedIndex = 0;
                                NfireEvent(select[0], 'change');
                                $el.val(name);
                                break;
                            default:
                                $layer.ssdata(field[2], $el.val());
                                break;
                        }
                    }
                });
                tableContainer.css('display', 'block');
                $(window).trigger('resize');
            });

        }
    });
})(njQuery, window);