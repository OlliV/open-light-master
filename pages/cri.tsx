import { useMemo, useState } from 'react';
import Box from '@mui/system/Box';
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
import { Scatter, gridColorAuto, pointRotationAuto } from '../components/Chart';
import { calcCRI } from '../lib/cri';
import lm3CalcCRI from '../lib/lm3cri';

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

function CriChart({ cri, showAll }: { cri: ReturnType<typeof calcCRI>; showAll?: boolean }) {
	return (
		<Scatter
			width={1}
			height={1}
			data={{
				datasets: cri.UVPairs.slice(0, showAll ? cri.UVPairs.length : 8).map(({ ref, test }, i) => ({
					label: `R${i + 1}`,
					borderColor: swatch[i],
					datalabels: { display: false },
					pointStyle: 'rect',
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
				scales: {
					x: {
						min: -40,
						max: 40,
						grid: {
							color: gridColorAuto,
						},
					},
					y: {
						min: -40,
						max: 40,
						grid: {
							color: gridColorAuto,
						},
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
					<FormGroup>
						<FormControlLabel
							control={<Switch onChange={(event) => setChartShowAll(event.target.checked)} />}
							label="Show R9-R14"
						/>
					</FormGroup>
					<Box sx={{ width: 400 }}>
						<CriChart cri={cri} showAll={chartShowAll} />
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
