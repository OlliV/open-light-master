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
