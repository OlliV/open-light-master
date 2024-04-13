import { getGlobalState, setGlobalState } from '../global';
import calcDuv from '../duv';
import calcTint from '../tint';

export const BLE_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

const PROTO_REQ_READ_M3 = 2564;
const PROTO_RESP_READ_M3 = 2565;
const PROTO_REQ_MEAS = 2560;
const PROTO_RES_MEAS = 2561;
const PROTO_REQ_FREQ = 2570;
const PROTO_RES_FREQ = 2571;

const PROTO_MSG_SINGLE = 0;
const PROTO_MSG_FFRAG = 0x80;
const PROTO_MSG_MFRAG = 0xa0;
const PROTO_MSG_LFRAG = 0xc0;

function calcResult(V1: number, B1: number, G1: number, Y1: number, O1: number, R1: number, C1: number) {
	const a = (O1 + R1) / (V1 + B1 + G1 + Y1 + O1 + R1);
	const b = (R1 - Y1) / (V1 + B1 + G1 + Y1 + O1 + R1);
	let mode = 0;
	Math.max(V1, B1, G1, Y1, O1, R1) / (V1 + B1 + G1 + Y1 + O1 + R1) >= 0.45
		? (mode = 1) // Monochromatic light, no need to calculate display index CRI
		: a >= 0.5 && a <= 0.55 && b >= 0 && b <= 0.05
		? (mode = 2) // thermal (incandescent) light source
		: (mode = 3); // general
	let O: number[][] = [[V1], [B1], [G1], [Y1], [O1], [R1], [C1]];
	let w = null;

	switch (mode) {
		case 1:
			w = matMul(
				[
					[0.06023, 0.00106, 0.02108, 0.03673, 0.1683, 0.02001, 0],
					[0.00652, 0.04478, 0.16998, -0.03268, 0.07425, 0.00739, 0],
					[0.33092, 0.12936, -0.15809, 0.19889, -0.0156, 0.00296, 0],
				],
				3,
				7,
				O,
				7,
				1
			);
			break;
		case 2:
			w = matMul(
				[
					[-0.43786, 0.53102, -0.1453, 0.2316, 0.36758, -0.09047, 0],
					[-0.23226, 0.69225, -0.39786, 0.22539, 0.47947, -0.17614, 0],
					[-0.11002, 1.21259, -0.56003, 0.14487, 0.35074, -0.30248, 0],
				],
				3,
				7,
				O,
				7,
				1
			);
			break;
		case 3:
			w = matMul(
				[
					[-0.05825, -0.0896, 0.25859, 0.19518, 0.10893, 0.06724, 0],
					[-0.19865, 0.01337, 0.40651, 0.29702, -0.06287, 0.03282, 0],
					[0.58258, 0.11548, 0.21823, -0.00136, -0.10732, -0.00915, 0],
				],
				3,
				7,
				O,
				7,
				1
			);
	}

	// trisimulus
	let X, Y, Z;
	(X = w[0][0]) < 0 && (X = 0);
	(Y = w[1][0]) < 0 && (Y = 0);
	(Z = w[2][0]) < 0 && (Z = 0);

	// chromacity coords
	let x = X / (X + Y + Z);
	let y = Y / (X + Y + Z);

	// McCamy’s (CCT) formula
	// RFE Explore better formulas
	// - Hernández-Andrés et al. formula
	// - Accurate method for computing correlated color temperature, Changjun Li et al.
	const n = (x - 0.332) / (0.1858 - y);
	const CCT = 449 * n * n * n + 3525 * n * n + 6823.3 * n + 5520.33;

	// MacAdam simplified Judd's
	const nj = -2 * x + 12 * y + 3;
	const Eu = (4 * x) / nj;
	const Ev = (6 * y) / nj;

	const [, tint] = calcTint(x, y);

	return (
		0 == X && 0 == Y && 0 == Z && ((x = 0), (y = 0)),
		{
			Eu,
			Ev,
			Ey: y,
			Ex: x,
			Duv: calcDuv(Eu, Ev),
			CCT,
			tint,
			Lux: 1 * Y,
			mode: mode,
		}
	);
}

function calcEml(cct: number, v1: number, b1: number, g1: number, y1: number, o1: number, r1: number, mode: number) {
	let eml: number;

	if (cct < 4e3) {
		if (cct < 3e3 && mode === 2) {
			// Thermal light source
			eml = -11.1321 * v1 + 10.088 * b1 + 10.5399 * g1 - 4.9714 * y1 - 4.2457 * o1 + 1.3921 * r1;
		} else {
			eml = 0.1157 * v1 + 0.543 * b1 + 0.1886 * g1 + 0.02516 * y1 - 0.0825 * o1 - 0.007316 * r1;
		}
	} else {
		eml = -0.005224 * v1 + 0.3113 * b1 + 0.3649 * g1 + 0.3632 * y1 - 0.4313 * o1 + 0.05123 * r1;
	}

	return eml < 0 ? 0 : eml;
}

