import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Children, type ReactNode, useState } from 'react';

const navWrapperSx = {
	position: 'absolute',
	top: 0,
	height: '100%',
	zIndex: 1,
	display: 'flex',
	alignItems: 'center',
	'&:hover button': {
		backgroundColor: 'black',
		filter: 'brightness(120%)',
		opacity: 0.4,
	},
} as const;

const navButtonSx = {
	margin: '0 10px',
	backgroundColor: '#494949',
	color: 'white',
	transition: '200ms',
	opacity: 0,
	'&:hover': {
		backgroundColor: '#494949',
		opacity: '0.6 !important',
	},
} as const;

/**
 * A minimal sliding carousel with prev/next buttons (shown on hover) and
 * indicator dots. Replaces react-material-ui-carousel, which is unmaintained
 * and only supports MUI 5 and React <= 18.
 */
export default function Carousel({ children }: { children: ReactNode }) {
	const slides = Children.toArray(children);
	const [active, setActive] = useState(0);
	const n = slides.length;
	const go = (i: number) => setActive(((i % n) + n) % n);

	return (
		<Box>
			<Box sx={{ position: 'relative', overflow: 'hidden' }}>
				<Box
					sx={{
						display: 'flex',
						transform: `translateX(-${active * 100}%)`,
						transition: 'transform 500ms ease-in-out',
					}}
				>
					{slides.map((slide, i) => (
						<Box key={i} sx={{ flex: '0 0 100%', minWidth: 0 }} aria-hidden={i !== active}>
							{slide}
						</Box>
					))}
				</Box>
				{n > 1 && (
					<>
						<Box sx={{ ...navWrapperSx, left: 0 }}>
							<IconButton aria-label="Previous" sx={navButtonSx} onClick={() => go(active - 1)}>
								<NavigateBeforeIcon fontSize="inherit" />
							</IconButton>
						</Box>
						<Box sx={{ ...navWrapperSx, right: 0 }}>
							<IconButton aria-label="Next" sx={navButtonSx} onClick={() => go(active + 1)}>
								<NavigateNextIcon fontSize="inherit" />
							</IconButton>
						</Box>
					</>
				)}
			</Box>
			{n > 1 && (
				<Box sx={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>
					{slides.map((_, i) => (
						<IconButton
							key={i}
							aria-label={`Slide ${i + 1}`}
							onClick={() => go(i)}
							sx={{
								padding: 0,
								transition: '200ms',
								color: i === active ? '#494949' : '#afafaf',
								'&:hover': { color: i === active ? '#494949' : '#1f1f1f' },
							}}
						>
							<FiberManualRecordIcon sx={{ fontSize: '15px' }} />
						</IconButton>
					))}
				</Box>
			)}
		</Box>
	);
}
