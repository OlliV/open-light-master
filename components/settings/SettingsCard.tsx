import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';
import SxPropsTheme from 'lib/SxPropsTheme';

const buttonProgressStyle: SxPropsTheme = {
	color: green[500],
	position: 'absolute',
	top: '50%',
	left: '50%',
	marginTop: -12,
	marginLeft: -12,
};

export const settingsCardStyle: SxPropsTheme = {
	height: '19em',
	width: '15em',
};

export const iconStyle: SxPropsTheme = {
	fontSize: '18px !important',
};

export function ActionButton({
	wait,
	onClick,
	disabled,
	children,
}: {
	wait?: boolean;
	onClick?: () => void;
	disabled?: boolean;
	children: any;
}) {
	return (
		<Box>
			<Button disabled={wait || disabled} variant="contained" onClick={onClick}>
				{children}
				{wait && <CircularProgress size={24} sx={buttonProgressStyle} />}
			</Button>
		</Box>
	);
}

export function SettingsCard({
	icon,
	title,
	actions,
	children,
}: {
	icon: ReactNode;
	title: string;
	actions?: ReturnType<typeof CardActions>;
	children: ReactNode;
}) {
	return (
		<Grid item xs="auto">
			<Card variant="outlined" sx={settingsCardStyle}>
				<CardContent sx={{ height: '15em' }}>
					<Typography gutterBottom variant="h5" component="h2">
						{icon} {`${title}`}
					</Typography>
					<Box>{children}</Box>
				</CardContent>
				{actions || ''}
			</Card>
		</Grid>
	);
}
