import { Chart as ChartJS, LinearScale, BarElement, Tooltip, Legend, Filler, Title, CategoryScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(LinearScale, BarElement, Tooltip, Legend, Filler, Title, CategoryScale);

export default Bar;
