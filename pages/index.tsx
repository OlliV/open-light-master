import Link from 'next/link';
import Box from '@mui/system/Box';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ContrastIcon from '@mui/icons-material/Contrast';
import DataArrayIcon from '@mui/icons-material/DataArray';
import DifferenceIcon from '@mui/icons-material/Difference';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ExposureIcon from '@mui/icons-material/Exposure';
import FluorescentIcon from '@mui/icons-material/Fluorescent';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import MyHead from '../components/MyHead';
import Title from '../components/Title';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	margin: 4,
	padding: theme.spacing(2),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	width: 100,
	height: 100,
}));

function MenuItem({ href, children }) {
	return (
		<Link href={href}>
			<Item>{children}</Item>
		</Link>
	);
}

export default function Home() {
	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title disableBack>OLM</Title>
				<br />
				<Grid
					container
					spacing={{ xs: 2, md: 3 }}
					columns={{ xs: 4, sm: 8, md: 12 }}
					alignItems="center"
					justifyContent="center"
				>
					<MenuItem href="/exposure">
						Exposure <br />
						<ExposureIcon />
					</MenuItem>
					<MenuItem href="/wb">
						WB <br />
						<WbIncandescentIcon />
					</MenuItem>
					<MenuItem href="/cri">
						CRI <br />
						<TipsAndUpdatesIcon />
					</MenuItem>
					<MenuItem href="/color">
						Color <br />
						<ContrastIcon />
					</MenuItem>
					<MenuItem href="/spectrum">
						Spectrum <br />
						<EqualizerIcon />
					</MenuItem>
					<MenuItem href="/ssi">
						SSI <br />
						<DifferenceIcon />
					</MenuItem>
					<MenuItem href="/text">
						Text <br />
						<DataArrayIcon />
					</MenuItem>
					<MenuItem href="/flicker">
						Flicker <br />
						<FluorescentIcon />
					</MenuItem>
				</Grid>
			</Box>
		</Container>
	);
}
