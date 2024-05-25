import wlMap from './wlmap';

const nmIncrement = 5;

/**
 * Black body radiant.
 */
export function SPDofPlanck(CCT: number) {
	return wlMap((wl) => {
		const wlp = wl * 10 ** -9;
		return 1.191027e-16 / (wlp ** 5 * (Math.exp(0.0143876 / (wlp * CCT)) - 1)); // Planck
	}, nmIncrement);
}

export const SPDofA = wlMap((wl) => {
	return (100 * (560 / wl) ** 5 * (Math.exp(1.435e7 / (2848 * 560)) - 1)) / (Math.exp(1.435e7 / (2848 * wl)) - 1);
}, nmIncrement);

// 380 - 780
// S0(L), S1(L), S2(L)
// step: 5 nm
const CIE_DIlluminant = [
	63.4, 38.5, 3.0, 64.6, 36.75, 2.1, 65.8, 35.0, 1.2, 80.3, 39.2, 0.05, 94.8, 43.4, -1.1, 99.8, 44.85, -0.8, 104.8,
	46.3, -0.5, 105.35, 45.1, -0.6, 105.9, 43.9, -0.7, 101.35, 40.5, -0.95, 96.8, 37.1, -1.2, 105.35, 36.9, -1.9, 113.9,
	36.7, -2.6, 119.75, 36.3, -2.75, 125.6, 35.9, -2.9, 125.55, 34.25, -2.85, 125.5, 32.6, -2.8, 123.4, 30.25, -2.7,
	121.3, 27.9, -2.6, 121.3, 26.1, -2.6, 121.3, 24.3, -2.6, 117.4, 22.2, -2.2, 113.5, 20.1, -1.8, 113.3, 18.15, -1.65,
	113.1, 16.2, -1.5, 111.95, 14.7, -1.4, 110.8, 13.2, -1.3, 108.65, 10.9, -1.25, 106.5, 8.6, -1.2, 107.65, 7.35, -1.1,
	108.8, 6.1, -1.0, 107.05, 5.15, -0.75, 105.3, 4.2, -0.5, 104.85, 3.05, -0.4, 104.4, 1.9, -0.3, 102.2, 0.95, -0.15,
	100.0, 0.0, 0.0, 98.0, -0.8, 0.1, 96.0, -1.6, 0.2, 95.55, -2.55, 0.35, 95.1, -3.5, 0.5, 92.1, -3.5, 1.3, 89.1, -3.5,
	2.1, 89.8, -4.65, 2.65, 90.5, -5.8, 3.2, 90.4, -6.5, 3.65, 90.3, -7.2, 4.1, 89.35, -7.9, 4.4, 88.4, -8.6, 4.7, 86.2,
	-9.05, 4.9, 84.0, -9.5, 5.1, 84.55, -10.2, 5.9, 85.1, -10.9, 6.7, 83.5, -10.8, 7.0, 81.9, -10.7, 7.3, 82.25, -11.35,
	7.95, 82.6, -12.0, 8.6, 83.75, -13.0, 9.2, 84.9, -14.0, 9.8, 83.1, -13.8, 10.0, 81.3, -13.6, 10.2, 76.6, -12.8,
	9.25, 71.9, -12.0, 8.3, 73.1, -12.65, 8.95, 74.3, -13.3, 9.6, 75.35, -13.1, 9.05, 76.4, -12.9, 8.5, 69.85, -11.75,
	7.75, 63.3, -10.6, 7.0, 67.5, -11.1, 7.3, 71.7, -11.6, 7.6, 74.35, -11.9, 7.8, 77.0, -12.2, 8.0, 71.1, -11.2, 7.35,
	65.2, -10.2, 6.7, 56.45, -9.0, 5.95, 47.7, -7.8, 5.2, 58.15, -9.5, 6.3, 68.6, -11.2, 7.4, 66.8, -10.8, 7.1, 65.0,
	-10.4, 6.8,
];

export function SPDofD(CCT: number) {
	const xlo = -4.607e9 / CCT ** 3 + 2.9678e6 / CCT ** 2 + 0.09911e3 / CCT + 0.244063; // 4000 - 7000 K
	const xhi = 2.0064e9 / CCT ** 3 + 1.9018e6 / CCT ** 2 + 0.24748e3 / CCT + 0.23704; // 7001 - 25000 K
	const xd = CCT < 7000 ? xlo : xhi;
	const yd = -3 * xd ** 2 + 2.87 * xd - 0.275;

	return wlMap((_, i) => {
		const M1 = (-1.3515 - 1.7703 * xd + 5.9114 * yd) / (0.0241 + 0.2562 * xd - 0.7341 * yd);
		const M2 = (0.03 - 31.4424 * xd + 30.0717 * yd) / (0.0241 + 0.2562 * xd - 0.7341 * yd);
		return CIE_DIlluminant[i * 3] + M1 * CIE_DIlluminant[i * 3 + 1] + M2 * CIE_DIlluminant[i * 3 + 2]; // D illuminant
	}, nmIncrement);
}

export const SPDofE = wlMap((wl) => 100, nmIncrement);

/**
 * Fluorescent Std FL1.
 * 6430 K
 */
export const SPDofFL1 = [
	1.87, 2.36, 2.94, 3.47, 5.17, 19.49, 6.13, 6.24, 7.01, 7.79, 8.56, 43.67, 16.94, 10.72, 11.35, 11.89, 12.37, 12.75,
	13.0, 13.15, 13.23, 13.17, 13.13, 12.85, 12.52, 12.2, 11.83, 11.5, 11.22, 11.05, 11.03, 11.18, 11.53, 27.74, 17.05,
	13.55, 14.33, 15.01, 15.52, 18.29, 19.55, 15.48, 14.91, 14.15, 13.22, 12.19, 11.12, 10.03, 8.95, 7.96, 7.02, 6.2,
	5.42, 4.73, 4.15, 3.64, 3.2, 2.81, 2.47, 2.18, 1.93, 1.72, 1.67, 1.43, 1.29, 1.19, 1.08, 0.96, 0.88, 0.81, 0.77,
	0.75, 0.73, 0.68, 0.69, 0.64, 0.68, 0.69, 0.61, 0.52, 0.43,
];

/**
 * Fluorescent Std FL2.
 * 4230 K
 */
export const SPDofFL2 = [
	1.18, 1.48, 1.84, 2.15, 3.44, 15.69, 3.85, 3.74, 4.19, 4.62, 5.06, 34.98, 11.81, 6.27, 6.63, 6.93, 7.19, 7.4, 7.54,
	7.62, 7.65, 7.62, 7.62, 7.45, 7.28, 7.15, 7.05, 7.04, 7.16, 7.47, 8.04, 8.88, 10.01, 24.88, 16.64, 14.59, 16.16,
	17.56, 18.62, 21.47, 22.79, 19.29, 18.66, 17.73, 16.54, 15.21, 13.8, 12.36, 10.95, 9.65, 8.4, 7.32, 6.31, 5.43,
	4.68, 4.02, 3.45, 2.96, 2.55, 2.19, 1.89, 1.64, 1.53, 1.27, 1.1, 0.99, 0.88, 0.76, 0.68, 0.61, 0.56, 0.54, 0.51,
	0.47, 0.47, 0.43, 0.46, 0.47, 0.4, 0.33, 0.27,
];

