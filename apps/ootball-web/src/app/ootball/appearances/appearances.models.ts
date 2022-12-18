export interface Competition {
  name: string;
  id: number;
}

export interface HomeTeam {
  score: number;
  name: string;
  id: number;
}

export interface AwayTeam {
  score: number;
  name: string;
  id: number;
}

export interface Match {
  date: string;
  competition: Competition;
  id: number;
  'home-team': HomeTeam;
  'away-team': AwayTeam;
  attendance: number;
}

export interface Cautioned {
  minute: number;
}

export interface Replaced {
  shirt: number;
  minute: number;
  player: string;
}

export interface SentOff {
  minute: number;
}

export interface Appearance {
  shirt: number;
  match: Match;
  cautioned?: Cautioned;
  replaced?: Replaced;
  'sent-off'?: SentOff;
}

export interface Player {
  appearances: Appearance[];
  id: number;
  'first-name': string;
  'last-name': string;
}

export interface Team {
  name: string;
  id: number;
}

export interface Appearances {
  players: Player[];
  competition: Competition;
  team: Team;
}

export interface AppearancesRes {
  appearances: Appearances;
  pages: number;
  records: number;
  page: number;
}
