import React from 'react';
import { northernPremierMidlandsData } from './leagueTable.data';

export const Leaguetable: React.FC = () => {
  const league = northernPremierMidlandsData['league-table'];

  return (
    <>
      <h1>{league.competition.name}</h1>

      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Played</th>
            <th>Won</th>
            <th>Drawn</th>
            <th>Lost</th>
            <th>For</th>
            <th>Against</th>
            <th>Diff</th>
            <th>Points</th>
          </tr>
          {league.teams.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t['all-matches'].played}</td>
              <td>{t['all-matches'].won}</td>
              <td>{t['all-matches'].drawn}</td>
              <td>{t['all-matches'].lost}</td>
              <td>{t['all-matches'].for}</td>
              <td>{t['all-matches'].against}</td>
              <td>{t['all-matches']['goal-difference']}</td>
              <td>{t['total-points']}</td>
              {/* <td>
              <pre>{JSON.stringify(t, undefined, 2)}</pre>
            </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <div />
    </>
  );
};

export default Leaguetable;