/**
 * Fluorescent Std FL3.
 * 3450 K
 */
export const SPDofFL3 = [
	0.82, 1.02, 1.26, 1.44, 2.57, 14.36, 2.7, 2.45, 2.73, 3.0, 3.28, 31.85, 9.47, 4.02, 4.25, 4.44, 4.59, 4.72, 4.8,
	4.86, 4.87, 4.85, 4.88, 4.77, 4.67, 4.62, 4.62, 4.73, 4.99, 5.48, 6.25, 7.34, 8.78, 23.82, 16.14, 14.59, 16.63,
	18.49, 19.95, 23.11, 24.69, 21.41, 20.85, 19.93, 18.67, 17.22, 15.65, 14.04, 12.45, 10.95, 9.51, 8.27, 7.11, 6.09,
	5.22, 4.45, 3.8, 3.23, 2.75, 2.33, 1.99, 1.7, 1.55, 1.27, 1.09, 0.96, 0.83, 0.71, 0.62, 0.54, 0.49, 0.46, 0.43,
	0.39, 0.39, 0.35, 0.38, 0.39, 0.33, 0.28, 0.21,
];

/**
 * Fluorescent Std FL4.
 * 2940 K
 */
export const SPDofFL4 = [
	0.57, 0.7, 0.87, 0.98, 2.01, 13.75, 1.95, 1.59, 1.76, 1.93, 2.1, 30.28, 8.03, 2.55, 2.7, 2.82, 2.91, 2.99, 3.04,
	3.08, 3.09, 3.09, 3.14, 3.06, 3.0, 2.98, 3.01, 3.14, 3.41, 3.9, 4.69, 5.81, 7.32, 22.59, 15.11, 13.88, 16.33, 18.68,
	20.64, 24.28, 26.26, 23.28, 22.94, 22.14, 20.91, 19.43, 17.74, 16.0, 14.42, 12.56, 10.93, 9.52, 8.18, 7.01, 6.0,
	5.11, 4.36, 3.69, 3.13, 2.64, 2.24, 1.91, 1.7, 1.39, 1.18, 1.03, 0.88, 0.74, 0.64, 0.54, 0.49, 0.46, 0.42, 0.37,
	0.37, 0.33, 0.35, 0.36, 0.31, 0.26, 0.19,
];

/**
 * Fluorescent Std FL5.
 * 6350 K
 */
export const SPDofFL5 = [
	1.87, 2.35, 2.92, 3.45, 5.1, 18.91, 6.0, 6.11, 6.85, 7.58, 8.31, 40.76, 16.06, 10.32, 10.91, 11.4, 11.83, 12.17,
	12.4, 12.54, 12.58, 12.52, 12.47, 12.2, 11.89, 11.61, 11.33, 11.1, 10.96, 10.97, 11.16, 11.54, 12.12, 27.78, 17.73,
	14.47, 15.2, 15.77, 16.1, 18.54, 19.5, 15.39, 14.64, 13.72, 12.69, 11.57, 10.45, 9.35, 8.29, 7.32, 6.41, 5.63, 4.9,
	4.26, 3.72, 3.25, 2.83, 2.49, 2.19, 1.93, 1.71, 1.52, 1.48, 1.26, 1.13, 1.05, 0.96, 0.85, 0.78, 0.72, 0.68, 0.67,
	0.65, 0.61, 0.62, 0.59, 0.62, 0.64, 0.55, 0.47, 0.4,
];

/**
 * Fluorescent Std FL6.
 * 4150 K
 */
export const SPDofFL6 = [
	1.05, 1.31, 1.63, 1.9, 3.11, 14.8, 3.43, 3.3, 3.68, 4.07, 4.45, 32.61, 10.74, 5.48, 5.78, 6.03, 6.25, 6.41, 6.52,
	6.58, 6.59, 6.56, 6.56, 6.42, 6.28, 6.2, 6.19, 6.3, 6.6, 7.12, 7.94, 9.07, 10.49, 25.22, 17.46, 15.63, 17.22, 18.53,
	19.43, 21.97, 23.01, 19.41, 18.56, 17.42, 16.09, 14.64, 13.15, 11.68, 10.25, 8.95, 7.74, 6.69, 5.71, 4.87, 4.16,
	3.55, 3.02, 2.57, 2.2, 1.87, 1.6, 1.37, 1.29, 1.05, 0.91, 0.81, 0.71, 0.61, 0.54, 0.48, 0.44, 0.43, 0.4, 0.37, 0.38,
	0.35, 0.39, 0.41, 0.33, 0.26, 0.21,
];

/**
 * Fluorescent Broad-band FL7.
 * 6500 K
 */
export const SPDofFL7 = [
	2.56, 3.18, 3.84, 4.53, 6.15, 19.37, 7.37, 7.05, 7.71, 8.41, 9.15, 44.14, 17.52, 11.35, 12.0, 12.58, 13.08, 13.45,
	13.71, 13.88, 13.95, 13.93, 13.82, 13.64, 13.43, 13.25, 13.08, 12.93, 12.78, 12.6, 12.44, 12.33, 12.26, 29.52,
	17.05, 12.44, 12.58, 12.72, 12.83, 15.46, 16.75, 12.83, 12.67, 12.45, 12.19, 11.89, 11.6, 11.35, 11.12, 10.95,
	10.76, 10.42, 10.11, 10.04, 10.02, 10.11, 9.87, 8.65, 7.27, 6.44, 5.83, 5.41, 5.04, 4.57, 4.12, 3.77, 3.46, 3.08,
	2.73, 2.47, 2.25, 2.06, 1.9, 1.75, 1.62, 1.54, 1.45, 1.32, 1.17, 0.99, 0.81,
];

/**
 * Fluorescent Broad-band FL8.
 * 5000 K
 */
export const SPDofFL8 = [
	1.21, 1.5, 1.81, 2.13, 3.17, 13.08, 3.83, 3.45, 3.86, 4.42, 5.09, 34.1, 12.42, 7.68, 8.6, 9.46, 10.24, 10.84, 11.33,
	11.71, 11.98, 12.17, 12.28, 12.32, 12.35, 12.44, 12.55, 12.68, 12.77, 12.72, 12.6, 12.43, 12.22, 28.96, 16.51,
	11.79, 11.76, 11.77, 11.84, 14.61, 16.11, 12.34, 12.53, 12.72, 12.92, 13.12, 13.34, 13.61, 13.87, 14.07, 14.2,
	14.16, 14.13, 14.34, 14.5, 14.46, 14.0, 12.58, 10.99, 9.98, 9.22, 8.62, 8.07, 7.39, 6.71, 6.16, 5.63, 5.03, 4.46,
	4.02, 3.66, 3.36, 3.09, 2.85, 2.65, 2.51, 2.37, 2.15, 1.89, 1.61, 1.32,
];

