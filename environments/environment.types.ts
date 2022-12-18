export interface Environment {
  name: 'dev' | 'prod';
  region: string;
  profile: string;
  apiUrl: string;
  bucketName: string;
  bucketUrl: string;
}
