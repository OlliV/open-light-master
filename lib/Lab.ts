export const XYZnD50 = [96.4212, 100, 82.5188];
export const XYZnD65 = [95.0489, 100, 108.884];

function f(t: number) {
	const δ = 6 / 29;
	if (t > δ ** 3) {
		return Math.cbrt(t);
	} else {
		return (1 / 3) * t * Math.pow(δ, -2) + 4 / 29;
	}
}

export default function CIEXYZtoLab(X: number, Y: number, Z: number, XYZn: number[]) {
	const L = 116 * f(Y / XYZn[1]) - 16;
	const a = 500 * (f(X / XYZn[0]) - f(Y / XYZn[1]));
	const b = 200 * (f(Y / XYZn[1]) - f(Z / XYZn[2]));

	return [L, a, b];
}


export function LabHue(a: number, b: number) {
	return Math.atan2(b, a);
}

// C_ab
export function LabChroma(a: number, b: number) {
	return Math.sqrt(a ** 2 + b ** 2);
}

// S_ab
export function LabSat(Cab: number, L: number) {
	return Cab / Math.sqrt(Cab ** 2 + L ** 2);
}

export function CalcLabHueChromaSat(X: number, Y: number, Z: number) {
	const [L, a, b] = CIEXYZtoLab(X, Y, Z, XYZnD65);
	const hab = LabHue(a, b) * (180 / Math.PI) || 0;
	const posHab = Math.round((hab + 360) % 360);
	const chroma = LabChroma(a, b);
	const sat = LabSat(chroma, L);

	return {
		Lab: [L, a, b],
		hab: posHab,
		chroma,
		sat,
	};
}
