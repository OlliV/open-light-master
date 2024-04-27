import { useState } from 'react';
import TextField from '@mui/material/TextField';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { SettingsCard, iconStyle } from './SettingsCard';
import { useGlobalState } from 'lib/global';

export default function Parameters() {
	const [hz, setHz] = useGlobalState('hz');
	const [avg, setAvg] = useGlobalState('avg');
	const [hzError, setHzError] = useState('');
	const [avgError, setAvgError] = useState('');

	return (
		<SettingsCard icon={<DisplaySettingsIcon sx={iconStyle} />} title="Parameters">
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
		</SettingsCard>
	);
}
