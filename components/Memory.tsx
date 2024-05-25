import { useEffect, useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MemoryIcon from '@mui/icons-material/Memory';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SettingsCard, iconStyle, ActionButton } from 'components/settings/SettingsCard';
import { MemoryItem, useGlobalState } from 'lib/global';
import { getDateTime } from 'lib/locale';
import * as std from 'lib/spdIlluminants';
import { calcRefMeas } from 'lib/spd';

const recallModalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 425,
	p: 4,
};

const addModalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	p: 4,
};

function MemoryList({ sx = [] }: { sx?: SxProps<Theme> }) {
	const [memory, setMemory] = useGlobalState('memory');
	const [isClient, setIsClient] = useState(false);

	// Hack to avoid hydration errors.
	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<Paper sx={sx}>
			<List dense component="div" role="list">
				{!isClient
					? ''
					: memory.map((item: MemoryItem, i: number) => {
							const labelId = `list-item-${i}-label`;
							const toggle = () =>
								setMemory(
									memory.map((m: MemoryItem) =>
										m == item ? { ...m, recall: !(m.recall ?? false) } : m
									)
								);
							const deleteItem = () => setMemory(memory.filter((m: MemoryItem) => m != item));

							return (
								<ListItem
									key={i}
									secondaryAction={
										<IconButton edge="end" aria-label="delete" onClick={deleteItem}>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemIcon>
										<Checkbox
											checked={item.recall}
											tabIndex={-1}
											disableRipple
											inputProps={{
												'aria-labelledby': labelId,
											}}
											onClick={toggle}
										/>
									</ListItemIcon>
									<ListItemText id={labelId} primary={`${item.name}`} />
								</ListItem>
							);
						})}
			</List>
		</Paper>
	);
}

export default function Memory() {
	const [meas] = useGlobalState('res_lm_measurement');
	const [memory, setMemory] = useGlobalState('memory');
	const [name, setName] = useState<string>('');
	const handleSave = () =>
		setMemory([
			...memory,
			{
				name: name.length > 0 ? name : `${getDateTime(new Date())}: ${meas.CCT.toFixed(0)} K`,
				created: Date.now(),
				type: 'LM3',
				recall: false,
				meas,
			},
		]);
	const [openRecallModal, setOpenRecallModal] = useState(false);
	const handleOpen = () => setOpenRecallModal(true);
	const handleClose = () => {
		setOpenRecallModal(false);
	};

	return (
		<ButtonGroup variant="contained" disableElevation aria-label="Memory function">
			<TextField label="Name" variant="outlined" onChange={(e) => setName(e.currentTarget.value)} />
			<Button onClick={handleSave}>Save</Button>
			<Button onClick={handleOpen}>Recall</Button>
			<Modal
				open={openRecallModal}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={recallModalStyle}>
					<Card>
						<CardContent>
							<Typography gutterBottom variant="h5" component="div">
								Recall
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Select the measurement(s) to be recalled.
							</Typography>
							<MemoryList sx={{ width: 330, height: 300, overflow: 'auto' }} />
						</CardContent>
					</Card>
				</Box>
			</Modal>
		</ButtonGroup>
	);
}

