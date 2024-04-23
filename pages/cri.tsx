import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Title from '../components/Title';
import Typography from '@mui/material/Typography';
import CCT from '../components/CCT';
import Duv from '../components/Duv';
import { useGlobalState } from '../lib/global';
import { calcCRI } from '../lib/cri';
import { interpolateSPD } from '../lib/spd';
import { calcCRI as calcCRI2 } from '../lib/cri2';

export default function Text() {
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
					<Typography>Alternative calculation:</Typography>
					<Box>
						{cri2.map((r, i) => (
							<TextField
								key={`cri${i}`}
								label={`R${i == 0 ? 'a' : i}`}
								disabled
								sx={{ m: 1, width: '15ch' }}
								value={`${Math.round(r)}`}
							/>
						))}
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
