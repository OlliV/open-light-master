import { calcCRI } from './cri';
import { interpolateSPD } from './spd';
import { normalize2 } from './vector';

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
		{ l: 450, v: meas.V1 },
		{ l: 500, v: meas.B1 },
		{ l: 550, v: meas.G1 },
		{ l: 570, v: meas.Y1 },
		{ l: 600, v: meas.O1 },
		{ l: 650, v: meas.R1 },
	]);

	return calcCRI(
		meas.CCT,
		spd.map(({ v }) => v)
	);
}

export function lm3NormSPD(meas: MeasurementData) {
	const norm = normalize2([meas.V1, meas.B1, meas.G1, meas.Y1, meas.O1, meas.R1]);
	return [
		{
			l: 450,
			v: norm[0],
		},
		{
			l: 500,
			v: norm[1],
		},
		{
			l: 550,
			v: norm[2],
		},
		{
			l: 570,
			v: norm[3],
		},
		{
			l: 600,
			v: norm[4],
		},
		{
			l: 650,
			v: norm[5],
		},
	];
}
