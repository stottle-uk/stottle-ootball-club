import Fixtures from './ootball/games/Fixtures';
import Leaguetable from './ootball/leagueTables/LeagueTable';

export const App: React.FC = () => (
  <>
    <Leaguetable />
    <hr />
    <Fixtures />
  </>
);

export default App;
