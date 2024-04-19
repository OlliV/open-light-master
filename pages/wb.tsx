import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Title from '../components/Title';
import CIE1931 from '../components/CIE1931';
import { useGlobalState } from '../lib/global';
import { calcCRI } from '../lib/cri';

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const cri = useMemo(() => calcCRI(meas), [meas]);
	// "The concept of correlated color temperature should not be used if the
	// chromaticity of the test source differs more than Δuv = 5×10-2 from the
	// Planckian radiator."
	// Schanda, János (2007). "3: CIE Colorimetry".
	// Colorimetry: Understanding the CIE System.
	const duvErr = Math.abs(meas.Duv) > 5e-2;

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - WB</Title>
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
					</Box>
					<Box>
						<TextField
							label="Duv"
							disabled
							sx={{ m: 1, width: '15ch' }}
							variant="outlined"
							error={duvErr}
							value={`${meas.Duv.toFixed(3)}`}
							helperText={duvErr && 'Invalid CCT?'}
						/>
						<TextField
							label="Tint"
							disabled
							sx={{ m: 1, width: '15ch' }}
							value={`${Math.round(meas.tint)}`}
						/>
					</Box>
					<CIE1931 Ex={meas.Ex} Ey={meas.Ey} />
				</Paper>
			</Box>
		</Container>
	);
}
