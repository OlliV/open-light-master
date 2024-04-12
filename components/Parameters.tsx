import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useGlobalState } from '../lib/global';

export default function Parameters({ children }) {
	const [hz, setHz] = useGlobalState('hz');
	const [avg, setAvg] = useGlobalState('avg');
	const [hzError, setHzError] = useState('');
	const [avgError, setAvgError] = useState('');

	return (
		<Grid item xs="auto">
			<Card variant="outlined" sx={{ height: '19em' }}>
				<CardContent sx={{ height: '15em' }}>
					<Typography gutterBottom variant="h5" component="h2">
						{children}
					</Typography>
					<Box>
						<TextField
							error={!!hzError}
							label="Poll Hz"
							defaultValue={`${hz}`}
							helperText={hzError}
							variant="standard"
							onChange={(e) => {
								const newHz = parseInt(e.target.value);
								if (Number.isNaN(newHz) || newHz <= 0 || newHz > 100) {
									setHzError('Incorrect entry.');
								} else {
									if (hzError) setHzError('');
									setHz(newHz);
								}
							}}
						/>
						<br />
						<br />
						<TextField
							error={!!avgError}
							label="Avg Period"
							defaultValue={`${avg}`}
							helperText={avgError}
							variant="standard"
							onChange={(e) => {
								const newAvg = parseInt(e.target.value);
								if (Number.isNaN(newAvg) || newAvg < 0 || newAvg > 300) {
									setAvgError('Incorrect entry.');
								} else {
									if (avgError) setAvgError('');
									setAvg(newAvg);
								}
							}}
						/>
					</Box>
				</CardContent>
			</Card>
		</Grid>
	);
}
