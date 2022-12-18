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

interface StateModel {
  dispatch: (url: string, type: keyof State) => void;
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

interface State {
  competitions?: CompetitionRes;
  leagueTable?: LeagueTableRes;
  games?: GamesRes;
}

interface OwnProps {
  defaultState: State;
}

export const StateProvider: React.FC<PropsWithChildren<OwnProps>> = ({
  children,
  defaultState,
}) => {
  const [state, setState] = useState<State>(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetch = useFetch(environment.apiUrl);

  const dispatch = useCallback(
    async (url: string, type: keyof State) => {
      setIsLoading(true);
      const res = await fetch.get<State[keyof State]>(`/${url}`);
      setState((s) => ({ ...s, [type]: res }));
      setIsLoaded(true);
      setIsLoading(false);
    },
    [fetch]
  );

  const stateData = useMemo(
    () => ({
      competitions: state.competitions?.competitions,
      leagueTable: state.leagueTable?.['league-table'],
      games: state.games?.['fixtures-results'],
    }),
    [state]
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
