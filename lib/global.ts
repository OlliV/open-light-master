import { createGlobalState } from 'react-hooks-global-state';
import { BtDevice } from './ble';

const defaultScene = [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0.5, 1], [0, 1], 'limited'];

export type GlobalState = {
	// Devices
	btDevice_lm3: null | BtDevice;
	// Control
	lm3: any; // TODO Type
	// Set values
	running: boolean;
	// Reported values
	res_lm_measurement: {
		// corrected
		V1: number;
		B1: number;
		G1: number;
		Y1: number;
		O1: number;
		R1: number;
		temperature: number;
		// calculated
		mode: number;
		Eu: number;
		Ev: number;
		Ey: number;
		Ex: number;
		Duv: number;
		CCT: number;
		tint: number;
		Lux: number;
		eml: number;
	};
	res_battery_level: number;
	// Settings
};

const LOCAL_STORAGE_KEY = 'settings';
const initialState: GlobalState = {
	// Devices
	btDevice_lm3: null,
	// Control
	lm3: null,
	// Set values
	running: false,
	// Reported values
	res_lm_measurement: {
		V1: 0,
		B1: 0,
		G1: 0,
		Y1: 0,
		O1: 0,
		R1: 0,
		mode: 0,
		Eu: 0,
		Ev: 0,
		Ey: 0,
		Ex: 0,
		Duv: 0,
		CCT: 0,
		tint: 0,
		Lux: 0,
		eml: 0,
	},
	res_battery_level: 0,
	// Settings
	// Load config from local storage
	...(typeof window === 'undefined' ? {} : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))),
};

const { useGlobalState: _useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

type ConfigKey = 'cc_scenes';

function useGlobalState(key: keyof GlobalState) {
	const [value, setValue] = _useGlobalState(key);

	const setAndSaveValue = (value: Parameters<typeof setValue>[0]) => {
		setValue(value);

		// Defer saving to not disturb the render loop.
		setTimeout(() => {
			saveConfig();
		}, 0);
	};

	return [value, setAndSaveValue] as const;
}

function saveConfig() {
	//const config: { [k in ConfigKey]: any } = {
	//	cc_scenes: getGlobalState('cc_scenes'),
	//};
	//localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
}

export { useGlobalState, getGlobalState, setGlobalState /* saveConfig */ };
