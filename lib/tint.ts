// Copyright 2018 GoPro, Inc.
// Copyright 2024-2025 Olli Vanhoja
// SPDX-License-Identifier: MIT

const kTintScale = -3000.0;

/*****************************************************************************/

// Table from Wyszecki & Stiles, "Color Science", second edition, page 228.

// kTempTable[i * 4 + j]
// j:
// r = 0
// u = 1
// v = 2
// t = 3
const kTempTable = Float64Array.from([
	[0, 0.18006, 0.26352, -0.24341],
	[10, 0.18066, 0.26589, -0.25479],
	[20, 0.18133, 0.26846, -0.26876],
	[30, 0.18208, 0.27119, -0.28539],
	[40, 0.18293, 0.27407, -0.3047],
	[50, 0.18388, 0.27709, -0.32675],
	[60, 0.18494, 0.28021, -0.35156],
	[70, 0.18611, 0.28342, -0.37915],
	[80, 0.1874, 0.28668, -0.40955],
	[90, 0.1888, 0.28997, -0.44278],
	[100, 0.19032, 0.29326, -0.47888],
	[125, 0.19462, 0.30141, -0.58204],
	[150, 0.19962, 0.30921, -0.70471],
	[175, 0.20525, 0.31647, -0.84901],
	[200, 0.21142, 0.32312, -1.0182],
	[225, 0.21807, 0.32909, -1.2168],
	[250, 0.22511, 0.33439, -1.4512],
	[275, 0.23247, 0.33904, -1.7298],
	[300, 0.2401, 0.34308, -2.0637],
	[325, 0.24702, 0.34655, -2.4681],
	[350, 0.25591, 0.34951, -2.9641],
	[375, 0.264, 0.352, -3.5814],
	[400, 0.27218, 0.35407, -4.3633],
	[425, 0.28039, 0.35577, -5.3762],
	[450, 0.28863, 0.35714, -6.7262],
	[475, 0.29685, 0.35823, -8.5955],
	[500, 0.30505, 0.35907, -11.324],
	[525, 0.3132, 0.35968, -15.628],
	[550, 0.32129, 0.36011, -23.325],
	[575, 0.32931, 0.36038, -40.77],
	[600, 0.33724, 0.36051, -116.45],
].flat());

export default function calcTint(x: number, y: number) {
	let fTemperature: number;
	let fTint: number;

	const u = (2.0 * x) / (1.5 - x + 6.0 * y);
	const v = (3.0 * y) / (1.5 - x + 6.0 * y);

	// Search for line pair coordinate is between.
	let last_dt = 0.0;
	let last_dv = 0.0;
	let last_du = 0.0;

	for (let i = 1; i <= 30; i++) {
		// Convert slope to delta-u and delta-v, with length 1.
		let du = 1.0;
		let dv = kTempTable[i * 4 + 3];
		let len = Math.sqrt(1.0 + dv * dv);

		du /= len;
		dv /= len;

		// Find delta from black body point to test coordinate.
		let uu = u - kTempTable[i * 4 + 1];
		let vv = v - kTempTable[i * 4 + 2];

		// Find distance above or below line.
		let dt = -uu * dv + vv * du;

		// If below line, we have found line pair.
		if (dt <= 0.0 || i === 30) {
			// Find fractional weight of two lines.
			if (dt > 0.0) {
				dt = 0.0;
			}

			dt = -dt;

			const f = (i === 1) ? 0.0 : dt / (last_dt + dt);

			// Interpolate the temperature.
			fTemperature = 1.0e6 / (kTempTable[(i - 1) * 4 + 0] * f + kTempTable[i * 4 + 0] * (1.0 - f));

			// Find delta from black body point to test coordinate.
			uu = u - (kTempTable[(i - 1) * 4 + 1] * f + kTempTable[i * 4 + 1] * (1.0 - f));
			vv = v - (kTempTable[(i - 1) * 4 + 2] * f + kTempTable[i * 4 + 2] * (1.0 - f));

			// Interpolate vectors along slope.

			du = du * (1.0 - f) + last_du * f;
			dv = dv * (1.0 - f) + last_dv * f;

			len = Math.sqrt(du * du + dv * dv);

			du /= len;
			dv /= len;

			// Find distance along slope.
			fTint = (uu * du + vv * dv) * kTintScale;

			break;
		}

		// Try next line pair.
		last_dt = dt;
		last_du = du;
		last_dv = dv;
	}

	return [fTemperature, fTint];
}
