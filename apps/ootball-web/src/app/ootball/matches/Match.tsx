import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { useFetch } from '../../hooks';
import { matchState } from '../state/ootball.state';
import { MatchRes } from './matches.models';
import MatchInner from './MatchInner';

export const Match: React.FC = () => {
  const params = useParams();
  const { get } = useFetch();

  const getItems = useRecoilCallback(
    ({ set, snapshot }) =>
      async (matchId: number) => {
        const state = await snapshot.getPromise(matchState);
        if (!state[matchId]) {
          const match = await get<MatchRes>(`/match.json?match=${matchId}`);

          set(matchState, (oldAppState) => ({
            ...oldAppState,
            [matchId]: match.match,
          }));
        }
      },
    []
  );

  useEffect(() => {
    (async () => {
      if (params.matchId) {
        await getItems(+params.matchId);
      }
    })();
  }, [getItems, params.matchId]);

  return params.matchId ? <MatchInner matchId={+params.matchId} /> : null;
};

export default Match;
