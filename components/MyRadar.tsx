import { useMemo } from 'react';
import { Scatter } from './Chart';

const degToRad = Math.PI / 180;

const axisAngles = [
	0, // red
	(1 / 3) * Math.PI, // yellow
	(2 / 3) * Math.PI, // green
	Math.PI, // cyan
	(4 / 3) * Math.PI, // blue
	(5 / 3) * Math.PI, // magenta
];
const lines = axisAngles.map((t) => ({
	type: 'line',
	drawTime: 'beforeDatasetsDraw',
	borderColor: 'lightGrey',
	borderWidth: 1,
	xMin: 0,
	yMin: 0,
	xMax: Math.cos(t),
	yMax: Math.sin(t),
}));
const points = axisAngles.map((t) => ({
	type: 'point',
	drawTime: 'beforeDatasetsDraw',
	backgroundColor: `hsl(${(t * 180) / Math.PI}, 100%, 45%)`,
	xValue: Math.cos(t),
	yValue: Math.sin(t),
}));

function polar2xy(r: number, angle: number) {
	return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
}

type MyRadarPointer = {
	borderColor?: string;
	backgroundColor?: string;
	r: number;
	angle: number;
};

type MyRadarDataset = {
	labels?: string[];
	borderColor?: string;
	backgroundColor?: string;
	data: { r: number; angle: number; label: string }[];
};

export default function MyRadar({ pointer, datasets }: { pointer?: MyRadarPointer; datasets: MyRadarDataset[] }) {
	const scatterDatasets = useMemo(() => {
		const ds: any[] = datasets.map((dataset) => ({
			borderColor: dataset.borderColor,
			backgroundColor: dataset.backgroundColor,
			pointBackgroundColor: dataset.backgroundColor,
			animation: false,
			showLine: true,
			tension: 0.7,
			pointRadius: 3,
			datalabels: { display: false },
			labels: dataset?.labels || (dataset.data[0]?.label && dataset.data.map(({ label }) => label)),
			data: dataset.data.map(({ r, angle }) => polar2xy(r, angle)),
		}));
		if (pointer) {
			ds.unshift({
				borderColor: pointer.borderColor,
				backgroundColor: pointer.backgroundColor,
				pointBackgroundColor: pointer.backgroundColor,
				pointStyle: 'circle',
				pointRadius: (ctx) => (ctx.dataIndex == 0 ? 0 : 5),
				showLine: true,
				animation: false,
				datalabels: { display: false },
				labels: ['origo', `(r: ${pointer.r.toFixed(3)}, ∠: ${(pointer.angle * 180) / Math.PI} °)`],
				data: [{ x: 0, y: 0 }, polar2xy(pointer.r, pointer.angle)],
			});
		}
		return ds;
	}, [pointer, datasets]);

	return (
		<Scatter
			width={1}
			height={1}
			data={{
				datasets: scatterDatasets,
			}}
			options={{
				aspectRatio: 1,
				maintainAspectRatio: true,
				plugins: {
					title: {
						display: true,
						text: 'Hue vs Sat',
						position: 'bottom',
						padding: {
							top: -10, // This fixes the aspect ratio shift
						},
					},
					tooltip: {
						callbacks: {
							label: (ctx) =>
								// @ts-ignore
								(ctx.dataset.labels && ctx.dataset.labels[ctx.dataIndex]) ||
								`(x: ${ctx.parsed.x}, y: ${ctx.parsed.y})`,
						},
					},
					legend: {
						display: false,
					},
					annotation: {
						annotations: [
							{
								type: 'ellipse',
								drawTime: 'beforeDatasetsDraw',
								xMin: -1,
								xMax: 1,
								yMin: -1,
								yMax: 1,
								borderColor: 'lightGrey',
								backgroundColor: 'white',
							},
							{
								type: 'ellipse',
								drawTime: 'beforeDatasetsDraw',
								xMin: -0.5,
								xMax: 0.5,
								yMin: -0.5,
								yMax: 0.5,
								borderColor: 'lightGrey',
								backgroundColor: 'white',
							},
							// @ts-ignore
							...lines,
							// @ts-ignore
							...points,
						],
					},
				},
				scales: {
					x: {
						min: -1.1,
						max: 1.1,
						display: false,
						grid: {
							display: true,
						},
						title: {
							display: false,
						},
						ticks: {
							display: true,
						},
					},
					y: {
						min: -1.1,
						max: 1.1,
						display: false,
						grid: {
							display: true,
						},
						title: {
							display: false,
						},
						ticks: {
							display: true,
						},
					},
				},
			}}
		/>
	);
}

//ctx.width = ctx.offsetWidth;
//ctx.height = ctx.offsetHeight;
//let myChart = new Chart(ctx, {
//  type: 'scatter',
//});
//
//function updateData() {
//  let data = [];
//  for (let i = 0; i < 50; i++) {
//    data.push({
//      radius: 2 * Math.random() + 1,
//      angle: ((2 * Math.PI / 50) * i) + (Math.random() * (10 * Math.PI / 180))
//    })
//  }
//  myChart.data.datasets[0].data = data;
//  myChart.update();
//
//  setTimeout(updateData, 5000);
//}
//updateData();
