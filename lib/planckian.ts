// Krystek, Michael P. (January 1985).
// "An algorithm to calculate correlated colour temperature".
// Color Research & Application. 10 (1): 38–40.

import { uv2xy, xy2uv } from "./CIEConv";

// doi:10.1002/col.5080100109
function calc_xyc_low(T: number) {
	const uT =
		(0.860117757 + 1.54118254e-4 * T + 1.28641212e-7 * T ** 2) / (1 + 8.42420235e-4 * T + 7.08145163e-7 * T ** 2);
	const vT =
		(0.317398726 + 4.22806245e-5 * T + 4.20481691e-8 * T ** 2) / (1 - 2.89741816e-5 * T + 1.61456053e-7 * T ** 2);
	const div = 2 * uT - 8 * vT + 4;

	return [(3 * uT) / div, (2 * vT) / div];
}

// Kim et al. cubic spline
function calc_xc_high(T: number) {
	if (1667 <= T && T <= 4000) {
		return -0.2661239 * (10 ** 9 / T ** 3) - 0.2343589 * (10 ** 6 / T ** 2) + 0.8776956 * (10 ** 3 / T) + 0.17991;
	} else if (4000 <= T && T <= 25000) {
		return -3.0258469 * (10 ** 9 / T ** 3) + 2.1070379 * (10 ** 6 / T ** 2) + 0.2226347 * (10 ** 3 / T) + 0.24039;
	}
	return NaN;
}

// Kim et al. cubic spline
function calc_yc_high(T: number, xc: number) {
	if (1667 <= T && T <= 2222) {
		return -1.1063814 * xc ** 3 - 1.3481102 * xc ** 2 + 2.18555832 * xc - 0.20219683;
	} else if (2222 <= T && T <= 4000) {
		return -0.9549476 * xc ** 3 - 1.37418593 * xc ** 2 + 2.09137015 * xc - 0.16748867;
	} else if (4000 <= T && T <= 25000) {
		return 3.081758 * xc ** 3 - 5.8733867 * xc ** 2 + 3.75112997 * xc - 0.37001483;
	}
	return NaN;
}

/**
 * Calculate Planckian locus for T
 */
function calc_xy(T: number) {
	if (T < 1000) {
		return [NaN, NaN];
	} else if (T < 1667) {
		return calc_xyc_low(T);
	} else {
		const xc = calc_xc_high(T);
		return [xc, calc_yc_high(T, xc)];
	}
}

/**
 * Calculate Planckian locus for T and Duv
 */
export default function planckian_xy(T: number, Duv: number = 0) {
	if (Duv === 0) {
		return calc_xy(T);
	} else {
		const dT = 0.01 // K
		const xy0 = calc_xy(T);
		const xy1 = calc_xy(T + dT);
		const [u0, v0] = xy2uv(xy0[0], xy0[1]);
		const [u1, v1] = xy2uv(xy1[0], xy1[1]);
		const du = u1 - u0;
		const dv = v1 - v0;
		const sq = Math.sqrt(du * du + dv * dv);
		const u = u0 - Duv * dv / sq;
		const v = v0 + Duv * du / sq;
		return uv2xy(u, v);
	}
}
