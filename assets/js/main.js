/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);




/*
	Multiverse by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
	breakpoints({
		xlarge:  [ '1281px',  '1680px' ],
		large:   [ '981px',   '1280px' ],
		medium:  [ '737px',   '980px'  ],
		small:   [ '481px',   '736px'  ],
		xsmall:  [ null,      '480px'  ]
	});

	// Hack: Enable IE workarounds.
	if (browser.name == 'ie')
		$body.addClass('ie');

	// Touch?
	if (browser.mobile)
		$body.addClass('touch');

	// Transitions supported?
	if (browser.canUse('transition')) {

		// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

		// Prevent transitions/animations on resize.
		var resizeTimeout;

		$window.on('resize', function() {

			window.clearTimeout(resizeTimeout);

			$body.addClass('is-resizing');

			resizeTimeout = window.setTimeout(function() {
				$body.removeClass('is-resizing');
			}, 100);

		});

	}

	// Scroll back to top.
	$window.scrollTop(0);

	// Panels.
	var $panels = $('.panel');

	$panels.each(function() {

		var $this = $(this),
			$toggles = $('[href="#' + $this.attr('id') + '"]'),
			$closer = $('<div class="closer" />').appendTo($this);

		// Closer.
		$closer
			.on('click', function(event) {
				$this.trigger('---hide');
			});

		// Events.
		$this
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('---toggle', function() {

				if ($this.hasClass('active'))
					$this.triggerHandler('---hide');
				else
					$this.triggerHandler('---show');

			})
			.on('---show', function() {

				// Hide other content.
				if ($body.hasClass('content-active'))
					$panels.trigger('---hide');

				// Activate content, toggles.
				$this.addClass('active');
				$toggles.addClass('active');

				// Activate body.
				$body.addClass('content-active');

			})
			.on('---hide', function() {

				// Deactivate content, toggles.
				$this.removeClass('active');
				$toggles.removeClass('active');

				// Deactivate body.
				$body.removeClass('content-active');

			});

		// Toggles.
		$toggles
			.removeAttr('href')
			.css('cursor', 'pointer')
			.on('click', function(event) {

				event.preventDefault();
				event.stopPropagation();

				$this.trigger('---toggle');

			});

	});

	// Global events.
	$body
		.on('click', function(event) {

			if ($body.hasClass('content-active')) {

				event.preventDefault();
				event.stopPropagation();

				$panels.trigger('---hide');

			}

		});

	$window
		.on('keyup', function(event) {

			if (event.keyCode == 27
				&&	$body.hasClass('content-active')) {

				event.preventDefault();
				event.stopPropagation();

				$panels.trigger('---hide');

			}

		});


	// Main.
	var $mainn = $('#mainn');

	// Thumbs.
	$mainn.children('.thumb').each(function() {

		var	$this = $(this),
			$image = $this.find('.image'), $image_img = $image.children('img'),
			x;

		// No image? Bail.
		if ($image.length == 0)
			return;

		// Image.
		// This sets the background of the "image" <span> to the image pointed to by its child
		// <img> (which is then hidden). Gives us way more flexibility.

		// Set background.
		$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

		// Set background position.
		if (x = $image_img.data('position'))
			$image.css('background-position', x);

		// Hide original img.
		$image_img.hide();

	});

	// Poptrox.
	$mainn.poptrox({
		baseZIndex: 20000,
		caption: function($a) {

			var s = '';

			$a.nextAll().each(function() {
				s += this.outerHTML;
			});

			return s;

		},
		fadeSpeed: 300,
		onPopupClose: function() { $body.removeClass('modal-active'); },
		onPopupOpen: function() { $body.addClass('modal-active'); },
		overlayOpacity: 0,
		popupCloserText: '',
		popupHeight: 150,
		popupLoaderText: '',
		popupSpeed: 300,
		popupWidth: 150,
		selector: '.thumb > a.image',
		usePopupCaption: true,
		usePopupCloser: true,
		usePopupDefaultStyling: false,
		usePopupForceClose: true,
		usePopupLoader: true,
		usePopupNav: true,
		windowMargin: 50
	});

	// Hack: Set margins to 0 when 'xsmall' activates.
	breakpoints.on('<=xsmall', function() {
		$mainn[0]._poptrox.windowMargin = 0;
	});

	breakpoints.on('>xsmall', function() {
		$mainn[0]._poptrox.windowMargin = 50;
	});

})(jQuery);