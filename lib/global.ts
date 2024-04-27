import { useMemo } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { BtDevice } from './ble';

export type LM3Measurement = {
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
	Ex: number;
	Ey: number;
	Eu: number;
	Ev: number;
	CCT: number;
	Duv: number;
	tint: number;
	Lux: number;
	eml: number;
};

export type RefMeasurement = {
	SPD: number[];
	Ex: number;
	Ey: number;
	Eu: number;
	Ev: number;
	CCT: number;
	Duv: number;
	tint: number;
	Lux: number;
};

export type MemoryItem = {
	name: string;
	type: string;
	created: number;
	/**
	 * Set true if should be shown on the screen.
	 */
	recall: boolean;
	meas: {
		Ex: number;
		Ey: number;
		Eu: number;
		Ev: number;
		CCT: number;
		Duv: number;
		tint: number;
		Lux: number;
	};
};

export type RefMemoryItem = {
	type: 'ref';
	meas: RefMeasurement;
} & MemoryItem;

export type LM3MemoryItem = {
	type: 'LM3';
	meas: LM3Measurement;
} & MemoryItem;

export type GlobalState = {
	// Devices
	btDevice_lm3: null | BtDevice;
	// Control
	lm3: any; // TODO Type
	// Set values
	running: boolean;
	// Reported values
	res_lm_measurement: LM3Measurement;
	res_lm_freq: {
		CCT: number;
		Lux: number;
		fluDepth: number;
		flickerIndex: number;
		freqDiv: number;
		wave: number[];
	};
	res_battery_level: number;
	// Settings
	hz: number;
	avg: number;
	// Memory function
	memory: Array<MemoryItem | RefMemoryItem | LM3MemoryItem>;
};

const LOCAL_STORAGE_KEY = 'olm_settings';
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
		Ex: 0,
		Ey: 0,
		Eu: 0,
		Ev: 0,
		CCT: 0,
		Duv: 0,
		tint: 0,
		Lux: 0,
		eml: 0,
	},
	res_lm_freq: {
		CCT: 0,
		Lux: 0,
		fluDepth: 0,
		flickerIndex: 0,
		freqDiv: 1,
		wave: [],
	},
	res_battery_level: -1,
	// Settings
	hz: 1,
	avg: 1,
	// Memory feature
	memory: [],
	// Load config from local storage
	...(typeof window === 'undefined' ? {} : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))),
};

const { useGlobalState: _useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

type ConfigKey = 'avg' | 'hz' | 'memory';

type SetStateAction<S> = S | ((prevState: S) => S);
function useGlobalState<StateKey extends keyof GlobalState>(
	key: StateKey
): readonly [GlobalState[StateKey], (u: SetStateAction<GlobalState[StateKey]>) => void] {
	const [value, setValue] = _useGlobalState(key);

	const setAndSaveValue = (value: Parameters<typeof setValue>[0]) => {
		setValue(value);

		if (['hz', 'avg', 'memory'].includes(key)) {
			// Defer saving to not disturb the render loop.
			setTimeout(() => {
				saveConfig();
			}, 0);
		}
	};

	return [value, setAndSaveValue] as const;
}

function saveConfig() {
	const config: { [k in ConfigKey]: any } = {
		hz: getGlobalState('hz'),
		avg: getGlobalState('avg'),
		memory: getGlobalState('memory'),
	};
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
}

function useMemoryRecall(): MemoryItem[] {
	const [memory] = useGlobalState('memory');
	return useMemo(() => memory.filter((m: MemoryItem) => m.recall), [memory]);
}

export { useGlobalState, getGlobalState, setGlobalState /* saveConfig */, useMemoryRecall };
