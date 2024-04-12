import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Title from '../components/Title';
import DataArray from '../components/DataArray';
import { useGlobalState } from '../lib/global';
import { calcCRI } from '../lib/cri';

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const cri = useMemo(() => calcCRI(meas), [meas]);
	const rows = [
		{ id: 1, name: 'CCT', value: Math.round(meas.CCT), unit: 'K' },
		{ id: 9, name: 'Ra', value: cri.R[0], unit: null },
		{ id: 10, name: 'R1', value: cri.R[1], unit: null },
		{ id: 11, name: 'R2', value: cri.R[2], unit: null },
		{ id: 12, name: 'cs', value: cri.cs, unit: null },
	];

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - CRI</Title>
				<DataArray rows={rows} pageSize={9} />
			</Box>
		</Container>
	);
}
