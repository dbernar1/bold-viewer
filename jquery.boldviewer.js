//jquery.boldviewer.js
/*! BoldViewer @version 0.0.1-5 | Bold Innovation Group | MIT License | github.com/BOLDInnovationGroup/image-viewer */
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
			html = '<div id="boldviewer-overlay">\
					<div id="boldviewer-wrapper">\
						<div id="boldviewer-content">\
                            <div id="boldviewer-content-slider"></div>\
                        </div>\
                        <div id="boldviewer-overlays">\
                            <a id="boldviewer-prev"><i class="fa fa-angle-left"></i></a>\
                            <a id="boldviewer-next"><i class="fa fa-angle-right"></i></a>\
                            <div id="boldviewer-top">\
                                <div id="boldviewer-top-items"></div>\
                                <a id="boldviewer-close"><i class="fa fa-close"></i></a>\
                            </div>\
                            <div id="boldviewer-bottom">\
                                <div id="boldviewer-bottom-tray">\
                                    <div id="boldviewer-page-indicators"></div>\
                                    <div id="boldviewer-thumbnails"></div>\
                                </div>\
                            </div>\
                        </div>\
					</div>\
			     </div>',
            
        viewer = {
            init: function(index) {
                $('body').append(html);
                
                viewer.slider = $("#boldviewer-content-slider");
                viewer.pageIndicators = $('#boldviewer-page-indicators');
                viewer.thumbnails = $('#boldviewer-thumbnails');
                
                $elem.each( function() {
                    var $img = $('<div class="slide"><img data-src=' + $(this).attr('href') + ">");
                    viewer.slider.append($img);
                    
                    var $pageIndicator = $('<div class="page-indicator"><i class="fa fa-circle"></i></div>');
                    viewer.pageIndicators.append($pageIndicator);
                    
                    var $thumbnail = $('<div class="thumbnail" style="background:url(' + $(this).data('thumbnail') + ')">');
                    viewer.thumbnails.append($thumbnail);
                });
                
                viewer.slides = viewer.slider.find(".slide");
                viewer.bindActions();
                
//                viewer.setSlide(index);
            },
            bindActions: function() {
//                $('#bold-viewer-close, #boldviewer-overlay').on('click', function() {
//                    viewer.close();  
//                });
                
                $('#boldviewer-next').on('click', function(e) {
                    e.stopPropagation();
                    viewer.nextSlide();
                });
                
                $('#boldviewer-prev').on('click', function(e) {
                    e.stopPropagation();
                    viewer.prevSlide();
                });
                
                if(plugin.settings.hideOverlayTime > 0) {
                    $('#boldviewer-wrapper').mousemove(this.handleMouseMove);
                }
                
                $('.thumbnail').on('click', function(e) {
                    e.stopPropagation();

                    viewer.setSlide(viewer.thumbnails.find('.thumbnail').index(this));
                });
                
                $('#boldviewer-close').on('click', function(e) {
                    e.stopPropagation();
                    viewer.close();
                });
            },
            handleMouseMove: function() {
                if(viewer.mouseMoveTimer != null) {
                    clearTimeout(viewer.mouseMoveTimer);
                }
                
                $('#boldviewer-wrapper').removeClass('hide-overlays');
                
                viewer.mouseMoveTimer = setTimeout(function () {
                    $('#boldviewer-wrapper').addClass('hide-overlays');
                }, plugin.settings.hideOverlayTime);
            },
            close: function() {
                $('#boldviewer-overlay').empty();
                $('#boldviewer-overlay').remove();
            },
            setSlide: function(index) {
                if(typeof index === 'undefined') {
                    index = 0;   
                }
                
                currentIndex = index;
                this.loadSlide(index);
                
                viewer.slider.css("transform", "translateX(-" + index * 100 + "%)");
                
                viewer.pageIndicators.find('.page-indicator.current').removeClass('current');
                viewer.pageIndicators.find('.page-indicator:nth-of-type(' + (index+1) + ")").addClass('current');
                
                viewer.thumbnails.find('.thumbnail.current').removeClass('current');
                viewer.thumbnails.find('.thumbnail:nth-of-type(' + (index+1) + ")").addClass('current');
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