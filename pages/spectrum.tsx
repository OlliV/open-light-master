import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Carousel from 'react-material-ui-carousel';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Memory from 'components/Memory';
import MyHead from 'components/MyHead';
import Title from 'components/Title';
import { Bar, Scatter, makeChartTitle } from 'components/Chart';
import wavelengthToColor from 'lib/wl2rgb';
import wlMap from 'lib/wlmap';
import { SPD, interpolateSPD } from 'lib/spd';
import { lm3NormSPD } from 'lib/lm3calc';
import { normalize2 } from 'lib/vector';
import { useMemoryRecall, useGlobalState, LM3Measurement, RefMeasurement } from 'lib/global';

type RecallData = {
	name: string;
	norm: SPD;
	scatter: Array<{ x: number; y: number }>;
};

function refToRecallData(name: string, meas: RefMeasurement): RecallData {
	const normBars = normalize2([
		meas.SPD[14], // 450 nm
		meas.SPD[24], // 500 nm
		meas.SPD[34], // 550 nm
		meas.SPD[38], // 570 nm
		meas.SPD[44], // 600 nm
		meas.SPD[54], // 650 nm
	]);
	const normScatter = normalize2(meas.SPD);

	return {
		name,
		norm: wlMap((l, i) => ({ l, v: normBars[i] }), 5),
		scatter: wlMap((l, i) => ({ x: l, y: normScatter[i] }), 5),
	};
}

function lm3ToRecallData(name: string, meas: LM3Measurement) {
	const norm = lm3NormSPD(meas);

	return {
		name,
		norm,
		scatter: interpolateSPD2Chart(norm),
	};
}

const measToRecallData = Object.freeze({
	ref: refToRecallData,
	LM3: lm3ToRecallData,
});

const barDataLabels = Object.freeze(['450 nm', '500 nm', '550 nm', '570 nm', '600 nm', '650 nm']);

function spd2bar(spd: Readonly<SPD>) {
	return spd.map(({ v }) => v);
}

function spd2color(spd: Readonly<SPD>) {
	return spd.map(({ l }) => wavelengthToColor(l)[0]);
}

function SpectrumBar({ data, recallData }: { data: Readonly<SPD>; recallData: RecallData[] }) {
	return (
		<Bar
			width={1}
			height={1}
			data={{
				// @ts-ignore
				labels: barDataLabels,
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

function SpectrumScatter({ data, recallData }: { data: Array<{ x: number; y: number }>; recallData: RecallData[] }) {
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
					})),
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

function interpolateSPD2Chart(data: Readonly<SPD>) {
	return interpolateSPD(data).map(({ l, v }) => ({ x: l, y: v }));
}

export default function Spectrum() {
	const [meas] = useGlobalState('res_lm_measurement');
	const recall = useMemoryRecall();
	const norm = lm3NormSPD(meas);
	const scatter = interpolateSPD2Chart(norm);
	const recallData = useMemo<RecallData[]>(
		() =>
			recall
				.filter((m) => ['ref', 'LM3'].includes(m.type))
				.map(({ name, type, meas }): RecallData => measToRecallData[type](name, meas)),
		[recall]
	);

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
					<Container sx={{ height: '450px', overflow: 'scroll' }}>
						<Carousel autoPlay={false} animation="slide" swipe={false}>
							<Container sx={{ height: '400px', width: '100%', maxWidth: '400px' }}>
								<SpectrumBar data={norm} recallData={recallData} />
							</Container>
							<Container sx={{ height: '400px' }}>
								<SpectrumScatter data={scatter} recallData={recallData} />
							</Container>
						</Carousel>
					</Container>
				</Paper>
			</Box>
		</Container>
	);
}
