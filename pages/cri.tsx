import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Title from '../components/Title';
import CCT from '../components/CCT';
import Duv from '../components/Duv';
import { useGlobalState } from '../lib/global';
import { calcCRI } from '../lib/cri';

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const cri = useMemo(() => calcCRI(meas), [meas]);

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
				</Paper>
			</Box>
		</Container>
	);
}
