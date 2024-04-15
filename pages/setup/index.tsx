import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import Title from '../../components/Title';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';
import SxPropsTheme from '../../lib/SxPropsTheme';
import { BtDevice, pairDevice } from '../../lib/ble';
import { useEffect, useState } from 'react';
import MyHead from '../../components/MyHead';
import Parameters from '../../components/Parameters';
import { getGlobalState, useGlobalState } from '../../lib/global';
import { BLE_SERVICE_UUID as LM3_SERVICE_UUID, createLm3 } from '../../lib/ble/lm3';

type Severity = 'error' | 'info' | 'success' | 'warning';

type InfoMessage = {
	message: string;
	severity: Severity;
};

const buttonProgressStyle: SxPropsTheme = {
	color: green[500],
	position: 'absolute',
	top: '50%',
	left: '50%',
	marginTop: -12,
	marginLeft: -12,
};
const iconStyle: SxPropsTheme = {
	fontSize: '18px !important',
};

function DeviceStatus({ wait, severity, children }: { wait?: boolean; severity: Severity; children: any }) {
	return (
		<CardContent>
			<Alert severity={severity}>{children}</Alert>
		</CardContent>
	);
}

function ActionButton({
	wait,
	onClick,
	disabled,
	children,
}: {
	wait: boolean;
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

function LM3(props: { children: any }) {
	const pairedWithMessage = (btd): InfoMessage => ({
		message: btd ? `Paired with\n${btd.device.name}` : 'Not configured',
		severity: 'info',
	});
	const [btAvailable, setBtAvailable] = useState(false);
	const [pairingRequest, setPairingRequest] = useState(false);
	const [isPairing, setIsPairing] = useState(false);
	const [btDevice, setBtDevice] = useGlobalState('btDevice_lm3') as [BtDevice, (BtDevice) => void];
	const [lm3, setLm3] = useGlobalState('lm3');
	let [info, setInfo] = useState<InfoMessage>(pairedWithMessage(btDevice));

	const unpairDevice = () => {
		if (btDevice) {
			if (btDevice.device.gatt.connected) {
				//@ts-ignore
				btDevice.disconnect();
			}
			setBtDevice(null);
			setInfo(pairedWithMessage(null));
			setLm3(null);
			setIsPairing(false);
		}
	};

	useEffect(() => {
		navigator.bluetooth
			.getAvailability()
			.then((v) => setBtAvailable(v))
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (pairingRequest) {
			setPairingRequest(false);
			setIsPairing(true);
			if (btDevice && btDevice.device.gatt.connected) {
				unpairDevice();
			}

			(async () => {
				try {
					setInfo({ message: 'Requesting BLE Device...', severity: 'info' });

					const newBtDevice = await pairDevice(
						null,
						[LM3_SERVICE_UUID],
						async ({ device, server }) => {
							try {
								const lm3 = await createLm3(server);
								await lm3.startNotifications();
								await lm3.readCal();
								lm3.startMeasuring((1 / getGlobalState('hz')) * 1000, getGlobalState('avg'));
								setLm3(lm3);
							} catch (err) {
								console.error(err);
								setInfo({ message: `${err}`, severity: 'error' });
							}
						},
						() => {
							// Unpair if we can't reconnect.
							unpairDevice();
						}
					);

					const { device } = newBtDevice;
					console.log(`> Name: ${device.name}\n> Id: ${device.id}\n> Connected: ${device.gatt.connected}`);
					setInfo(pairedWithMessage(newBtDevice));
					setBtDevice(newBtDevice);
				} catch (err) {
					const msg = `${err}`;
					if (msg.startsWith('NotFoundError: User cancelled')) {
						setInfo({ message: 'Pairing cancelled', severity: 'warning' });
					} else {
						setInfo({ message: `${err}`, severity: 'error' });
					}
				} finally {
					setIsPairing(false);
				}
			})();
		}
	}, [pairingRequest]); // eslint-disable-line react-hooks/exhaustive-deps

	const scanDevices = () => {
		setPairingRequest(true);
	};

	return (
		<Grid item xs="auto">
			<Card variant="outlined" sx={{ height: '19em', width: '15em' }}>
				<CardContent sx={{ height: '15em' }}>
					<Typography gutterBottom variant="h5" component="h2">
						{props.children}
					</Typography>
					<Box>
						<DeviceStatus wait={isPairing} severity={info.severity}>
							{info.message.split('\n').map((line, i) => (
								<span key={i}>
									{`${line}`}
									<br />
								</span>
							))}
						</DeviceStatus>
					</Box>
				</CardContent>
				<CardActions>
					<ActionButton wait={isPairing} disabled={!btAvailable} onClick={scanDevices}>
						Scan
					</ActionButton>
					<ActionButton wait={false} disabled={!btDevice} onClick={unpairDevice}>
						Unpair
					</ActionButton>
				</CardActions>
			</Card>
		</Grid>
	);
}

export default function Setup() {
	return (
		<Container maxWidth="md">
			<MyHead title="Setup" />
			<Box>
				<Title href="/">Setup</Title>
				<Grid container direction="row" alignItems="center" spacing={2}>
					<LM3>
						<SensorWindowIcon sx={iconStyle} /> LM3
					</LM3>
					<Parameters>
						<DisplaySettingsIcon sx={iconStyle} /> Parameters
					</Parameters>
				</Grid>
			</Box>
		</Container>
	);
}
