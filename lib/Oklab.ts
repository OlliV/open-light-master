import { matrixMul } from './matrix';

const M1 = [
	[ 0.8189330101, 0.3618667424, -0.1288597137 ],
	[ 0.0329845436, 0.9293118715, 0.0361456387 ],
	[ 0.0482003018, 0.2643662691, 0.6338517070 ]
];
const M2 = [
	[ 0.2104542553, 0.7936177850, -0.0040720468 ],
	[ 1.9779984951, -2.4285922050, 0.4505937099 ],
	[ 0.0259040371, 0.7827717662, -0.8086757660 ]
];

export function XYZD65toOklab(X: number, Y: number, Z: number): [number, number, number] {
	const [[ l ], [ m ], [ s ]] = matrixMul(M1, [[ X ], [ Y ] , [ Z ] ]);
	const q = 1 / 3;
	const lms_prime = [ [ l ** q ], [ m ** q ], [ s ** q ] ];
	const Lab = matrixMul(M2, lms_prime);

	return [Lab[0][0], Lab[1][0], Lab[2][0]] as const;
}

export function Oklab2Oklch(L: number, a: number, b: number) {
	const C = Math.sqrt(a ** 2 + b ** 2);
	const h = Math.atan2(b, a);

	return [L, C, h] as const;
}

export function Oklch2Oklab(L: number, C: number, h: number) {
	const a = C * Math.cos(h);
	const b = C * Math.sin(h);

	return [ L, a, b ] as const;
}
