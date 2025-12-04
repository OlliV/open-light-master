import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MyHead from 'components/MyHead';
import Title from 'components/Title';
import { Line } from 'components/Chart';
import Control from 'components/FreqMeasControl';
import { FreqDataTable as DataTable } from 'components/FreqDataTable';
import { useGlobalState } from 'lib/global';
import { calcFft } from 'lib/flicker';

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

type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array;
//| BigInt64Array
//| BigUint64Array;

function typedArrayMax(arr: TypedArray): number {
	let max: number = arr.length > 0 ? arr[0] : -Infinity;

	for (let v of arr) {
		if (v > max) {
			max = v;
		}
	}

	return max;
}

const FFT = ({ wave, freqDiv, setFc }: { wave: readonly number[]; freqDiv: number; setFc: (fc: number) => void }) => {
	const data: Float32Array = useMemo(() => calcFft(wave), [wave]);
	const unitMul = freqDiv > 26 ? 1 : 1 / 1000;
	useEffect(() => setFc((1e3 * data.indexOf(typedArrayMax(data.subarray(1)))) / freqDiv), [freqDiv, setFc, data]);

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
							borderColor: 'black',
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
								text: unitMul === 1 ? 'Frequency [Hz]' : 'Frequency [kHz]',
								color: 'black',
							},
							ticks: {
								display: true,
								color: 'black',
								callback: (tickValue, index, ticks) =>
									unitMul === 1
										? Math.round((1e3 * Number(tickValue)) / freqDiv)
										: (((1e3 * Number(tickValue)) / freqDiv) * unitMul).toFixed(2),
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
								color: 'black',
							},
						},
					},
				}}
			/>
		</Container>
	);
};

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
