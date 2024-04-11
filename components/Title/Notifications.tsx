import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AlertColor } from '@mui/material/Alert';
import { ReactNode, MouseEvent, useState } from 'react';

type Notification = {
	severity: AlertColor;
	icon?: ReactNode;
	permanent?: boolean; // can't be cleared with X, i.e. action is mandatory
	text: string;
};

function useNotifications(): [Notification[], (notification: Notification) => void] {
	const [clearedNotifications, setClearedNotifications] = useState<string[]>([]);
	const notifications: Notification[] = [].filter(({ text }) => !clearedNotifications.includes(text));
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
