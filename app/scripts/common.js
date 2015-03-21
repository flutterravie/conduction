$(function () {

	'use strict';

	var	tHeat, tBoil, m, tempStart, dHeight, waterH, freq, stopPushed;

	// temp
	tempStart = 10;
	m = 0.75;
	freq = 1000;
	stopPushed = false;
	waterH = $('.js-water').height();

	$('.js-start').on('click', function () {
		countT();

		/*do {
			heat ();
		} while (tHeat > 0);*/
		
		dHeight = m * 200 / tBoil;
		boil ();
	});

	$('.js-stop').on('click', function () {
		stopPushed = true;
		freq = 7.8125;
	});

	function countT() {
		tHeat = Math.ceil(4.187 * m * (100 - tempStart) / 2); // t = c(кДж/кг*К) * m(кг) * dT(°c) / p(кВт)
		tBoil = Math.ceil(2256 * m / 2);
		console.log(tBoil);
	}

	function heat() {

	}

	function boil() {
		var counterID = setInterval(function() {
			waterH = waterH - dHeight;
			$('.js-water').height(waterH);
			tBoil--;
			if (stopPushed) {
				stopPushed = false;
				clearInterval(counterID);
				boil();
			}
			if (tBoil <= 0) {
				clearInterval(counterID);
			};
		}, freq);
	}

	/*var navTab = $('.js-tab');

	navTab.on('click', function () {
		if (!$(this).is('.cond-ui-nav__item_active')) {
			navTab.toggleClass('cond-ui-nav__item_active');
			$('.js-tab-content').toggleClass('cond-ui-wrapper_active');
		}
	});*/

});
