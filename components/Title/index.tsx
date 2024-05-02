import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import IconSettings from '@mui/icons-material/Settings';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MouseEvent } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Notifications from './Notifications';
import PowerStatus from './PowerStatus';
import MeasControl from 'components/MeasControl';

const sxArrowEnabled = {
	'&:hover': {
		color: 'grey',
		cursor: 'pointer',
	},
};

const sxArrowDisabled = {
	visibility: 'hidden',
};

const Offset = styled('div')(({ theme }) => ({ margin: '2px', ...theme.mixins.toolbar }));

function BackButton({ disable, onClick }: { disable: boolean; onClick?: (e?: MouseEvent<HTMLElement>) => void }) {
	return (
		<IconButton sx={{ color: 'white' }} disabled={disable} onClick={onClick}>
			<FirstPageIcon />
		</IconButton>
	);
}

function Setup() {
	const router = useRouter();

	const openSettings = (e: MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push('/setup');
	};

	return (
		<Box>
			<IconButton onClick={openSettings} size="large" aria-label="open settings" color="inherit">
				<IconSettings />
			</IconButton>
		</Box>
	);
}

export default function Title({
	disableBack,
	href,
	className,
	children,
}: {
	disableBack?: boolean;
	href?: string;
	className?: string;
	children: any;
}) {
	const router = useRouter();

	const goBack = (e: MouseEvent<HTMLElement>) => {
		if (disableBack) {
			e.preventDefault();
		} else if (href) {
			router.push(href);
		} else {
			router.back();
		}
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="fixed" elevation={0} sx={{ left: 0, width: '100vw' }}>
				<Toolbar>
					<BackButton disable={disableBack} onClick={goBack} />
					<Typography variant="h6" noWrap component="div">
						{children}
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<MeasControl />
					<PowerStatus />
					<Setup />
					<Notifications />
				</Toolbar>
			</AppBar>
			<Offset />
		</Box>
	);
}
