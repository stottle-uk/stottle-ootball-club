import React from 'react';
import { useRecoilCallback } from 'recoil';
import { useFetch, useOnceCall } from '../../hooks';
import { competitionsState } from '../state/ootball.state';
import { CompetitionRes } from './competitions.models';
import CompetitionsInner from './CompetitionsInner';

export const Competitions: React.FC = () => {
  const { get } = useFetch();

  const getItems = useRecoilCallback(({ snapshot, set }) => async () => {
    const state = await snapshot.getPromise(competitionsState);

    if (!state.length) {
      const competitions = await get<CompetitionRes>(`/competitions.json`);
      set(competitionsState, competitions.competitions);
    }
  });

  useOnceCall(getItems);

  return <CompetitionsInner />;
};

export default Competitions;
