import Fixtures from './ootball/games/Fixtures';
import Leaguetable from './ootball/leagueTables/LeagueTable';
import Match from './ootball/matches/Match';

export const App: React.FC = () => {
  return (
    <>
      <Leaguetable />
      <hr />
      <Fixtures />
      <hr />
      <Match />
    </>
  );
};

export default App;
