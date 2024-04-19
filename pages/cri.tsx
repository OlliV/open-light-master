import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import MyHead from '../components/MyHead';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Title from '../components/Title';
import { useGlobalState } from '../lib/global';
import { calcCRI } from '../lib/cri';

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const cri = useMemo(() => calcCRI(meas), [meas]);
	const rows = [
		{ id: 1, name: 'CCT', value: Math.round(meas.CCT), unit: 'K' },
		{ id: 9, name: 'Ra', value: Math.round(cri.R[0]), unit: null },
		{ id: 12, name: 'cs', value: cri.cs, unit: null },
	];
	// See wb.tsx
	const duvErr = Math.abs(meas.Duv) > 5e-2;

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - CRI</Title>
				<Paper sx={{ padding: 2 }}>
					<Box>
						<TextField
							label="CCT"
							disabled
							sx={{ m: 1, width: '15ch' }}
							value={`${Math.round(meas.CCT)}`}
							InputProps={{
								endAdornment: <InputAdornment position="end">K</InputAdornment>,
							}}
						/>
						<TextField
							label="Duv"
							disabled
							sx={{ m: 1, width: '15ch' }}
							variant="outlined"
							error={duvErr}
							value={`${meas.Duv.toFixed(3)}`}
							helperText={duvErr && 'Invalid CCT?' || <>&nbsp;</>}
						/>
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
