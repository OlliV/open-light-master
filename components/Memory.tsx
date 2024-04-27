import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton, ListItem} from '@mui/material';
import Typography from '@mui/material/Typography';
import { MemoryItem, useGlobalState } from '../lib/global';
import {getDateTime} from '../lib/locale';

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

function MemoryList() {
	const [memory, setMemory] = useGlobalState('memory');

	return (
		<Paper sx={{ width: 330, height: 300, overflow: 'auto' }}>
			<List dense component="div" role="list">
				{memory.map((item: MemoryItem, i: number) => {
					const labelId = `list-item-${i}-label`;
					const toggle = () =>
						setMemory(
							memory.map((m: MemoryItem) => (m == item ? { ...m, recall: !(m.recall ?? false) } : m))
						);
					const deleteItem = () =>
						setMemory(memory.filter((m: MemoryItem) => m != item));

					return (
						<ListItem key={i}
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
		setMemory([...memory, { name: name.length > 0 ? name : `${getDateTime(new Date())}: ${meas.CCT.toFixed(0)} K`, created: Date.now(), type: 'LM3', recall: false, meas }]);
	const [openRecallModal, setOpenRecallModal] = useState(false);
	const handleOpen = () => setOpenRecallModal(true);
	const handleClose = () => {
		setOpenRecallModal(false);
	};

	// TODO Save modal

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
					<MemoryList />
				</Box>
			</Modal>
		</ButtonGroup>
	);
}
