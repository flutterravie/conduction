$(function () {

	'use strict';

	var navTab = $('.js-tab');

	navTab.on('click', function () {
		if (!$(this).is('.cond-ui-nav__item_active')) {
			navTab.toggleClass('cond-ui-nav__item_active');
			$('.js-tab-content').toggleClass('cond-ui-wrapper_active');
		}
	});

});
