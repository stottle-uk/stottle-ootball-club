import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Loader from '../../patterns/Suspense';
import { gamesIdState, gamesSelector } from '../state/ootball.state';
import FixturesInner from './FixturesInner';

export const Fixtures: React.FC = () => {
  const params = useParams();
  const setGameId = useSetRecoilState(gamesIdState);

  useEffect(() => {
    if (params.teamId) {
      setGameId(+params.teamId);
    }
  }, [params, setGameId]);

  return (
    <Loader selector={gamesSelector}>
      <FixturesInner />
    </Loader>
  );
};

export default Fixtures;