/**
 * Fluorescent Broad-band FL9.
 * 4150 K
 */
export const SPDofFL9 = [
	0.9, 1.12, 1.36, 1.6, 2.59, 12.8, 3.05, 2.56, 2.86, 3.3, 3.82, 32.62, 10.77, 5.84, 6.57, 7.25, 7.86, 8.35, 8.75,
	9.06, 9.31, 9.48, 9.61, 9.68, 9.74, 9.88, 10.04, 10.26, 10.48, 10.63, 10.78, 10.96, 11.18, 27.71, 16.29, 12.28,
	12.74, 13.21, 13.65, 16.57, 18.14, 14.55, 14.65, 14.66, 14.61, 14.5, 14.39, 14.4, 14.47, 14.62, 14.72, 14.55, 14.4,
	14.58, 14.88, 15.51, 15.47, 13.2, 10.57, 9.18, 8.25, 7.57, 7.03, 6.35, 5.72, 5.25, 4.8, 4.29, 3.8, 3.43, 3.12, 2.86,
	2.64, 2.43, 2.26, 2.14, 2.02, 1.83, 1.61, 1.38, 1.12,
];

/**
 * Fluorescent 3 Band FL10.
 * 5000 K
 */
export const SPDofFL10 = [
	1.11, 0.8, 0.62, 0.57, 1.48, 12.16, 2.12, 2.7, 3.74, 5.14, 6.75, 34.39, 14.86, 10.4, 10.76, 10.67, 10.11, 9.27,
	8.29, 7.29, 7.91, 16.64, 16.73, 10.44, 5.94, 3.34, 2.35, 1.88, 1.59, 1.47, 1.8, 5.71, 40.98, 73.69, 33.61, 8.24,
	3.38, 2.47, 2.14, 4.86, 11.45, 14.79, 12.16, 8.97, 6.52, 8.31, 44.12, 34.55, 12.09, 12.15, 10.52, 4.43, 1.95, 2.19,
	3.19, 2.77, 2.29, 2.0, 1.52, 1.35, 1.47, 1.79, 1.74, 1.02, 1.14, 3.32, 4.49, 2.05, 0.49, 0.24, 0.21, 0.21, 0.24,
	0.24, 0.21, 0.17, 0.21, 0.22, 0.17, 0.12, 0.09,
];

/**
 * Fluorescent 3 Band FL11.
 * 4000 K
 */
export const SPDofFL11 = [
	0.91, 0.63, 0.46, 0.37, 1.29, 12.68, 1.59, 1.79, 2.46, 3.33, 4.49, 33.94, 12.13, 6.95, 7.19, 7.12, 6.72, 6.13, 5.46,
	4.79, 5.66, 14.29, 14.96, 8.97, 4.72, 2.33, 1.47, 1.1, 0.89, 0.83, 1.18, 4.9, 39.59, 72.84, 32.61, 7.52, 2.83, 1.96,
	1.67, 4.43, 11.28, 14.76, 12.73, 9.74, 7.33, 9.72, 55.27, 42.58, 13.18, 13.16, 12.26, 5.11, 2.07, 2.34, 3.58, 3.01,
	2.48, 2.14, 1.54, 1.33, 1.46, 1.94, 2.0, 1.2, 1.35, 4.1, 5.58, 2.51, 0.57, 0.27, 0.23, 0.21, 0.24, 0.24, 0.2, 0.24,
	0.32, 0.26, 0.16, 0.12, 0.09,
];

/**
 * Fluorescent 3 Band FL12.
 * 3000 K
 */
export const SPDofFL12 = [
	0.96, 0.64, 0.45, 0.33, 1.19, 12.48, 1.12, 0.94, 1.08, 1.37, 1.78, 29.05, 7.9, 2.65, 2.71, 2.65, 2.49, 2.33, 2.1,
	1.91, 3.01, 10.83, 11.88, 6.88, 3.43, 1.49, 0.92, 0.71, 0.6, 0.63, 1.1, 4.56, 34.4, 65.4, 29.48, 7.16, 3.08, 2.47,
	2.27, 5.09, 11.96, 15.32, 14.27, 11.86, 9.28, 12.31, 68.53, 53.02, 14.67, 14.38, 14.71, 6.46, 2.57, 2.75, 4.18,
	3.44, 2.81, 2.42, 1.64, 1.36, 1.49, 2.14, 2.34, 1.42, 1.61, 5.04, 6.98, 3.19, 0.71, 0.3, 0.26, 0.23, 0.28, 0.28,
	0.21, 0.17, 0.21, 0.19, 0.15, 0.1, 0.05,
];

/**
 * Fluorescent 3.1: Standard halophosphate lamp.
 */
export const SPDofFL3_1 = [
	2.39, 2.93, 3.82, 4.23, 4.97, 86.3, 11.65, 7.09, 7.84, 8.59, 9.44, 196.54, 10.94, 11.38, 11.89, 12.37, 12.81, 13.15,
	13.39, 13.56, 13.59, 13.56, 14.07, 13.39, 13.29, 13.25, 13.53, 14.24, 15.74, 18.26, 22.28, 27.97, 35.7, 148.98,
	56.55, 68.68, 79.99, 91.47, 101.32, 123.16, 129.53, 115.05, 113.48, 110.08, 104.28, 97.98, 89.6, 80.74, 71.92, 63.5,
	55.46, 47.97, 41.39, 35.5, 30.32, 25.79, 21.84, 18.53, 15.67, 13.22, 11.14, 9.4, 8.65, 6.75, 5.69, 4.87, 4.29, 3.54,
	3.03, 2.62, 2.28, 1.94, 1.7, 1.5, 1.36, 1.16, 4.91, 0.95, 1.5, 0.89, 0.68,
];

/**
 * Fluorescent 3.2: Standard halophosphate lamp.
 */
export const SPDofFL3_2 = [
	5.8, 6.99, 8.7, 9.89, 11.59, 94.53, 20.8, 16.52, 18.3, 20.33, 22.0, 231.9, 25.81, 27.63, 29.1, 30.61, 31.92, 33.11,
	33.83, 34.7, 35.02, 35.22, 35.81, 35.14, 35.14, 34.9, 34.7, 35.02, 36.13, 37.92, 40.62, 44.7, 49.63, 154.16, 62.21,
	68.92, 75.83, 81.95, 86.95, 103.54, 109.94, 91.95, 89.85, 87.15, 83.26, 78.93, 73.93, 68.84, 63.44, 58.84, 53.84,
	49.43, 45.54, 41.53, 38.31, 34.62, 31.8, 29.02, 26.72, 24.22, 22.19, 20.41, 19.1, 16.79, 15.13, 13.82, 12.63, 11.39,
	10.32, 9.21, 8.89, 7.5, 6.71, 6.11, 5.4, 4.8, 8.7, 4.01, 4.09, 3.3, 2.82,
];

