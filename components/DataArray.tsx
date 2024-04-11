import Box from '@mui/system/Box';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

const rowsSample = [{ id: 1, name: 'CCT', value: 5600, unit: 'K' }];

const columns: GridColDef<(typeof rowsSample)[number]>[] = [
	{ field: 'id', headerName: 'ID' },
	{
		field: 'name',
		headerName: 'Name',
		width: 150,
		hideable: false,
	},
	{
		field: 'value',
		headerName: 'Value',
		type: 'number',
		width: 110,
		sortable: false,
		hideable: false,
		getApplyQuickFilterFn: undefined,
	},
	{
		field: 'unit',
		headerName: 'Unit',
		width: 90,
		hideable: false,
		getApplyQuickFilterFn: undefined,
	},
];

export default function DataArray({
	rows,
	pageSize = 5,
	filter,
}: {
	rows: typeof rowsSample;
	pageSize?: number;
	filter?: any;
}) {
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
