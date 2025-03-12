import { SPD, interpolateSPD } from './spd';
import { matrixMul } from './matrix';
import { normalize3, sub as vecSub, convolve } from './vector';

const trap30x301 = (() => {
	const trap = [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5];
	const out = Array.from({ length: 30 }, () => Array.from({ length: 301 }, () => 0));

	for (let i = 0; i < 30; i++) {
		for (let j = 0; j < trap.length; j++) {
			out[i][10 * i + j] = trap[j];
		}
	}

	return out;
})();

const spectralWeight = Object.freeze([
	12 / 45,
	22 / 45,
	32 / 45,
	40 / 45,
	44 / 45,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	11 / 15,
	3 / 15,
]);
const convVec = Object.freeze([0.22, 0.56, 0.22]);

export function ssi(ref: Readonly<SPD>, test: Readonly<SPD>) {
	const refVec = matrixMul(
		trap30x301,
		interpolateSPD(ref, 1, 380, 670).map(({ v }) => [v])
	).map(([v]) => v); // step 1
	const testVec = matrixMul(
		trap30x301,
		interpolateSPD(test, 1, 380, 670).map(({ v }) => [v])
	).map(([v]) => v);

	const refNorm = normalize3(refVec); // step 2
	const testNorm = normalize3(testVec);

	const diffNorm = vecSub(testNorm, refNorm); // step 3
	const diffRela = diffNorm.map((x, i) => x / (refNorm[i] + 1 / refNorm.length)); // step 4
	const weightedDiffRela = diffRela.map((x, i) => x * spectralWeight[i]); // step 5
	const sWeightedDiffRela = convolve([0, ...weightedDiffRela, 0], convVec); // step 6
	const metric = sWeightedDiffRela.reduce((sum, cur) => sum + cur ** 2); // step 7
	const SSI = Math.round(100 - 32 * Math.sqrt(metric)); // step 8

	return SSI;
}