/**
 * Fluorescent 3.3: Standard halophosphate lamp.
 */
export const SPDofFL3_3 = [
	8.94, 11.21, 14.08, 16.48, 19.63, 116.33, 32.07, 29.72, 33.39, 36.94, 40.33, 262.66, 46.87, 49.79, 52.46, 54.81,
	56.81, 58.44, 59.52, 60.12, 60.24, 59.88, 59.88, 58.6, 57.85, 56.29, 54.81, 53.42, 52.7, 52.5, 53.3, 54.89, 57.61,
	182.75, 65.27, 69.41, 73.28, 76.56, 78.67, 95.74, 97.22, 76.79, 73.36, 69.33, 64.23, 58.92, 53.38, 47.91, 42.61,
	37.74, 33.11, 29.04, 25.29, 22.1, 19.31, 16.84, 14.68, 12.89, 11.37, 9.97, 8.82, 7.86, 7.78, 6.3, 5.67, 5.15, 4.91,
	4.31, 3.99, 3.67, 3.43, 3.19, 2.95, 2.75, 2.63, 2.43, 7.14, 2.19, 2.71, 2.0, 1.8,
];

/**
 * Fluorescent 3.4: Standard DeLuxe type lamp.
 */
export const SPDofFL3_4 = [
	3.46, 3.86, 4.41, 4.51, 4.86, 71.22, 8.72, 5.36, 5.61, 5.91, 6.42, 192.77, 7.77, 8.37, 9.22, 10.18, 11.18, 12.28,
	13.38, 14.54, 15.74, 17.09, 19.6, 21.05, 23.96, 27.77, 32.68, 38.29, 43.76, 47.72, 50.27, 51.78, 52.68, 167.36,
	55.29, 56.94, 59.3, 62.15, 65.26, 84.26, 89.22, 75.79, 79.19, 82.8, 85.76, 88.62, 91.12, 93.43, 96.89, 101.45,
	103.65, 100.3, 97.89, 96.59, 106.21, 109.97, 117.49, 96.04, 80.15, 70.42, 65.01, 60.15, 56.04, 50.92, 46.26, 42.6,
	38.85, 35.09, 31.73, 28.77, 25.76, 32.16, 21.3, 18.55, 17.74, 14.74, 12.93, 13.63, 10.43, 9.97, 8.07,
];

/**
 * Fluorescent 3.5: Standard DeLuxe type lamp.
 */
export const SPDofFL3_5 = [
	4.72, 5.82, 7.18, 8.39, 9.96, 58.86, 15.78, 15.1, 17.3, 19.66, 22.43, 176.0, 28.67, 31.92, 35.38, 38.73, 41.98,
	44.92, 47.49, 49.58, 51.21, 52.36, 53.99, 53.78, 54.04, 53.88, 53.62, 53.25, 53.09, 52.88, 52.99, 53.15, 53.67,
	167.93, 55.61, 56.82, 58.39, 60.22, 62.21, 81.45, 84.96, 68.71, 70.7, 73.01, 74.69, 76.26, 77.68, 78.67, 80.14,
	81.71, 82.08, 79.98, 78.15, 76.52, 79.2, 79.51, 81.08, 70.76, 62.58, 56.87, 52.83, 49.11, 46.28, 42.24, 38.58,
	35.59, 32.76, 29.61, 26.89, 24.53, 22.17, 20.02, 18.45, 16.09, 15.62, 13.1, 11.69, 12.42, 9.43, 8.96, 7.39,
];

/**
 * Fluorescent 3.6: Standard DeLuxe type lamp.
 */
export const SPDofFL3_6 = [
	5.53, 6.63, 8.07, 9.45, 11.28, 61.47, 17.8, 17.47, 20.12, 23.05, 26.37, 186.01, 33.94, 37.98, 42.12, 46.38, 50.3,
	53.95, 56.94, 59.48, 61.36, 62.68, 64.34, 63.9, 63.85, 63.24, 62.46, 61.41, 60.47, 59.48, 58.65, 57.93, 57.49,
	175.17, 57.27, 57.49, 57.99, 58.76, 59.64, 78.77, 81.26, 63.18, 64.29, 65.78, 66.77, 67.77, 68.6, 69.1, 70.15,
	71.69, 71.97, 69.81, 68.05, 66.66, 69.7, 70.37, 72.47, 62.3, 54.45, 49.2, 45.6, 42.4, 40.02, 36.48, 33.28, 30.84,
	28.3, 25.65, 23.33, 21.23, 19.29, 17.41, 16.31, 14.21, 14.04, 11.55, 10.39, 11.28, 8.51, 8.24, 7.02,
];

/**
 * Fluorescent 3.7: 3 Band.
 */
export const SPDofFL3_7 = [
	3.79, 2.56, 1.91, 1.42, 1.51, 73.64, 7.37, 4.69, 5.33, 6.75, 8.51, 181.81, 11.71, 11.96, 12.18, 11.9, 11.16, 11.22,
	9.83, 8.94, 12.08, 52.56, 55.42, 31.69, 16.03, 6.72, 4.59, 3.67, 3.02, 3.21, 4.9, 19.05, 177.64, 347.34, 116.8,
	31.87, 16.37, 14.92, 14.12, 29.5, 61.4, 85.05, 64.86, 65.01, 53.17, 34.22, 427.27, 201.1, 58.63, 72.01, 88.19,
	20.07, 13.1, 12.92, 24.54, 15.94, 13.56, 13.38, 8.42, 6.57, 7.18, 9.9, 11.47, 8.88, 3.05, 22.04, 42.79, 14.4, 1.88,
	1.6, 1.42, 1.05, 1.23, 1.76, 0.74, 0.52, 4.1, 0.46, 0.99, 0.43, 0.0,
];

/**
 * Fluorescent 3.8: 3 Band.
 */
export const SPDofFL3_8 = [
	4.18, 2.93, 2.29, 1.98, 2.44, 70.7, 10.19, 9.79, 13.21, 17.79, 22.98, 191.43, 31.76, 33.35, 33.87, 32.89, 30.6,
	28.28, 24.81, 21.6, 23.4, 68.99, 70.85, 42.29, 22.67, 11.08, 7.66, 6.07, 5.07, 4.88, 6.26, 20.29, 204.67, 390.25,
	135.69, 34.57, 15.71, 12.6, 11.05, 25.05, 54.98, 82.84, 58.22, 53.06, 41.44, 25.26, 329.89, 161.29, 54.19, 66.3,
	71.43, 15.74, 10.22, 10.68, 20.32, 14.13, 11.72, 11.75, 7.87, 6.38, 7.23, 8.94, 9.79, 7.26, 2.59, 17.03, 33.69,
	12.02, 1.68, 1.5, 1.31, 1.01, 1.16, 1.59, 0.79, 0.67, 4.82, 0.61, 1.25, 0.79, 0.58,
];

