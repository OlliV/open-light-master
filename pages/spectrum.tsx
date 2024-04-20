import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import MyHead from '../components/MyHead';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Title from '../components/Title';
import { Bar } from '../components/Chart';
import { useGlobalState } from '../lib/global';
import { normalize2 } from '../lib/vector';
import wavelengthToColor from '../lib/wl2rgb';

const SpectrumBar = ({ data }) => {
	return (
		<Container sx={{ height: '400px', width: '100%', maxWidth: '400px' }}>
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
					<SpectrumBar data={data} />
				</Paper>
			</Box>
		</Container>
	);
}