const SPDs: {
	label: string;
	desc: string;
	SPD: number[] | ((CCT: number) => number[]);
}[] = [
	{ label: 'Planck', desc: 'Planckian locus.', SPD: std.SPDofPlanck },
	{
		label: 'A',
		desc: 'CIE standard illuminant A is intended to represent typical 2856 K tungsten-filament lighting.',
		SPD: std.SPDofA,
	},
	{ label: 'D', desc: 'CIE standard illuminant series D represents natural daylight locus.', SPD: std.SPDofD },
	{ label: 'D50', desc: 'CIE horizon light.', SPD: std.SPDofD(5000) },
	{ label: 'D55', desc: 'CIE mid-morning / mid-afternoon daylight.', SPD: std.SPDofD(5500) },
	{ label: 'D60', desc: '6000 K illuminant D', SPD: std.SPDofD(6000) },
	{ label: 'D65', desc: 'CIE noon daylight.', SPD: std.SPDofD(6500) },
	{ label: 'D75', desc: 'CIE North sky daylight.', SPD: std.SPDofD(7500) },
	{ label: 'D93', desc: 'high-efficiency blue phosphor monitors', SPD: std.SPDofD(9300) },
	{
		label: 'E',
		desc: 'Equal-energy radiator, an illuminant that gives equal weight to all wavelengths.',
		SPD: std.SPDofE,
	},
	{ label: 'FL1', desc: 'CIE 6430 K daylight fluorescent.', SPD: std.SPDofFL1 },
	{ label: 'FL2', desc: 'CIE 4230 K cool white fluorescent.', SPD: std.SPDofFL2 },
	{ label: 'FL3', desc: 'CIE 3450 K white fluorescent.', SPD: std.SPDofFL3 },
	{ label: 'FL4', desc: 'CIE 2940 K warm white fluorescent.', SPD: std.SPDofFL4 },
	{ label: 'FL5', desc: 'CIE 6350 K daylight fluorescent.', SPD: std.SPDofFL5 },
	{ label: 'FL6', desc: 'CIE 4150 K light white fluorescent.', SPD: std.SPDofFL6 },
	{ label: 'FL7', desc: 'CIE broadband D65 simulator.', SPD: std.SPDofFL7 },
	{ label: 'FL8', desc: 'CIE broadband D50 simulator.', SPD: std.SPDofFL8 },
	{ label: 'FL9', desc: 'CIE broadband 4150 K cool white deluxe fluorescent.', SPD: std.SPDofFL9 },
	{ label: 'FL10', desc: 'CIE 3-band 5000 K', SPD: std.SPDofFL10 },
	{ label: 'FL11', desc: 'CIE 3-band 4000 K', SPD: std.SPDofFL11 },
	{ label: 'FL12', desc: 'CIE 3-band 3000 K', SPD: std.SPDofFL12 },
	{ label: 'FL3.1', desc: 'CIE Standard halophosphate lamp', SPD: std.SPDofFL3_1 },
	{ label: 'FL3.2', desc: 'CIE Standard halophosphate lamp.', SPD: std.SPDofFL3_2 },
	{ label: 'FL3.3', desc: 'CIE Standard halophosphate lamp', SPD: std.SPDofFL3_3 },
	{ label: 'FL3.4', desc: 'CIE Standard DeLuxe type lamp', SPD: std.SPDofFL3_4 },
	{ label: 'FL3.5', desc: 'CIE Standard DeLuxe type lamp', SPD: std.SPDofFL3_5 },
	{ label: 'FL3.6', desc: 'CIE Standard DeLuxe type lamp', SPD: std.SPDofFL3_6 },
	{ label: 'FL3.7', desc: 'CIE 3 Band', SPD: std.SPDofFL3_7 },
	{ label: 'FL3.8', desc: 'CIE 3 Band', SPD: std.SPDofFL3_8 },
	{ label: 'FL3.9', desc: 'CIE 3 Band', SPD: std.SPDofFL3_9 },
	{ label: 'FL3.10', desc: 'CIE 3 Band', SPD: std.SPDofFL3_10 },
	{ label: 'FL3.11', desc: 'CIE 3 Band', SPD: std.SPDofFL3_11 },
	{ label: 'FL3.12', desc: 'CIE Multi Band', SPD: std.SPDofFL3_12 },
	{ label: 'FL3.13', desc: 'CIE Multi Band', SPD: std.SPDofFL3_13 },
	{ label: 'FL3.14', desc: 'CIE Multi Band', SPD: std.SPDofFL3_14 },
	{ label: 'FL3.15', desc: 'CIE Multi Band', SPD: std.SPDofFL3_15 },
	{ label: 'Xenon', desc: '6044 K', SPD: std.SPDofXenon },
	{ label: 'HMI 6002 K', desc: 'Hydrargyrum medium-arc iodide (HMI) lamp.', SPD: std.SPDofHMI1 },
	{ label: 'HMI 5630 K', desc: 'Hydrargyrum medium-arc iodide (HMI) lamp.', SPD: std.SPDofHMI2 },
	{ label: 'LED-B1', desc: '2733 K phosphor-converted blue.', SPD: std.SPDofLED_B1 },
	{ label: 'LED-B2', desc: '2998 K phosphor-converted blue.', SPD: std.SPDofLED_B2 },
	{ label: 'LED-B3', desc: '4103 K phosphor-converted blue.', SPD: std.SPDofLED_B3 },
	{ label: 'LED-B4', desc: '5109 K phosphor-converted blue.', SPD: std.SPDofLED_B4 },
	{ label: 'LED-B5', desc: '6598 K phosphor-converted blue.', SPD: std.SPDofLED_B5 },
	{ label: 'LED-BH1', desc: '2851 K mixing of phosphor-converted blue LED and red LED.', SPD: std.SPDofLED_BH1 },
	{ label: 'LED-RGB1', desc: '2840 K mixing of red, green, and blue LEDs.', SPD: std.SPDofLED_RGB1 },
	{ label: 'LED-V1', desc: '2724 K violet-pumped phosphor-type LEDs.', SPD: std.SPDofLED_V1 },
	{ label: 'LED-V2', desc: '4070 K violet-pumped phosphor-type LEDs.', SPD: std.SPDofLED_V2 },
];

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
	? ElementType
	: never;
