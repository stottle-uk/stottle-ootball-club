import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Loader from '../../patterns/Suspense';
import {
  leagueTableSelector,
  leagueTablesIdState,
} from '../state/ootball.state';
import LeaguetableInner from './LeagueTableInner';

export const Leaguetable: React.FC = () => {
  const params = useParams();
  const setLeagueTableId = useSetRecoilState(leagueTablesIdState);

  useEffect(() => {
    if (params.competitionId) {
      setLeagueTableId(+params.competitionId);
    }
  }, [params, setLeagueTableId]);

  return (
    <Loader selector={leagueTableSelector}>
      <LeaguetableInner />
    </Loader>
  );
};

export default Leaguetable;
