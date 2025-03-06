export interface BtDevice {
	device: BluetoothDevice;
	server: BluetoothRemoteGATTServer;
}

async function connect(device: BluetoothDevice): Promise<BluetoothRemoteGATTServer> {
	try {
		const server = await exponentialBackoff(
			3 /* max retries */,
			2 /* seconds delay */,
			async (): Promise<BluetoothRemoteGATTServer> => {
				time(`Connecting to Bluetooth Device (${device.name})...`);
				return await device.gatt.connect();
			}
		);

		console.log(`Bluetooth Device connected (${device.name}).`);
		return server;
	} catch (err) {
		throw err;
	}
}

/*
 * @param connectCb is called on the initial connect as well as on reconnects. This allows restarting the notifications.
 */
export async function pairDevice(
	filters: any | null,
	optionalServices: string[] | null,
	connectCb: (dev: BtDevice) => Promise<void>,
	onDisconnectedCb: () => void
) {
	const options = {
		acceptAllDevices: !filters,
		filters: filters || undefined,
		optionalServices,
	};

	const device = await navigator.bluetooth.requestDevice(options);
	const onDisconnected = (e) => {
		console.log(`> Bluetooth Device disconnected`); // TODO Show the name
		connect(device)
			.then(async (server) => {
				const btDevice = {
					device,
					server,
				};

				await connectCb(btDevice);
			})
			.catch((err) => {
				console.error(`> Bluetooth Device "${device.name}" reconnect failed: `, err);
				onDisconnectedCb();
			});
	};

	device.addEventListener('gattserverdisconnected', onDisconnected);
	let server: BluetoothRemoteGATTServer | null;
	try {
		server = await connect(device);
	} catch (err) {
		console.error('> Bluetooth Device connect failed');
		server = null;
	}
	connectCb({
		device,
		server,
	});

	return {
		device,
		disconnect: () => {
			console.log(`> Disconnecting ${device.name}`);
			device.removeEventListener('gattserverdisconnected', onDisconnected);
			device.gatt.disconnect();
		},
	};
}

// RFE is this ever needed? We can just unpair and throwaway everything.
export async function stopNotifications(characteristic) {
	characteristic.stopNotifications();
}

async function exponentialBackoff(max: number, delay: number, toTry) {
	return new Promise<typeof toTry>((resolve, reject) => _exponentialBackoff(max, delay, toTry, resolve, reject));
}

async function _exponentialBackoff(max: number, delay: number, toTry, success, fail) {
	try {
		success(await toTry());
	} catch (error) {
		if (max === 0) {
			return fail(error);
		}
		time('Retrying in ' + delay + 's... (' + max + ' tries left)');
		setTimeout(function () {
			_exponentialBackoff(--max, delay * 2, toTry, success, fail);
		}, delay * 1000);
	}
}

function time(text: string) {
	console.log(`[${new Date().toJSON().substr(11, 8)}]${text}`);
}
