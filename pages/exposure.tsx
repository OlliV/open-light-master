import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MyHead from 'components/MyHead';
import Title from 'components/Title';
import { useGlobalState } from 'lib/global';
import { calcEV, calcFstop, calcShutter, closestAperture, closestShutter } from 'lib/exposure';

const DEFAULT_ISO = 100;

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	const [iso, setIso] = useState(DEFAULT_ISO);
	const [gain, setGain] = useState(0);
	const [auto, setAuto] = useState(0);
	const [[shutter, aperture], setParam] = useState([1 / 100, 4]);
	const [shutterStr, setShutterStr] = useState('4');
	const [apertureStr, setApertureStr] = useState('4');
	const [invalid, setInvalid] = useState(0);
	const updateParam = useCallback(
		(newEv: number, newShutter: number, newAperture: number) => {
			if (auto === 0) {
				const autoShutter = calcShutter(newEv, newAperture);
				const str = `${1 / closestShutter(autoShutter)}`;
				setParam([autoShutter, newAperture]);
				setShutterStr(str);
			} else {
				const autoAperture = calcFstop(newEv, newShutter);
				const tradFstop = closestAperture(autoAperture);
				const str = tradFstop < 10 ? tradFstop.toFixed(1) : `${tradFstop}`;
				setParam([newShutter, autoAperture]);
				setApertureStr(str);
			}
		},
		[setParam, setShutterStr, setApertureStr, auto]
	);
	const ev = useMemo(() => {
		const ev = calcEV(meas.Lux, Number.isNaN(iso) ? DEFAULT_ISO : iso, gain);
		updateParam(ev, shutter, aperture);
		return ev;
	}, [updateParam, meas.Lux, iso, gain, shutter, aperture]);
	const updateExposure = (newShutter: number, newAperture: number) => {
		const newInvalid = (Number(Number.isNaN(newShutter)) & 1) | ((Number(Number.isNaN(newAperture)) & 1) << 1);
		setInvalid(newInvalid);
		updateParam(ev, newShutter, newAperture);
	};

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box
				position="relative"
				sx={{
					'& .MuiTextField-root': { m: 1, width: '25ch' },
				}}
				component="form"
				noValidate
				autoComplete="off"
			>
				<Title>OLM - Exposure</Title>
				<Paper sx={{ padding: 2 }}>
					<Box>
						<TextField label="EV" disabled id="outlined-basic" variant="outlined" value={Math.round(ev)} />
						<TextField
							label="ISO"
							variant="outlined"
							required
							error={Number.isNaN(iso)}
							defaultValue={`${iso}`}
							onChange={(e) => setIso(parseInt(e.target.value))}
						/>
						<TextField
							label="Gain"
							error={Number.isNaN(gain)}
							defaultValue={`${gain}`}
							onChange={(e) => setGain(Number(e.target.value))}
						/>
					</Box>
					<Box>
						<Stack direction="row" spacing={1} alignItems="center">
							<Typography>Shutter</Typography>
							<Switch
								color="default"
								defaultChecked={false}
								onChange={(e) => setAuto(Number(e.target.checked))}
							/>
							<Typography>Aperture</Typography>
						</Stack>
					</Box>
					<Box>
						<TextField
							label="Shutter"
							InputProps={{
								startAdornment: <InputAdornment position="start">1/</InputAdornment>,
							}}
							variant="outlined"
							required
							disabled={auto === 0}
							error={!!(invalid & 1)}
							value={shutterStr}
							onChange={(e) => {
								const v = e.target.value;
								setShutterStr(v);
								const num = 1 / Number(v);
								if (!Number.isNaN(num)) updateExposure(num, aperture);
							}}
						/>
						<TextField
							label="Aperture"
							InputProps={{
								startAdornment: <InputAdornment position="start">f/</InputAdornment>,
							}}
							variant="outlined"
							required
							disabled={auto === 1}
							error={!!(invalid & 2)}
							value={apertureStr}
							onChange={(e) => {
								const v = e.target.value;
								setApertureStr(v);
								const num = Number(v);
								if (!Number.isNaN(num)) updateExposure(shutter, num);
							}}
						/>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
