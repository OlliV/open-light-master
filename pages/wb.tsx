import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import CCT from 'components/CCT';
import CIE1931 from 'components/CIE1931';
import Duv from 'components/Duv';
import Memory from 'components/Memory';
import MyHead from 'components/MyHead';
import Title from 'components/Title';
import { useGlobalState, useMemoryRecall } from 'lib/global';

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const secondary = useMemoryRecall().map(({ name, meas }) => ({
		label: name,
		Ex: meas.Ex,
		Ey: meas.Ey,
		CCT: meas.CCT,
		Duv: meas.Duv,
	}));

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
						<Box sx={{ float: 'right', paddingTop: 1, paddingRight: 1 }}>
							<Memory />
						</Box>
					</Box>
					<CIE1931 Ex={meas.Ex} Ey={meas.Ey} CCT={meas.CCT} Duv={meas.Duv} secondaryPoints={secondary} />
				</Paper>
			</Box>
		</Container>
	);
}
