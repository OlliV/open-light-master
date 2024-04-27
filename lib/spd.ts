import { CIE1931_2DEG_CMF } from './CMF';
import Spline from './spline';
import wlMap from './wlmap';
import { XYZ2xy, xy2uv, XYZ2UVW } from './CIEConv';
import calcCCT from './cct';
import calcDuv from './duv';
import calcTint from './tint';

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

export function spd2XYZ(spd: number[], cmf: number[]) {
	const xsum = spd.reduce((sum, v, i) => sum + v * cmf[i * 3], 0);
	const ysum = spd.reduce((sum, v, i) => sum + v * cmf[i * 3 + 1], 0);
	const zsum = spd.reduce((sum, v, i) => sum + v * cmf[i * 3 + 2], 0);

	return [(100 * xsum) / ysum, 100, (100 * zsum) / ysum];
}

export function normalizeSPD(spd: number[]) {
	return spd.map((v, _, a) => v / a[36]);
}

export function calcRefMeas(spd: number[]) {
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
		Lux: XYZ[1], // TODO This is a bit meaningless
	};
}
