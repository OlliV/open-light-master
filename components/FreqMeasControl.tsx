import Box from '@mui/system/Box';
import IconButton from '@mui/material/IconButton';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { useEffect, useState } from 'react';
import { useGlobalState } from 'lib/global';

export default function Control({ n }) {
	const [lm3] = useGlobalState('lm3');
	const [meas] = useGlobalState('res_lm_freq');
	const [working, setWorking] = useState(false);

	useEffect(() => {
		setWorking(!lm3);
	}, [meas, lm3]);

	return (
		<Box sx={{ width: 10 }}>
			<IconButton
				disabled={working}
				onClick={() => {
					setWorking(true);
					lm3.readFreq(0, n);
				}}
				size="large"
				aria-label="start/pause measurements"
				color="inherit"
			>
				{<ModelTrainingIcon />}
			</IconButton>
		</Box>
	);
}
