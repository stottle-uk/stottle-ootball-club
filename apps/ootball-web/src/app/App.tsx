import Fixtures from './ootball/games/Fixtures';
import Leaguetable from './ootball/leagueTables/LeagueTable';

export const App: React.FC = () => {
  return (
    <>
      <Leaguetable />
      <hr />
      <Fixtures />
    </>
  );
};

export default App;
