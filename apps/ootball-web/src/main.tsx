import { EmotionCache } from '@emotion/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import App from './app/App';
import Competitions from './app/ootball/competitions/Competitions';
import Leaguetable from './app/ootball/leagueTables/LeagueTable';
import Match from './app/ootball/matches/Match';
import { AppState } from './app/ootball/state/ootball.state';
import Team from './app/ootball/teams/Team';
import { environment } from './environments/environment';
import Root from './root/Root';
import { createEmotionCache } from './root/themes';

declare global {
  interface Window {
    __CONFIG__?: AppState;
  }
}

type MainFn = (
  state: AppState,
  cache: EmotionCache,
  router: ReturnType<typeof createBrowserRouter>
) => () => React.ReactNode;

const defaultState = window.__CONFIG__ || {};
const emotionCache = createEmotionCache();
const browserRouter = createBrowserRouter(
  [
    {
      path: '',
      element: <App />,
      children: [
        {
          index: true,
          element: <Competitions />,
        },
        {
          path: 'competition/:competitionId',
          element: <Leaguetable />,
        },
        {
          path: 'fixtures/:teamId',
          element: <Team />,
        },
        {
          path: 'match/:matchId',
          element: <Match />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to={''} replace={true} />,
    },
  ],
  { basename: `/${environment.envName}/web-app` }
);

const getMainBuilder: MainFn = (state, cache, router) => () =>
  (
    <StrictMode>
      <Root cache={cache} defaultState={state}>
        <RouterProvider router={router} />
      </Root>
    </StrictMode>
  );

const getMain = getMainBuilder(defaultState, emotionCache, browserRouter);

const docRoot = document.getElementById('root') as HTMLElement;
if (Object.keys(defaultState).length) {
  ReactDOM.hydrateRoot(docRoot, getMain());
} else {
  ReactDOM.createRoot(docRoot).render(getMain());
}
