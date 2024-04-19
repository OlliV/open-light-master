export function calc_xc(T: number) {
	if (1667 <= T && T <= 4000) {
		return -0.2661239 * (10 ** 9 / T ** 3) - 0.2343589 * (10 ** 6 / T ** 2) + 0.8776956 * (10 ** 3 / T) + 0.17991;
	} else if (4000 <= T && T <= 25000) {
		return -3.0258469 * (10 ** 9 / T ** 3) + 2.1070379 * (10 ** 6 / T ** 2) + 0.2226347 * (10 ** 3 / T) + 0.24039;
	}
	return NaN;
}

export function calc_yc(T: number, xc: number) {
	if (1667 <= T && T <= 2222) {
		return -1.1063814 * xc ** 3 - 1.3481102 * xc ** 2 + 2.18555832 * xc - 0.20219683;
	} else if (2222 <= T && T <= 4000) {
		return -0.9549476 * xc ** 3 - 1.37418593 * xc ** 2 + 2.09137015 * xc - 0.16748867;
	} else if (4000 <= T && T <= 25000) {
		return 3.081758 * xc ** 3 - 5.8733867 * xc ** 2 + 3.75112997 * xc - 0.37001483;
	}
	return NaN;
}

export function calc_xy(T: number) {
	const xc = calc_xc(T);
	const yc = calc_yc(T, xc);

	return [xc, yc];
}
