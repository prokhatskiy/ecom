$(document).on('ready', function() {
	var $blocks = $('.l-block'),
		$cat = $('#categories'),
		$catRows = $cat.find('.categories__row'),
		$catItems = $cat.find('.categories__i'),
	    $win = $(window);

	function resize() {
		var height = $win.height(),
		    catHeight,
		    itemHeight,
		    doobleItemWidth;

		$blocks.each(function() {
			$(this).css({
				'height' : (height < 300) ? 300 : height
			});
		});

		catHeight = $cat.outerHeight();
		itemHeight = Math.round(catHeight/2);
		doobleItemWidth = itemHeight*2;
		$catRows.height(itemHeight);

		$catItems.each(function() {
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
	}

	resize();
	$win.on('resize', resize);
});