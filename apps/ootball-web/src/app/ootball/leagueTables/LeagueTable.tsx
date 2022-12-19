import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { useStateContext } from '../state/ootball.state';

export const Leaguetable: React.FC = () => {
  const { leagueTable, dispatch } = useStateContext();

  return leagueTable ? (
    <>
      <h1>{leagueTable.competition.name}</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: '100%' }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Played</TableCell>
              <TableCell>Won</TableCell>
              <TableCell>Drawn</TableCell>
              <TableCell>Lost</TableCell>
              <TableCell>For</TableCell>
              <TableCell>Against</TableCell>
              <TableCell>Diff</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leagueTable.teams.map((t) => (
              <TableRow
                key={t.id}
                onClick={() =>
                  dispatch(`fixtures-results.json?team=${t.id}`, 'games')
                }
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                }}
                hover={true}
              >
                <TableCell>{t.position}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t['all-matches'].played}</TableCell>
                <TableCell>{t['all-matches'].won}</TableCell>
                <TableCell>{t['all-matches'].drawn}</TableCell>
                <TableCell>{t['all-matches'].lost}</TableCell>
                <TableCell>{t['all-matches'].for}</TableCell>
                <TableCell>{t['all-matches'].against}</TableCell>
                <TableCell>{t['all-matches']['goal-difference']}</TableCell>
                <TableCell>{t['total-points']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <div>Select a League</div>
  );
};

export default Leaguetable;
