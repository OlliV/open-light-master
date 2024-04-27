import { useEffect, useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
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

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
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
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Recall
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Select the measurement(s) to be recalled.
					</Typography>
					<MemoryList sx={{ width: 330, height: 300, overflow: 'auto' }} />
				</Box>
			</Modal>
		</ButtonGroup>
	);
}

const SPDs = [
	{ label: 'Planck', SPD: std.SPDofPlanck },
	{ label: 'D', SPD: std.SPDofD },
	{ label: 'D50', SPD: std.SPDofD(5000) },
	{ label: 'D55', SPD: std.SPDofD(5500) },
	{ label: 'D60', SPD: std.SPDofD(6000) },
	{ label: 'D65', SPD: std.SPDofD(6500) },
	{ label: 'D93', SPD: std.SPDofD(9300) },
	{ label: 'FL1', SPD: std.SPDofFL1 },
	{ label: 'FL2', SPD: std.SPDofFL2 },
	{ label: 'FL3', SPD: std.SPDofFL3 },
	{ label: 'FL4', SPD: std.SPDofFL4 },
	{ label: 'FL5', SPD: std.SPDofFL5 },
	{ label: 'FL6', SPD: std.SPDofFL6 },
	{ label: 'FL7', SPD: std.SPDofFL7 },
	{ label: 'FL8', SPD: std.SPDofFL8 },
	{ label: 'FL9', SPD: std.SPDofFL9 },
	{ label: 'FL10', SPD: std.SPDofFL10 },
	{ label: 'FL11', SPD: std.SPDofFL11 },
	{ label: 'FL12', SPD: std.SPDofFL12 },
];

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
	? ElementType
	: never;
function SelectReferenceIlluminant({ onAdd }: { onAdd: (label: string, value: number[]) => void }) {
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
		<Box>
			<Box>
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
			</Box>
			<Button disabled={!selected} onClick={handleAdd}>
				Add
			</Button>
		</Box>
	);
}

export function MemorySettings() {
	const [memory, setMemory] = useGlobalState('memory');
	const [openAddModal, setOpenAddModal] = useState(false);
	const handleOpen = () => setOpenAddModal(true);
	const handleClose = () => setOpenAddModal(false);
	const handleAdd = (label: string, value: number[]) =>
		setMemory([
			...memory,
			{
				name: label,
				created: Date.now(),
				type: 'ref',
				recall: false,
				meas: calcRefMeas(value),
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
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Add Illuminant
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Here you can add a reference illuminant to the memory.
					</Typography>
					<SelectReferenceIlluminant onAdd={handleAdd} />
				</Box>
			</Modal>
		</SettingsCard>
	);
}
