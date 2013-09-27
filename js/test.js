$(document).on('ready', function() {
	var $blocks = $('.l-block'),
	    $win = $(window);

	function resize() {
		var height = $win.height();

		$blocks.each(function() {
			$(this).css({
				'height' : (height < 300) ? 300 : height
			});
		});
	}

	resize();
	$win.on('resize', resize);
});