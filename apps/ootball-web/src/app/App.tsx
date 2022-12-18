import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TopBar from './layout/AppBar';
import Competitions from './ootball/competitions/Competitions';
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
    <Container>
      <TopBar />
      <Box margin={'16px 0'}>
        <Competitions />
        <hr />
        <Leaguetable />
        <hr />
        <Fixtures />
      </Box>
    </Container>
  </ThemeProvider>
);

export default App;
