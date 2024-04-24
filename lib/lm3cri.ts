import { interpolateSPD } from './spd';
import { calcCRI } from './cri';

type MeasurementData = {
	V1: number;
	B1: number;
	G1: number;
	Y1: number;
	O1: number;
	R1: number;
	Lux: number;
	CCT: number;
};

export default function lm3CalcCRI(meas: MeasurementData) {
	const spd = interpolateSPD([
		{ wl: 450, p: meas.V1 },
		{ wl: 500, p: meas.B1 },
		{ wl: 550, p: meas.G1 },
		{ wl: 570, p: meas.Y1 },
		{ wl: 600, p: meas.O1 },
		{ wl: 650, p: meas.R1 },
	]);

	return calcCRI(
		meas.CCT,
		spd.map(({ p }) => p)
	);
}
