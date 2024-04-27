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
import Memory from '../components/Memory';
import useMemoryRecall, { LM3MemoryItem, useGlobalState } from '../lib/global';
import wavelengthToColor from '../lib/wl2rgb';
import { SPD, interpolateSPD } from '../lib/spd';
import { lm3NormSPD } from '../lib/lm3calc';

type RecallData = {
	name: string;
	norm: SPD;
	scatter: Array<{x: number, y: number}>;
};

function spd2bar(spd: SPD) {
	return spd.map(({ v }) => v);
}

function spd2color(spd: SPD) {
	return spd.map(({ l }) => wavelengthToColor(l)[0]);
}

function SpectrumBar({ data, recallData }: { data: SPD; recallData: RecallData[] }) {
	return (
		<Bar
			width={1}
			height={1}
			data={{
				labels: data.map(({ l }) => `${l} nm`),
				datasets: [
					...recallData.map((e) => ({
						label: e.name,
						data: spd2bar(e.norm),
						borderWidth: 1,
						borderColor: 'black',
						backgroundColor: 'rgb(0,0,0,0)',
					})),
					{
						label: 'current',
						data: spd2bar(data),
						backgroundColor: spd2color(data),
					},
				],
			}}
			options={{
				plugins: {
					title: makeChartTitle('Measured SPD'),
					legend: {
						display: false,
					},
					datalabels: { display: false },
				},
				scales: {
					x: {
						stacked: true,
					},
					y: {
						min: 0,
						max: 1,
						stacked: false,
					},
				},
			}}
		/>
	);
}

function SpectrumScatter({ data, recallData }: { data: Array<{x: number, y: number}>; recallData: RecallData[] }) {
	return (
		<Scatter
			data={{
				datasets: [
					{
						label: 'current',
						borderColor: 'black',
						data: data,
					},
					...recallData.map((m) => ({
						label: m.name,
						data: m.scatter,
					}))
				],
			}}
			options={{
				plugins: {
					title: makeChartTitle('Interpolated SPD'),
					legend: {
						display: false,
					},
					datalabels: { display: false },
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
				showLine: true,
				elements: {
					point: {
						pointStyle: false,
					},
				},
			}}
		/>
	);
}

function interpolateSPD2Chart(data: SPD) {
	return interpolateSPD(data).map(({ l, v }) => ({ x: l, y: v }));
}

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const recall = useMemoryRecall();
	const [norm, scatter] = useMemo(() => {
		const norm = lm3NormSPD(meas);
		const scatter = interpolateSPD2Chart(norm);

		return [norm, scatter];
	}, [meas]);
	const recallData = useMemo<RecallData[]>(() => {
		return recall.filter((m) => m.type === 'LM3').map(({ name, meas }: LM3MemoryItem): RecallData => {
			const norm = lm3NormSPD(meas);

			return {
				name: name,
				norm,
				scatter: interpolateSPD2Chart(norm),
			};
		});
	}, [recall]);

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
					<Box sx={{ float: 'right', paddingTop: 1, paddingRight: 1 }}>
						<Memory />
					</Box>
					</Box>
					<Carousel autoPlay={false} animation="slide">
						<Container sx={{ height: '400px', width: '100%', maxWidth: '400px' }}>
							<SpectrumBar data={norm} recallData={recallData} />
						</Container>
						<Container sx={{ height: '400px' }}>
							<SpectrumScatter data={scatter} recallData={recallData} />
						</Container>
					</Carousel>
				</Paper>
			</Box>
		</Container>
	);
}
