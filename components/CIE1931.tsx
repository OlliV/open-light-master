import { useEffect, useMemo } from 'react';
import Container from '@mui/material/Container';
import Scatter from './Scatter';
import planckian from '../lib/planckian';

export default function CIE1931({Ex, Ey}) {
	const locus = useMemo(() => {
		const CCT_MIN = 1667;
		const CCT_MAX = 25000;
		const CCT_STEP = 100;

		return Array.from({length: (CCT_MAX - CCT_MIN) / CCT_STEP}, (_, i) => CCT_MIN + i * CCT_STEP).map((T) => {
			const xc = planckian.calc_xc(T);
			const yc = planckian.calc_yc(T, xc);
			return { x: xc, y: yc, T };
		});
	}, []);

	return (
		<Container>
			<Scatter
				data={{
					labels: locus.map(({T}) => `${T} K`),
					datasets: [
						{
							label: 'locus',
							data: locus.map(({x, y}) => ({x, y})),
							showLine: true,
							borderColor: 'black',
							borderWidth: 1,
							pointRadius: 0,
						},
						{
							label: 'CCT',
							data: [{ x: Ex, y: Ey }],
							borderColor: 'black',
							pointRadius: 2,
						},
					],
				}}
				options={{
					plugins: {
						legend: {
							display: false,
						},
					},
					scales: {
						x: {
							min: 0,
							max: 0.8,
							display: true,
							grid: {
								display: true,
							},
							title: {
								display: true,
								text: 'y',
								color: 'black',
							},
							ticks: {
								display: true,
								color: 'blue',
								//callback: (tickValue, index, ticks) => Math.round((1e3 * Number(tickValue)) / freqDiv),
							},
						},
						y: {
							min: 0,
							max: 0.9,
							display: true,
							grid: {
								display: true,
							},
							title: {
								display: true,
								text: 'x',
								color: 'black',
							},
							ticks: {
								display: true,
								color: 'blue',
							},
						},
					},
				}}
			/>
		</Container>
	);
};
