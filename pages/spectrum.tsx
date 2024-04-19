import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Paper from '@mui/material/Paper';
import Title from '../components/Title';
import Bar from '../components/Bar';
import { useGlobalState } from '../lib/global';
import { normalize } from '../lib/vector';

function wavelengthToColor(wl: number) {
	let R: number;
	let G: number;
	let B: number;
	let alpha: number;

	if (wl >= 380 && wl < 440) {
		R = (-1 * (wl - 440)) / (440 - 380);
		G = 0;
		B = 1;
	} else if (wl >= 440 && wl < 490) {
		R = 0;
		G = (wl - 440) / (490 - 440);
		B = 1;
	} else if (wl >= 490 && wl < 510) {
		R = 0;
		G = 1;
		B = (-1 * (wl - 510)) / (510 - 490);
	} else if (wl >= 510 && wl < 580) {
		R = (wl - 510) / (580 - 510);
		G = 1;
		B = 0;
	} else if (wl >= 580 && wl < 645) {
		R = 1;
		G = (-1 * (wl - 645)) / (645 - 580);
		B = 0.0;
	} else if (wl >= 645 && wl <= 780) {
		R = 1;
		G = 0;
		B = 0;
	} else {
		R = 0;
		G = 0;
		B = 0;
	}

	if (wl > 780 || wl < 380) {
		alpha = 0;
	} else if (wl > 700) {
		alpha = (780 - wl) / (780 - 700);
	} else if (wl < 420) {
		alpha = (wl - 380) / (420 - 380);
	} else {
		alpha = 1;
	}

	return ['rgba(' + R * 100 + '%,' + G * 100 + '%,' + B * 100 + '%, ' + alpha + ')', R, G, B, alpha];
}

const SpectrumBar = ({ data }) => {
	return (
		<Container sx={{ height: '400px', width: '100%', maxWidth: '400px' }}>
			<Bar
				width={1}
				height={1}
				data={{
					labels: data.map(({l}) => `${l} nm`),
					datasets: [{
						label: 'nm',
						data: data.map(({v}) => v),
						backgroundColor: data.map(({l}) => wavelengthToColor(l)[0]),
					}],
				}}
				options={{
					scales: {
						y: {
							min: 0,
							max: 1,
						},
					},
					plugins: {
						legend: {
							display: false,
						},
					},
				}}
			/>
		</Container>
	);
};

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const data = useMemo(() => {
		const vec = [meas.V1, meas.B1, meas.G1, meas.Y1, meas.O1, meas.R1];
		const norm = vec.every((v) => v === 0)
			? [0, 0, 0, 0, 0, 0]
			: normalize([meas.V1, meas.B1, meas.G1, meas.Y1, meas.O1, meas.R1]);
		return [
			{
				l: 450,
				v: norm[0],
			},
			{
				l: 500,
				v: norm[1],
			},
			{
				l: 550,
				v: norm[2],
			},
			{
				l: 570,
				v: norm[3],
			},
			{
				l: 600,
				v: norm[4],
			},
			{
				l: 650,
				v: norm[5],
			},
		];
	}, [meas]);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - Spectrum</Title>
				<Paper>
					<SpectrumBar data={data} />
				</Paper>
			</Box>
		</Container>
	);
}
