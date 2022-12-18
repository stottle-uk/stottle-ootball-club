export interface GamesRes {
  'fixtures-results': FixturesResults;
}

export interface FixturesResults {
  team: Team;
  matches: Match[];
}

export interface Team {
  name: string;
  id: number;
}

export interface Match {
  date: string;
  venue?: string;
  round?: Round;
  competition: Competition;
  id: number;
  time: string;
  'home-team': HomeTeam;
  referee?: string;
  'away-team': AwayTeam;
  attendance: number;
  status: Status;
}

export interface Round {
  name: string;
  id: number;
}

export interface Competition {
  name: string;
  id: number;
}

export interface HomeTeam {
  score: number;
  'half-time-score'?: number;
  name: string;
  id: number;
}

export interface AwayTeam {
  score: number;
  'half-time-score'?: number;
  name: string;
  id: number;
}

export interface Status {
  short: string;
  full: string;
}
