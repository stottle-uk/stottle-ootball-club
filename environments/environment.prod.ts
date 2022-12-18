import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'prod',
  profile: '',
  region: 'eu-west-2',
  apiUrl: 'https://78y0vgej77.execute-api.eu-west-2.amazonaws.com/prod',
  bucketName: 'web-ssr-bucket-prod',
  bucketUrl: 'https://web-ssr-bucket-prod.s3.eu-west-2.amazonaws.com',
};
