import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import { iconStyle, SettingsCard, ActionButton } from 'components/settings/SettingsCard';
import { Paired, pairDevice } from 'lib/ble';
import { GlobalState, useGlobalState } from 'lib/global';

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

export default function Ble({
	title,
	globalBtDeviceName,
	filter,
	optionalServices,
	connectCb,
	disconnectCb,
}: {
	title: string;
	globalBtDeviceName: keyof GlobalState;
	filter?: Parameters<typeof pairDevice>[0];
	optionalServices: Parameters<typeof pairDevice>[1];
	connectCb: (server: BluetoothRemoteGATTServer) => Promise<void>;
	disconnectCb: (btd: Paired) => void;
}) {
	const pairedWithMessage = (btd: Paired): InfoMessage => ({
		message: btd ? `Paired with\n${btd.device.name}` : 'Not configured',
		severity: 'info',
	});
	const [btAvailable, setBtAvailable] = useState(false);
	const [pairingRequest, setPairingRequest] = useState(false);
	const [isPairing, setIsPairing] = useState(false);
	const [btDevice, setBtDevice] = useGlobalState(globalBtDeviceName);
	let [info, setInfo] = useState<InfoMessage>(pairedWithMessage(btDevice));

	const unpairDevice = () => {
		if (btDevice) {
			if (btDevice.device.gatt.connected) {
				btDevice.disconnect();
			}
			setBtDevice(null);
			setInfo(pairedWithMessage(null));
			disconnectCb(btDevice);
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
						filter || null,
						optionalServices,
						async ({ device: _device, server }) => {
							try {
								await connectCb(server);
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
			title={title}
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
