import React from 'react';
import Loader from '../../patterns/Suspense';
import { competitionsSelector } from '../state/ootball.state';
import CompetitionsInner from './CompetitionsInner';

export const Competitions: React.FC = () => (
  <Loader selector={competitionsSelector}>
    <CompetitionsInner />
  </Loader>
);

export default Competitions;
