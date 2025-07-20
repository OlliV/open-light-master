import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Container from '@mui/material/Container';
import MyHead from 'components/MyHead';
import Title from 'components/Title';
import Polar from 'components/Polar';
import { useGlobalState } from 'lib/global';
import { XYZnD65, xy2XYZ, XYZ2Lab, LabHueSatChroma } from 'lib/CIEConv';
import { normalize2 } from 'lib/vector';
import wl2rgb from 'lib/wl2rgb';

// TODO This is picking wrong colors most of the time
const wls = Object.freeze([0, 600, 570, 550, 500, 450, 650].map((wl, i, arr) => [i / arr.length, wl2rgb(wl)[0]]));

function borderColorSelector(context) {
	const ctx = context.chart.ctx;
	const gradient = ctx.createLinearGradient(0, 0, 0, 200);

	for (let v of wls) {
		gradient.addColorStop(...v);
	}

	return gradient;
}

export default function Text() {
	const [meas] = useGlobalState('res_lm_measurement');
	// It may seem like a good idea to put useMemo here but it actually
	// consumes 2x the time.
	const r = normalize2([meas.V1, meas.B1, meas.G1, meas.Y1, meas.O1, meas.R1]);
	const wls = {
		borderColor: borderColorSelector,
		backgroundColor: 'hsla(35, 40%, 40%, 50%)',
		data: [
			{ r: r[5], angle: 0, label: '650 nm' },
			{ r: r[4], angle: 0.7803367085666647, label: '600 nm' },
			{ r: r[3], angle: 1.1704177963873974, label: '570 nm' },
			{ r: r[2], angle: 1.4250613342533702, label: '550 nm' },
			{ r: r[1], angle: 2.6939157004532475, label: '500 nm' },
			{ r: r[0], angle: 3.9013344769829246, label: '450 nm' },
			{ r: r[5], angle: 2 * Math.PI, label: '650 nm' },
		],
	};
	const [X, Y, Z] = xy2XYZ(meas.Ex, meas.Ey, meas.Lux);
	const Lab = XYZ2Lab(X, Y, Z, XYZnD65);
	const { hab: posHab, chroma, sat } = LabHueSatChroma(...Lab);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - Color</Title>
				<Paper sx={{ padding: 2 }}>
					<Box>
						<TextField
							label="L*a*b*"
							disabled
							sx={{ m: 1, width: '28ch' }}
							value={`${Lab[0].toFixed(3)}, ${Lab[1].toFixed(3)}, ${Lab[2].toFixed(3)}`}
						/>
						<TextField
							label="Hue"
							disabled
							sx={{ m: 1, width: '10ch' }}
							value={posHab}
							InputProps={{
								endAdornment: <InputAdornment position="end">°</InputAdornment>,
							}}
						/>
						<TextField
							label="Chroma"
							disabled
							sx={{ m: 1, width: '10ch' }}
							value={`${Math.round(chroma)}`}
						/>
						<TextField
							label="Sat"
							disabled
							sx={{ m: 1, width: '10ch' }}
							value={`${Math.round(sat * 100)}`}
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
							}}
						/>
					</Box>
					<Container sx={{ height: '400px', width: '100%', maxWidth: '400px' }}>
						<Polar
							title="Hue vs Sat"
							pointer={{
								borderColor: 'black',
								backgroundColor: `hsl(${posHab}, 100%, 45%)`,
								r: sat,
								angle: (posHab * Math.PI) / 180,
							}}
							// @ts-ignore
							datasets={[wls]}
						/>
					</Container>
				</Paper>
			</Box>
		</Container>
	);
}
