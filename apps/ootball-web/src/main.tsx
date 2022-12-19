import { EmotionCache } from '@emotion/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import App from './app/App';
import { AppState } from './app/ootball/state/ootball.state';
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

const defaultState = ('__CONFIG__' in window && window.__CONFIG__) || {};
const emotionCache = createEmotionCache();
const rootPath = `/${environment.envName}/web-app`;
const browserRouter = createBrowserRouter([
  {
    path: rootPath,
    element: <App />,
  },
  {
    path: '*',
    element: <Navigate to={rootPath} replace={true} />,
  },
]);

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
