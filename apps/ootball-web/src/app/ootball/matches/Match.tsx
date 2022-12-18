import React from 'react';
import { matchTestData } from './matches.data';

export const Match: React.FC = () => {
  const match = matchTestData['match'];

  return (
    <div className="match">
      <div>
        <div>{match['home-team'].goals.map((g) => g.description)}</div>
        <div>
          {match['home-team']['line-up'].map((g) => (
            <span key={g.shirt}>
              {g.shirt} - {g.player['first-name']} {g.player['last-name']}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div>{match['away-team'].goals.map((g) => g.description)}</div>
        <div>
          {match['away-team']['line-up'].map((g) => (
            <span key={g.shirt}>
              {g.shirt} - {g.player['first-name']} {g.player['last-name']}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Match;
