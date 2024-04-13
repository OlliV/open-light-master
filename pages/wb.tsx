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
		{ id: 2, name: 'Duv', value: meas.Duv, unit: null },
		{ id: 3, name: 'Tint', value: Math.round(meas.tint), unit: null },
	];

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - WB</Title>
				<DataArray rows={rows} pageSize={9} />
			</Box>
		</Container>
	);
}
