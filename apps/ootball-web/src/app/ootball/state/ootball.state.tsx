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

export const http = new FetchClient(environment.apiUrl);

export const competitionsSelector = selector<Competition[]>({
  key: 'competitionsSelector',
  get: ({ get }) => {
    const initState = get(appInitState);
    return initState?.competitions?.competitions || [];
  },
});

export const leagueTableSelector = selector<LeagueTable | undefined>({
  key: 'leagueTableSelector',
  get: ({ get }) => {
    const initState = get(appInitState);

    return initState.leagueTable?.['league-table'];
  },
});

export const gamesSelector = selector<FixturesResults | undefined>({
  key: 'gamesSelector',
  get: async ({ get }) => {
    const id = get(gamesIdState);
    const initState = get(appInitState);

    const results = initState.games?.['fixtures-results'];
    if (id && results?.team.id === id) {
      return results;
    }

    if (!id) {
      return undefined;
    }

    const res = await http.get<GamesRes>(`/fixtures-results.json?team=${id}`);
    return res['fixtures-results'];
  },
});

export const appInitState = atom<AppState>({
  key: 'initState',
  default: {},
});

export const leagueTablesIdState = atom<number | undefined>({
  key: 'leagueTablesIdState',
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
  ({ set }) =>
    set(appInitState, state);
