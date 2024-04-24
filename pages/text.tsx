import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import MyHead from '../components/MyHead';
import Title from '../components/Title';
import DataArray from '../components/DataArray';
import { GridLogicOperator } from '@mui/x-data-grid';
import { useGlobalState } from '../lib/global';
import lm3CalcCRI from '../lib/lm3cri';
import { XYZnD65, xy2XYZ, XYZ2Lab } from '../lib/CIEConv';
import { LabHueSatChroma } from '../lib/Lab';

function calcHueSat(x: number, y: number, Lux: number) {
	const [X, Y, Z] = xy2XYZ(x, y, Lux);
	const [L, a, b] = XYZ2Lab(X, Y, Z, XYZnD65);

	return LabHueSatChroma(L, a, b);
}

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const rows = useMemo(() => {
		const { hab: hue, sat } = calcHueSat(meas.Ex, meas.Ey, meas.Lux);
		const cri = lm3CalcCRI(meas);
		const array = [
			{ id: 0, name: 'CCT', value: Math.round(meas.CCT), unit: 'K' },
			{ id: 0, name: 'x', value: meas.Ex, unit: null },
			{ id: 0, name: 'y', value: meas.Ey, unit: null },
			{ id: 0, name: 'u', value: meas.Eu, unit: null },
			{ id: 0, name: 'v', value: meas.Ev, unit: null },
			{ id: 0, name: 'Duv', value: meas.Duv, unit: null },
			{ id: 0, name: 'Tint', value: Math.round(meas.tint), unit: null },
			{ id: 0, name: 'Hue', value: hue, unit: 'deg' },
			{ id: 0, name: 'Sat', value: sat, unit: '%' },
			{ id: 0, name: 'Illuminance', value: Math.round(meas.Lux), unit: 'lx' },
			{ id: 0, name: 'Illuminance [fc]', value: Math.round(meas.Lux * 0.09293680297), unit: 'ft⋅cd' },
			{ id: 0, name: 'Ra', value: Math.round(cri.R[0]), unit: null },
			...Array.from({ length: 14 }).map((_, i) => ({
				id: 0,
				name: `R${i + 1}`,
				value: Math.round(cri.R[i + 1]),
				unit: null,
			})),
			{ id: 0, name: 'Temperature', value: meas.temperature, unit: '°C' },
		];
		for (let i = 0; i < array.length; i++) array[i].id = i;
		return array;
	}, [meas]);

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
