// Krystek, Michael P. (January 1985).
// "An algorithm to calculate correlated colour temperature".
// Color Research & Application. 10 (1): 38–40.
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
export default function calc_xy(T: number) {
	if (T < 1000) {
		return [NaN, NaN];
	} else if (T < 1667) {
		return calc_xyc_low(T);
	} else {
		const xc = calc_xc_high(T);
		return [xc, calc_yc_high(T, xc)];
	}
}