/**
 * Fluorescent 3.9: 3 Band.
 */
export const SPDofFL3_9 = [
	3.77, 2.64, 2.06, 1.87, 2.55, 71.68, 12.05, 13.57, 19.6, 27.33, 35.39, 211.82, 49.02, 51.83, 52.5, 50.73, 46.93,
	42.42, 37.16, 31.84, 31.94, 77.74, 79.45, 47.93, 26.24, 13.15, 8.8, 6.7, 5.38, 4.93, 6.06, 19.76, 215.94, 412.13,
	34.74, 14.76, 10.99, 9.25, 23.5, 53.05, 81.9, 54.92, 47.8, 36.65, 21.82, 285.69, 139.94, 53.37, 64.3, 64.04, 13.79,
	9.06, 9.83, 18.6, 13.38, 10.99, 10.77, 7.57, 6.19, 7.09, 8.54, 8.77, 6.41, 2.26, 15.02, 29.39, 10.22, 1.42, 1.23,
	1.1, 0.84, 0.97, 1.35, 0.65, 0.13, 4.22, 0.1, 0.68, 0.16, 0.0,
];

/**
 * Fluorescent 3.10: 3 Band.
 */
export const SPDofFL3_10 = [
	0.25, 0.0, 0.0, 0.0, 0.69, 21.24, 2.18, 1.86, 3.1, 5.0, 7.03, 45.08, 16.78, 12.28, 13.31, 13.66, 13.69, 13.13,
	12.28, 11.42, 11.66, 22.04, 26.17, 18.57, 11.36, 6.83, 5.58, 4.88, 4.31, 3.76, 3.61, 5.62, 38.59, 100, 36.54, 10.57,
	2.98, 2.05, 1.84, 6.09, 17.27, 21.77, 18.72, 10.15, 7.26, 5.17, 56.66, 49.39, 18.57, 14.21, 14.01, 5.99, 2.68, 3.14,
	6.25, 5.78, 6.75, 5.16, 3.03, 1.57, 1.72, 1.54, 1.71, 1.1, 0.28, 3.65, 7.54, 2.34, 0.05, 0.04, 0.04, 0.03, 0.03,
	0.02, 0.02, 0.01, 0.01, 0.0, 0.0, 0.0, 0.0,
];

/**
 * Fluorescent 3.11: 3 Band.
 */
export const SPDofFL3_11 = [
	3.85, 2.91, 2.56, 2.59, 3.63, 74.54, 14.69, 17.22, 24.99, 34.4, 44.57, 228.08, 61.53, 65.31, 66.35, 64.37, 59.81,
	54.24, 47.42, 41.1, 40.04, 85.54, 86.55, 53.47, 30.91, 17.41, 12.56, 10.1, 8.48, 7.74, 8.58, 21.39, 220.12, 417.35,
	146.13, 36.67, 16.51, 12.56, 10.81, 25.31, 53.31, 80.75, 53.56, 44.02, 33.05, 20.26, 233.61, 118.2, 51.66, 61.27,
	55.15, 12.95, 8.93, 9.77, 17.12, 13.01, 10.45, 10.33, 7.7, 6.34, 7.35, 8.22, 7.93, 5.7, 2.23, 12.43, 24.24, 8.74,
	1.39, 1.23, 1.1, 0.84, 0.94, 1.23, 0.68, 0.52, 4.6, 0.45, 1.04, 0.45, 0.0,
];

/**
 * Fluorescent 3.12: Multi Band.
 */
export const SPDofFL3_12 = [
	1.62, 2.06, 2.71, 3.11, 3.67, 74.6, 8.88, 4.77, 4.72, 4.72, 4.94, 150.29, 6.08, 7.13, 9.1, 11.76, 14.96, 18.54,
	22.48, 26.76, 31.66, 40.93, 45.83, 46.0, 45.26, 43.16, 41.63, 39.75, 37.83, 36.16, 35.25, 37.04, 59.86, 183.53,
	59.03, 47.93, 48.67, 52.69, 57.24, 77.75, 87.81, 80.55, 84.83, 86.84, 91.44, 96.51, 105.25, 106.74, 108.53, 106.92,
	101.54, 95.2, 89.34, 82.95, 75.78, 68.65, 61.7, 55.23, 48.58, 42.9, 37.74, 32.93, 29.65, 25.19, 21.69, 19.28, 17.36,
	14.74, 12.86, 11.28, 9.97, 8.88, 7.78, 7.04, 6.3, 5.55, 10.15, 4.5, 4.81, 3.72, 3.28,
];

/**
 * Fluorescent 3.13: Multi Band.
 */
export const SPDofFL3_13 = [
	2.23, 2.92, 3.91, 4.55, 5.46, 77.4, 11.25, 7.69, 8.29, 8.98, 10.01, 204.45, 3.75, 16.88, 21.73, 27.96, 34.92, 41.96,
	48.62, 54.33, 59.49, 67.91, 70.01, 66.4, 62.07, 56.95, 52.7, 48.54, 44.8, 41.75, 39.77, 40.5, 59.27, 184.09, 59.06,
	49.95, 50.9, 54.51, 58.33, 77.49, 85.78, 76.2, 78.73, 78.95, 81.48, 84.57, 87.75, 89.56, 91.36, 89.0, 83.67, 78.26,
	73.19, 67.61, 61.42, 55.49, 49.78, 44.46, 39.13, 34.45, 30.28, 26.37, 23.88, 20.1, 17.4, 15.29, 13.62, 11.68, 10.31,
	9.11, 8.03, 7.13, 6.31, 5.67, 5.11, 4.55, 9.06, 3.74, 4.04, 3.14, 2.75,
];

/**
 * Fluorescent 3.14: Multi Band.
 */
export const SPDofFL3_14 = [
	2.87, 3.69, 4.87, 5.82, 7.17, 72.21, 13.69, 11.12, 12.43, 13.9, 15.82, 200.99, 21.72, 26.33, 32.85, 40.8, 49.23,
	57.39, 65.26, 71.99, 78.25, 88.85, 91.67, 86.81, 80.42, 73.82, 69.12, 63.69, 58.44, 53.57, 49.66, 48.44, 72.56,
	200.42, 65.0, 47.49, 44.14, 44.71, 46.01, 63.52, 71.73, 63.52, 64.13, 63.74, 66.82, 70.65, 79.29, 80.77, 83.59,
	82.59, 77.6, 72.47, 68.34, 63.82, 58.57, 53.18, 47.97, 43.14, 38.19, 33.85, 29.94, 26.24, 23.9, 20.33, 17.42, 15.64,
	14.34, 12.21, 10.65, 9.43, 8.34, 7.52, 6.73, 6.08, 5.52, 5.0, 9.47, 4.08, 4.43, 3.39, 3.17,
];

