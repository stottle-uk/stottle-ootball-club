import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Appearances from '../appearances/Appearances';
import Fixtures from '../games/Fixtures';
import Goalscorers from '../goalscorers/Goalscorers';
import TeamDetails from '../teams/TeamDetails';

export const TeamInner: React.FC<{ teamId: number }> = ({ teamId }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Box component={'h1'} display={'flex'}>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          color="primary"
          sx={{ marginRight: '16px' }}
        >
          <ArrowBackIosNewIcon />
        </Button>
      </Box>

      <hr />

      <Box display={'flex'} flexDirection={'row'}>
        <Box flexGrow={1} marginRight={'24px'}>
          <Fixtures teamId={teamId} />
        </Box>
        <Box>
          <TeamDetails teamId={teamId} />
          <hr />
          <Goalscorers teamId={teamId} />
          <hr />
          <Appearances teamId={teamId} />
        </Box>
      </Box>
    </div>
  );
};

export default TeamInner;
