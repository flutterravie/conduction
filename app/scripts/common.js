$(function () {

	'use strict';
	// 1px воды = 3мл
	var	tMelt,
		tHeat, // время нагревания, сек
		tBoil, // время выкипания, сек
		tempStart, // стартовая температура
		$temp = $('.js-temp'),
		$volume = $('js-volume'),
		$ice = $('.js-ice'),
		$iceRadio = $('#iceRadio'),
		$waterRadio = $('#waterRadio'),
		$boilRadio = $('#boilRadio'),
		m = 0.75, // масса/объём, кг/л
		freq = 1000, // частота обновления, мс
		stopPushed = false,
		waterH = $('.js-water').height(), // высота блока воды
		iceW = $('.js-ice').width(),
		iceH = $('.js-ice').height();

	$('.js-start').on('click', function () {
		countT();
		melt();
	});

	$('.js-stop').on('click', function () {
		stopPushed = true;
		freq = 7.8125;
	});

	function setHeight(H) {
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
		tempStart = parseFloat($temp.text());
		tHeat = Math.ceil(4.187 * m * (100 - tempStart) / 2); // t = c(кДж/кг*К) * m(кг) * dT(°c) / p(кВт)
		tBoil = Math.ceil(2256 * m / 2);
	}

	function melt() {
		var dIceWidth = 200 / tMelt,
			dIceHeight = 1.05 * (waterH / tMelt),
			counterID = setInterval(function () {
				if (tempStart > 0) {
					clearInterval(counterID);
					heat();
				}
				iceW = iceW - dIceWidth;
				iceH = iceH - dIceHeight;
				$('.js-ice').width(iceW).height(iceH);
				tMelt--;
				if (stopPushed) {
					stopPushed = false;
					clearInterval(counterID);
					melt();
				}
				if (tMelt <= 0) {
					clearInterval(counterID);
					heat();
				}
			}, freq);
	}

	function heat() {
		var dTemp = (100 - tempStart) / tHeat,
			counterID = setInterval(function () {
				if (tempStart > 99) {
					clearInterval(counterID);
					boil();
				}
				if (tHeat > 0) {
					tempStart = tempStart + dTemp;
				}
				$temp.text(tempStart.toFixed(0));
				tHeat--;
				if (stopPushed) {
					stopPushed = false;
					clearInterval(counterID);
					heat();
				}
				if (tHeat <= 0) {
					clearInterval(counterID);
					boil();
				}
			}, freq);
	}

	function boil() {
		var dHeight = m * 200 / tBoil,
			counterID = setInterval(function () {
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
					$('.js-water').hide();
				}
			}, freq);
	}

	$('.js-volume').on('change', function () {
		setHeight(Math.ceil(parseInt($('.js-volume').val()) / 3));
	});

	$iceRadio.on('click', function () {
		$ice.show();
		$temp.text(0);
	});

	$waterRadio.on('click', function () {
		$ice.hide();
		$temp.text(50);
	});

	$boilRadio.on('click', function () {
		$ice.hide();
		$temp.text(100);
	});
});
