import { atom, MutableSnapshot, selectorFamily } from 'recoil';
import { Appearances } from '../appearances/appearances.models';
import {
  Competition,
  CompetitionRes,
} from '../competitions/competitions.models';
import { FixturesResults, GamesRes } from '../games/games.models';
import { Goalscorers } from '../goalscorers/goalscorers.models';
import {
  LeagueTable,
  LeagueTableRes,
} from '../leagueTables/leagueTable.models';
import { Match, MatchRes } from '../matches/matches.models';
import { Team } from '../teams/teams.models';

export interface AppState {
  competitions?: CompetitionRes;
  leagueTable?: LeagueTableRes;
  games?: GamesRes;
  match?: MatchRes;
}

export const competitionsState = atom<Competition[]>({
  key: 'initState',
  default: [],
});

export const gamesState = atom<Record<string, FixturesResults>>({
  key: 'gamesState',
  default: {},
});

export const gamesSelector = selectorFamily<FixturesResults, number>({
  key: 'gamesSelector',
  get:
    (teamId) =>
    ({ get }) =>
      get(gamesState)[teamId],
});

export const leagueTablesState = atom<Record<string, LeagueTable>>({
  key: 'leagueTablesState',
  default: {},
});

export const leagueTablesSelector = selectorFamily<LeagueTable, number>({
  key: 'leagueTablesSelector',
  get:
    (teamId) =>
    ({ get }) =>
      get(leagueTablesState)[teamId],
});

export const matchState = atom<Record<string, Match>>({
  key: 'matchState',
  default: {},
});

export const matchSelector = selectorFamily<Match, number>({
  key: 'matchSelector',
  get:
    (teamId) =>
    ({ get }) =>
      get(matchState)[teamId],
});

export const teamState = atom<Record<string, Team>>({
  key: 'teamState',
  default: {},
});

export const teamSelector = selectorFamily<Team, number>({
  key: 'teamSelector',
  get:
    (teamId) =>
    ({ get }) =>
      get(teamState)[teamId],
});

export const goalscorersState = atom<Record<string, Goalscorers>>({
  key: 'goalscorersState',
  default: {},
});

export const goalscorersSelector = selectorFamily<Goalscorers, number>({
  key: 'goalscorersSelector',
  get:
    (teamId) =>
    ({ get }) =>
      get(goalscorersState)[teamId],
});

export const appearancesState = atom<Record<string, Appearances>>({
  key: 'appearancesState',
  default: {},
});

export const appearancesSelector = selectorFamily<Appearances, number>({
  key: 'appearancesSelector',
  get:
    (teamId) =>
    ({ get }) =>
      get(appearancesState)[teamId],
});

export const initializeRecoilState: (
  state: AppState
) => (ss: MutableSnapshot) => void =
  (state) =>
  ({ set }) => {
    set(competitionsState, state.competitions?.competitions || []);
    const games = state.games?.['fixtures-results'];
    if (games) {
      set(gamesState, {
        [games.team.id]: games,
      });
    }
    const table = state.leagueTable?.['league-table'];
    if (table) {
      set(leagueTablesState, {
        [table.competition.id]: table,
      });
    }
    const match = state.match?.match;
    if (match) {
      set(matchState, {
        [match.id]: match,
      });
    }
  };
