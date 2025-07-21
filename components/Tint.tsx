import TextField from '@mui/material/TextField';

export default function Tint({ value }: { value: number }) {
	return (
		<TextField
			label="Tint"
			disabled
			sx={{ m: 1, width: '10ch' }}
			value={`${Math.round(value)}`}
		/>
	);
}
