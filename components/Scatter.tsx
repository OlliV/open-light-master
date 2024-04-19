import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, Title } from 'chart.js';
import Datalabels from 'chartjs-plugin-datalabels';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, Title, Datalabels);

export default Scatter;
