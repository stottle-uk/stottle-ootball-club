import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { competitionsSelector } from '../state/ootball.state';

export const CompetitionsInner: React.FC = () => {
  const competitions = useRecoilValue(competitionsSelector);

  return (
    <Box className="competitions" display={'flex'} flexWrap={'wrap'}>
      {(competitions || [])
        .filter((c) => c.type === 'league')
        .map((c) => (
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
          >
            {c['generic-name']}
          </Button>
        ))}
    </Box>
  );
};

export default CompetitionsInner;