/**
 * Fluorescent 3.15: Multi Band.
 */
export const SPDofFL3_15 = [
	300.0, 286.0, 268.0, 244.0, 304.0, 581.0, 225.0, 155.0, 152.0, 170.0, 295.0, 1417.0, 607.0, 343.0, 386.0, 430.0,
	469.0, 502.0, 531.0, 552.0, 567.0, 572.0, 575.0, 561.0, 548.0, 527.0, 507.0, 482.0, 461.0, 438.0, 418.0, 404.0,
	429.0, 1016.0, 581.0, 370.0, 368.0, 371.0, 377.0, 490.0, 525.0, 402.0, 404.0, 412.0, 418.0, 425.0, 428.0, 432.0,
	433.0, 431.0, 427.0, 420.0, 410.0, 399.0, 385.0, 370.0, 352.0, 336.0, 317.0, 298.0, 277.0, 260.0, 242.0, 223.0,
	202.0, 187.0, 167.0, 152.0, 136.0, 125.0, 113.0, 103.0, 93.0, 84.0, 75.0, 66.0, 58.0, 51.0, 46.0, 41.0, 37.0,
];

/**
 * Xenon.
 * 6044 K
 */
export const SPDofXenon = [
	93.03, 94.59, 96.33, 100.56, 102.81, 100.1, 100.84, 101.45, 102.57, 101.94, 101.29, 101.54, 103.74, 103.67, 110.3,
	112.78, 116.52, 129.56, 141.07, 126.45, 115.94, 118.42, 111.75, 113.67, 105.17, 103.88, 102.9, 102.71, 102.29,
	101.9, 101.54, 101.47, 101.12, 101.43, 100.98, 100.75, 100.44, 100.28, 100.19, 100.0, 99.86, 100.47, 100.33, 99.04,
	97.17, 96.65, 96.84, 98.5, 100.21, 99.91, 97.8, 96.84, 98.92, 99.18, 101.99, 98.78, 97.14, 98.43, 100.3, 101.29,
	101.97, 109.55, 110.88, 102.08, 94.49, 93.05, 98.1, 106.2, 98.24, 95.69, 101.73, 108.39, 102.62, 100.28, 97.33,
	97.45, 101.71, 137.21, 105.22, 84.41, 80.55,
];

/**
 * HMI 1.
 * 6002 K
 */
export const SPDofHMI1 = [
	116.39, 114.92, 445.62, 107.07, 108.19, 123.74, 125.42, 123.88, 125.56, 116.39, 89.57, 122.69, 120.03, 71.29, 65.93,
	73.25, 80.53, 72.48, 66.65, 67.82, 66.6, 59.4, 60.43, 62.92, 64.03, 68.89, 57.96, 57.28, 54.24, 50.74, 52.25, 53.26,
	56.32, 114.85, 119.19, 59.24, 56.91, 62.96, 65.18, 100.0, 158.96, 81.58, 82.42, 72.41, 74.44, 62.19, 61.75, 61.0,
	60.76, 62.91, 55.78, 50.61, 52.97, 49.83, 46.82, 47.96, 56.13, 53.38, 67.89, 73.25, 47.32, 50.08, 44.96, 56.34,
	69.68, 36.16, 28.41, 27.15, 28.21, 34.95, 34.94, 27.68, 24.19, 22.61, 21.79, 30.47, 33.75, 36.16, 32.39, 26.55,
	24.38,
];

/**
 * HMI 2.
 * 5630 K
 */
export const SPDofHMI2 = [
	25.54, 37.72, 50.54, 70.58, 85.75, 127.05, 183.25, 290.31, 400.39, 462.06, 470.93, 678.6, 527.99, 424.0, 441.57,
	462.96, 488.59, 452.99, 444.71, 439.61, 453.62, 416.76, 434.63, 399.82, 399.07, 425.56, 377.81, 370.65, 332.78,
	326.62, 348.29, 315.82, 332.37, 903.57, 498.77, 346.72, 335.4, 412.55, 400.25, 723.26, 819.15, 406.53, 599.9,
	439.39, 448.26, 356.58, 458.39, 377.63, 356.1, 380.23, 299.38, 302.49, 317.13, 314.58, 283.14, 290.45, 305.33,
	326.97, 573.24, 353.87, 280.1, 352.53, 262.44, 277.25, 283.94, 191.55, 168.42, 157.05, 168.39, 181.89, 162.78,
	148.76, 166.76, 138.57, 141.64, 220.97, 185.33, 346.98, 401.23, 184.98, 171.06,
];

/**
 * LED-B1.
 * Phosphor-type LEDs in different CCT categories.
 * 2733 K
 */
export const SPDofLED_B1 = [
	0, 0.01, 0.01, 0.02, 0.04, 0.07, 0.15, 0.28, 0.53, 0.92, 1.54, 2.52, 4.16, 6.39, 7.89, 7.57, 6.25, 5.16, 4.37, 3.84,
	3.7, 3.88, 4.26, 4.79, 5.41, 6.05, 6.7, 7.34, 7.98, 8.64, 9.31, 10.02, 10.76, 11.53, 12.38, 13.28, 14.23, 15.2,
	16.2, 17.19, 18.14, 19.02, 19.78, 20.38, 20.8, 21, 20.97, 20.71, 20.23, 19.56, 18.76, 17.82, 16.78, 15.66, 14.49,
	13.31, 12.15, 11.02, 9.95, 8.93, 7.98, 7.1, 6.3, 5.57, 4.89, 4.26, 3.72, 3.25, 2.83, 2.47, 2.15, 1.87, 1.63, 1.42,
	1.25, 1.1, 0.97, 0.86, 0.76, 0.68, 0.61,
];

/**
 * LED-B2.
 * Phosphor-type LEDs in different CCT categories.
 * 2998 K
 */
export const SPDofLED_B2 = [
	0, 0, 0, 0.01, 0.02, 0.05, 0.11, 0.24, 0.5, 0.96, 1.71, 2.82, 4.71, 7.87, 10.56, 10.24, 7.94, 6.25, 5.23, 4.36, 4,
	4.17, 4.59, 5.21, 5.96, 6.72, 7.44, 8.11, 8.74, 9.39, 10.06, 10.75, 11.49, 12.25, 13.05, 13.86, 14.7, 15.5, 16.28,
	17, 17.69, 18.31, 18.83, 19.24, 19.51, 19.59, 19.48, 19.19, 18.72, 18.1, 17.34, 16.47, 15.51, 14.49, 13.42, 12.33,
	11.26, 10.24, 9.25, 8.3, 7.42, 6.6, 5.85, 5.17, 4.55, 3.99, 3.49, 3.04, 2.65, 2.31, 2.01, 1.75, 1.52, 1.32, 1.15, 1,
	0.87, 0.76, 0.67, 0.59, 0.52,
];

