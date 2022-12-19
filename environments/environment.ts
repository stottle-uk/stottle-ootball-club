import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'dev',
  region: 'eu-west-1',
  profile: '',
  apiUrl: 'https://yxi58blahc.execute-api.eu-west-1.amazonaws.com/dev',
  bucketName: 'web-ssr-bucket-dev',
  bucketUrl: 'https://web-ssr-bucket-dev.s3.eu-west-1.amazonaws.com',
};
