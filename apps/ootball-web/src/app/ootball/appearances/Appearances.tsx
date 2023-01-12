import Box from '@mui/material/Box';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { appearancesSelector } from '../state/ootball.state';

export const Appearances: React.FC<{ teamId: number }> = ({ teamId }) => {
  const appearances = useRecoilValue(appearancesSelector(teamId));

  return !appearances ? null : (
    <Box>
      {appearances.players
        .slice(0)
        .sort((a, b) => b.appearances.length - a.appearances.length)
        .map((p) => (
          <div key={p.id}>
            {p['first-name']} {p['last-name']} {p.appearances.length}
          </div>
        ))}
    </Box>
  );
};

export default Appearances;