/**
 * LED-B3.
 * Phosphor-type LEDs in different CCT categories.
 * 4103 K
 */
export const SPDofLED_B3 = [
	0, 0, 0.01, 0.02, 0.05, 0.11, 0.25, 0.56, 1.2, 2.37, 4.24, 7.17, 12.11, 17.7, 18.87, 14.58, 9.9, 7.53, 6.02, 5.11,
	5.17, 5.82, 6.77, 7.88, 8.94, 9.82, 10.52, 11.06, 11.51, 11.93, 12.37, 12.83, 13.31, 13.79, 14.26, 14.68, 15.08,
	15.42, 15.72, 15.97, 16.18, 16.37, 16.5, 16.55, 16.5, 16.32, 16, 15.54, 14.96, 14.27, 13.48, 12.62, 11.71, 10.78,
	9.85, 8.93, 8.04, 7.2, 6.42, 5.69, 5.02, 4.42, 3.88, 3.39, 2.95, 2.56, 2.22, 1.92, 1.65, 1.43, 1.23, 1.06, 0.91,
	0.78, 0.68, 0.58, 0.5, 0.43, 0.37, 0.32, 0.28,
];

/**
 * LED-B4.
 * Phosphor-type LEDs in different CCT categories.
 * 5109 K
 */
export const SPDofLED_B4 = [
	0, 0, 0, 0.01, 0.03, 0.08, 0.21, 0.54, 1.31, 2.75, 5.04, 8.31, 13.37, 20.61, 25.91, 24.12, 17.47, 11.9, 8.62, 6.34,
	4.89, 4.25, 4.19, 4.7, 5.77, 7.27, 8.94, 10.6, 12.11, 13.36, 14.3, 15.02, 15.54, 15.9, 16.15, 16.33, 16.42, 16.44,
	16.36, 16.2, 15.98, 15.7, 15.36, 14.93, 14.44, 13.86, 13.24, 12.57, 11.84, 11.12, 10.38, 9.65, 8.91, 8.19, 7.51,
	6.86, 6.21, 5.6, 5.05, 4.54, 4.05, 3.62, 3.23, 2.87, 2.53, 2.24, 1.99, 1.76, 1.55, 1.37, 1.21, 1.07, 0.95, 0.85,
	0.75, 0.67, 0.61, 0.55, 0.5, 0.45, 0.42,
];

/**
 * LED-B5
 * Phosphor-type LEDs in different CCT categories.
 * 6598 K
 */
export const SPDofLED_B5 = [
	0, 0.01, 0.01, 0.03, 0.07, 0.16, 0.35, 0.78, 1.67, 3.3, 5.94, 9.92, 16.15, 25.15, 32.34, 31.18, 23.46, 16.39, 12.08,
	9.08, 7.21, 6.48, 6.49, 7.05, 8.1, 9.45, 10.88, 12.22, 13.38, 14.29, 14.98, 15.48, 15.81, 16.01, 16.1, 16.13, 16.1,
	15.98, 15.77, 15.5, 15.15, 14.76, 14.31, 13.79, 13.22, 12.59, 11.91, 11.2, 10.47, 9.73, 9, 8.27, 7.57, 6.9, 6.25,
	5.65, 5.08, 4.55, 4.06, 3.61, 3.22, 2.86, 2.54, 2.26, 2, 1.75, 1.54, 1.36, 1.2, 1.05, 0.93, 0.82, 0.72, 0.64, 0.56,
	0.49, 0.44, 0.39, 0.35, 0.31, 0.27,
];

/**
 * LED-BH1
 * Hybrid-type.
 * 2851 K
 */
export const SPDofLED_BH1 = [
	0, 0.01, 0.02, 0.04, 0.08, 0.17, 0.41, 0.93, 1.84, 3.05, 4.29, 5.69, 7.06, 7.91, 7.74, 6.62, 5.13, 3.85, 2.94, 2.34,
	1.99, 1.92, 2.19, 2.87, 4.03, 5.64, 7.49, 9.25, 10.82, 12.11, 13.08, 13.66, 14.01, 14.19, 14.28, 14.27, 14.19,
	14.03, 13.82, 13.59, 13.35, 13.2, 13.19, 13.46, 14.31, 16.15, 19.49, 25.07, 33.87, 40.75, 35.59, 21.59, 11.11, 7.27,
	5.58, 4.64, 3.98, 3.48, 3.07, 2.73, 2.42, 2.15, 1.91, 1.7, 1.5, 1.33, 1.18, 1.05, 0.93, 0.83, 0.74, 0.65, 0.57,
	0.51, 0.46, 0.41, 0.37, 0.34, 0.3, 0.28, 0.25,
];

/**
 * LED-RGB1.
 * spectral distribution.
 * 2840 K
 */
export const SPDofLED_RGB1 = [
	0, 0, 0, 0.01, 0.02, 0.05, 0.11, 0.24, 0.5, 0.94, 1.6, 2.43, 3.38, 4.59, 5.84, 5.56, 4, 3.14, 2.8, 2.68, 3.03, 3.98,
	5.53, 7.84, 10.96, 14.61, 18.01, 20.24, 20.57, 19.22, 16.93, 14.58, 12.61, 11.09, 9.93, 9.11, 8.6, 8.31, 8.21, 8.24,
	8.42, 8.74, 9.25, 10, 11.1, 12.74, 15.35, 19.43, 26.01, 36.47, 51.1, 62.69, 52.07, 28.62, 15.5, 9.58, 6.54, 4.95,
	4.01, 3.37, 2.89, 2.51, 2.18, 1.92, 1.67, 1.44, 1.25, 1.09, 0.93, 0.82, 0.71, 0.61, 0.53, 0.45, 0.4, 0.35, 0.3,
	0.27, 0.24, 0.21, 0.17,
];

/**
 * LED-V1.
 * violet-pumped phosphor-type LEDs.
 * 2724 K
 */
export const SPDofLED_V1 = [
	0.01, 0.03, 0.14, 0.61, 2.62, 8.43, 16.51, 17.9, 11.26, 5.94, 3.31, 2.25, 2.07, 2.29, 2.68, 3.15, 3.64, 4.18, 4.83,
	5.57, 6.4, 7.27, 8.08, 8.73, 9.21, 9.54, 9.75, 9.91, 10.06, 10.26, 10.51, 10.82, 11.17, 11.55, 11.92, 12.3, 12.68,
	13.07, 13.52, 14.06, 14.7, 15.46, 16.38, 17.39, 18.5, 19.51, 20.52, 21.52, 22.38, 23.07, 23.51, 23.71, 23.67, 23.35,
	22.81, 22.01, 21.03, 19.91, 18.69, 17.39, 16.05, 14.69, 13.36, 12.04, 10.8, 9.62, 8.54, 7.57, 6.68, 5.86, 5.12,
	4.46, 3.88, 3.37, 2.94, 2.54, 2.21, 1.9, 1.65, 1.44, 1.22,
];

