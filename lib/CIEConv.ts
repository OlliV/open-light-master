export const XYZnD50 = [96.4212, 100, 82.5188];
export const XYZnD65 = [95.0489, 100, 108.884];

export function XYZ2xy(XYZ: number[]) {
	const x = XYZ[0] / (XYZ[0] + XYZ[1] + XYZ[2]);
	const y = XYZ[1] / (XYZ[0] + XYZ[1] + XYZ[2]);

	return [x, y] as const;
}

// MacAdam simplified Judd's
export function xy2uv(x: number, y: number) {
	const nj = -2 * x + 12 * y + 3;
	const u = (4 * x) / nj;
	const v = (6 * y) / nj;
	return [u, v] as const;
}

export function XYZ2UVW(XYZ: number[], u0: number, v0: number) {
	const [u, v] = xy2uv(...XYZ2xy(XYZ));

	const W = 25 * XYZ[1] ** (1 / 3) - 17;
	const U = 13 * W * (u - u0);
	const V = 13 * W * (v - v0);

	return [U, V, W] as const;
}

function f(t: number) {
	const δ = 6 / 29;
	if (t > δ ** 3) {
		return Math.cbrt(t);
	} else {
		return (1 / 3) * t * Math.pow(δ, -2) + 4 / 29;
	}
}

export function XYZ2Lab(X: number, Y: number, Z: number, XYZn: number[]) {
	const L = 116 * f(Y / XYZn[1]) - 16;
	const a = 500 * (f(X / XYZn[0]) - f(Y / XYZn[1]));
	const b = 200 * (f(Y / XYZn[1]) - f(Z / XYZn[2]));

	return [L, a, b] as const;
}

export function xy2XYZ(x: number, y: number, Y: number) {
	const X = (Y / y) * x;
	const Z = (Y / y) * (1 - x - y);

	return [X, Y, Z] as const;
}
