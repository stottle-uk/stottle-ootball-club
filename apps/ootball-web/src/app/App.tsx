import Fixtures from './ootball/games/Fixtures';
import Leaguetable from './ootball/leagueTables/LeagueTable';

export const App: React.FC = () => (
  <>
    <h1>An Update</h1>
    <Leaguetable />
    <hr />
    <Fixtures />
  </>
);

export default App;
