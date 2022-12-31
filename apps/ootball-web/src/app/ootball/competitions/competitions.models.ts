export interface Round {
  name: string;
  id: number;
}

export interface Competition {
  'generic-name': string;
  id: number;
  type: 'league' | 'cup';
  'full-name': string;
  rounds: Round[];
}

export interface CompetitionRes {
  competitions: Competition[];
}
