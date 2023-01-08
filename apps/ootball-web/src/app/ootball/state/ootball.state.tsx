import { FetchClient } from '@ootball-club/http-client';
import { atom, MutableSnapshot, selector } from 'recoil';
import { environment } from '../../../environments/environment';
import {
  Competition,
  CompetitionRes,
} from '../competitions/competitions.models';
import { FixturesResults, GamesRes } from '../games/games.models';
import {
  LeagueTable,
  LeagueTableRes,
} from '../leagueTables/leagueTable.models';

export interface AppState {
  competitions?: CompetitionRes;
  leagueTable?: LeagueTableRes;
  games?: GamesRes;
}

const http = new FetchClient(environment.apiUrl);

export const competitionsSelector = selector<Competition[]>({
  key: 'competitionsSelector',
  get: async ({ get }) => {
    const val = get(competitionsState);
    return (
      val?.competitions ||
      http.get<CompetitionRes>(`/competitions.json`).then((r) => r.competitions)
    );
  },
});

export const leagueTableSelector = selector<LeagueTable | undefined>({
  key: 'leagueTableSelector',
  get: async ({ get }) => {
    const id = get(leagueTablesIdState);
    const val = get(leagueTablesState);

    const leagueTable = val?.['league-table'];
    if (!id) {
      return leagueTable;
    }

    const res = await http.get<LeagueTableRes>(`/league-table.json?comp=${id}`);
    return res['league-table'];
  },
});

export const gamesSelector = selector<FixturesResults | undefined>({
  key: 'gamesSelector',
  get: async ({ get }) => {
    const id = get(gamesIdState);
    const val = get(gamesState);

    const results = val?.['fixtures-results'];
    if (!id) {
      return results;
    }

    const res = await http.get<GamesRes>(`/fixtures-results.json?team=${id}`);
    return res['fixtures-results'];
  },
});

export const competitionsState = atom<CompetitionRes>({
  key: 'competitionsState',
  default: undefined,
});

export const leagueTablesState = atom<LeagueTableRes | undefined>({
  key: 'leagueTablesState',
  default: undefined,
});

export const leagueTablesIdState = atom<number | undefined>({
  key: 'leagueTablesIdState',
  default: undefined,
});

export const gamesState = atom<GamesRes | undefined>({
  key: 'gamesState',
  default: undefined,
});

export const gamesIdState = atom<number | undefined>({
  key: 'gamesIdState',
  default: undefined,
});

export const initializeRecoilState: (
  state: AppState
) => (ss: MutableSnapshot) => void =
  (state) =>
  ({ set }) => {
    if (state.competitions) {
      set(competitionsState, state.competitions);
    }
    set(leagueTablesState, state.leagueTable);
    set(gamesState, state.games);
  };
