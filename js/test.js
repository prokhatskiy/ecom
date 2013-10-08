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
	$(window).on('resize', function() {
	    resize();
	});

	var gal = new Gallery();
});

function Gallery(conf) {
	var _this = this,
	    conf = conf || {};

	this.conf = {
		$win : $(window),
		$el : $('#promos'),
		$btns : $('#promo .promo__nav-i'),
		$catItems : $('#categories .categories__i')
	}

	this.init();
	this.conf.$btns.on('click', function() {
		_this.set($(this).attr('data-id'));
		return false;
	});


	return this;
}

Gallery.prototype.init = function() {
	this.set(1);
	return this;
}

Gallery.prototype.set = function(id) {
	this.destroyTimer();
	$('.promo__main-i_select').removeClass('promo__main-i_select');
	$('#promo-' + id).addClass('promo__main-i_select');
	$('.promo__nav-i_select').removeClass('promo__nav-i_select');
	$('#promo-btn-' + id).addClass('promo__nav-i_select');
	this.id = id;
	this.$time = $('#promo-btn-' + id + ' .promo__laoder');
	this.initTimer();
}

Gallery.prototype.initTimer = function() {
	var _this = this,
	    id;
	this.timer = setInterval(function() {
		id = _this.id+1;		
		if(_this.id === 3) id = 1;
		_this.set(id);
	}, 10000);
}

Gallery.prototype.destroyTimer = function() {
	clearInterval(this.timer);
}


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
	var catHeight = this.conf.$cat.height();
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

	this.conf.$items.css({
		'width' : width,
		'height' : height
	})
}