//jquery.boldviewer.js
/*! BoldViewer @version 0.1.3-0 | Bold Innovation Group | MIT License | github.com/BOLDInnovationGroup/image-viewer */
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
			},
			
			plugin = this,
			$elem,
			selector = elem.selector,
			$selector = $( selector ),
            imageHtml = '<img class="content-item">',
			/* jshint multistr: true */
			html = '<div id="bv-overlay">\
					<div id="bv-wrapper" tabindex="1">\
						<div id="bv-content">\
                            <div id="bv-content-slider"></div>\
                        </div>\
                        <div id="bv-overlays">\
                            <a id="bv-prev"><i class="fa fa-angle-left"></i></a>\
                            <a id="bv-next"><i class="fa fa-angle-right"></i></a>\
                            <div id="bv-top">\
                                <div id="bv-top-items"></div>\
                                <a id="bv-close"><i class="fa fa-close"></i></a>\
                            </div>\
                            <div id="bv-bottom">\
                                <div id="bv-bottom-tray">\
                                    <div id="bv-page-indicators"></div>\
                                    <div id="bv-thumbnails"></div>\
                                </div>\
                            </div>\
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
                
                $elem.each( function() {
                    var $img = $('<div class="bv-slide" data-src=' + $(this).attr('href') + ">");
                    viewer.slider.append($img);
                    
                    var $pageIndicator = $('<div class="bv-page-indicator"><i class="fa fa-circle"></i></div>');
                    viewer.pageIndicators.append($pageIndicator);
                    
                    var $thumbnail = $('<div class="bv-thumbnail" style="background:url(' + $(this).data('thumbnail') + ')">');
                    viewer.thumbnails.append($thumbnail);
                });
                
                viewer.slides = viewer.slider.find(".bv-slide");
                viewer.bindActions();
            },
            bindActions: function() {
                $('#bv-next').on('click', function(e) {
                    e.stopPropagation();
                    viewer.nextSlide();
                });
                
                $('#bv-prev').on('click', function(e) {
                    e.stopPropagation();
                    viewer.prevSlide();
                });
                
                if(plugin.settings.hideOverlayTime > 0) {
                    $('#bv-wrapper').mousemove(this.handleMouseMove);
                }
                
                $('.bv-thumbnail').on('click', function(e) {
                    e.stopPropagation();

                    viewer.setSlide(viewer.thumbnails.find('.bv-thumbnail').index(this));
                });
                
                $('#bv-close').on('click', function(e) {
                    e.stopPropagation();
                    viewer.close();
                });
                
                if(plugin.settings.allowKeyboard) {
                    $('#bv-wrapper').keydown(function (e) {
                        e.preventDefault();
                        
                        if(e.which == 37) {
                            viewer.prevSlide();   
                        } else if(e.which == 39) {
                            viewer.nextSlide();   
                        } else if(e.which == 27) {
                            viewer.close();   
                        } else if(e.which == 36) {
                            viewer.setSlide();   
                        }
                    });
                }
            },
            handleMouseMove: function() {
                if(viewer.mouseMoveTimer != null) {
                    clearTimeout(viewer.mouseMoveTimer);
                }
                
                $('#bv-wrapper').removeClass('bv-hide-overlays');
                
                viewer.mouseMoveTimer = setTimeout(function () {
                    $('#bv-wrapper').addClass('bv-hide-overlays');
                }, plugin.settings.hideOverlayTime);
            },
            close: function() {
                $('#bv-overlay').empty();
                $('#bv-overlay').remove();
                
                if(plugin.settings.afterClose) {
                   plugin.settings.afterClose();
                }
            },
            setSlide: function(index) {
                if(typeof index === 'undefined') {
                    index = 0;   
                }
                
                currentIndex = index;
                
                viewer.slider.css("transform", "translateX(-" + index * 100 + "%)");
                
                viewer.pageIndicators.find('.bv-page-indicator.bv-current').removeClass('bv-current');
                viewer.pageIndicators.find('.bv-page-indicator:nth-of-type(' + (index+1) + ")").addClass('bv-current');
                viewer.pageIndicators.css("transform", "translateX(-" + (index * 100) + "%)");
                
                viewer.thumbnails.find('.bv-thumbnail.bv-current').removeClass('bv-current');
                viewer.thumbnails.find('.bv-thumbnail:nth-of-type(' + (index+1) + ")").addClass('bv-current');
                viewer.thumbnails.css("transform", "translateX(-" + (index * 100 + 50) + "%)");
                
                
                this.loadSlide(index);
                
//                // preload adjacent slides
//                this.loadSlide(index-1);
//                this.loadSlide(index+1);
                
//                if(plugin.settings.slideShown) {
//                   plugin.settings.slideShown(viewer.slides[index], index);
//                }
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
                if(currentIndex < viewer.slides.length - 1) {
                    currentIndex ++;
                    viewer.setSlide(currentIndex);
                }
            },
            prevSlide: function() {
                if(currentIndex > 0) {
                    currentIndex --;
                    viewer.setSlide(currentIndex);
                }
            },
            currentIndex : 0,
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
