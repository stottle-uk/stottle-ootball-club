import React from 'react';
import { useOnceCall } from '../../hooks';
import { useStateContext } from '../state/ootball.state';

export const Leaguetable: React.FC = () => {
  const { competitions, leagueTable, dispatch } = useStateContext();

  useOnceCall(() => {
    dispatch('competitions.json', 'competitions');
  }, competitions && !competitions.length);

  return (
    <>
      <div className="competitions">
        {(competitions || []).slice(0, 20).map((c) => (
          <span
            key={c.id}
            onClick={() =>
              dispatch(`league-table.json?comp=${c.id}`, 'leagueTable')
            }
          >
            {c['generic-name']}
          </span>
        ))}
      </div>
      {leagueTable ? (
        <>
          <h1>{leagueTable.competition.name}</h1>
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
              {leagueTable.teams.map((t) => (
                <tr
                  key={t.id}
                  onClick={() =>
                    dispatch(`fixtures-results.json?team=${t.id}`, 'games')
                  }
                >
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
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div>Select a League</div>
      )}
      <div />
    </>
  );
};

export default Leaguetable;
