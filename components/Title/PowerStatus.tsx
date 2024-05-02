import { BatteryLevel } from 'components/BatteryLevel';
import { useGlobalState } from 'lib/global';
import { useEffect } from 'react';

export default function PowerStatus() {
	// @ts-ignore
	// The whole battery_status stuff is commented out for now
	const [batteryLevel] = useGlobalState('res_battery_level');

	useEffect(() => {}, [batteryLevel]);

	return <BatteryLevel batteryLevel={batteryLevel} />;
}
