import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { leagueTableSelector } from '../state/ootball.state';

export const LeaguetableInner: React.FC = () => {
  const leagueTable = useRecoilValue(leagueTableSelector);

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
              <TableRow key={t.id} hover={true}>
                <TableCell>{t.position}</TableCell>
                <TableCell>
                  <Link to={`../fixtures/${t.id}`}>{t.name}</Link>
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
