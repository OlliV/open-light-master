import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import webfft from 'webfft';
import { fftshift } from '../lib/fftshift';
import MyHead from '../components/MyHead';
import Title from '../components/Title';
import IconButton from '@mui/material/IconButton';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { useGlobalState } from '../lib/global';
import Line from '../components/Line';

function mean(x: number[]) {
	return x.reduce((prev: number, xn: number) => prev + xn) / x.length;
}

const marks = [
	{
		value: 0,
		label: 'low',
	},
	{
		value: 1,
		label: 'medium',
	},
	{
		value: 2,
		label: 'high',
	},
];

function DiscreteSliderValues({ onChange }: { onChange: (newValue: number) => void }) {
	return (
		<Box sx={{ width: 100 }}>
			<Slider
				aria-label="Restricted values"
				defaultValue={0}
				min={0}
				max={2}
				step={null}
				valueLabelDisplay="off"
				marks={marks}
				onChange={(_, newValue) => {
					let n: number;
					switch (newValue) {
						case 0:
							n = 146;
							break;
						case 1:
							n = 25;
							break;
						case 2:
							n = 11;
							break;
						default:
							n = 25;
					}
					onChange(n);
				}}
			/>
		</Box>
	);
}

function Control({ n }) {
	const [lm3] = useGlobalState('lm3');
	const [meas] = useGlobalState('res_lm_freq');
	const [working, setWorking] = useState(false);

	useEffect(() => {
		setWorking(!lm3);
	}, [meas, lm3]);

	return (
		<Box sx={{ width: 10 }}>
			<IconButton
				disabled={working}
				onClick={() => {
					setWorking(true);
					lm3.readFreq(0, n);
				}}
				size="large"
				aria-label="start/pause measurements"
				color="inherit"
			>
				{<ModelTrainingIcon />}
			</IconButton>
		</Box>
	);
}

const FFT = ({ wave, freqDiv, setFc }) => {
	const fftSize = 1024; // must be power of 2
	const [fft] = useState(new webfft(fftSize));

	const data: number[] = useMemo(() => {
		if (wave.length != 1024) return [0];

		const DC = mean(wave);
		// The input is an interleaved complex array (IQIQIQIQ...), so it's twice the size
		const fftOut = fft.fft(new Float32Array(wave.map((xn: number) => xn - DC).flatMap((xn: number) => [xn, 0])));
		const mag = new Float32Array(fftSize);
		for (let i = 0; i < fftSize; i++) {
			mag[i] = Math.sqrt(fftOut[2 * i] * fftOut[2 * i] + fftOut[2 * i + 1] * fftOut[2 * i + 1]);
		}
		return Array.from(fftshift(mag).slice(fftSize / 2, fftSize));
	}, [fft, wave]);
	useEffect(() => setFc((1e3 * data.indexOf(Math.max(...data.slice(1)))) / freqDiv), [data]);

	return (
		<Container>
			<Line
				data={{
					labels: Array.from({ length: data?.length || 0 }, (_, i) => i),
					datasets: [
						{
							label: 'Dataset',
							data: data,
							fill: false,
							borderColor: 'green',
							borderWidth: 1,
							pointRadius: 0,
						},
					],
				}}
				options={{
					plugins: {
						legend: {
							display: false,
						},
						datalabels: {
							display: false,
						},
					},
					scales: {
						x: {
							display: true,
							grid: {
								display: true,
							},
							title: {
								display: true,
								text: 'Frequency [Hz]',
								color: 'black',
							},
							ticks: {
								display: true,
								color: 'blue',
								callback: (tickValue, index, ticks) => Math.round((1e3 * Number(tickValue)) / freqDiv),
							},
						},
						y: {
							display: true,
							grid: {
								display: true,
							},
							title: {
								display: true,
								text: 'Mag [Lux]',
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

function DataTable({ CCT, Lux, flickerIndex, fluDepth, fc }) {
	return (
		<TableContainer sx={{ marginTop: 3 }} component={Paper}>
			<Table sx={{ minWidth: 300 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="right">CCT</TableCell>
						<TableCell align="right">Lux</TableCell>
						<TableCell align="right">Flicker Index</TableCell>
						<TableCell align="right">Modulation Depth [%]</TableCell>
						<TableCell align="right">fc&nbsp;[Hz]</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow key={0} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
						<TableCell align="right">{Math.round(CCT)}</TableCell>
						<TableCell align="right">{Math.round(Lux)}</TableCell>
						<TableCell align="right">{Math.round(flickerIndex)}</TableCell>
						<TableCell align="right">{Math.round(fluDepth)}</TableCell>
						<TableCell align="right">{Math.round(fc)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default function Flicker() {
	const [data] = useGlobalState('res_lm_freq');
	const [n, setN] = useState(146);
	const [fc, setFc] = useState(0);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - Flicker</Title>
				<Paper sx={{ marginTop: 2, marginBottom: 1, paddingTop: 1, paddingLeft: 4 }}>
					<Typography variant="button">Sampling</Typography>
					<Stack
						sx={{ marginTop: 1, marginBottom: 2, paddingLeft: 4, paddingBottom: 1 }}
						spacing={2}
						direction="row"
					>
						<DiscreteSliderValues onChange={setN} />
						<Control n={n} />
					</Stack>
				</Paper>
				<Paper sx={{ paddingTop: 2, paddingBottom: 2 }}>
					<FFT wave={data.wave} freqDiv={data.freqDiv} setFc={setFc} />
				</Paper>
				<DataTable
					CCT={data.CCT}
					Lux={data.Lux}
					flickerIndex={data.flickerIndex}
					fluDepth={data.fluDepth}
					fc={fc}
				/>
			</Box>
		</Container>
	);
}
