export function normalize(v: number[]) {
	const div = Math.sqrt(v.reduce((res, vn) => res + Math.pow(vn, 2), 0));

	return v.map((vn) => vn / div);
}

export function normalize2(v: number[]) {
	const max = Math.max(...v);
	return max === 0 ? v.slice(0) : v.map((v) => v / max);
}

export function sub(a: number[], b: number[]) {
	return a.map((x, i) => x - b[i]);
}

export function transform(v: number[], sub: number[], coeff: number[]) {
	return v.map((xn, i) => (xn - sub[i]) / coeff[i]);
}

export function dotProdC(a: number[], b: number[], C: number) {
	return a.reduce((prev, an, n) => prev + an * b[n], C);
}

export function convolve(volume: number[], kernel: number[]) {
	const r = Array.from({ length: volume.length + kernel.length }, () => 0);

	for (let j = 0; j < kernel.length; ++j) {
		r[j] = volume[0] * kernel[j];
	}

	for (let i = 1; i < volume.length; ++i) {
		for (let j = 0; j < kernel.length; ++j) {
			r[i + j] += volume[i] * kernel[j];
		}
	}

	return r;
}
