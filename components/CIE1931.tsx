import Container from '@mui/material/Container';
import { Scatter, pointRotationAuto } from './Chart';
import planckianCalc_xy from '../lib/planckian';

const spectral = [
	[0.1741, 0.005],
	[0.174, 0.005],
	[0.1738, 0.0049],
	[0.1736, 0.0049],
	[0.1733, 0.0048],
	[0.173, 0.0048],
	[0.1726, 0.0048],
	[0.1721, 0.0048],
	[0.1714, 0.0051],
	[0.1703, 0.0058],
	[0.1689, 0.0069],
	[0.1669, 0.0086],
	[0.1644, 0.0109],
	[0.1611, 0.0138],
	[0.1566, 0.0177],
	[0.151, 0.0227],
	[0.144, 0.0297],
	[0.1355, 0.0399],
	[0.1241, 0.0578],
	[0.1096, 0.0868],
	[0.0913, 0.1327],
	[0.0687, 0.2007],
	[0.0454, 0.295],
	[0.0235, 0.4127],
	[0.0082, 0.5384],
	[0.0039, 0.6548],
	[0.0139, 0.7502],
	[0.0389, 0.812],
	[0.0743, 0.8338],
	[0.1142, 0.8262],
	[0.1547, 0.8059],
	[0.1929, 0.7816],
	[0.2296, 0.7543],
	[0.2658, 0.7243],
	[0.3016, 0.6923],
	[0.3373, 0.6589],
	[0.3731, 0.6245],
	[0.4087, 0.5896],
	[0.4441, 0.5547],
	[0.4788, 0.5202],
	[0.5125, 0.4866],
	[0.5448, 0.4544],
	[0.5752, 0.4242],
	[0.6029, 0.3965],
	[0.627, 0.3725],
	[0.6482, 0.3514],
	[0.6658, 0.334],
	[0.6801, 0.3197],
	[0.6915, 0.3083],
	[0.7006, 0.2993],
	[0.7079, 0.292],
	[0.714, 0.2859],
	[0.719, 0.2809],
	[0.723, 0.277],
	[0.726, 0.274],
	[0.7283, 0.2717],
	[0.73, 0.27],
	[0.7311, 0.2689],
	[0.732, 0.268],
	[0.7327, 0.2673],
	[0.7334, 0.2666],
	[0.734, 0.266],
	[0.7344, 0.2656],
	[0.7346, 0.2654],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.737, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.7347, 0.2653],
	[0.1741, 0.005],
].map(([x, y]) => ({ x, y }));

const markers = [
	{ x: 0.1738, y: 0.0049, wl: 390 },
	{ x: 0.144, y: 0.0297, wl: 460 },
	{ x: 0.1241, y: 0.0578, wl: 470 },
	{ x: 0.0913, y: 0.1327, wl: 480 },
	{ x: 0.0454, y: 0.295, wl: 490 },
	{ x: 0.0082, y: 0.5384, wl: 500 },
	{ x: 0.0139, y: 0.7502, wl: 510 },
	{ x: 0.0743, y: 0.8338, wl: 520 },
	{ x: 0.2296, y: 0.7543, wl: 540 },
	{ x: 0.3731, y: 0.6245, wl: 560 },
	{ x: 0.5125, y: 0.4866, wl: 580 },
	{ x: 0.627, y: 0.3725, wl: 600 },
	{ x: 0.6915, y: 0.3083, wl: 620 },
	{ x: 0.7347, y: 0.2653, wl: 700 },
];

function planckianXYT(T: number) {
	const [x, y] = planckianCalc_xy(T);
	return { x, y, T };
}

const CCTMarkers = [
	planckianXYT(1500),
	planckianXYT(2000),
	planckianXYT(2500),
	planckianXYT(3000),
	planckianXYT(4000),
	planckianXYT(6000),
	planckianXYT(10000),
];

const CCT_MIN = 1000;
const CCT_MAX = 25000;
const CCT_STEP = 100;

const locus = Array.from({ length: (CCT_MAX - CCT_MIN) / CCT_STEP }, (_, i) => CCT_MIN + i * CCT_STEP).map(
	planckianXYT
);

function toolTipTitle(datasetIndex: number, dataIndex: number, defaultLabel: any) {
	switch (datasetIndex) {
		case 0:
			return 'locus';
		case 1:
			return `${markers[dataIndex].wl} nm`;
		default:
			return `${defaultLabel}`;
	}
}

export default function CIE1931({ Ex, Ey }) {
	return (
		<Container sx={{ minWidth: 400 }}>
			<Scatter
				width={1}
				height={1}
				data={{
					labels: locus.map(({ T }) => `${T} K`),
					datasets: [
						{
							label: 'Spectral locus',
							data: spectral,
							animation: false,
							tension: 0.3,
							showLine: true,
							borderColor: 'black',
							borderWidth: 1,
							pointRadius: 0,
							datalabels: { display: false },
						},
						{
							data: markers.map(({ x, y }) => ({ x, y })),
							animation: false,
							borderColor: 'black',
							pointStyle: 'line',
							borderWidth: 2,
							pointRadius: 5,
							pointRotation: (ctx) => pointRotationAuto(ctx, 110),
							datalabels: {
								labels: {
									value: {
										align: 'top',
										formatter: (_value, context) => markers[context.dataIndex].wl,
									},
								},
							},
						},
						{
							label: 'Planckian locus',
							data: locus.map(({ x, y }) => ({ x, y })),
							animation: false,
							showLine: true,
							borderColor: 'black',
							borderWidth: 1,
							pointRadius: 0,
							datalabels: { display: false },
						},
						{
							data: CCTMarkers.map(({ x, y }) => ({ x, y })),
							animation: false,
							borderColor: 'black',
							pointStyle: 'line',
							borderWidth: 2,
							pointRadius: 5,
							pointRotation: [110, 90, 80, 65, 60, 50, 45],
							datalabels: {
								labels: {
									value: {
										align: 'top',
										rotation: 45,
										offset: (context) => context.dataIndex * 2,
										formatter: (_value, context) => `${CCTMarkers[context.dataIndex].T} K`,
									},
								},
							},
						},
						{
							label: 'CCT',
							data: [{ x: Ex, y: Ey }],
							borderColor: 'black',
							pointRadius: 2,
							datalabels: { display: false },
						},
					],
				}}
				options={{
					aspectRatio: 1,
					plugins: {
						legend: {
							display: false,
						},
						title: {
							display: true,
							text: 'CIE 1931',
							position: 'bottom',
							padding: {
								top: -10, // This fixes the aspect ratio shift
							},
						},
						datalabels: {
							display: true,
						},
						tooltip: {
							enabled: true,
							callbacks: {
								//label: (tooltipItem) => tooltipItem.dataIndex == 0 ? 'Hello' : 'Hi',
								title: (tooltipItems) =>
									toolTipTitle(
										tooltipItems[0].datasetIndex,
										tooltipItems[0].dataIndex,
										tooltipItems[0].label
									),
							},
						},
					},
					scales: {
						x: {
							min: 0,
							max: 0.8,
							display: true,
							grid: {
								display: true,
							},
							title: {
								display: true,
								text: 'y',
								color: 'black',
							},
							ticks: {
								display: true,
							},
						},
						y: {
							min: 0,
							max: 0.9,
							display: true,
							grid: {
								display: true,
							},
							title: {
								display: true,
								text: 'x',
								color: 'black',
							},
							ticks: {
								display: true,
							},
						},
					},
				}}
			/>
		</Container>
	);
}
