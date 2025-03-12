import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import CCT from 'components/CCT';
import Container from '@mui/material/Container';
import Duv from 'components/Duv';
import Memory from 'components/Memory';
import MyHead from 'components/MyHead';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Title from 'components/Title';
import wlMap from 'lib/wlmap';
import { interpolateSPD } from 'lib/spd';
import { lm3NormSPD } from 'lib/lm3calc';
import { makeMatrix } from 'lib/matrix';
import { normalize2 } from 'lib/vector';
import { ssi } from 'lib/ssi';
import { useGlobalState, useMemoryRecall } from 'lib/global';

function Matrix({ head, m }: { head: string[]; m: number[][] }) {
	const cellStyle = { borderWidth: 1, borderStyle: 'solid', borderColor: 'black' };
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow sx={cellStyle}>
						<TableCell sx={cellStyle} />
						{head.map((col, i) => (
							<TableCell key={i} sx={cellStyle}>
								{col}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{m.map((row, i) => (
						<TableRow key={i} sx={cellStyle}>
							<TableCell variant="head" sx={cellStyle}>
								{head[i]}
							</TableCell>
							{row.map((col, j) => (
								<TableCell key={j} sx={cellStyle}>{`${col}`}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default function Text() {
	const [isClient, setIsClient] = useState(false);
	const [meas] = useGlobalState('res_lm_measurement');
	const measSpd = interpolateSPD(lm3NormSPD(meas));
	const recall = useMemoryRecall();
	const recallSpd = useMemo<{ name: string; spd: readonly { l: number; v: number }[] }[]>(() => {
		return recall
			.filter((m) => ['ref', 'LM3'].includes(m.type))
			.map(({ name, type, meas }) => {
				if (type === 'ref') {
					// @ts-ignore
					const norm = normalize2(meas.SPD);
					const lv = wlMap((l, i) => ({ l, v: norm[i] }));

					return { name, spd: lv };
				} else if (type === 'LM3') {
					// @ts-ignore
					return { name, spd: lm3NormSPD(meas) };
				}
			});
	}, [recall]);
	const [head, SSImat] = useMemo<[string[], number[][]]>(() => {
		const allSpd = [{ name: 'current', spd: measSpd }, ...recallSpd];
		const mat = makeMatrix(allSpd.length, allSpd.length);

		for (let i = 0; i < mat.length; i++) {
			for (let j = 0; j < mat.length; j++) {
				mat[i][j] = ssi(allSpd[i].spd, allSpd[j].spd);
			}
		}

		return [allSpd.map((m) => m.name), mat];
	}, [measSpd, recallSpd]);
	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<Container maxWidth="md">
			<MyHead />
			<Box position="relative" sx={{ flexGrow: 1 }}>
				<Title>OLM - SSI</Title>
				<Paper sx={{ padding: 2 }}>
					<Box>
						<CCT value={meas.CCT} />
						<Duv value={meas.Duv} />
						<TextField
							label="Tint"
							disabled
							sx={{ m: 1, width: '15ch' }}
							value={`${Math.round(meas.tint)}`}
						/>
						<Box sx={{ float: 'right', paddingTop: 1, paddingRight: 1 }}>
							<Memory />
						</Box>
						<Matrix head={isClient ? head : []} m={isClient ? SSImat : [[]]} />
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
