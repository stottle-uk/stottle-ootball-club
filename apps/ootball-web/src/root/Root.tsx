import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';
import { RecoilRoot } from 'recoil';
import {
  AppState,
  initializeRecoilState,
} from '../app/ootball/state/ootball.state';
import { theme } from './themes';

interface OwnProps {
  defaultState: AppState;
  cache: EmotionCache;
}

const Root: React.FC<PropsWithChildren<OwnProps>> = ({
  children,
  defaultState,
  cache,
}) => (
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecoilRoot initializeState={initializeRecoilState(defaultState)}>
        {children}
      </RecoilRoot>
    </ThemeProvider>
  </CacheProvider>
);

export default Root;
