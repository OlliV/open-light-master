import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MyHead from 'components/MyHead';
import Parameters from 'components/settings/Parameters';
import Title from 'components/Title';
import { MemorySettings } from 'components/Memory';
import Ble from 'components/settings/ble';
import { BLE_SERVICE_UUID as LM3_SERVICE_UUID, createLm3 } from 'lib/ble/lm3';
import { getGlobalState, useGlobalState } from 'lib/global';
import { Paired } from 'lib/ble';

function LM3() {
	const [, setDevice] = useGlobalState('lm3');
	const connectCb = async (server: BluetoothRemoteGATTServer) => {
		const lm3 = await createLm3(server);
		await lm3.startNotifications();
		await lm3.readCal();
		lm3.startMeasuring((1 / getGlobalState('hz')) * 1000, getGlobalState('avg'));
		setDevice(lm3);
	};
	const disconnectCb = (_btd: Paired) => {
		setDevice(null);
	};

	return (
		<Ble
			title="LM3"
			globalBtDeviceName="btDevice_lm3"
			optionalServices={[LM3_SERVICE_UUID]}
			connectCb={connectCb}
			disconnectCb={disconnectCb}
		/>
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
