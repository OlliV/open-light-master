import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useGlobalState } from '../lib/global';

export default function MeasControl() {
	const [running, setRunning] = useGlobalState('running');
	const toggle = () => setRunning(!running);

	return (
		<Box>
			<IconButton onClick={toggle} size="large" aria-label="start/pause measurements" color="inherit">
				{running ? <PauseCircleIcon /> : <PlayCircleIcon />}
			</IconButton>
		</Box>
	);
}
