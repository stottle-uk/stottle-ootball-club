import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';
import { Link } from 'react-router-dom';
import { useOnceCall } from '../../hooks';
import { useStateContext } from '../state/ootball.state';

export const Competitions: React.FC = () => {
  const { competitions, dispatch } = useStateContext();

  useOnceCall(() => {
    dispatch('competitions.json', 'competitions');
  }, competitions && !competitions.length);

  return (
    <Box className="competitions" display={'flex'} flexWrap={'wrap'}>
      {(competitions || []).map((c) => (
        <Button
          variant="outlined"
          to={`./competition/${c.id}`}
          component={Link}
          sx={{
            flex: '20%',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            margin: '4px',
            height: '60px',
          }}
          key={c.id}
          onClick={() =>
            dispatch(`league-table.json?comp=${c.id}`, 'leagueTable')
          }
        >
          {c['generic-name']}
        </Button>
      ))}
    </Box>
  );
};

export default Competitions;
