export interface GoalscorersRes {
  page: number;
  goalscorers: Goalscorers;
  records: number;
  pages: number;
}

export interface Goalscorers {
  players: Player[];
  team: Team;
}

export interface Player {
  id: number;
  'first-name': string;
  'last-name': string;
  goals: Goal[];
}

export interface Goal {
  match: Match;
  description: string;
  minute: number;
}

export interface Match {
  date: string;
  competition: Competition;
  id: number;
  'home-team': HomeTeam;
  'away-team': AwayTeam;
  attendance: number;
  round?: Round;
}

export interface Competition {
  name: string;
  id: number;
}

export interface HomeTeam {
  name: string;
  score: number;
  id: number;
}

export interface AwayTeam {
  name: string;
  score: number;
  id: number;
}

export interface Round {
  name: string;
  id: number;
}

export interface Team {
  name: string;
  id: number;
}
