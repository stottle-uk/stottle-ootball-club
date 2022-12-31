import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { environment } from '../../../environments/environment';
import { useFetch } from '../../hooks';
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

interface StateModel {
  dispatch: (url: string, type: keyof AppState) => void;
  competitions?: Competition[];
  leagueTable?: LeagueTable;
  games?: FixturesResults;
  isLoading: boolean;
  isLoaded: boolean;
}

const StateContext = createContext<StateModel>({
  dispatch: () => void 0,
  competitions: [],
  isLoading: false,
  isLoaded: false,
});

export const useStateContext = () => useContext(StateContext);

interface OwnProps {
  defaultState: AppState;
}

export const StateProvider: React.FC<PropsWithChildren<OwnProps>> = ({
  children,
  defaultState,
}) => {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetch = useFetch(environment.apiUrl);

  const dispatch = useCallback(
    async (url: string, type: keyof AppState) => {
      setIsLoading(true);
      const res = await fetch.get<AppState[keyof AppState]>(`/${url}`);
      setState((s) => ({ ...s, [type]: res }));
      setIsLoaded(true);
      setIsLoading(false);
    },
    [fetch]
  );

  const stateData = useMemo(
    () => ({
      competitions: isLoading ? undefined : state.competitions?.competitions,
      leagueTable: isLoading ? undefined : state.leagueTable?.['league-table'],
      games: isLoading ? undefined : state.games?.['fixtures-results'],
    }),
    [state, isLoading]
  );

  return (
    <StateContext.Provider
      value={{
        dispatch,
        isLoading,
        isLoaded,
        ...stateData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
