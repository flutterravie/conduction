$(function () {

	'use strict';
	// 1px воды = 3мл
	var
		tMelt, // время плавления льда, сек
		tHeat, // время нагревания, сек
		tBoil, // время выкипания, сек
		tempStart, // стартовая температура
		$temp = $('.js-temp'),
		$volume = $('js-volume'),
		$ice = $('.js-ice'),
		$iceRadio = $('#iceRadio'),
		$waterRadio = $('#waterRadio'),
		$boilRadio = $('#boilRadio'),
		$speedSlow = $('#slow'),
		$speedNormal = $('#normal'),
		$speedFast = $('#fast'),
		$speedVeryFast = $('#veryFast'),
		$speedChange = $('.cond-ui__speed'),
		m = 0.75, // масса/объём, кг/л
		freq = 1000, // частота обновления, мс
		speedChanged = false,
		paused = false,
		waterH, // высота блока воды
		iceW,
		iceH;

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
		$('.js-ice').height(H).css('top', 205 - H);
		$('.cond-vessel-ice__top').css('height', String(40 / H * 100) + '%').css('top', String(-23 / H * 100) + '%');
		$('.cond-vessel-ice__bottom').css('height', String(40 / H * 100) + '%').css('bottom', String(-18 / H * 100) + '%');
	}

	function countT() {
		iceW = $('.js-ice').width();
		iceH = $('.js-ice').height();
		waterH = $('.js-water').height();
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
				if (speedChanged) {
					speedChanged = false;
					clearInterval(counterID);
					melt();
				}
				if (paused) {
					clearInterval(counterID);
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
				if (speedChanged) {
					speedChanged = false;
					clearInterval(counterID);
					heat();
				}
				if (paused) {
					clearInterval(counterID);
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
				if (speedChanged) {
					speedChanged = false;
					clearInterval(counterID);
					boil();
				}
				if (paused) {
					clearInterval(counterID);
				}
				if (tBoil <= 0) {
					clearInterval(counterID);
					$('.js-water').hide();
				}
			}, freq);
	}

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

	$('.js-volume').on('change', function () {
		setHeight(parseInt($('.js-volume').val()) / 3);
	});

	$speedChange.on('click', function () {
		speedChanged = true;
	});

	$speedSlow.on('click', function () {
		freq = 1000;		
	});

	$speedNormal.on('click', function () {
		freq = 250;		
	});

	$speedFast.on('click', function () {
		freq = 62.5;		
	});

	$speedVeryFast.on('click', function () {
		freq = 15.625;		
	});

	$('.js-start').on('click', function () {
		paused = false;
		countT();
		melt();
	});

	$('.js-pause').on('click', function () {
		paused = true;
	})

	$('.js-stop').on('click', function () {
		paused = true;
		setTimeout(function () {
			setHeight(parseInt($('.js-volume').val()) / 3);
		}, 1000);
	})
});
