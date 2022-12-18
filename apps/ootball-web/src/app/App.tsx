import { red } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Fixtures from './ootball/games/Fixtures';
import Leaguetable from './ootball/leagueTables/LeagueTable';

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

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Leaguetable />
    <hr />
    <Fixtures />
  </ThemeProvider>
);

export default App;
