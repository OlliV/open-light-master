import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Title from '../components/Title';
import DataArray from '../components/DataArray';
import { GridLogicOperator } from '@mui/x-data-grid';
import { calcCRI } from '../lib/cri';
import { useGlobalState } from '../lib/global';

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const cri = useMemo(() => calcCRI(meas), [meas]);
	const rows = useMemo(
		() =>
			[
				{ id: 0, name: 'CCT', value: Math.round(meas.CCT), unit: 'K' },
				{ id: 0, name: 'x', value: meas.Ex, unit: null },
				{ id: 0, name: 'y', value: meas.Ey, unit: null },
				{ id: 0, name: 'u', value: meas.Eu, unit: null },
				{ id: 0, name: 'v', value: meas.Ev, unit: null },
				{ id: 0, name: 'Duv', value: meas.Duv, unit: null },
				{ id: 0, name: 'Tint', value: meas.tint, unit: null },
				//{ id: 0, name: 'Hue', value: 0, unit: 'deg' },
				//{ id: 0, name: 'Sat', value: 0, unit: '%' },
				{ id: 0, name: 'Illuminance', value: Math.round(meas.Lux), unit: 'lx' },
				{ id: 0, name: 'Illuminance [fc]', value: Math.round(meas.Lux * 0.09293680297), unit: 'ft⋅cd' },
				{ id: 0, name: 'Ra', value: Math.round(cri.R[0]), unit: null },
				{ id: 0, name: 'cs', value: cri.cs, unit: null },
				{ id: 0, name: 'Temperature', value: meas.temperature, unit: '°C' },
			].map((v, i) => ((v.id = i + 1), v)),
		[meas, cri]
	);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - Text</Title>
				<DataArray
					rows={rows}
					pageSize={9}
					filter={{
						filterModel: {
							items: [],
							quickFilterValues: ['CCT', 'x', 'y', 'u', 'v', 'Illuminance', 'Ra'],
							quickFilterLogicOperator: GridLogicOperator.Or,
						},
					}}
				/>
			</Box>
		</Container>
	);
}
