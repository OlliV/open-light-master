export default function wlMap<U>(
	fn: (wl: number, index: number) => U,
	increment: number = 5,
	min: number = 380,
	max: number = 780
) {
	return Array.from({ length: (max - min) / increment + 1 }, (_, index) => fn(min + index * increment, index));
}
