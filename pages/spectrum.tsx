import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Carousel from 'react-material-ui-carousel';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import MyHead from '../components/MyHead';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Title from '../components/Title';
import { Bar, Scatter, makeChartTitle } from '../components/Chart';
import { useGlobalState } from '../lib/global';
import { normalize2 } from '../lib/vector';
import wavelengthToColor from '../lib/wl2rgb';
import { interpolateSPD } from '../lib/spd';

const SpectrumBar = ({ data }) => {
	return (
		<Bar
			width={1}
			height={1}
			data={{
				labels: data.map(({ l }) => `${l} nm`),
				datasets: [
					{
						label: 'nm',
						datalabels: { display: false },
						data: data.map(({ v }) => v),
						backgroundColor: data.map(({ l }) => wavelengthToColor(l)[0]),
					},
				],
			}}
			options={{
				scales: {
					y: {
						min: 0,
						max: 1,
					},
				},
				plugins: {
					title: makeChartTitle('Measured SPD'),
					legend: {
						display: false,
					},
				},
			}}
		/>
	);
};

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const data = useMemo(() => {
		const norm = normalize2([meas.V1, meas.B1, meas.G1, meas.Y1, meas.O1, meas.R1]);
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
	const dataInterpolated = useMemo(() => {
		const norm = normalize2([meas.V1, meas.B1, meas.G1, meas.Y1, meas.O1, meas.R1]);
		return interpolateSPD([
			{ wl: 450, p: norm[0] },
			{ wl: 500, p: norm[1] },
			{ wl: 550, p: norm[2] },
			{ wl: 570, p: norm[3] },
			{ wl: 600, p: norm[4] },
			{ wl: 650, p: norm[5] },
		]).map(({ wl, p }) => ({ x: wl, y: p }));
	}, [meas]);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - Spectrum</Title>
				<Paper>
					<Box>
						<TextField
							label="Illuminance"
							disabled
							sx={{ m: 1, width: '15ch' }}
							value={`${Math.round(meas.Lux)}`}
							InputProps={{
								endAdornment: <InputAdornment position="end">lx</InputAdornment>,
							}}
						/>
					</Box>
					<Carousel autoPlay={false} animation="slide">
						<Container sx={{ height: '400px', width: '100%', maxWidth: '400px' }}>
							<SpectrumBar data={data} />
						</Container>
						<Container sx={{ height: '400px' }}>
							<Scatter
								data={{
									datasets: [
										{
											label: 'SPD',
											datalabels: { display: false },
											showLine: true,
											pointStyle: false,
											borderColor: 'black',
											data: dataInterpolated,
										},
									],
								}}
								options={{
									plugins: {
										title: makeChartTitle('Interpolated SPD'),
										legend: {
											display: false,
										},
									},
									scales: {
										x: {
											min: 380,
											max: 780,
										},
										y: {
											min: 0,
										},
									},
								}}
							/>
						</Container>
					</Carousel>
				</Paper>
			</Box>
		</Container>
	);
}
