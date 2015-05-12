$(function () {

	'use strict';

	// 1px воды = 3мл

	var
		tMelt, // время плавления льда, сек
		tHeat, // время нагревания воды, сек
		tBoil, // время выкипания воды, сек
		tempStart, // стартовая температура
		$temp = $('.js-temp'), // индикатор температуры
		$volume = $('.js-volume'), // поле ввода объёма воды
		$ice = $('.js-ice'),
		$water = $('.js-water'),
		// переключатели исходного состояния
		$iceRadio = $('#iceRadio'),
		$waterRadio = $('#waterRadio'),
		$boilRadio = $('#boilRadio'),
		$radio = $('.cond-ui__radio'),
		// переключатели скорости
		$speedSlow = $('#slow'),
		$speedNormal = $('#normal'),
		$speedFast = $('#fast'),
		$speedVeryFast = $('#veryFast'),
		$speedChange = $('.cond-ui__speed'),
		m = 0.75, // масса/объём, кг/л
		freq = 1000, // частота обновления, мс
		speedChanged = false,
		started = false,
		paused = false,
		waterH, // высота блока воды
		iceW,
		iceH;

	// установить высоту блока воды и льда
	function setHeight(H) {
		if (H > 200) {
			H = 200;
			$volume.val(600);
		}
		if (H < 0) {
			H = 0;
			$volume.val(0);
		}
		$water.height(H);
		$ice.height(H).css('top', 205 - H);
		$('.js-ice__top').css('height', String(40 / H * 100) + '%').css('top', String(-23 / H * 100) + '%');
		$('.js-ice__bottom').css('height', String(40 / H * 100) + '%').css('bottom', String(-18 / H * 100) + '%');
	}

	// рассчёт времени таяния, нагревания и выкипания
	function countT() {
		iceW = $ice.width();
		iceH = $ice.height();
		waterH = $water.height();
		tempStart = parseFloat($temp.text());
		tMelt = Math.ceil(335 * m / 2); // t(sec) = λ(кДж/кг) * m(кг) / p(кВт)
		tHeat = Math.ceil(4.187 * m * (100 - tempStart) / 2); // t(sec) = c(кДж/кг*К) * m(кг) * ΔT(°c) / p(кВт)
		tBoil = Math.ceil(2256 * m / 2); // t(sec) = L(кДж/кг) * m(кг) / p(кВт)
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
				$ice.width(iceW).height(iceH);
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
				$water.height(waterH);
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
					$water.hide();
				}
			}, freq);
	}

	$iceRadio.on('click', function () {
		if (!started) {
			$ice.show();
			$temp.text(0);
		}
	});

	$waterRadio.on('click', function () {
		if (!started) {
			$ice.hide();
			$temp.text(50);
		}
	});

	$boilRadio.on('click', function () {
		if (!started) {
			$ice.hide();
			$temp.text(100);
		}
	});

	$volume.on('change', function () {
		setHeight(parseInt($volume.val()) / 3);
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
		started = true;
		paused = false;
		$radio.prop('disabled', true);
		countT();
		melt();
	});

	$('.js-pause').on('click', function () {
		paused = true;
	});

	$('.js-stop').on('click', function () {
		started = false;
		paused = true;
		setTimeout(function () {
			setHeight(parseInt($volume.val()) / 3);
			$ice.width(200);
			$radio.prop('disabled', false);
		}, 1000);
	});
});
