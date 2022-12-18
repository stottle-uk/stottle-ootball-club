export interface AllMatches {
  lost: number;
  against: number;
  'goal-difference': number;
  won: number;
  for: number;
  drawn: number;
  played: number;
}

export interface HomeMatches {
  lost: number;
  against: number;
  won: number;
  for: number;
  drawn: number;
  played: number;
}

export interface AwayMatches {
  lost: number;
  against: number;
  won: number;
  for: number;
  drawn: number;
  played: number;
}

export interface Team {
  'all-matches': AllMatches;
  zone?: string;
  name: string;
  'home-matches': HomeMatches;
  'away-matches': AwayMatches;
  id: number;
  position: number;
  'total-points': number;
}

export interface Competition {
  name: string;
  id: number;
}

export interface LeagueTable {
  teams: Team[];
  description: string;
  competition: Competition;
}

export interface LeagueTableRes {
  'league-table': LeagueTable;
}
