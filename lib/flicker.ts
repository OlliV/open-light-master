import webfft from 'webfft';
import { fftshift } from 'lib/fftshift';
import { setGlobalState } from './global';

const fftSize = 1024; // must be a power of 2
const fft = new webfft(fftSize);

function mean(x: readonly number[]) {
	return x.reduce((prev: number, xn: number) => prev + xn) / x.length;
}

export function calcFft(wave: readonly number[]): Float32Array {
	if (wave.length != fftSize) return Float32Array.from([0]);

	const DC = mean(wave);
	// The input is an interleaved complex array (IQIQIQIQ...), so it's twice the size
	const fftOut = fft.fft(new Float32Array(wave.map((xn: number) => xn - DC).flatMap((xn: number) => [xn, 0])));
	const mag = new Float32Array(fftSize);
	for (let i = 0; i < fftSize; i++) {
		mag[i] = Math.sqrt(fftOut[2 * i] * fftOut[2 * i] + fftOut[2 * i + 1] * fftOut[2 * i + 1]);
	}

	//return Array.from(fftshift(mag).slice(fftSize / 2, fftSize));
	return fftshift(mag).subarray(fftSize / 2, fftSize);
}

export function calcFlicker(
	waveData: { n: number; sRange: number; x: readonly number[] },
	CCT: number,
	Lux: number,
	Ksensor: readonly number[]
) {
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
			c = 12.285;
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
			y = 34.516602;
	}

	let { x: wave } = waveData;
	const corrected = wave.map(function (xn) {
		var t = xn - y;
		return t < 0 ? 0 : t;
	});
	//const wavMax = Math.max(...corrected);
	//const wavMin = Math.min(...corrected);
	const wavMean = mean(corrected);
	const k = wavMean !== 0 ? Lux / wavMean : 1;
	//console.log('Lux:', Lux, 'average:', wavMean, 'max:', wavMax, 'min:', wavMin, 'k:', k);
	wave = corrected.map((v) => k * v);
	const sortedWave = wave.slice(0).sort((n, t) => {
		return n - t;
	});
	const rSortedWave = sortedWave.slice(0, 30).reverse();
	const N = mean(sortedWave.slice(-30));
	const T = mean(rSortedWave);
	const V = mean(wave);
	let fluDepth = N + T <= 0 ? 0 : ((N - T) / (N + T)) * 100;
	fluDepth = fluDepth > 99.5 ? 99.5 : fluDepth; // fluctuation depth
	const J = wave.reduce((xn, t) => xn + (t - V > 0 ? t - V : 0));
	const waveSum = wave.reduce((prev, xn) => prev + xn);
	const flickerIndex = waveSum === 0 ? 0 : J / waveSum;

	setGlobalState('res_lm_freq', {
		CCT,
		Lux,
		fluDepth,
		flickerIndex,
		freqDiv: c,
		wave,
	});
}
