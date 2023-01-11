import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { matchSelector } from '../state/ootball.state';

export const MatchInner: React.FC<{ matchId: number }> = ({ matchId }) => {
  const match = useRecoilValue(matchSelector(matchId));
  const navigate = useNavigate();

  return match ? (
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
      <div className="match">
        <div>
          <div>
            {match['home-team'].name} {match['home-team'].score}
          </div>
          <div>
            {match['home-team']?.goals?.map((g) => g.description)} &nbsp;
          </div>
          <div>
            {match['home-team']['line-up'].map((g) => (
              <span key={g.shirt}>
                {g.shirt} - {g.player['first-name']} {g.player['last-name']}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div>
            {match['away-team'].score} {match['away-team'].name}
          </div>
          <div>
            {match['away-team'].goals?.map((g) => g.description)} &nbsp;
          </div>
          <div>
            {match['away-team']['line-up'].map((g) => (
              <span key={g.shirt}>
                {g.shirt} - {g.player['first-name']} {g.player['last-name']}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading!</div>
  );
};

export default MatchInner;
