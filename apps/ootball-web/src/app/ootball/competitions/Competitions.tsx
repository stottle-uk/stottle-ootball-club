import React from 'react';
import { useRecoilCallback } from 'recoil';
import { useOnceCall } from '../../hooks';
import { appInitState, http } from '../state/ootball.state';
import { CompetitionRes } from './competitions.models';
import CompetitionsInner from './CompetitionsInner';

export const Competitions: React.FC = () => {
  const getItems = useRecoilCallback(({ snapshot, set }) => async () => {
    const state = await snapshot.getPromise(appInitState);

    if (!state.competitions) {
      const competitions = await http.get<CompetitionRes>(`/competitions.json`);
      set(appInitState, (oldAppState) => ({ ...oldAppState, competitions }));
    }
  });

  useOnceCall(getItems);

  return <CompetitionsInner />;
};

export default Competitions;
