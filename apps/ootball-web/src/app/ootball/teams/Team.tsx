import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { useFetch } from '../../hooks';
import { AppearancesRes } from '../appearances/appearances.models';
import { GamesRes } from '../games/games.models';
import { GoalscorersRes } from '../goalscorers/goalscorers.models';
import {
  appearancesState,
  gamesState,
  goalscorersState,
  teamState,
} from '../state/ootball.state';
import { TeamRes } from '../teams/teams.models';
import TeamInner from './TeamInner';

export const Fixtures: React.FC = () => {
  const params = useParams();
  const { get } = useFetch();

  const getItems = useRecoilCallback(
    ({ set, snapshot }) =>
      async (teamId: number) => {
        const state = await snapshot.getPromise(gamesState);
        if (!state[teamId]) {
          const [games, team, goalscorers, appearances] = await Promise.all([
            get<GamesRes>(`/fixtures-results.json?team=${teamId}`),
            get<TeamRes>(`/team.json?team=${teamId}`),
            get<GoalscorersRes>(`/goalscorers.json?team=${teamId}`),
            get<AppearancesRes>(`/appearances.json?team=${teamId}`),
          ]);

          set(gamesState, (oldAppState) => ({
            ...oldAppState,
            [teamId]: games['fixtures-results'],
          }));
          set(teamState, (oldAppState) => ({
            ...oldAppState,
            [teamId]: team.team,
          }));
          set(goalscorersState, (oldAppState) => ({
            ...oldAppState,
            [teamId]: goalscorers.goalscorers,
          }));
          set(appearancesState, (oldAppState) => ({
            ...oldAppState,
            [teamId]: appearances.appearances,
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

  return params.teamId ? <TeamInner teamId={+params.teamId} /> : null;
};

export default Fixtures;
