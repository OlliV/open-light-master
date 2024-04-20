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

export { Bar, Line, Scatter };
