export interface Team {
  website: string;
  twitter: string;
  address: string;
  name: string;
  postcode: string;
  ground: string;
  capacity: number;
  telephone: string;
  id: number;
}

export interface TeamRes {
  team: Team;
}
