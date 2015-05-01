$(function () {

	'use strict';
	// 1px воды = 3мл
	var	tHeat, // время нагревания, сек
		tBoil, // время выкипания, сек
		dHeight, // высота шага выкипания, px
		m = 0.75, // масса/объём, кг/л
		tempStart = 10, // стартовая температура
		freq = 1000, // частота обновления, мс
		stopPushed = false,
		waterH = $('.js-water').height(), // высота блока воды
		iceW = $('.js-ice').width(),
		iceH = $('.js-ice').height();

	$('.js-start').on('click', function () {
		melt();
		// countT();

		/*do {
			heat();
		} while (tHeat > 0);*/

		// dHeight = m * 200 / tBoil;

		// boil();
	});

	$('.js-stop').on('click', function () {
		stopPushed = true;
		freq = 7.8125;
	});

	function countT() {
		tHeat = Math.ceil(4.187 * m * (100 - tempStart) / 2); // t = c(кДж/кг*К) * m(кг) * dT(°c) / p(кВт)
		tBoil = Math.ceil(2256 * m / 2);
	}

	function melt() {
		var tMelt = 100,
			dIceWidth = 200 / tMelt,
			dIceHeight = 1.05 * (waterH / tMelt),
			counterID = setInterval(function () {
				iceW = iceW - dIceWidth;
				iceH = iceH - dIceHeight;
				$('.js-ice').width(iceW).height(iceH);
				tMelt--;
				if (tMelt <= 0) {
					clearInterval(counterID);
				}
				console.log(iceW, iceH, tMelt);
			}, 25);
		console.log('end');
	}

	function heat() {

	}

	function boil() {
		var counterID = setInterval(function () {
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
			}
		}, freq);
	}



});
