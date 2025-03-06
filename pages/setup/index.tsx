import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import MyHead from 'components/MyHead';
import Parameters from 'components/settings/Parameters';
import Title from 'components/Title';
import { iconStyle, SettingsCard, ActionButton } from 'components/settings/SettingsCard';
import { Paired, pairDevice } from 'lib/ble';
import { MemorySettings } from 'components/Memory';
import { getGlobalState, useGlobalState } from 'lib/global';
import { BLE_SERVICE_UUID as LM3_SERVICE_UUID, createLm3 } from 'lib/ble/lm3';

type Severity = 'error' | 'info' | 'success' | 'warning';

type InfoMessage = {
	message: string;
	severity: Severity;
};

function DeviceStatus({ wait, severity, children }: { wait?: boolean; severity: Severity; children: any }) {
	return (
		<CardContent>
			<Alert severity={severity}>{children}</Alert>
		</CardContent>
	);
}

function LM3() {
	const pairedWithMessage = (btd: Paired): InfoMessage => ({
		message: btd ? `Paired with\n${btd.device.name}` : 'Not configured',
		severity: 'info',
	});
	const [btAvailable, setBtAvailable] = useState(false);
	const [pairingRequest, setPairingRequest] = useState(false);
	const [isPairing, setIsPairing] = useState(false);
	const [btDevice, setBtDevice] = useGlobalState('btDevice_lm3');
	const [, setLm3] = useGlobalState('lm3');
	let [info, setInfo] = useState<InfoMessage>(pairedWithMessage(btDevice));

	const unpairDevice = () => {
		if (btDevice) {
			console.log(btDevice);
			if (btDevice.device.gatt.connected) {
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
						async ({ device: _device, server }) => {
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
		<SettingsCard
			icon={<SensorWindowIcon sx={iconStyle} />}
			title="LM3"
			actions={
				<CardActions>
					<ActionButton wait={isPairing} disabled={!btAvailable} onClick={scanDevices}>
						Scan
					</ActionButton>
					<ActionButton wait={false} disabled={!btDevice} onClick={unpairDevice}>
						Unpair
					</ActionButton>
				</CardActions>
			}
		>
			<DeviceStatus wait={isPairing} severity={info.severity}>
				{info.message.split('\n').map((line, i) => (
					<span key={i}>
						{`${line}`}
						<br />
					</span>
				))}
			</DeviceStatus>
		</SettingsCard>
	);
}

export default function Setup() {
	return (
		<Container maxWidth="md">
			<MyHead title="Setup" />
			<Box>
				<Title href="/">Setup</Title>
				<Grid container direction="row" alignItems="center" spacing={2}>
					<LM3 />
					<Parameters />
					<MemorySettings />
				</Grid>
			</Box>
		</Container>
	);
}
