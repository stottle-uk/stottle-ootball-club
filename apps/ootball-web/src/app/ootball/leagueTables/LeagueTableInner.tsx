import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { leagueTablesSelector } from '../state/ootball.state';

export const LeaguetableInner: React.FC<{ compId: number }> = ({ compId }) => {
  const leagueTable = useRecoilValue(leagueTablesSelector(compId));

  return leagueTable ? (
    <>
      <Box component={'h1'} display={'flex'}>
        <Button
          component={RouterLink}
          to="../"
          variant="outlined"
          color="primary"
          sx={{ marginRight: '16px' }}
        >
          <ArrowBackIosNewIcon />
        </Button>
        {leagueTable.competition.name}
      </Box>

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
              <TableRow key={t.id} hover={true}>
                <TableCell>{t.position}</TableCell>
                <TableCell>
                  <RouterLink to={`../fixtures/${t.id}`}>{t.name}</RouterLink>
                </TableCell>
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

export default LeaguetableInner;
