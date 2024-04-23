import Spline from './spline';
import wlMap from './wlmap';

export type SPD = {
	wl: number;
	p: number;
}[];

export function interpolateSPD(input: SPD, increment: number = 5) {
	const xs = [380, ...input.map(({ wl }) => wl), 780];
	const ys = [0, ...input.map(({ p }) => p), 0];

	const spline = new Spline(xs, ys);
	return wlMap((wl) => ({ wl, p: spline.at(wl) }), increment);
}