/**
 * LED-V2.
 * violet-pumped phosphor-type LEDs.
 * 4070 K
 */
export const SPDofLED_V2 = [
	0.01, 0.06, 0.26, 1.15, 4.47, 11.98, 19.89, 20.24, 14.39, 8.95, 5.78, 4.65, 4.86, 5.78, 6.97, 8.1, 9.05, 9.82,
	10.52, 11.21, 11.87, 12.5, 12.98, 13.23, 13.3, 13.21, 13.05, 12.88, 12.74, 12.68, 12.7, 12.77, 12.91, 13.04, 13.16,
	13.26, 13.35, 13.42, 13.52, 13.64, 13.83, 14.07, 14.42, 14.82, 15.26, 15.64, 16.03, 16.4, 16.67, 16.88, 16.93,
	16.85, 16.62, 16.23, 15.72, 15.07, 14.31, 13.45, 12.57, 11.64, 10.69, 9.78, 8.87, 8, 7.17, 6.37, 5.65, 5.01, 4.42,
	3.88, 3.39, 2.95, 2.58, 2.24, 1.95, 1.7, 1.47, 1.3, 1.1, 0.96, 0.84,
];

/**
 * High Pressure discharge lamp: Standard high pressure sodium lamp.
 */
export const SPDofHP1 = [
	1.9, 2.2, 2.5, 2.7, 3.1, 4.3, 3.8, 4.2, 4.8, 5.19, 5.89, 7.39, 7.89, 5.69, 12.89, 6.69, 4.3, 20.78, 12.99, 6.69,
	1.4, 1.5, 3.2, 18.18, 56.24, 2.9, 2.1, 13.39, 2.1, 2.0, 2.2, 2.3, 2.6, 5.1, 11.39, 15.48, 20.78, 55.64, 254.03,
	56.14, 111.78, 297.98, 142.55, 334.84, 189.4, 117.78, 79.92, 108.09, 46.85, 38.16, 32.47, 28.37, 25.37, 22.98,
	20.38, 19.78, 17.78, 16.78, 19.18, 17.98, 13.69, 9.99, 8.19, 7.59, 6.99, 6.79, 6.49, 6.39, 6.09, 5.99, 5.79, 5.79,
	5.79, 5.79, 6.39, 5.99, 5.59, 31.97, 27.87, 5.89, 6.69,
];

/**
 * High Pressure discharge lamp: Colour enhanced high pressure sodium lamp.
 */
export const SPDofHP2 = [
	2.64, 2.77, 3.42, 3.68, 4.33, 5.5, 5.94, 7.2, 9.02, 10.27, 12.48, 16.82, 16.04, 15.26, 22.58, 20.07, 15.13, 25.27,
	28.04, 15.99, 10.4, 11.1, 13.44, 22.62, 49.71, 17.21, 17.12, 27.26, 20.02, 21.54, 23.36, 25.66, 29.69, 43.12, 98.3,
	125.6, 134.57, 149.7, 166.12, 98.77, 30.47, 1.17, 0.39, 1.65, 21.41, 76.11, 126.16, 161.96, 160.06, 158.19, 153.69,
	147.4, 140.6, 134.92, 127.59, 124.65, 118.02, 113.94, 118.1, 115.16, 102.85, 90.54, 83.34, 79.44, 76.97, 74.85,
	73.12, 71.51, 70.13, 69.04, 67.48, 66.7, 66.31, 65.14, 65.7, 64.79, 64.1, 83.04, 86.25, 63.93, 64.92,
];

/**
 * High Pressure discharge lamp: High pressure metal halide lamp.
 */
export const SPDofHP3 = [
	3.15, 7.49, 10.87, 12.57, 12.97, 21.29, 26.29, 30.18, 43.06, 29.58, 23.18, 35.28, 26.29, 24.29, 22.91, 26.2, 29.31,
	25.3, 28.14, 24.05, 21.82, 20.51, 23.05, 26.98, 30.96, 30.72, 27.13, 29.55, 34.22, 29.98, 41.21, 173.14, 141.37,
	64.98, 33.83, 34.26, 33.32, 52.8, 74.29, 47.97, 49.2, 96.07, 85.41, 175.18, 153.73, 120.22, 98.9, 90.22, 70.07,
	66.84, 57.61, 53.03, 49.85, 48.16, 42.76, 50.64, 48.42, 41.27, 43.44, 40.48, 35.16, 34.94, 24.68, 24.7, 21.49,
	19.49, 18.48, 17.55, 17.36, 17.09, 16.32, 16.07, 16.58, 15.78, 17.66, 20.46, 16.59, 17.81, 16.07, 14.83, 14.61,
];

/**
 * High Pressure discharge lamp: High pressure metal halide lamp.
 */
export const SPDofHP4 = [
	9.8, 13.3, 19.97, 25.81, 24.69, 47.66, 54.44, 63.82, 85.52, 60.54, 38.37, 88.2, 44.94, 35.64, 30.75, 33.77, 40.81,
	33.77, 35.28, 32.55, 29.44, 26.16, 29.96, 32.83, 33.58, 41.16, 32.93, 32.13, 34.45, 30.12, 41.13, 187.1, 101.37,
	123.96, 42.47, 34.73, 31.82, 54.67, 57.45, 70.43, 69.5, 49.37, 183.35, 162.15, 109.35, 72.38, 70.6, 58.08, 44.13,
	50.2, 40.8, 37.91, 36.71, 38.3, 31.24, 35.31, 45.62, 35.82, 89.91, 36.01, 32.57, 39.26, 23.27, 25.3, 20.02, 17.54,
	16.25, 15.2, 15.15, 15.22, 14.26, 12.63, 14.75, 13.19, 17.63, 23.38, 16.02, 24.46, 22.05, 16.11, 12.91,
];

/**
 * High Pressure discharge lamp: High pressure metal halide lamp.
 */
export const SPDofHP5 = [
	0.34, 7.11, 11.49, 14.97, 14.95, 29.14, 38.08, 51.56, 62.56, 55.61, 41.98, 50.02, 42.14, 39.04, 40.52, 45.29, 51.01,
	49.18, 49.05, 46.12, 45.73, 39.46, 44.39, 46.14, 49.54, 59.76, 48.47, 48.38, 48.7, 44.25, 54.42, 128.93, 81.26,
	67.36, 48.48, 51.41, 48.88, 68.52, 80.85, 65.96, 59.43, 67.57, 128.34, 131.85, 101.7, 77.05, 66.27, 77.09, 60.51,
	65.23, 57.86, 56.2, 54.32, 56.34, 45.74, 50.79, 56.66, 51.99, 84.31, 47.48, 47.46, 61.78, 34.51, 38.74, 30.98,
	25.45, 22.88, 20.82, 21.05, 20.81, 18.69, 17.54, 19.58, 16.42, 23.77, 35.39, 21.37, 34.58, 30.21, 19.71, 15.61,
];
