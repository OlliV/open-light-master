import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export function FreqDataTable({ CCT, Lux, flickerIndex, fluDepth, fc }) {
	return (
		<TableContainer sx={{ marginTop: 3 }} component={Paper}>
			<Table sx={{ minWidth: 300 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="right">CCT</TableCell>
						<TableCell align="right">Lux</TableCell>
						<TableCell align="right">Flicker Index</TableCell>
						<TableCell align="right">Modulation Depth [%]</TableCell>
						<TableCell align="right">fc&nbsp;[Hz]</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow key={0} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
						<TableCell align="right">{Math.round(CCT)}</TableCell>
						<TableCell align="right">{Math.round(Lux)}</TableCell>
						<TableCell align="right">{Math.round(flickerIndex)}</TableCell>
						<TableCell align="right">{Math.round(fluDepth)}</TableCell>
						<TableCell align="right">{Math.round(fc)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export function FreqDataTable2({ CCT, Lux, flickerIndex, fluDepth }) {
	return (
		<TableContainer sx={{ marginTop: 3 }} component={Paper}>
			<Table sx={{ minWidth: 300 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="right">CCT</TableCell>
						<TableCell align="right">Lux</TableCell>
						<TableCell align="right">Flicker Index</TableCell>
						<TableCell align="right">Modulation Depth [%]</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow key={0} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
						<TableCell align="right">{Math.round(CCT)}</TableCell>
						<TableCell align="right">{Math.round(Lux)}</TableCell>
						<TableCell align="right">{Math.round(flickerIndex)}</TableCell>
						<TableCell align="right">{Math.round(fluDepth)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

