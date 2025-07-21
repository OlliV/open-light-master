import { CIE1931_2DEG_CMF } from './CMF';
import Spline from './spline';
import wlMap from './wlmap';
import { XYZ2xy, xy2uv, XYZ2UVW } from './CIEConv';
import calcCCT from './cct';
import calcDuv from './duv';
import calcTint from './tint';
import { RefMeasurement } from './global';

export type SPD = {
	l: number /*!< wavelength. */;
	v: number /*!< power. */;
}[];

export function interpolateSPD(input: Readonly<SPD>, increment: number = 5, min: number = 380, max: number = 780): SPD {
	const xs = [...input.map(({ l }) => l)];
	const ys = [...input.map(({ v }) => v)];

	if (xs[0] > min) {
		xs.unshift(min);
		ys.unshift(0);
	}
	if (xs[xs.length - 1] < max) {
		xs.push(max);
		ys.push(ys[ys.length - 1]);
	}

	const spline = new Spline(xs, ys);
	return wlMap((l) => ({ l, v: spline.at(l) }), increment);
}

// Convert any SPD that covers 380..780 nm to an spd array.
export function SPD2spd(input: SPD): Float64Array {
	return Float64Array.from(input.filter(({ l }) => l >= 380 && l <= 780 && l % 5 == 0).map(({ v }) => v));
}

/**
 * Calculate tristimulus from an spd.
 * @param spd spd must be 380..780 nm with 5 nm steps.
 * @param cmf Color matching function. This should always almost be the CIE1931_2DEG_CMF.
 */
export function spd2XYZ(spd: Float64Array, cmf: Float64Array) {
	const xsum = spd.reduce((sum: number, v: number, i: number) => sum + v * cmf[i * 3], 0);
	const ysum = spd.reduce((sum: number, v: number, i: number) => sum + v * cmf[i * 3 + 1], 0);
	const zsum = spd.reduce((sum: number, v: number, i: number) => sum + v * cmf[i * 3 + 2], 0);

	return [(100 * xsum) / ysum, 100, (100 * zsum) / ysum];
}

/**
 * Normalize by 560 nm.
 * @param spd spd must be 380..780 nm with 5 nm steps.
 */
export function normalizeSPD(spd: Float64Array) {
	const center = spd[36];

	return spd.map((v: number) => v / center);
}

/**
 * Calculate a reference.
 * Calculate a reference measurement that can be used to compare against real
 * measurements.
 * @param spd spd must be 380..780 nm with 5 nm steps.
 */
export function calcRefMeas(spd: Float64Array): RefMeasurement {
	const ref = normalizeSPD(spd);
	const XYZ = spd2XYZ(ref, CIE1931_2DEG_CMF);
	const [x, y] = XYZ2xy(XYZ);
	const [u, v] = xy2uv(x, y);

	return {
		SPD: spd,
		Ex: x,
		Ey: y,
		Eu: u,
		Ev: v,
		CCT: calcCCT(x, y),
		Duv: calcDuv(u, v),
		tint: calcTint(x, y)[1],
		Lux: XYZ[1],
	};
}
