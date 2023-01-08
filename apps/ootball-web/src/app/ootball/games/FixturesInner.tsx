import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { gamesSelector } from '../state/ootball.state';

export const FixturesInner: React.FC = () => {
  const games = useRecoilValue(gamesSelector);
  const navigate = useNavigate();

  return !games ? (
    <span>Select a Team</span>
  ) : (
    <div className="fixtures">
      <Box component={'h1'} display={'flex'}>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          color="primary"
          sx={{ marginRight: '16px' }}
        >
          <ArrowBackIosNewIcon />
        </Button>
        {games.team.name} ({games.team.id})
      </Box>

      <table>
        <tbody>
          {games.matches.map((g) => (
            <React.Fragment key={g.id}>
              <tr className="header">
                <td colSpan={5}>
                  <div>
                    {g.date} {g.time}
                  </div>
                  <div>
                    <RouterLink to={`/competition/${g.competition.id}`}>
                      {g.competition.name}
                    </RouterLink>
                    {`${g.round ? ` (${g.round.name})` : ''}`}
                  </div>
                </td>
              </tr>
              <tr className="info">
                <td colSpan={5}>
                  <div>{g.venue}</div>
                  <div>{g.referee}</div>
                  <div>{g.attendance}</div>
                </td>
              </tr>
              <tr className="game">
                <td>{g['home-team'].name}</td>
                <td>
                  <div>{g['home-team'].score}</div>
                </td>
                <td>
                  <div>{g['away-team'].score}</div>
                </td>
                <td>{g['away-team'].name}</td>
              </tr>
              {/* <tr className="match">
                <td colSpan={3}>
                  <Match />
                </td>
              </tr> */}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FixturesInner;
