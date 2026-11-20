import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export default function CCT({ value }: { value: number }) {
	return (
		<TextField
			label="CCT"
			disabled
			sx={{ m: 1, width: '15ch' }}
			value={`${Math.round(value)}`}
			slotProps={{
				input: {
					endAdornment: <InputAdornment position="end">K</InputAdornment>,
				},
			}}
		/>
	);
}
