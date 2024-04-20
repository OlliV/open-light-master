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
