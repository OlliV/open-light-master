import TextField from '@mui/material/TextField';

export default function Duv({ value }: { value: number }) {
	// "The concept of correlated color temperature should not be used if the
	// chromaticity of the test source differs more than Δuv = 5×10-2 from the
	// Planckian radiator."
	// Schanda, János (2007). "3: CIE Colorimetry".
	// Colorimetry: Understanding the CIE System.
	const duvErr = Math.abs(value) > 5e-2;

	return (
		<TextField
			label="Duv"
			disabled
			sx={{ m: 1, width: '10ch' }}
			variant="outlined"
			error={duvErr}
			value={`${value.toFixed(3)}`}
			helperText={(duvErr && 'Invalid CCT?') || <>&nbsp;</>}
		/>
	);
}
