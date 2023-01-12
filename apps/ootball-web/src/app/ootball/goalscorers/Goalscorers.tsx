import Box from '@mui/material/Box';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { goalscorersSelector } from '../state/ootball.state';

export const Goalscorers: React.FC<{ teamId: number }> = ({ teamId }) => {
  const goalscorers = useRecoilValue(goalscorersSelector(teamId));

  return !goalscorers ? null : (
    <Box>
      {goalscorers.players
        .slice(0)
        .sort((a, b) => b.goals.length - a.goals.length)
        .map((p) => (
          <div key={p.id}>
            {p['first-name']} {p['last-name']} {p.goals.length}
          </div>
        ))}
    </Box>
  );
};

export default Goalscorers;
