// Original matrix funcs Riky Perdana
// slightly edited from https://rikyperdana.medium.com/matrix-operations-in-functional-js-e3463f36b160

const withAs = (obj, cb) => cb(obj);
const sum = (arr: number[]) => arr.reduce((a, b) => a + b);
const mul = (arr: number[]) => arr.reduce((a, b) => a * b);
const sub = (arr: number[]) => arr.splice(1).reduce((a, b) => a - b, arr[0]);
// TODO do something better
const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const shifter = (arr: number[], step: number) => [...arr.splice(step), ...arr.splice(arr.length - step)] as const;

export const makeMatrix = (rows: number, cols: number, fill?: (i: number, j: number) => number) =>
	Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => (fill ? fill(i, j) : 0)));

export const matrixSize = (matrix: number[][]) => [matrix.length, matrix[0].length] as const;

export const arr2mat = (rows: number, cols: number, arr: number[]) =>
	Array.from({ length: rows }, (_, i) => arr.slice(i * cols, i * cols + cols));

const matrixMap = (matrix: number[][], cb: ({ i, ix, j, jx, matrix }) => number) =>
	deepClone(matrix).map((i, ix) => i.map((j, jx) => cb({ i, ix, j, jx, matrix })));

export const matrixScalar = (n: number, matrix: number[][]) => matrixMap(matrix, ({ j }) => n * j);

export const matrixAdd = (matrices) =>
	matrices.reduce(
		(acc, inc) => matrixMap(acc, ({ j, ix, jx }) => j + inc[ix][jx]),
		makeMatrix(...matrixSize(matrices[0]))
	);

export const matrixSub = (matrices) =>
	matrices.splice(1).reduce((acc, inc) => matrixMap(acc, ({ j, ix, jx }) => j - inc[ix][jx]), matrices[0]);

export const matrixMul = (m1, m2) =>
	makeMatrix(m1.length, m2[0].length, (i, j) => sum(m1[i].map((k, kx) => k * m2[kx][j])));

export const matrixMuls = (matrices) =>
	deepClone(matrices)
		.splice(1)
		.reduce(
			(acc, inc) =>
				makeMatrix(acc.length, inc[0].length, (ix, jx) => sum(acc[ix].map((k, kx) => k * inc[kx][jx]))),
			deepClone(matrices[0])
		);

const matrixMinor = (matrix: number[][], row: number, col: number) =>
	matrix.length < 3
		? matrix
		: matrix.filter((i, ix) => ix !== row - 1).map((i) => i.filter((j, jx) => jx !== col - 1));

// TODO FIX
// @ts-ignore
export const matrixTrans = (matrix: number[][]) =>
	makeMatrix(...shifter(matrixSize(matrix), 1), (i: number, j: number) => matrix[j][i]);

export const matrixDet = (matrix: number[][]) =>
	withAs(deepClone(matrix), (clone) =>
		matrix.length < 3
			? sub(matrixTrans(clone.map(shifter)).map(mul))
			: sum(clone[0].map((i, ix) => matrixDet(matrixMinor(matrix, 1, ix + 1)) * Math.pow(-1, ix + 2) * i))
	);

export const matrixCofactor = (matrix) =>
	matrixMap(matrix, ({ i, ix, j, jx }) =>
		matrix[0].length > 2
			? Math.pow(-1, ix + jx + 2) * matrixDet(matrixMinor(matrix, ix + 1, jx + 1))
			: ix != jx
				? -matrix[jx][ix]
				: matrix[+!ix][+!jx]
	);

export const matrixInverse = (matrix: [][]) =>
	matrixMap(matrixTrans(matrixCofactor(matrix)), ({ j }) => j / matrixDet(matrix));
