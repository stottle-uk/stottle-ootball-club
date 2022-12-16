export interface MatchRes {
  match: Match;
}

export interface Match {
  date: string;
  venue: string;
  competition: Competition;
  id: number;
  time: string;
  'home-team': HomeTeam;
  'away-team': AwayTeam;
  attendance: number;
  status: Status;
}

export interface Competition {
  name: string;
  id: number;
}

export interface HomeTeam {
  score: number;
  'half-time-score': number;
  name: string;
  id: number;
  'line-up': LineUp[];
  goals: Goal[];
}

export interface LineUp {
  shirt: number;
  sort: number;
  player: Player;
  cautioned?: Cautioned;
  substitution?: Substitution;
}

export interface Player {
  id: number;
  'first-name': string;
  'last-name': string;
}

export interface Cautioned {
  minute: number;
}

export interface Substitution {
  replaced: Replaced;
  minute: number;
}

export interface Replaced {
  shirt: number;
  sort: number;
  player: Player2;
}

export interface Player2 {
  id: number;
  'first-name': string;
  'last-name': string;
}

export interface Goal {
  description: string;
  sort: number;
  minute: number;
  player: Player3;
}

export interface Player3 {
  id: number;
  'first-name': string;
  'last-name': string;
}

export interface AwayTeam {
  score: number;
  'half-time-score': number;
  name: string;
  id: number;
  'line-up': LineUp2[];
  goals: Goal2[];
}

export interface LineUp2 {
  shirt: number;
  sort: number;
  player: Player4;
  cautioned?: Cautioned2;
  substitution?: Substitution2;
}

export interface Player4 {
  'first-name': string;
  'last-name': string;
}

export interface Cautioned2 {
  minute: number;
}

export interface Substitution2 {
  replaced: Replaced2;
  minute: number;
}

export interface Replaced2 {
  shirt: number;
  sort: number;
  player: Player5;
}

export interface Player5 {
  'first-name': string;
  'last-name': string;
}

export interface Goal2 {
  description: string;
  sort: number;
  minute: number;
}

export interface Status {
  short: string;
  full: string;
}
