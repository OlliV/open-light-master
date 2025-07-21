const fStops = Object.freeze([
	0.5, 0.7, 0.8, 1.0, 1.2, 1.4, 1.7, 2.0, 2.4, 2.8, 3.3, 4.0, 4.8, 5.6, 6.7, 8.0, 9.5, 11, 13, 16, 19, 22, 27, 32, 38,
	45, 54, 64, 76, 90, 107, 128, 180, 256,
]);

const sspeeds = Object.freeze([
	1 / 8000,
	1 / 4000,
	1 / 2000,
	1 / 1000,
	1 / 800,
	1 / 500,
	1 / 400,
	1 / 320,
	1 / 250,
	1 / 200,
	1 / 125,
	1 / 60,
	1 / 30,
	1 / 15,
	1 / 8,
	1 / 4,
	1 / 2,
	1,
	5 / 6,
	2 / 3,
	2,
	4,
	8,
	15,
	25,
	30,
	60,
	120,
]);

function closest(needle: number, haystack: readonly number[]): number {
	return haystack.reduce((a, b) => {
		let aDiff = Math.abs(a - needle);
		let bDiff = Math.abs(b - needle);

		if (aDiff === bDiff) {
			return a > b ? a : b;
		} else {
			return bDiff < aDiff ? b : a;
		}
	});
}

export function closestShutter(shutter: number): number {
	return closest(shutter, sspeeds);
}

export function closestAperture(fstop: number): number {
	return closest(fstop, fStops);
}

export function calcEV(lux: number, iso: number = 100, gain: number = 0): number {
	const C = 250;
	const EV100 = Math.log2((lux * 100) / C);

	if (iso === 100) {
		return EV100 + gain / 6;
	}

	return EV100 + Math.log2(iso / 100) + gain / 6;
}

export function calcShutter(ev: number, fstop: number): number {
	return (fstop * fstop) / (2 ** ev);
}

export function calcFstop(ev: number, shutter: number): number {
	return Math.sqrt(shutter * (2 ** ev));
}
