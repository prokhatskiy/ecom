var Ui,
    Events,
    Router;

(function($) {
	// Events object
	Events = _.extend({}, Backbone.Events);

	$(document).on('ready', function() {
		// UI Object
		Ui = function(conf) {
			//vars
			var _this = this,
			    conf = conf || {};

			this.conf = {
				minHeight : conf.minHeight || 300
			};

			// UI global vars
			this.touch = ('ontouchstart' in document.body) ? true : false;
			// left: 37, up: 38, right: 39, down: 40,
			// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
			this.keys = [38, 40];
			this.currentHash = document.location.hash.slice(1);
			this.$win = $(window);
			this.$doc = $(document);
			this.$blocks = $('.l-block');
			//find blocks
			this.hash = this.findBlocks();
			//resize blocks
			this.resizeBlock();
			this.$win.on('resize', function() {
				_this.resizeBlock.call(_this);
			});

			//scrollEvent		
			this.disableScroll();
		}

		Ui.prototype.findBlocks = function() {
			var el,
			    blocks = {};
			for (var i = 0, l = this.$blocks.length; i < l; i++) {
				el = this.$blocks[i];				
				if(el.hasAttribute('data-id')) {
					blocks[el.getAttribute('data-id')] = $(el);
				}
			};
			return blocks;
		};

		Ui.prototype.resizeBlock = function() {
			for(block in this.hash) if(this.hash.hasOwnProperty(block)) {
				var winHeight = this.$win.height();
				this.hash[block].css({
					'height' : (winHeight < this.conf.minHeight) ? this.conf.minHeight : winHeight
				});
			}	

			this.scrollTo(this.currentHash, 0);
		};

		Ui.prototype.scrollTo = function(block, delay) {
			var  _this = this,
			     scrollTop = 0;
			if(!this.hash.hasOwnProperty(block)) return false;
			scrollHeight = this.hash[block].offset().top;
			$('html, body').animate({
				'scrollTop' : scrollHeight
			}, delay, function() {
				_this.currentHash = block;
			});
			
			return { 'block' :  block, 'scrollTop' : scrollHeight };
		};

		Ui.prototype.disableScroll = function() {
			var _this = this;

			this.$win.on('scroll', function(event) {
				Events.trigger('switch:handmade', {
					hash : _this.currentHash,
					scrollTop : _this.$win.scrollTop()
				});
			});

			function preventDefault(e, direction) {
				var e = e || window.event,
					direction = direction || 'bottom';

				if (e.preventDefault) e.preventDefault();
				e.returnValue = false;
				console.log()
				Events.trigger('switch:auto', {
					direction : direction,
					hash : _this.currentHash
				});
			}

			function keydown(e) {
				var direction;
				if(e.keyCode === 38) {
					direction = 'top';
				}
				else if(e.keyCode === 40) {
					direction = 'bottom';
				}

			    for (var i = _this.keys.length; i--;) {
			        if (e.keyCode === _this.keys[i]) {
			            preventDefault(e, direction);
			            return;
			        }
			    }
			}

			function handle(delta) {
		        if (delta < 0)
					console.log('bottom')
		        else
					console.log('top')
			}
			
			function wheel(event){
		        var delta = 0,
		            direction;

		        if(!event) {
		        	event = window.event;	
		        }		                
		        if(event.wheelDelta) { 
		            delta = event.wheelDelta/120;
		        } 
		        else if(event.detail) { 
		            delta = -event.detail/3;
		        }
		        if(delta) {
		        	if(delta < 0) {
		        		direction = 'bottom';
		        	}
		        	else {
		        		direction = 'top';
		        	}
		        }		                
		        
		        preventDefault(event, direction)
			}

			if(window.addEventListener) {
				window.addEventListener('DOMMouseScroll', wheel, false);
			}

			window.onmousewheel = document.onmousewheel = wheel;
			document.onkeydown = keydown;
		};

		//Global event listeners
		Events.on('switch:auto', function(data) {
			console.log('auto', data);
		});
		Events.on('switch:handmade', function(data) {
			console.log('handmade', data);
		});

		// Router
		Router = Backbone.Router.extend({
			initialize : function(ui) {
				var _this = this,
				    ui = ui || {},
				    hash = _.keys(ui.hash);

				this.firstBlock = hash[0];

				for (var i = 0, l = hash.length; i < l; i++) {
					(function(block){
						_this.route(block, function() {
							ui.scrollTo(block, 1000);
						});
					})(hash[i]);					
				};
			},
			routes : {
				'*path' : 'defaultState'
			},
			defaultState : function() {
				document.location.hash = this.firstBlock;
			}
		});

		//create instance of UI
		var ui = new Ui();
		//create instance of Router
		var router = new Router(ui);
		Backbone.history.start();
	});
})(jQuery);
