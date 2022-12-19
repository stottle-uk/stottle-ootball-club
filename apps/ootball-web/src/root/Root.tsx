import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { PropsWithChildren } from 'react';
import { AppState, StateProvider } from '../app/ootball/state/ootball.state';
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
      <StateProvider defaultState={defaultState}>{children}</StateProvider>
    </ThemeProvider>
  </CacheProvider>
);

export default Root;
