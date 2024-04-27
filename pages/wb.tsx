import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Title from '../components/Title';
import CCT from '../components/CCT';
import Duv from '../components/Duv';
import CIE1931 from '../components/CIE1931';
import { useGlobalState } from '../lib/global';

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - WB</Title>
				<Paper sx={{ padding: 2 }}>
					<Box>
						<CCT value={meas.CCT} />
						<Duv value={meas.Duv} />
						<TextField
							label="Tint"
							disabled
							sx={{ m: 1, width: '15ch' }}
							value={`${Math.round(meas.tint)}`}
						/>
					</Box>
					<CIE1931 Ex={meas.Ex} Ey={meas.Ey} Duv={meas.Duv} />
				</Paper>
			</Box>
		</Container>
	);
}
