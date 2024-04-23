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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import Datalabels from 'chartjs-plugin-datalabels';
import Annotation from 'chartjs-plugin-annotation';

ChartJS.register(
	Annotation,
	BarElement,
	CategoryScale,
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

function pointRotationAuto(ctx, C: number) {
	const i = ctx.dataIndex;
	const { data } = ctx.dataset;
	const point1 = data[i];
	const point2 = i >= data.length - 1 && i > 0 ? data[i - 1] : i > 0 && data.length > 0 ? data[i + 1] : point1;
	if (point1 == point2) {
		return 0;
	}
	return (180 / Math.PI) * Math.atan(Math.abs((point2.y - point1.y) / (point2.x, -point2.y))) + C;
}

export { Bar, Line, Scatter, pointRotationAuto };
