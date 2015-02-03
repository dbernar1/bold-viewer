//jquery.boldviewer.js
/*! BoldViewer @version 0.0.1-7 | Bold Innovation Group | MIT License | github.com/BOLDInnovationGroup/image-viewer */
/* Based on Swipebox github.com/brutaldesign/swipebox */

;( function ( window, document, $, undefined ) {

	$.boldviewer = function( elem, options ) {
        // Default options
		var viewer,
			defaults = {
				beforeOpen: null,
				afterOpen: null,
				afterClose: null,
				loopAtEnd: false,
                hideOverlayTime: 5000,
                allowKeyboard: true,
			},
			
			plugin = this,
			elements = [], // slides array [ { href:'...', title:'...' }, ...],
			$elem,
			selector = elem.selector,
			$selector = $( selector ),
            imageHtml = '<img class="content-item">',
			/* jshint multistr: true */
			html = '<div id="bv-overlay">\
					<div id="bv-wrapper">\
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
                $('body').append(html);
                
                viewer.slider = $("#bv-content-slider");
                viewer.pageIndicators = $('#bv-page-indicators');
                viewer.thumbnails = $('#bv-thumbnails');
                
                $elem.each( function() {
                    var $img = $('<div class="bv-slide"><img data-src=' + $(this).attr('href') + ">");
                    viewer.slider.append($img);
                    
                    var $pageIndicator = $('<div class="bv-page-indicator"><i class="fa fa-circle"></i></div>');
                    viewer.pageIndicators.append($pageIndicator);
                    
                    var $thumbnail = $('<div class="bv-thumbnail" style="background:url(' + $(this).data('thumbnail') + ')">');
                    viewer.thumbnails.append($thumbnail);
                });
                
                viewer.slides = viewer.slider.find(".bv-slide");
                viewer.bindActions();
                
//                viewer.setSlide(index);
            },
            bindActions: function() {
//                $('#bold-viewer-close, #bv-overlay').on('click', function() {
//                    viewer.close();  
//                });
                
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
            },
            setSlide: function(index) {
                if(typeof index === 'undefined') {
                    index = 0;   
                }
                
                currentIndex = index;
                this.loadSlide(index);
                
                viewer.slider.css("transform", "translateX(-" + index * 100 + "%)");
                
                viewer.pageIndicators.find('.bv-page-indicator.bv-current').removeClass('bv-current');
                viewer.pageIndicators.find('.bv-page-indicator:nth-of-type(' + (index+1) + ")").addClass('bv-current');
                viewer.pageIndicators.css("transform", "translateX(-" + (index * 100) + "%)");
                
                viewer.thumbnails.find('.bv-thumbnail.bv-current').removeClass('bv-current');
                viewer.thumbnails.find('.bv-thumbnail:nth-of-type(' + (index+1) + ")").addClass('bv-current');
                viewer.thumbnails.css("transform", "translateX(-" + (index * 100 + 50) + "%)");
            },
            loadSlide: function(index) {
                var currentSlideImg = $(viewer.slides[index]).find("img");
                currentSlideImg.attr('src', currentSlideImg.data('src'));  
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
