export default function wavelengthToColor(wl: number): [string, number, number, number, number] {
	let R: number;
	let G: number;
	let B: number;
	let alpha: number;

	if (wl >= 380 && wl < 440) {
		R = (-1 * (wl - 440)) / (440 - 380);
		G = 0;
		B = 1;
	} else if (wl >= 440 && wl < 490) {
		R = 0;
		G = (wl - 440) / (490 - 440);
		B = 1;
	} else if (wl >= 490 && wl < 510) {
		R = 0;
		G = 1;
		B = (-1 * (wl - 510)) / (510 - 490);
	} else if (wl >= 510 && wl < 580) {
		R = (wl - 510) / (580 - 510);
		G = 1;
		B = 0;
	} else if (wl >= 580 && wl < 645) {
		R = 1;
		G = (-1 * (wl - 645)) / (645 - 580);
		B = 0.0;
	} else if (wl >= 645 && wl <= 780) {
		R = 1;
		G = 0;
		B = 0;
	} else {
		R = 0;
		G = 0;
		B = 0;
	}

	if (wl > 780 || wl < 380) {
		alpha = 0;
	} else if (wl > 700) {
		alpha = (780 - wl) / (780 - 700);
	} else if (wl < 420) {
		alpha = (wl - 380) / (420 - 380);
	} else {
		alpha = 1;
	}

	return [`rgba(${R * 100}%,${G * 100}%,${B * 100}%,${alpha})`, R, G, B, alpha];
}
