import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AlertColor } from '@mui/material/Alert';
import { BatteryLevel } from '../BatteryLevel';
import { ReactNode, MouseEvent, useState } from 'react';
import {useGlobalState} from '../../lib/global';

type Notification = {
	severity: AlertColor;
	icon?: ReactNode;
	permanent?: boolean; // can't be cleared with X, i.e. action is mandatory
	text: string;
};

function useLm3Alerts(): Notification[] {
	const [btDevice_lm3] = useGlobalState('btDevice_lm3');
	const [battLevel] = useGlobalState('res_battery_level');

	if (!btDevice_lm3) {
		return [{
			severity: 'error',
			icon: <SensorWindowIcon />,
			text: 'LM3 not connected',
		}];
	} else if (battLevel >= 0 && battLevel <= 20) {
		const getIcon = (l: number) => <BatteryLevel batteryLevel={l} />;
		return [{
			severity: 'warning',
			icon: getIcon(battLevel),
			text: 'Low battery',
		}];
	} else {
		return [];
	}
}

function useNotifications(): [Notification[], (notification: Notification) => void] {
	const lm3Alerts = useLm3Alerts();
	const [clearedNotifications, setClearedNotifications] = useState<string[]>([]);
	const notifications: Notification[] = [
		...lm3Alerts,
	].filter(({ text }) => !clearedNotifications.includes(text));
	const clearNotification = (notification: Notification) =>
		setClearedNotifications([...clearedNotifications, notification.text]);

	return [notifications, clearNotification];
}

export default function Notifications() {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [notifications, clearNotification] = useNotifications();

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<Box>
			<IconButton
				size="large"
				aria-label={`show ${notifications.length} new notifications`}
				color="inherit"
				onClick={handleClick}
			>
				<Badge badgeContent={notifications.length} color="error">
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Stack sx={{ width: '100%' }} spacing={1}>
					{notifications.length ? (
						notifications.map((msg, i) => (
							<Alert
								icon={msg.icon}
								severity={msg.severity}
								onClose={msg.permanent ? undefined : () => clearNotification(msg)}
								key={`notification_${i}`}
							>
								{msg.text}
							</Alert>
						))
					) : (
						<Typography sx={{ p: 2 }}>No notifications</Typography>
					)}
				</Stack>
			</Popover>
		</Box>
	);
}
