import { useMemo } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { GridLogicOperator } from '@mui/x-data-grid';
import Memory from 'components/Memory';
import MyHead from 'components/MyHead';
import Title from 'components/Title';
import lm3CalcCRI from 'lib/lm3calc';
import { LabHueSatChroma } from 'lib/Lab';
import { XYZnD65, xy2XYZ, XYZ2Lab } from 'lib/CIEConv';
import { calcCRI } from 'lib/cri';
import { useGlobalState, useMemoryRecall } from 'lib/global';

const rowFormatter: { [key: string]: (value: never) => string } = {
	CCT: (value: number) => `${Math.round(value)} K`,
	x: (value: number) => `${value.toFixed(4)}`,
	y: (value: number) => `${value.toFixed(4)}`,
	u: (value: number) => `${value.toFixed(4)}`,
	v: (value: number) => `${value.toFixed(4)}`,
	Duv: (value: number) => value.toFixed(3),
	Tint: (value: number) => value.toFixed(0),
	Hue: (value: number) => `${value} deg`,
	Sat: (value: number) => `${(100 * value).toFixed(0)} %`,
	Illuminance: (value: number) => `${Math.round(value)} lx`,
	'Illuminance [fc]': (value: number) => `${Math.round(value)} ft⋅cd`,
	Ra: (value: number) => `${value.toFixed(0)}`,
	R0: (value: number) => `${value.toFixed(0)}`,
	R1: (value: number) => `${value.toFixed(0)}`,
	R2: (value: number) => `${value.toFixed(0)}`,
	R3: (value: number) => `${value.toFixed(0)}`,
	R4: (value: number) => `${value.toFixed(0)}`,
	R5: (value: number) => `${value.toFixed(0)}`,
	R6: (value: number) => `${value.toFixed(0)}`,
	R7: (value: number) => `${value.toFixed(0)}`,
	R8: (value: number) => `${value.toFixed(0)}`,
	R9: (value: number) => `${value.toFixed(0)}`,
	R10: (value: number) => `${value.toFixed(0)}`,
	R11: (value: number) => `${value.toFixed(0)}`,
	R12: (value: number) => `${value.toFixed(0)}`,
	R13: (value: number) => `${value.toFixed(0)}`,
	R14: (value: number) => `${value.toFixed(0)}`,
	Temperature: (value: number) => `${value.toFixed(2)} °C`,
};

const rowsSample = [{ id: 1, name: 'CCT', value: 5600 }];

const columnsTemplate: GridColDef<(typeof rowsSample)[number]>[] = [
	{ field: 'id', headerName: 'ID' },
	{
		field: 'name',
		headerName: 'Name',
		width: 120,
		hideable: false,
	},
	{
		field: 'value',
		headerName: 'Current',
		type: 'number',
		width: 120,
		sortable: false,
		hideable: false,
		getApplyQuickFilterFn: undefined,
		valueFormatter: (value, { name }) => rowFormatter[name](value || 0),
	},
];

function DataArray({ rows, pageSize = 5, filter }: { rows: typeof rowsSample; pageSize?: number; filter?: any }) {
	const recall = useMemoryRecall();
	const columns = [
		...columnsTemplate,
		...recall.map((rvalue, i) => ({
			...columnsTemplate[2],
			field: `recall${i}`,
			headerName: `${rvalue.name}`,
			hideable: true,
		})),
	];

	return (
		<Box sx={{ height: '100%', width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: pageSize,
						},
					},
					filter,
				}}
				columnVisibilityModel={{ id: false }}
				pageSizeOptions={[pageSize]}
				disableRowSelectionOnClick
				disableDensitySelector
				ignoreValueFormatterDuringExport
				slots={{ toolbar: GridToolbar }}
				slotProps={{
					toolbar: {
						showQuickFilter: true,
					},
				}}
			/>
		</Box>
	);
}

function calcHueSat(x: number, y: number, Lux: number) {
	const [X, Y, Z] = xy2XYZ(x, y, Lux);
	const [L, a, b] = XYZ2Lab(X, Y, Z, XYZnD65);

	return LabHueSatChroma(L, a, b);
}

function makeRecallCols(cols: number[]) {
	return cols.reduce((prev, cur, i) => ((prev[`recall${i}`] = cur), prev), {});
}

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const recall = useMemoryRecall();
	const rows = useMemo(() => {
		const { hab: hue, sat } = calcHueSat(meas.Ex, meas.Ey, meas.Lux);
		const cri = lm3CalcCRI(meas);
		const recallCri = recall.map(({ type: t, meas: rMeas }) =>
			// @ts-ignore
			t === 'LM3' ? lm3CalcCRI(rMeas) : t === 'ref' ? calcCRI(rMeas.CCT, rMeas.SPD) : null
		);
		const array = [
			{ id: 0, name: 'CCT', value: meas.CCT, ...makeRecallCols(recall.map((item) => item.meas.CCT)) },
			{ id: 0, name: 'x', value: meas.Ex, ...makeRecallCols(recall.map((item) => item.meas.Ex)) },
			{ id: 0, name: 'y', value: meas.Ey, ...makeRecallCols(recall.map((item) => item.meas.Ey)) },
			{ id: 0, name: 'u', value: meas.Eu, ...makeRecallCols(recall.map((item) => item.meas.Eu)) },
			{ id: 0, name: 'v', value: meas.Ev, ...makeRecallCols(recall.map((item) => item.meas.Ev)) },
			{ id: 0, name: 'Duv', value: meas.Duv, ...makeRecallCols(recall.map((item) => item.meas.Duv)) },
			{ id: 0, name: 'Tint', value: meas.tint, ...makeRecallCols(recall.map((item) => item.meas.tint)) },
			{
				id: 0,
				name: 'Hue',
				value: hue,
				...makeRecallCols(recall.map((item) => calcHueSat(item.meas.Ex, item.meas.Ey, item.meas.Lux).hab)),
			},
			{
				id: 0,
				name: 'Sat',
				value: sat,
				...makeRecallCols(recall.map((item) => calcHueSat(item.meas.Ex, item.meas.Ey, item.meas.Lux).sat)),
			},
			{ id: 0, name: 'Illuminance', value: meas.Lux, ...makeRecallCols(recall.map((item) => item.meas.Lux)) },
			{
				id: 0,
				name: 'Illuminance [fc]',
				value: meas.Lux * 0.09293680297,
				...makeRecallCols(recall.map((item) => item.meas.Lux * 0.09293680297)),
			},
			{
				id: 0,
				name: 'Ra',
				value: Math.round(cri.R[0]),
				...makeRecallCols(recall.map((_, i) => recallCri[i].R[0])),
			},
			...Array.from({ length: 14 }).map((_, i) => ({
				id: 0,
				name: `R${i + 1}`,
				value: Math.round(cri.R[i + 1]),
				...makeRecallCols(recallCri.map((cri) => cri.R[i + 1])),
			})),
			{
				id: 0,
				name: 'Temperature',
				value: meas.temperature,
				// @ts-ignore
				...makeRecallCols(recall.map((item) => item.meas?.temperature || 20)),
			},
		];
		for (let i = 0; i < array.length; i++) array[i].id = i;
		return array;
	}, [meas, recall]);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - Text</Title>
				<Paper>
					<Box sx={{ width: '100%', height: 75 }}>
						<Box sx={{ float: 'right', paddingTop: 1, paddingRight: 1, paddingBottom: 1 }}>
							<Memory />
						</Box>
					</Box>
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
				</Paper>
			</Box>
		</Container>
	);
}
