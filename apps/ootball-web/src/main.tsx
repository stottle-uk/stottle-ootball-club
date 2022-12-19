import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { red } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import App from './app/App';
import { StateProvider } from './app/ootball/state/ootball.state';
import { environment } from './environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type State = Record<string, any>;
type MainFn = (
  state: State,
  router: ReturnType<typeof createBrowserRouter>
) => () => React.ReactNode;

declare global {
  interface Window {
    __CONFIG__?: State;
  }
}

const defaultState = ('__CONFIG__' in window && window.__CONFIG__) || {};

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

const cache = createCache({ key: 'css' });
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

const getMainBuilder: MainFn = (state, router) => () =>
  (
    <StrictMode>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StateProvider defaultState={state}>
            <RouterProvider router={router} />
          </StateProvider>
        </ThemeProvider>
      </CacheProvider>
    </StrictMode>
  );

const getMain = getMainBuilder(defaultState, browserRouter);

const docRoot = document.getElementById('root') as HTMLElement;
if (Object.keys(defaultState).length) {
  ReactDOM.hydrateRoot(docRoot, getMain());
} else {
  ReactDOM.createRoot(docRoot).render(getMain());
}