function matMul(mat_a: number[][], m1: number, n1: number, mat_b: number[][], m2: number, n2: number) {
	let mat_r = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	];

	for (let i = 0; i < m1; i++)
		for (let j = 0; j < n2; j++) for (let k = 0; k < n1; k++) mat_r[i][j] = mat_r[i][j] + mat_a[i][k] * mat_b[k][j];

	return mat_r;
}

function lpfGetA(avg_period: number, sample_interval: number) {
	return Math.exp(-(sample_interval / avg_period));
}

/**
 * Calculate the next output value of the lpf.
 * @param prev is the previous output of this function.
 * @param a is the coefficient calculated by lpfGetA().
 * @param sample is the current sample.
 */
function lpfCalcNext(a: number, prev: number, sample: number) {
	return a * prev + (1.0 - a) * sample;
}

function parseMeasurementData(data: number[], prevMeas: number[], coeff_a: number, kSensor: number[]) {
	data = data.slice(11);

	const V0 = (data[1] << 8) + data[2];
	const B0 = (data[3] << 8) + data[4];
	const G0 = (data[5] << 8) + data[6];
	const Y0 = (data[7] << 8) + data[8];
	const O0 = (data[9] << 8) + data[10];
	const R0 = (data[11] << 8) + data[12];
	const power = (data[13] << 8) + data[14];
	const C0 = data[15];

	// Correction
	const V1 = lpfCalcNext(coeff_a, prevMeas[0], V0 * kSensor[0]); // 450 nm
	const B1 = lpfCalcNext(coeff_a, prevMeas[1], B0 * kSensor[1]); // 500 nm
	const G1 = lpfCalcNext(coeff_a, prevMeas[2], G0 * kSensor[2]); // 550 nm
	const Y1 = lpfCalcNext(coeff_a, prevMeas[3], Y0 * kSensor[3]); // 570 nm
	const O1 = lpfCalcNext(coeff_a, prevMeas[4], O0 * kSensor[4]); // 600 nm
	const R1 = lpfCalcNext(coeff_a, prevMeas[5], R0 * kSensor[5]); // 650 nm
	const C1 = 1 * kSensor[6]; // But what's the relation of this to C0 that's the ambient temperature?

	const result = calcResult(V1, B1, G1, Y1, O1, R1, C1);
	// TODO
	//(V0 > 65e3 || B0 > 65e3 || G0 > 65e3 || Y0 > 65e3 || O0 > 65e3 || R0 > 65e3 || result.Lux > 5e4) && (result.Lux = 5e4, result.CCT = 0, result.Eu = 0, result.Ev = 0, result.Ey = 0, result.Ex = 0);
	//result.Lux < 3 && (result.Lux = 0);

	return {
		result: {
			V1,
			B1,
			G1,
			Y1,
			O1,
			R1,
			C1,
			...result,
			temperature: C0,
			eml: calcEml(result.CCT, V1, B1, G1, Y1, O1, R1, result.mode),
		},
		power,
	};
}

function buffer2array(data: DataView) {
	const arr = [];

	for (let i = 0; i < data.byteLength; i++) {
		arr.push(data.getUint8(i));
	}

	return arr;
}

function batteryLevel(voltage: number) {
	const u = [4080, 3985, 3894, 3838, 3773, 3725, 3710, 3688, 3656, 3594, 3455];
	const p = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 1];
	let level = 1;

	for (let i = 0; i < 9; i++) {
		if (voltage > u[i + 1]) {
			level = ((voltage - u[i + 1]) / (u[i] - u[i + 1])) * (p[i] - p[i + 1]) + p[i + 1];
			break;
		}
	}
	return Math.min(level, 100);
}

