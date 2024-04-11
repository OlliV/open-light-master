import Box from '@mui/system/Box';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MyHead from '../components/MyHead';
import Title from '../components/Title';
import Link from 'next/link';

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
				<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="flex-start">
					<MenuItem href="/exposure">Exposure</MenuItem>
					<MenuItem href="/text">Text</MenuItem>
					<MenuItem href="/cri">CRI</MenuItem>
				</Grid>
			</Box>
		</Container>
	);
}
