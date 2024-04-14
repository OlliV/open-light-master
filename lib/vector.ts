export function normalize(v: number[]) {
	const div = Math.sqrt(v.reduce((res, vn) => res + Math.pow(vn, 2), 0));

	return v.map((vn) => vn / div);
}

export function transform(v: number[], sub: number[], coeff: number[]) {
	return v.map((xn, i) => (xn - sub[i]) / coeff[i]);
}

export function dotProdC(a: number[], b: number[], C: number) {
	return a.reduce((prev, an, n) => prev + an * b[n], C);
}
