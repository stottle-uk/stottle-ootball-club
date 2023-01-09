import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { useFetch } from '../../hooks';
import { leagueTablesState } from '../state/ootball.state';
import { LeagueTableRes } from './leagueTable.models';
import LeaguetableInner from './LeagueTableInner';

export const Leaguetable: React.FC = () => {
  const params = useParams();
  const { get } = useFetch();

  const getItems = useRecoilCallback(
    ({ set, snapshot }) =>
      async (compId: number) => {
        const state = await snapshot.getPromise(leagueTablesState);
        if (!state[compId]) {
          const leagueTable = await get<LeagueTableRes>(
            `/league-table.json?comp=${compId}`
          );

          set(leagueTablesState, (oldAppState) => ({
            ...oldAppState,
            [compId]: leagueTable['league-table'],
          }));
        }
      },
    []
  );

  useEffect(() => {
    (async () => {
      if (params.competitionId) {
        await getItems(+params.competitionId);
      }
    })();
  }, [getItems, params.competitionId]);

  return params.competitionId ? (
    <LeaguetableInner compId={+params.competitionId} />
  ) : null;
};

export default Leaguetable;
