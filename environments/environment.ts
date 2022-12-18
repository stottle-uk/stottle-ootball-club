import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'dev',
  region: 'eu-west-1',
  profile: '',
  jwtSecret: 'secret',
  dynamo: {
    endpoint: 'http://localhost:4566',
    tableName: `dev-AppTable`,
  },
};
