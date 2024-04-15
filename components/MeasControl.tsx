import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useGlobalState } from '../lib/global';

export default function MeasControl() {
	const [running, setRunning] = useGlobalState('running');
	const [lm3] = useGlobalState('lm3');
	const toggle = () => setRunning(!running);

	return (
		<Box>
			<IconButton
				disabled={!lm3}
				onClick={toggle}
				size="large"
				aria-label="start/pause measurements"
				color="inherit"
			>
				{lm3 && running ? <PauseCircleIcon /> : <PlayCircleIcon />}
			</IconButton>
		</Box>
	);
}
