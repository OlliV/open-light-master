import { BatteryLevel, PowerAdapter } from '../BatteryLevel';
import { useGlobalState } from '../../lib/global';
import { useEffect } from 'react';

// TODO Battery status is unstable
// Unfortunately 9.0 is very unstable.
// It just oscillates between AC on and off.

export default function PowerStatus() {
	// @ts-ignore
	// The whole battery_status stuff is commented out for now
	const [batteryLevel] = useGlobalState('res_battery_level');

	useEffect(() => {}, [batteryLevel]);

	return <BatteryLevel batteryLevel={batteryLevel} />;
}
