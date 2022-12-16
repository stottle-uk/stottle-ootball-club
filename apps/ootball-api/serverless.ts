import type { Serverless } from 'serverless/aws';
import {
  baseServerlessConfig,
  baseServerlessConfigProvider,
} from '../../serverless.base';

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: `ootball-api`,
  provider: {
    ...(baseServerlessConfig.provider || baseServerlessConfigProvider),
  },
  custom: {
    ...baseServerlessConfig.custom,
    'serverless-offline': {
      lambdaPort: 3004,
      httpPort: 3005,
    },
  },
  functions: {
    'get-fixtures': {
      handler: 'src/fixtures/getFixtures.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfig;
