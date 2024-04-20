function f(t: number) {
	const δ = 6 / 29;
	if (t > δ ** 3) {
		return Math.cbrt(t);
	} else {
		return (1 / 3) * t * Math.pow(δ, -2) + 4 / 29;
	}
}

export const XYZnD50 = [96.4212, 100, 82.5188];

export const XYZnD65 = [95.0489, 100, 108.884];

export default function CIEXYZtoLab(X: number, Y: number, Z: number, XYZn: number[]) {
	const L = 116 * f(Y / XYZn[1]) - 16;
	const a = 500 * (f(X / XYZn[0]) - f(Y / XYZn[1]));
	const b = 200 * (f(Y / XYZn[1]) - f(Z / XYZn[2]));

	return [L, a, b];
}
