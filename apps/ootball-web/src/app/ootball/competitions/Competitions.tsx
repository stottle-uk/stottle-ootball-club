import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import React from 'react';
import { useOnceCall } from '../../hooks';
import { useStateContext } from '../state/ootball.state';

export const Competitions: React.FC = () => {
  const { competitions, leagueTable, dispatch } = useStateContext();

  useOnceCall(() => {
    dispatch('competitions.json', 'competitions');
  }, competitions && !competitions.length);

  return (
    <Box className="competitions" display={'flex'} flexWrap={'wrap'}>
      {(competitions || []).slice(0, 20).map((c) => (
        <Box
          variant="outlined"
          display={'flex'}
          component={Button}
          flex={'20%'}
          textAlign={'center'}
          alignItems={'center'}
          justifyContent={'center'}
          padding={'4px'}
          margin={'4px'}
          height={'60px'}
          sx={{
            backgroundColor:
              leagueTable?.competition.id === c.id ? '#ccc' : 'inherit',
          }}
          key={c.id}
          onClick={() =>
            dispatch(`league-table.json?comp=${c.id}`, 'leagueTable')
          }
        >
          {c['generic-name']}
        </Box>
      ))}
    </Box>
  );
};

export default Competitions;
