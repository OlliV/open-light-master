import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function CCT({ value }: { value: number }) {
	return (
		<TextField
			label="CCT"
			disabled
			sx={{ m: 1, width: '15ch' }}
			value={`${Math.round(value)}`}
			InputProps={{
				endAdornment: <InputAdornment position="end">K</InputAdornment>,
			}}
		/>
	);
}
