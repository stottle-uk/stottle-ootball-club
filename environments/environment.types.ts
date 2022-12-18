export interface Environment {
  name: 'dev' | 'stg' | 'prod';
  region: string;
  profile: string;
}
