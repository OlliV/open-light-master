/**
 * Reference white D50.
 * Y = 100, relative luminance.
 */
export const XYZnD50 = Object.freeze([96.4212, 100, 82.5188]);

/**
 * Reference white D65.
 * Y = 100, relative luminance.
 */
export const XYZnD65 = Object.freeze([95.0489, 100, 108.884]);

/**
 * XYZ to tristimulus to CIE 1931 (x, y) chromaticity.
 */
export function XYZ2xy(XYZ: readonly number[]) {
	const x = XYZ[0] / (XYZ[0] + XYZ[1] + XYZ[2]);
	const y = XYZ[1] / (XYZ[0] + XYZ[1] + XYZ[2]);

	return [x, y] as const;
}

/**
 * CIE 1931 (x, y) chromaticity to CIE 1960 UCS (u, v) chromaticity.
 * MacAdam simplified Judd's
 */
export function xy2uv(x: number, y: number) {
	const nj = -2 * x + 12 * y + 3;
	const u = (4 * x) / nj;
	const v = (6 * y) / nj;
	return [u, v] as const;
}

export function uv2xy(u: number, v: number) {
	const d = 2 * u - 8 * v + 4;
	const x = (3 * u) / d;
	const y = (2 * v) / d;
	return [x, y] as const;
}

/**
 * CIE XYZ color space to CIE 1964 UVW color space.
 */
export function XYZ2UVW(XYZ: readonly number[], u0: number, v0: number) {
	const [u, v] = xy2uv(...XYZ2xy(XYZ));

	const W = 25 * XYZ[1] ** (1 / 3) - 17;
	const U = 13 * W * (u - u0);
	const V = 13 * W * (v - v0);

	return [U, V, W] as const;
}

/**
 * xyY color space to XYZ tristimulus.
 */
export function xy2XYZ(x: number, y: number, Y: number) {
	const X = (Y / y) * x;
	const Z = (Y / y) * (1 - x - y);

	return [X, Y, Z] as const;
}

const δ = 6 / 29;

function f(t: number): number {
	if (t > δ ** 3) {
		return Math.cbrt(t);
	} else {
		return (1 / 3) * t * Math.pow(δ, -2) + 4 / 29;
	}
}

function finv(t: number): number {
	if (t > δ) {
		return t ** 3;
	} else {
		return 3 * δ ** 2 * (t - 4 / 29);
	}
}

/**
 * CIE XYZ color space to CIELAB color space.
 */
export function XYZ2Lab(X: number, Y: number, Z: number, XYZn: readonly number[]) {
	const L = 116 * f(Y / XYZn[1]) - 16;
	const a = 500 * (f(X / XYZn[0]) - f(Y / XYZn[1]));
	const b = 200 * (f(Y / XYZn[1]) - f(Z / XYZn[2]));

	return [L, a, b] as const;
}

export function Lab2XYZ(L: number, a: number, b: number, XYZn: readonly number[]) {
	const X = XYZn[0] * finv((L + 16) / 116 + a / 500);
	const Y = XYZn[1] * finv((L + 16) / 116);
	const Z = XYZn[2] * finv((L + 16) / 116 - b / 200);

	return [X, Y, Z] as const;
}

function LabHue(a: number, b: number) {
	return Math.atan2(b, a);
}

// C_ab
function LabChroma(a: number, b: number) {
	return Math.sqrt(a ** 2 + b ** 2);
}

// S_ab
function LabSat(Cab: number, L: number) {
	return Cab / Math.sqrt(Cab ** 2 + L ** 2);
}

export function LabHueSatChroma(L: number, a: number, b: number) {
	const hab = LabHue(a, b) * (180 / Math.PI) || 0;
	const posHab = Math.round((hab + 360) % 360);
	const chroma = LabChroma(a, b);
	const sat = LabSat(chroma, L);

	return {
		hab: posHab,
		sat,
		chroma,
	};
}