function SelectReferenceIlluminant({ onAdd }: { onAdd: (label: string, spd: number[]) => void }) {
	const [selected, setSelected] = useState<ArrayElement<typeof SPDs>>();
	const [CCT, setCCT] = useState(6500);
	const handleAdd = () => {
		if (typeof selected.SPD === 'function') {
			onAdd(`${selected.label} ${CCT.toFixed(0)} K`, selected.SPD(CCT));
		} else {
			onAdd(selected.label, selected.SPD);
		}
	};

	return (
		<Box sx={addModalStyle}>
			<Card>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Add Illuminant
					</Typography>
					<Autocomplete
						autoSelect
						disablePortal
						disableClearable
						options={SPDs}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Name" />}
						onChange={(_event, value, _reason) => setSelected(value)}
					/>
					<TextField
						label="CCT"
						disabled={!selected || typeof selected.SPD !== 'function'}
						sx={{ m: 1, width: '15ch' }}
						InputProps={{
							endAdornment: <InputAdornment position="end">K</InputAdornment>,
						}}
						onChange={(e) => {
							const v = e.target.value;
							const num = Number(v);
							if (!Number.isNaN(num)) setCCT(num);
						}}
					/>
					<Box sx={{ height: '5ex' }}>
						<Typography variant="body2" color="text.secondary">
							{selected?.desc}
						</Typography>
					</Box>
				</CardContent>
				<CardActions>
					<Button disabled={!selected} onClick={handleAdd}>
						Add
					</Button>
				</CardActions>
			</Card>
		</Box>
	);
}

export function MemorySettings() {
	const [memory, setMemory] = useGlobalState('memory');
	const [openAddModal, setOpenAddModal] = useState(false);
	const handleOpen = () => setOpenAddModal(true);
	const handleClose = () => setOpenAddModal(false);
	const handleAdd = (label: string, spd: number[]) =>
		setMemory([
			...memory,
			{
				name: label,
				created: Date.now(),
				type: 'ref',
				recall: false,
				meas: calcRefMeas(spd),
			},
		]);

	return (
		<SettingsCard
			icon={<MemoryIcon sx={iconStyle} />}
			title="Memory"
			actions={
				<CardActions>
					<ActionButton onClick={handleOpen}>Add Illuminant</ActionButton>
				</CardActions>
			}
		>
			<MemoryList sx={{ overflow: 'auto', height: '10em' }} />
			<Modal
				open={openAddModal}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<SelectReferenceIlluminant onAdd={handleAdd} />
			</Modal>
		</SettingsCard>
	);
}
