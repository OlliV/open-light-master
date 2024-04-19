export default function calcCCT(x: number, y: number) {
	// McCamy’s (CCT) formula
	// RFE Explore better formulas
	// - Hernández-Andrés et al. formula
	// - Accurate method for computing correlated color temperature, Changjun Li et al.
	const n = (x - 0.332) / (0.1858 - y);
	const CCT = 449 * n * n * n + 3525 * n * n + 6823.3 * n + 5520.33;

	return CCT;
}
