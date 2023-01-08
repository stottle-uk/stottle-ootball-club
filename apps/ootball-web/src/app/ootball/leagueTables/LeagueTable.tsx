import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { appInitState, http } from '../state/ootball.state';
import { LeagueTableRes } from './leagueTable.models';
import LeaguetableInner from './LeagueTableInner';

export const Leaguetable: React.FC = () => {
  const params = useParams();
  const inProgress = useRef(false);

  const getItems = useRecoilCallback(
    ({ set }) =>
      async (compId: number) => {
        const leagueTable = await http.get<LeagueTableRes>(
          `/league-table.json?comp=${compId}`
        );
        set(appInitState, (oldAppState) => ({ ...oldAppState, leagueTable }));
      },
    []
  );

  useEffect(() => {
    (async () => {
      if (params.competitionId && !inProgress.current) {
        inProgress.current = true;
        await getItems(+params.competitionId);
        inProgress.current = false;
      }
    })();
  }, [getItems, params.competitionId]);

  return <LeaguetableInner />;
};

export default Leaguetable;
