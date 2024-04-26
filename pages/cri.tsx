import { useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import Carousel from 'react-material-ui-carousel';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MyHead from '../components/MyHead';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Title from '../components/Title';
import CCT from '../components/CCT';
import Duv from '../components/Duv';
import { useGlobalState } from '../lib/global';
import { Bar, Scatter, gridColorAuto, pointRotationAuto } from '../components/Chart';
import { calcCRI } from '../lib/cri';
import lm3CalcCRI from '../lib/lm3cri';

const lightBlack = 'rgb(50,50,50)';
const swatch = [
	'rgb(242, 185, 158)',
	'rgb(206, 177, 82)',
	'rgb(128, 186, 76)',
	'rgb(0, 168, 166)',
	'rgb(0, 159, 222)',
	'rgb(0, 134, 205)',
	'rgb(165, 148, 198)',
	'rgb(233, 155, 193)',
	'rgb(230, 0, 54)',
	'rgb(255, 255, 255)',
	'rgb(0, 137, 94)',
	'rgb(0, 60, 149)',
	'rgb(244, 232, 219)',
	'rgb(0, 96, 68)',
];
const swatchBorder = [
	'rgb(242, 185, 158)',
	'rgb(206, 177, 82)',
	'rgb(128, 186, 76)',
	'rgb(0, 168, 166)',
	'rgb(0, 159, 222)',
	'rgb(0, 134, 205)',
	'rgb(165, 148, 198)',
	'rgb(233, 155, 193)',
	'rgb(230, 0, 54)',
	lightBlack,
	'rgb(0, 137, 94)',
	'rgb(0, 60, 149)',
	lightBlack,
	'rgb(0, 96, 68)',
];

function CriText({ cri }: { cri: ReturnType<typeof calcCRI> }) {
	return (
		<Box>
			{cri.R.map((r, i) => (
				<TextField
					key={`cri${i}`}
					label={`R${i === 0 ? 'a' : i}`}
					disabled
					sx={{ m: 1, width: '15ch' }}
					value={`${Math.round(r)}`}
				/>
			))}
		</Box>
	);
}

const criBarLabels = ['Ra', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14'];

function CriBars({ cri, showAll }: { cri: ReturnType<typeof calcCRI>; showAll: boolean }) {
	return (
		<Bar
			data={{
				labels: showAll ? criBarLabels : criBarLabels.slice(0, 9),
				datasets: [
					{
						label: 'CRI',
						datalabels: { display: false },
						borderWidth: 1,
						borderColor: lightBlack,
						backgroundColor: (c) => (c.dataIndex == 0 ? lightBlack : swatch[c.dataIndex - 1]),
						data: showAll ? cri.R : cri.R.slice(0, 9),
					},
				],
			}}
			options={{
				indexAxis: 'y',
				elements: {
					bar: {
						borderWidth: 2,
					},
				},
				scales: {
					x: {
						min: 0,
						max: 100,
						grid: {
							display: true,
						},
					},
					y: {
						grid: {
							display: true,
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
				},
			}}
		/>
	);
}

function CriChart({ cri, showAll }: { cri: ReturnType<typeof calcCRI>; showAll?: boolean }) {
	return (
		<Scatter
			width={1}
			height={1}
			data={{
				datasets: cri.UVPairs.slice(0, showAll ? cri.UVPairs.length : 8).map(({ ref, test }, i) => ({
					label: `R${i + 1}`,
					borderColor: swatchBorder[i],
					backgroundColor: swatch[i],
					datalabels: { display: false },
					pointRotation: (ctx) => pointRotationAuto(ctx, 45),
					pointRadius: (ctx) => ctx.dataIndex != 0 && 3,
					showLine: true,
					data: [
						{ x: ref[0], y: ref[1] },
						{ x: test[0], y: test[1] },
					],
				})),
			}}
			options={{
				plugins: {
					// @ts-ignore
					customCanvasBackgroundColor: {
						color: 'white',
					},
					tooltip: {
						enabled: true,
						callbacks: {
							title: (tooltipItems) => `Difference`,
							beforeLabel: (tooltipItem) =>
								`R${tooltipItem.datasetIndex + 1} ${tooltipItem.dataIndex == 0 ? 'Ref' : 'Test'}`,
							label: (tooltipItem) =>
								`U*V*: ${tooltipItem.formattedValue} ${tooltipItem.dataIndex == 0 ? '' : `∆E: ${cri.DE[tooltipItem.datasetIndex].toFixed(3)}`}`,
						},
					},
				},
				scales: {
					x: {
						min: showAll ? -60 : -40,
						max: showAll ? 120 : 40,
						grid: {
							color: gridColorAuto,
						},
					},
					y: {
						min: showAll ? -50 : -40,
						max: showAll ? 60 : 40,
						grid: {
							color: gridColorAuto,
						},
					},
				},
				elements: {
					line: {
						borderWidth: 2,
					},
					point: {
						pointStyle: 'rect',
						borderWidth: 1,
					},
				},
			}}
		/>
	);
}

export default function Cri() {
	const [meas] = useGlobalState('res_lm_measurement');
	const cri = useMemo(() => lm3CalcCRI(meas), [meas]);
	const [chartShowAll, setChartShowAll] = useState(false);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - CRI</Title>
				<Paper sx={{ padding: 2 }}>
					<Box>
						<CCT value={meas.CCT} />
						<Duv value={meas.Duv} />
					</Box>
					<CriText cri={cri} />
					<FormGroup>
						<FormControlLabel
							control={<Switch onChange={(event) => setChartShowAll(event.target.checked)} />}
							label="Show R9-R14"
						/>
					</FormGroup>
					<Carousel autoPlay={false} animation="slide">
						<Box sx={{ height: 400 }}>
							<CriChart cri={cri} showAll={chartShowAll} />
						</Box>
						<Box sx={{ height: 400 }}>
							<CriBars cri={cri} showAll={chartShowAll} />
						</Box>
					</Carousel>
				</Paper>
			</Box>
		</Container>
	);
}
