import React from 'react';
import { useRecoilValue } from 'recoil';
import { gamesSelector } from '../state/ootball.state';

export const FixturesInner: React.FC = () => {
  const games = useRecoilValue(gamesSelector);

  return !games ? (
    <span>Select a Team</span>
  ) : (
    <div className="fixtures">
      <h1>
        {games.team.name} ({games.team.id})
      </h1>

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
                    {`${g.competition.name} ${
                      g.round ? `(${g.round.name})` : ''
                    }`}
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