export async function createLm3(server: BluetoothRemoteGATTServer) {
	const service = await server.getPrimaryService(BLE_SERVICE_UUID);
	//const rxCharacteristic = await service.getCharacteristic(RX_CHARACTERISTIC_UUID);
	const txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);

	const calData = {
		Ksensor: [],
		power: 0,
	};
	let prevMeas = [0, 0, 0, 0, 0, 0]; // V1, B1, G1, Y1, O1, R1
	let coeff_a = 1; // Calc with lpfGetA()

	let inflight = false;
	let rxBuffer = null;
	let rxBufferLen = 0;
	txCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
		// @ts-ignore
		const value = event.target.value;

		//console.log('event:', value);

		try {
			const msgType = value.getUint8(0) & 0xe0;
			let payload: Uint8Array;
			switch (msgType) {
				case PROTO_MSG_SINGLE: // Single fragment message
					//console.log(`Single message. len: ${value.length}`);
					parseMsg(buffer2array(value).slice(3));
					break;
				case PROTO_MSG_FFRAG: // First fragment of a message
					const totalLen = (value.getUint8(1) << 8) | value.getUint8(2);
					//const something = value.getUint8(3);
					//console.log(`First fragment. totalLen: ${totalLen}`);
					payload = new Uint8Array(buffer2array(value).slice(3));
					rxBuffer = new Uint8Array(totalLen);
					rxBuffer.set(payload, 0);
					rxBufferLen = payload.length;
					break;
				case PROTO_MSG_MFRAG: // Partial
					//console.log(`Fragment. len: ${value.length}`);
					payload = new Uint8Array(buffer2array(value).slice(1));
					rxBuffer.set(payload, rxBufferLen);
					rxBufferLen += payload.length;
					break;
				case PROTO_MSG_LFRAG:
					//console.log(`Last fragment. len: ${value.length}`);
					payload = new Uint8Array(buffer2array(value).slice(1));
					rxBuffer.set(payload, rxBufferLen);
					rxBufferLen += payload.length;
					//console.log('buf len', rxBuffer.length, rxBufferLen);
					parseMsg(rxBuffer.subarray(0, rxBufferLen));
					break;
				default:
					console.log(`Unknown message type: ${msgType}`);
			}
		} catch (e) {
			console.log('Msg parse failed:', e);
		}
		inflight = false;
	});

	let seqno = 0;

	function encapsulateData(data: number[]) {
		const nFragments = data.length < 17 ? 1 : Math.ceil((data.length - 17) / 19 + 1);
		const fragments = [];

		for (let c = 0; c < nFragments; c++) {
			let head = [];
			let l = [];

			if (0 == c) {
				let u = data.length + nFragments + 2;

				head = [nFragments > 1 ? PROTO_MSG_FFRAG : PROTO_MSG_SINGLE, (0xff00 & u) >> 8, 0xff & u];
				l = nFragments > 1 ? data.slice(0, 17) : data.slice(0);
			} else {
				if (c != nFragments - 1) {
					head = [PROTO_MSG_MFRAG | c];
					l = data.slice(17 + 19 * (c - 1), 17 + 19 * c);
				} else {
					head = [PROTO_MSG_LFRAG | c];
					l = data.slice(17 + 19 * (c - 1));
				}
			}
			fragments.push([...head, ...l]);
		}

		return fragments;
	}

	const sendCommand = async (opCode: number, n?: number[]) => {
		/* this.realWriteDataWithCommondAndBody */
		seqno = (seqno + 1) & 0xff;

		let h = [0, 0x13, 0, 0, seqno, 0, 0 + (n ? n.length : 0), 0, 0, (0xff00 & opCode) >> 8, 0xff & opCode];

		let v = h;
		n && (v = h.concat(n));
		let frames = encapsulateData(v);
		//console.log('sending:', frames);
		inflight = true;
		for (const frame of frames) {
			let buf = new ArrayBuffer(frame.length);
			let view = new DataView(buf);

			for (let i = 0; i < frame.length; i++) {
				view.setInt8(i, 0xff & frame[i]);
			}

			await txCharacteristic.writeValue(buf);
		}
	};

	const parseMsg = (data: number[]) => {
		const code = ((255 & data[9]) << 8) + data[10];
		//const trx = data[5];
		//console.log('msgType: ' + (255 & data[9]) + ', ' + ((0xff & data[9]) << 8) + ', ' + code + ',transNumber:' + trx);

		if (code == PROTO_RES_MEAS) {
			// response to singleMeasure?
			const res = parseMeasurementData(data, prevMeas, coeff_a, calData.Ksensor);
			prevMeas[0] = res.result.V1;
			prevMeas[1] = res.result.B1;
			prevMeas[2] = res.result.G1;
			prevMeas[3] = res.result.Y1;
			prevMeas[4] = res.result.O1;
			prevMeas[5] = res.result.R1;
			//console.log('Read measurement:', res);

			setGlobalState('res_lm_measurement', res.result);
			setGlobalState('res_battery_level', batteryLevel(res.power));
		} else if (code == PROTO_RESP_READ_M3) {
			// response to readM3: M3 Matrix
			const arr2float = (v) => new DataView(new Uint8Array(v).buffer).getFloat32(0);

			let s = [];
			for (let i = 0; i < 7; i++) {
				const j = 4 * i;
				const l = data.slice(12 + j, 12 + j + 4);
				s.push(arr2float(l.reverse()));
			}
			calData.Ksensor = s;
			calData.power = (data[40] << 8) + data[41];
		}
	};

	const singleMeasure = async () => await sendCommand(PROTO_REQ_MEAS);

	const startMeasuring = (ms: number, avgPeriod: number) => {
		coeff_a = lpfGetA(avgPeriod, ms / 1000);
		let tim = setInterval(() => {
			if (inflight || !getGlobalState('running')) {
				return;
			}

			singleMeasure().catch((e) => {
				console.log(e);
				clearInterval(tim);
			});
		}, ms);
	};

	return {
		startNotifications: () => txCharacteristic.startNotifications(),
		readCal: async () => await sendCommand(PROTO_REQ_READ_M3),
		singleMeasure,
		startMeasuring,
	};
}
