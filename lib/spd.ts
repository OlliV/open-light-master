import Spline from './spline';
import wlMap from './wlmap';

export type SPD = {
	l: number /*!< wavelength. */;
	v: number /*!< power. */;
}[];

export function interpolateSPD(input: SPD, increment: number = 5): SPD {
	const xs = [380, ...input.map(({ l }) => l), 780];
	const ys = [0, ...input.map(({ v }) => v), input[input.length - 1].v];

	const spline = new Spline(xs, ys);
	return wlMap((l) => ({ l, v: spline.at(l) }), increment);
}
