import {setGlobalState} from "./global";

function mean(x: number[]) {
	return x.reduce((prev: number, xn: number) => prev + xn) / x.length
}

export function calcFlicker(waveData: { n: number; sRange: number; x: number[]; }, CCT: number, Lux: number, Ksensor: number[]) {
	if (waveData.x.length != 1024) {
		throw new Error('Expected 1024 samples');
	}
	let c: number;
	switch (waveData.n) {
		case 25:
			c = 26;
			break;
		case 146:
			c = 150;
			break;
		case 11:
			c = 12.285
	}
	let y: number;
	switch (waveData.sRange) {
		case 0:
			y = 67.003906;
			break;
		case 1:
			y = 35.363281;
			break;
		case 2:
		default:
			y = 34.516602
	}

	let { x: wave } = waveData;
	const corrected = wave.map(function (xn) {
		var t = xn - y;
		return t < 0 ? 0 : t
	});
	//const wavMax = Math.max(...O);
	//const wavMin = Math.min(...O);
	const wavMean = mean(corrected);
	const k = wavMean !== 0 ? Lux / wavMean : 1;
	//console.log('average:', wavMean, 'max:', wavMax, 'min:', wavMin, 'k:', k);
	wave = corrected.map((v) =>k * v);
	const sortedWave = wave.slice(0).sort((n, t) => {
		return n - t
	});
	const rSortedWave = sortedWave.slice(0, 30).reverse();
	const N = mean(sortedWave.slice(-30));
	const T = mean(rSortedWave);
	const V = mean(wave);
	let fluDepth = N + T <= 0 ? 0 : (N - T) / (N + T) * 100;
	fluDepth = fluDepth > 99.5 ? 99.5 : fluDepth; // fluctuation depth
    const J = wave.reduce((xn, t) => xn + (t - V > 0 ? t - V : 0));
	const waveSum = wave.reduce((prev, xn) => prev + xn);
	const flickerIndex = waveSum == 0 ? 0 : J / waveSum;

	setGlobalState('res_lm_freq', {
		fluDepth,
		flickerIndex,
		freqDiv: c,
		wave,
	});
}
