import React from 'react';
import { useRecoilValue } from 'recoil';
import { teamSelector } from '../state/ootball.state';

export const TeamDetails: React.FC<{ teamId: number }> = ({ teamId }) => {
  const team = useRecoilValue(teamSelector(teamId));

  return !team ? null : (
    <div>
      <div>{team.name}</div>
      <div>
        {team.ground} ({team.capacity})
      </div>
    </div>
  );
};

export default TeamDetails;
