import { useState } from 'react';
import Fixtures from './ootball/games/Fixtures';
import Leaguetable from './ootball/leagueTables/LeagueTable';

export const App: React.FC = () => {
  const [teamId, setTeamId] = useState(0);

  return (
    <>
      <Leaguetable onTeamClick={setTeamId} />
      <hr />
      <Fixtures teamId={teamId} />
    </>
  );
};

export default App;
