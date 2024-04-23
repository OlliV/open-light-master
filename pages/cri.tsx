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
import Typography from '@mui/material/Typography';
import CCT from '../components/CCT';
import Duv from '../components/Duv';
import { useGlobalState } from '../lib/global';
import { calcCRI } from '../lib/cri';
import { interpolateSPD } from '../lib/spd';
import { calcCRI as calcCRI2 } from '../lib/cri2';
import { Scatter, pointRotationAuto } from '../components/Chart';

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

export default function Cri() {
	const [meas] = useGlobalState('res_lm_measurement');
	const cri = useMemo(() => calcCRI(meas), [meas]);
	const cri2 = useMemo(() => {
		const spd = interpolateSPD([
			{ wl: 450, p: meas.V1 },
			{ wl: 500, p: meas.B1 },
			{ wl: 550, p: meas.G1 },
			{ wl: 570, p: meas.Y1 },
			{ wl: 600, p: meas.O1 },
			{ wl: 650, p: meas.R1 },
		]);
		return calcCRI2(
			meas.CCT,
			spd.map(({ p }) => p)
		);
	}, [meas]);
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
						<TextField label="Ra" disabled sx={{ m: 1, width: '15ch' }} value={`${Math.round(cri.R[0])}`} />
						<TextField label="cs" disabled sx={{ m: 1, width: '15ch' }} value={`${cri.cs.toFixed(6)}`} />
					</Box>
					<Typography>Alternative CRI Calculation</Typography>
					<Box>
						{cri2.R.map((r, i) => (
							<TextField
								key={`cri${i}`}
								label={`R${i == 0 ? 'a' : i}`}
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
						<Scatter
							width={1}
							height={1}
							data={{
								datasets: cri2.UVPairs.slice(0, chartShowAll ? cri2.UVPairs.length : 8).map(
									({ ref, test }, i) => ({
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
									})
								),
							}}
							options={{
								scales: {
									x: {
										min: -40,
										max: 40,
										grid: {
											color: ({ tick, chart }) => (tick.value == 0 ? 'black' : 'lightgrey'),
										},
									},
									y: {
										min: -40,
										max: 40,
										grid: {
											color: ({ tick }) => (tick.value == 0 ? 'black' : 'lightgrey'),
										},
									},
								},
							}}
						/>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
