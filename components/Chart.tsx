import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	Filler,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	RadialLinearScale,
	Title,
	Tooltip,
	ScriptableContext,
	ScriptableScaleContext,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import Datalabels from 'chartjs-plugin-datalabels';
import Annotation from 'chartjs-plugin-annotation';

const customCanvasBackgroundColor = {
	id: 'customCanvasBackgroundColor',
	beforeDraw: (chart, args, options) => {
		const { ctx } = chart;
		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		ctx.fillStyle = options.color || 'rgb(255,255,255)';
		ctx.fillRect(0, 0, chart.width, chart.height);
		ctx.restore();
	},
};

function pointRotationAuto(ctx: ScriptableContext<'line'>, C: number) {
	const i = ctx.dataIndex;
	const { data } = ctx.dataset;
	const point1 = data[i];
	const point2 = i >= data.length - 1 && i > 0 ? data[i - 1] : i > 0 && data.length > 0 ? data[i + 1] : point1;
	if (point1 === point2 || typeof point1 === 'number' || typeof point2 === 'number') {
		return 0;
	}
	return (180 / Math.PI) * Math.atan(Math.abs((point2.y - point1.y) / (point2.x, -point2.y))) + C;
}

function gridColorAuto({ tick }: ScriptableScaleContext) {
	return tick.value === 0 ? 'black' : 'lightgrey';
}

function makeChartTitle(title: string): {
	display: boolean;
	text: string;
	position: 'bottom';
	padding: { top: number };
} {
	return {
		display: true,
		text: title,
		position: 'bottom',
		padding: {
			top: -10, // This fixes the aspect ratio shift
		},
	};
}

ChartJS.register(
	Annotation,
	BarElement,
	CategoryScale,
	customCanvasBackgroundColor,
	Datalabels,
	Filler,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	RadialLinearScale,
	Title,
	Tooltip
);

export { Bar, Line, Scatter, pointRotationAuto, gridColorAuto, makeChartTitle };
