(function () {
	'use strict';

	var yPos = 0,
		aniDir = 1,
		timingIntStart = false,
		timeLag = 0,
		results = [],
		fps,
		delta,
		lastCalledTime;

	const $cursorEl = $('#cursor'),
		$resultsEl = $('#results'),
		$fpsEl = $('#fps'),
		showFPS = true,
		aniSpeed = 5,
		totalResults = 3;

	function animation() {
		// display the current fps
		if (showFPS) {
			if (!lastCalledTime) {
				lastCalledTime = Date.now();
				fps = 0;
			}
			delta = (Date.now() - lastCalledTime) / 1000;
			lastCalledTime = Date.now();
			fps = 1 / delta;

			$fpsEl.html(fps.toFixed(2));
		}

		// move the box
		yPos = yPos + (aniDir * aniSpeed);
		$cursorEl.css('transform', 'translate3d(0px, ' + yPos + 'px, 0px)');

		// if the box gets too low turn around
		if (yPos > 550 && aniDir === 1) {
			aniDir = -1;
			timingIntStart = false;
			timeLag = 0;
		}

		// if the box gets too high turn around
		if (yPos < 0 && aniDir === -1) {
			aniDir = 1;
			timingIntStart = false;
			timeLag = 0;
		}

		// box is in the center
		if (yPos === 275) {
			$cursorEl.css('border-color', '#ff0000');
			setTimeout(function () {
				$cursorEl.css('border-color', '#fff');
			}, 100);
			timingIntStart = true;
		}

		// start tracking lag time
		if (timingIntStart) {
			timeLag++;
		}

		// next frame
		requestAnimationFrame(animation);
	}
	requestAnimationFrame(animation);

	$(document).keypress(function (e) {

		// press space
		if (e.which === 32) {
			if (results.length === 0) {
				$resultsEl.html('');
			}

			// if the white square is past the gray one record results
			// if it was pressed before throw it out
			if (timingIntStart) {

				// add a result
				if (results.length < totalResults) {
					$resultsEl.append(timeLag + '<br>');
					results.push(timeLag);
				}

				// average the results and show the totals
				if (results.length == totalResults) {
					var avg,
						m;

					avg = (results.reduce((a, b) => a + b)) / results.length;
					avg = Math.round(avg * 100) / 100;
					m = Math.round(((avg / 60) * 1000) * 100) / 100;

					$resultsEl.append('average: ' + avg + '<br>');
					$resultsEl.append('average: ' + m + 'milliseconds');

					results = [];
				}
			}
		}
	});

}());
