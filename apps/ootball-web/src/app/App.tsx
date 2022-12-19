import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TopBar from './layout/AppBar';
import Competitions from './ootball/competitions/Competitions';
import Fixtures from './ootball/games/Fixtures';
import Leaguetable from './ootball/leagueTables/LeagueTable';

export const App: React.FC = () => (
  <Container>
    <TopBar />
    <Box padding={'16px 0'}>
      <Competitions />
      <Leaguetable />
      <Fixtures />
    </Box>
  </Container>
);

export default App;
