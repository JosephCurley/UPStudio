UP = window.UP || {};

UP.footer= (function() {
	var init = function(){
		var $toggle = $('.js-slide__title');

		$toggle.on('click', function(e) {

			e.preventDefault();

			var $parent = $(this).closest('.js-slide');
			var $body = $parent.find('.js-slide__body');

			if ($(this).hasClass('about-project__title-bar') && !$parent.hasClass('js-open')){
				$el = $(this);
				$('html, body').animate({
        			scrollTop: $el.offset().top
    			}, 1000, 'linear');
			}
			$parent.toggleClass('js-open');
		});
	}

	return {
		init: init
	};

})();

jQuery(document).ready(function($) {
	UP.footer.init();
});
