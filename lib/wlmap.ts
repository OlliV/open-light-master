export default function wlMap<U>(fn: (wl: number, index: number) => U, increment: number = 5) {
	return Array.from({ length: (780 - 380) / increment + 1 }).map((_, index) => fn(380 + index * increment, index));
}
