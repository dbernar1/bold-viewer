//jquery.boldviewer.js
/*! BoldViewer @version 0.2.0-1 | Bold Innovation Group | MIT License | github.com/BOLDInnovationGroup/image-viewer */
/* Based on Swipebox github.com/brutaldesign/swipebox */

;( function ( window, document, $, undefined ) {

	$.boldviewer = function( elem, options ) {
        // Default options
		var viewer,
			defaults = {
				beforeOpen: null,
				afterOpen: null,
				afterClose: null,
                slideShown: null,
                hideOverlayTime: 5000,
                allowKeyboard: true,
                topItemsHtml: '',
                extraAttrs: ''
			},
			
			plugin = this,
			$elem,
			selector = elem.selector,
			$selector = $( selector ),
			/* jshint multistr: true */
			html = '<div id="bv-overlay">\
					<div id="bv-wrapper" tabindex="1">\
						<div id="bv-content">\
                            <div id="bv-content-slider"></div>\
                        </div>\
                        <div id="bv-overlays">\
                            <a id="bv-prev"><i class="fa fa-angle-left"></i></a>\
                            <a id="bv-next"><i class="fa fa-angle-right"></i></a>\
                            <div id="bv-bottom"><div id="bv-bottom-tray"><div id="bv-page-indicators"></div><div id="bv-thumbnails"></div></div></div>\
                            <div id="bv-top"><div id="bv-top-items"></div><a id="bv-close"><i class="fa fa-close"></i></a></div>\
                        </div>\
					</div>\
			     </div>',
                     
        viewer = {
            init: function(index) {
                
                if(plugin.settings.beforeOpen) {
                    plugin.settings.beforeOpen();
                }
                
                var oldViewer = $('body').find("#bv-overlay");
                if(oldViewer) {
                    oldViewer.remove();    
                }
                
                $('body').append(html);
                
                viewer.slider = $("#bv-content-slider");
                viewer.pageIndicators = $('#bv-page-indicators');
                viewer.thumbnails = $('#bv-thumbnails');
                viewer.topItems = $('#bv-top-items');
                
                $elem.each( function() {
                    var extraAttrs = $(this).data('extra-attrs') + " " + plugin.settings.extraAttrs;
                    var imgHTML = '<div class="bv-slide" data-src=' + $(this).attr('href') + ' ';
                    
                    if(extraAttrs) {
                        imgHTML += extraAttrs;
                    }
                    
                    imgHTML += ">";
                    
                    var $img = $(imgHTML);
                    viewer.slider.append($img);
                    
                    var $pageIndicator = $('<div class="bv-page-indicator"><i class="fa fa-circle"></i></div>');
                    viewer.pageIndicators.append($pageIndicator);
                    
                    var $thumbnail = $('<div class="bv-thumbnail" style="background:url(' + $(this).data('thumbnail') + ')">');
                    viewer.thumbnails.append($thumbnail);
                });
                
                viewer.slides = viewer.slider.find(".bv-slide");
                viewer.topItems.html(plugin.settings.topItemsHtml);
                viewer.bindActions();
                
                $('html').css('overflow', 'hidden');
            },
            bindActions: function() {
                $('#bv-next').on('click', function(e) {
                    e.stopPropagation();
                    viewer.nextSlide();
                    if(plugin.settings.hideOverlayTime > 0) {
                        viewer.resetOverlayTimer();
                    }
                });
                
                $('#bv-prev').on('click', function(e) {
                    e.stopPropagation();
                    viewer.prevSlide();
                    if(plugin.settings.hideOverlayTime > 0) {
                        viewer.resetOverlayTimer();
                    }
                });
                
                if(plugin.settings.hideOverlayTime > 0) {
                    $('#bv-wrapper').mousemove(viewer.resetOverlayTimer);
                }
                
                $('.bv-thumbnail').on('click', function(e) {
                    e.stopPropagation();

                    viewer.setSlide(viewer.thumbnails.find('.bv-thumbnail').index(this));
                    
                    if(plugin.settings.hideOverlayTime > 0) {
                        viewer.resetOverlayTimer();
                    }
                });
                
                $('#bv-close').on('click', function(e) {
                    e.stopPropagation();
                    viewer.close();
                });
                
                if(plugin.settings.allowKeyboard) {
                    $('#bv-wrapper').keydown(function (e) {
                        if(e.which == 37) {
                            e.preventDefault();
                            viewer.prevSlide();
                        } else if(e.which == 39) {
                            e.preventDefault();
                            viewer.nextSlide();
                        } else if(e.which == 27) {
                            e.preventDefault();
                            viewer.close();
                        } else if(e.which == 36) {
                            e.preventDefault();
                            viewer.setSlide(0);
                        } else if(e.which == 35) {
                            e.preventDefault();
                            viewer.setSlide(viewer.slides.length-1);
                        }
                    });
                }
                
                $('#bv-overlays')[0].addEventListener('touchstart', function (e) {
//                    e.preventDefault();
                    viewer.startDrag($('#bv-content-slider'), e);
                }, false);
                
                $('#bv-overlays')[0].addEventListener('touchend', function (e) {
                    viewer.stopDrag($('#bv-content-slider'));
                }, false);
                
                $('#bv-overlays')[0].addEventListener('touchcancel', function (e) {
                    viewer.stopDrag($('#bv-content-slider'));
                }, false);
                
                $('#bv-overlays')[0].addEventListener('touchmove', function (e) {
                    viewer.doDrag($('#bv-content-slider'), e);
                    
                }, false);
            },
            startDrag: function(elem, event) {
                $this = elem;
                $this.data('dragging', true);
                $this.data('mouseX', event.touches[0].pageX);
                $this.data('old-transition-duration', $this.css('transition-duration'));
                $this.data('old-webkit-transition-duration', $this.css('-webkit-transition-duration'));
                $this.css('-webkit-transition-duration', '0s');
                $this.css('transition-duration', '0s');
            },
            stopDrag: function(elem) {
                $this = elem;
                $this.data('dragging', false);
                $this.data('mouseX', '');
                $this.css('-webkit-transition-duration', $this.data('old-webkit-transition-duration'));
                
                //figure out what slide to go to
                var style = window.getComputedStyle($this.get(0));  // Need the DOM object
                var matrix = new WebKitCSSMatrix(style.webkitTransform);
                var currentTranslateX = matrix.m41;
                
                var pageWidth = $this.width();
                var page = Math.round(-currentTranslateX / $this.width())
                
                if(page >= viewer.slides.length) {
                    page = viewer.slides.length -1;
                } else if (page < 0) {
                    page = 0;
                }
                
                viewer.setSlide(page);
            },
            doDrag: function(elem, event) {
                $this = elem;
                if($this.data('dragging')) {
                    var xDiff = event.touches[0].pageX - $this.data('mouseX');
                    var style = window.getComputedStyle($this.get(0));  // Need the DOM object
                    var matrix = new WebKitCSSMatrix(style.webkitTransform);
                    var currentTranslateX = matrix.m41;

                    $this.css('transform',  "translateX(" + (currentTranslateX + xDiff) + "px)")
                    $this.data('mouseX', event.touches[0].pageX);
                }
            },
            resetOverlayTimer: function() {
                if(viewer.overlayTimer != null) {
                    clearTimeout(viewer.overlayTimer);
                }
                
                $('#bv-wrapper').removeClass('bv-hide-overlays');
                
                if(plugin.settings.hideOverlayTime > 0) {
                    viewer.overlayTimer = setTimeout(function () {
                        
                        //overlay hiding could have been disabled while waiting for the timeout
                        if(plugin.settings.hideOverlayTime > 0) {
                            $('#bv-wrapper').addClass('bv-hide-overlays');
                        }
                    }, plugin.settings.hideOverlayTime);
                }
            },
            close: function() {
                $('#bv-overlay').empty();
                $('#bv-overlay').remove();
                $('html').css('overflow', 'scroll');
                
                if(plugin.settings.afterClose) {
                   plugin.settings.afterClose();
                }
            },
            setSlide: function(index) {
                if(typeof index === 'undefined') {
                    index = 0;   
                }
                
                var previousIndex = this.currentIndex;
                this.currentIndex = index;
                
                viewer.slider.css("transform", "translateX(-" + index * 100 + "%)");
                
                viewer.pageIndicators.find('.bv-page-indicator.bv-current').removeClass('bv-current');
                viewer.pageIndicators.find('.bv-page-indicator:nth-of-type(' + (index+1) + ")").addClass('bv-current');
                viewer.pageIndicators.css("transform", "translateX(-" + (index * 100) + "%)");
                
                viewer.thumbnails.find('.bv-thumbnail.bv-current').removeClass('bv-current');
                viewer.thumbnails.find('.bv-thumbnail:nth-of-type(' + (index+1) + ")").addClass('bv-current');
                viewer.thumbnails.css("transform", "translateX(-" + (index * 100 + 50) + "%)");
                
                
                if(Math.abs(previousIndex-1 - index) > 1)
                    this.unloadSlide(previousIndex-1);
                
                if(Math.abs(previousIndex - index) > 1)
                    this.unloadSlide(previousIndex);
                
                if(Math.abs(previousIndex+1 - index) > 1)
                    this.unloadSlide(previousIndex+1);
                
                this.loadSlide(index);
                
                // preload adjacent slides
                this.loadSlide(index-1);
                this.loadSlide(index+1);
                
                if(plugin.settings.slideShown) {
                   plugin.settings.slideShown(viewer.slides[index], index);
                }
            },
            loadSlide: function(index) {
                if(index >= 0 && index < viewer.slides.length) {
                    var slide = $(viewer.slides[index]);

                    if(slide.children().length == 0) {
                        slide.html('<img src=' + slide.data('src') +'>');
                    }
                }
            },
            unloadSlide: function(index) {
                if(index >= 0 && index < viewer.slides.length) {
                    $(viewer.slides[index]).empty();
                }
            },
            nextSlide: function() {
                if(this.currentIndex < viewer.slides.length - 1) {
                    viewer.setSlide(this.currentIndex+1);
                }
            },
            prevSlide: function() {
                if(this.currentIndex > 0) {
                    viewer.setSlide(this.currentIndex-1);
                }
            },
            currentIndex : -1,
            slider : null,
            slides : new Array(),
            pageIndicators: null,
            thumbnails: null,
        };
    
        plugin.init = function() {
            plugin.settings = $.extend( {}, defaults, options );
            $elem = $(selector);
                       
            $(document).on('click', selector, function (e) {
                e.preventDefault();
                viewer.init();
                viewer.setSlide($elem.index(this));
                $('#bv-wrapper').focus();
                
                if(plugin.settings.afterOpen) {
                    plugin.settings.afterOpen();
                }
            });
        };
        
        plugin.init();
    };
    
    $.fn.boldviewer = function( options ) {

		if ( ! $.data( this, '_boldviewer' ) ) {
			var boldviewer = new $.boldviewer( this, options );
			this.data( '_boldviewer', boldviewer );
		}
		return this.data( '_boldviewer' );
	
	};
    
}( window, document, jQuery ) );
