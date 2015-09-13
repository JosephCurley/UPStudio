UP = window.UP || {};

UP.lightbox = (function() {

	var $selector;
	var $image;

	var imageArray = [];
	var imageSource = '';
	var imageCpation = '';
	var imageObject = {};
	var imageIndex = '';

	var currentIndex = 0;
	var imageCount = 0;

	var $modal;
	var modalTemplate = "<div class='js-lightbox-modal'><div class='lightbox-modal__wrapper'><div class='lightbox-modal__image-wrapper'></div><div class='lightbox-modal__caption-wrapper'></div></div></div>";

	//Create a document fragment of the modal wrapper and append to the body.
	var buildModal = function() {
		$modal = $(document.createDocumentFragment());
		$modal.append(modalTemplate);
		$('body').append($modal);
	};

	var collectImages = function() {
		$selector.each(function(index, el) {
			imageObject = {};

			$(el).data('index', index);

			var $current = $(el).children('img');
			//TODO set this to work with multiple images.
			imageSource = $current.data('lightbox-src') ? $current.data('lightbox-src') : $current.attr('src');
			imageCaption = $current.data('caption') ? $current.data('caption') : $current.attr('alt');

			imageObject.src = imageSource;
			imageObject.caption = imageCaption;

			imageArray.push(imageObject);
		});

		//account for off by one error
		imageCount = imageArray.length - 1;
	}

	//Open the modal.
	var openModal = function(index) {
		currentIndex = index;
		var currentImage = imageArray[index].src;
		var currentCaption = imageArray[index].caption;
		$("<img src='" + currentImage + "'>").appendTo($('.lightbox-modal__image-wrapper')).load(function(){
			setWidth();
		});
		$("<p>" + currentCaption + "</p>").appendTo($('.lightbox-modal__caption-wrapper'));
		$('body').addClass('modal--is-open');
	};

	//Close Modal
	var closeModal = function() {
		$('body').removeClass('modal--is-open');
		$('.lightbox-modal__image-wrapper').empty();
		$('.lightbox-modal__caption-wrapper').empty();
	}

	var transitionLightbox = function(e) {
		if (e.keyCode === 37) {
			transitionBack();
		} else if (e.keyCode === 39) {
			transitionForward();
		} else if (e.keyCode === 38) {
			closeModal();
		}
	}
	var transitionBack = function() {
		//If Current index is greater than 0, subtract one, else loop.
		currentIndex = currentIndex > 0 ? currentIndex - 1 : imageCount;  
		reloadContent(currentIndex); 
	}

	var transitionForward = function() {
		currentIndex = currentIndex === imageCount ? 0 : currentIndex + 1;  
		reloadContent(currentIndex); 
	}

	var reloadContent = function(index){

		$('.lightbox-modal__image-wrapper img').attr('src', imageArray[index].src );
		$('.lightbox-modal__caption-wrapper p').html(imageArray[index].caption);
		setWidth();
	}

	var setWidth = function(){
		var imageWidth = $('.lightbox-modal__image-wrapper img').width();
		$('.lightbox-modal__wrapper').width(imageWidth);
	}

	//Bind the click handler.
	var init = function() {

		//Set the Selector class
		$selector = $('.js-lightbox');

		buildModal();

		collectImages();

		//Bind the click handler.
		$selector.on('click', function(e) {
			e.preventDefault();
			imageIndex = $(this).data('index');
			openModal(imageIndex);
		});

		//Bind the close function to just the outer most container;
		$('.js-lightbox-modal').on('click', function(e) {
			e.preventDefault();
			var target = $(e.target);
			if (target.is(".js-lightbox-modal")) {
				closeModal();
			}
		});

		$('body').keydown(function(e) {
			//Check to see which key is pressed before doing any DOM checking
			if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39) {
				//If the Left or Right arrow was pressed and the modal is visible transition the lightbox.
				if ($('.js-lightbox-modal').is(':visible')) {
					transitionLightbox(e);
				}
			} 
		});

		window.addEventListener("orientationchange", function() {
			if ($('.js-lightbox-modal').is(':visible')) {
				setWidth();			}
		}, false);
	};

	return {
		init: init
	};

})();

jQuery(document).ready(function($) {
	UP.lightbox.init();
});
