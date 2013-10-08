$(document).on('ready', function() {
	$('.l-container').onepage_scroll({
		sectionContainer: '.l-block',
		easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
		animationTime: 1000, // AnimationTime let you define how long each section takes to animate
		pagination: false, // You can either show or hide the pagination. Toggle true for show, false for hide.
		updateURL: true,
	});

	var $blocks = $('.l-block'),
	    $win = $(window),
	    time = new Date(),
	    categories = new Categories(),
	    products = new Products();

	function resize() {
		var now = new Date(),
		    height;

		categories.onResize();
		products.onResize();
	}

	
	resize();

	var rtime = new Date(1, 1, 2000, 12,00,00);
	var timeout = false;
	var delta = 200;
	$(window).resize(function() {
	    rtime = new Date();
	    if (timeout === false) {
	        timeout = true;
	        setTimeout(resizeend, delta);
	    }
	});

	function resizeend() {
	    if (new Date() - rtime < delta) {
	        setTimeout(resizeend, delta);
	    } else {
	        timeout = false;
	        resize();
	    }               
	}
});


// Categories
function Categories(conf) {
	var _this = this,
	    conf = conf || {};

	this.conf = {
		$win : $(window),
		$cat : $('#categories'),
		$catRows : $('#categories .categories__row'),
		$catItems : $('#categories .categories__i')
	}

	this.onResize();

	return this;
}

Categories.prototype.onResize = function() {
	var catHeight = this.conf.$cat.outerHeight();
	    itemHeight = Math.round(catHeight/2);
	    doobleItemWidth = itemHeight*2;
	
	this.conf.$catRows.height(itemHeight);

	this.conf.$catItems.each(function() {
		var $this = $(this); 

		if($this.hasClass('categories__i_2col')) {
			$this.css({
				'width' : doobleItemWidth,
				'height' : itemHeight
			});
		}
		else{
			$this.css({
				'width' : itemHeight,
				'height' : itemHeight
			});
		}
	});
};

//Products

function Products() {
	var _this = this,
	    conf = conf || {};

	this.conf = {
		$win : $(window),
		$container : $('#products'),
		$row : $('#products .products__row'),
		$items : $('#products .products__i'),
		padding : $('#products .products__header').outerHeight()
	}


	this.prop = $(this.conf.$items[0]).width() / $(this.conf.$items[0]).height();

	this.onResize();

	return this;
}

Products.prototype.onResize = function() {	
	var height = Math.round((this.conf.$win.height() - this.conf.padding - 1) / 2),
	    width = this.prop * height;

	    console.log(height, width, this.conf.padding, this.conf.$win.height())

	this.conf.$items.css({
		'width' : width,
		'height' : height
	})
}