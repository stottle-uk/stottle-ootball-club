import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { useFetch } from '../../hooks';
import { gamesState } from '../state/ootball.state';
import FixturesInner from './FixturesInner';
import { GamesRes } from './games.models';

export const Fixtures: React.FC = () => {
  const params = useParams();
  const { get } = useFetch();

  const getItems = useRecoilCallback(
    ({ set, snapshot }) =>
      async (teamId: number) => {
        const state = await snapshot.getPromise(gamesState);
        if (!state[teamId]) {
          const games = await get<GamesRes>(
            `/fixtures-results.json?team=${teamId}`
          );

          set(gamesState, (oldAppState) => ({
            ...oldAppState,
            [teamId]: games['fixtures-results'],
          }));
        }
      }
  );

  useEffect(() => {
    (async () => {
      if (params.teamId) {
        await getItems(+params.teamId);
      }
    })();
  }, [getItems, params.teamId]);

  return params.teamId ? <FixturesInner teamId={+params.teamId} /> : null;
};

export default Fixtures;
