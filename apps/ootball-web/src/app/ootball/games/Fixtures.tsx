import Box from '@mui/material/Box';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { gamesSelector } from '../state/ootball.state';

export const Fixtures: React.FC<{ teamId: number }> = ({ teamId }) => {
  const games = useRecoilValue(gamesSelector(teamId));

  return !games ? (
    <span>Select a Team</span>
  ) : (
    <div className="fixtures">
      <Box component={'h1'} display={'flex'}>
        {games.team.name} ({games.team.id})
      </Box>

      <table>
        <tbody>
          {games.matches.map((g) => (
            <React.Fragment key={g.id}>
              <tr className="header">
                <td colSpan={2}>
                  <div>
                    {`${g.round ? ` (${g.round.name})` : ''} `}
                    <RouterLink to={`/competition/${g.competition.id}`}>
                      {g.competition.name}
                    </RouterLink>
                  </div>
                </td>
                <td colSpan={2}>
                  <div>
                    <RouterLink to={`/match/${g.id}`}>
                      {new Date(g.date).toDateString()} {g.time}
                    </RouterLink>
                  </div>
                </td>
              </tr>
              <tr className="info">
                <td colSpan={4}>
                  <div>{g.referee}</div>
                </td>
              </tr>

              <tr className="game">
                <td>{g['home-team'].name}</td>
                <td>
                  <div>
                    {new Date(g.date).getTime() < new Date().getTime()
                      ? g['home-team'].score
                      : '-'}
                  </div>
                </td>
                <td>
                  <div>
                    {new Date(g.date).getTime() < new Date().getTime()
                      ? g['away-team'].score
                      : '-'}
                  </div>
                </td>
                <td>{g['away-team'].name}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Fixtures;
