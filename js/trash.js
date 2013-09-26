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
			this.animStart = false;

			//find blocks
			this.hash = this.findBlocks();
			this.hashArr = _.keys(this.hash);

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
			
			if(!this.hash.hasOwnProperty(block) || this.animStart) return false;
			
			scrollHeight = this.hash[block].offset().top;
			this.animStart = true;

			$('html, body').stop(true, false).animate({
				'scrollTop' : scrollHeight
			}, delay, 'easeInExpo', function() {
				_this.currentHash = block;
				setTimeout(function() { _this.animStart = false; }, 300);
			});
			
			return { 'block' :  block, 'scrollTop' : scrollHeight, 'hash' : _this.hashArr };
		};

		Ui.prototype.disableScroll = function() {
			var _this = this,
			    time = new Date(),
			    direction;

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

			function wheel(event){
		        var delta,
		            direction,
		            now = new Date();

	        	delta = now - time;
	        	if(delta < 100) {	        		
	        		return false;
	        	}		        		
	        	else {
	        		time = now;
	        	}	        

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

		// Router
		Router = Backbone.Router.extend({
			initialize : function(ui) {
				var _this = this,
				    ui = ui || {};
				
				this.hash = ui.hashArr;

				this.firstBlock = this.hash[0];

				for (var i = 0, l = this.hash.length; i < l; i++) {
					(function(block){
						_this.route(block, function() {
							ui.scrollTo(block, 1000);
						});
					})(this.hash[i]);					
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

		// Events Listener
		Events.on('switch:auto', function(data) {
			var hash = ui.hashArr,
			    current = _.indexOf(hash, data.hash);

			if(data.direction === 'top') {
				if(current === 0) {
					return false;
				}
				else {
					current--;
					document.location.hash = hash[current];
				}
			}
			else if(data.direction === 'bottom') {
				if(current === hash.length - 1) {
					return false;
				}
				else {
					current+=1;;
					document.location.hash = hash[current];
				}
			}
		});
	});
})(jQuery);
