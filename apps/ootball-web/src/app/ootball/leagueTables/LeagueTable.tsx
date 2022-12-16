import React, { useCallback, useState } from 'react';
import { useFetch, useOnceCall } from '../../hooks';
import { CompetitionRes } from '../competitions/competitions.models';
import { LeagueTable, LeagueTableRes } from './leagueTable.models';

interface OwnProps {
  onTeamClick: (teamId: number) => void;
}

export const Leaguetable: React.FC<OwnProps> = ({ onTeamClick }) => {
  const [league, setLeague] = useState<LeagueTable>();
  const [competitions, setCompetitions] = useState<
    CompetitionRes['competitions']
  >([]);
  const fetch = useFetch('http://localhost:3005/dev/');

  const onSelectLeague = useCallback(
    async (compId: number) => {
      const res = await fetch.get<LeagueTableRes>(
        `league-table.json?comp=${compId}`
      );
      setLeague(res['league-table']);
    },
    [fetch]
  );

  useOnceCall(() => {
    (async () => {
      const res = await fetch.get<CompetitionRes>('competitions.json');
      setCompetitions(res.competitions);
    })();
  });

  return (
    <>
      <div className="competitions">
        {competitions.slice(0, 20).map((c) => (
          <span key={c.id} onClick={() => onSelectLeague(c.id)}>
            {c['generic-name']}
          </span>
        ))}
      </div>
      {league ? (
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
                <tr key={t.id} onClick={() => onTeamClick(t.id)}>
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
        </>
      ) : (
        <div>Select a League</div>
      )}
      <div />
    </>
  );
};

export default Leaguetable;
