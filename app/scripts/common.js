$(function () {

	'use strict';
	// 1px воды = 3мл
	var	tMelt,
		tHeat, // время нагревания, сек
		tBoil, // время выкипания, сек
		dHeight, // высота шага выкипания, px
		$temp = $('.js-temp'),
		$volume = $('js-volume'),
		$iceRadio = $('#ice'),
		$waterRadio = $('#water'),
		$boilRadio = $('#boil'),
		m = 0.75, // масса/объём, кг/л
		tempStart = parseFloat($temp.text()), // стартовая температура
		freq = 1000, // частота обновления, мс
		stopPushed = false,
		waterH = $('.js-water').height(), // высота блока воды
		iceW = $('.js-ice').width(),
		iceH = $('.js-ice').height();

	$('.js-start').on('click', function () {
		//melt();
		countT();

		heat();

		//dHeight = m * 200 / tBoil;

		//boil();
	});

	$('.js-stop').on('click', function () {
		stopPushed = true;
		freq = 7.8125;
	});

	function volume(H) {
		if (H > 200) {
			H = 200;
			$('.js-volume').val(600);
		}
		if (H < 0) {
			H = 0;
			$('.js-volume').val(0);
		}
		$('.js-water').height(H);
		$('.js-ice').height(H);
	}

	function countT() {
		tMelt = Math.ceil(335 * m / 2);
		tHeat = Math.ceil(4.187 * m * (100 - tempStart) / 2); // t = c(кДж/кг*К) * m(кг) * dT(°c) / p(кВт)
		tBoil = Math.ceil(2256 * m / 2);
	}

	function heat() {
		var dTemp = (100 - tempStart) / tHeat,
			counterID = setInterval(function () {
				tempStart = tempStart + dTemp;
				$temp.text(tempStart.toFixed(2));
				tHeat--;
				if (tHeat <= 0) {
					clearInterval(counterID);
				}
			}, freq);
	}

	function melt() {
		var dIceWidth = 200 / tMelt,
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

	$('.js-volume').on('change', function () {
		volume(Math.ceil(parseInt($('.js-volume').val()) / 3));
	});

});
