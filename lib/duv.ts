// ANSI C78.377-2011
export default function calcDuv(u: number, v: number) {
	const k = [-0.471106, 1.925865, -2.4243787, 1.5317403, -0.5179722, 0.0893944, -0.00616793];
	const Lfp = Math.sqrt(Math.pow(u - 0.292, 2) + Math.pow(v - 0.24, 2));
	const a = Math.acos((u - 0.292) / Lfp);
	const Lbb =
		k[6] * Math.pow(a, 6) +
		k[5] * Math.pow(a, 5) +
		k[4] * Math.pow(a, 4) +
		k[3] * Math.pow(a, 3) +
		k[2] * Math.pow(a, 2) +
		k[1] * a +
		k[0];

	return Lfp - Lbb;
}
