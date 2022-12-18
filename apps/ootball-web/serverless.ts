/* eslint-disable no-template-curly-in-string */
import type { Serverless } from 'serverless/aws';
import { env } from '../../environments/environment.serverless';
import {
  baseServerlessConfig,
  baseServerlessConfigProvider,
} from '../../serverless.base';

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: `ootball-web`,
  provider: {
    ...(baseServerlessConfig.provider || baseServerlessConfigProvider),
  },
  custom: {
    ...baseServerlessConfig.custom,
    'serverless-offline': {
      lambdaPort: 3006,
      httpPort: 3007,
    },
  },
  functions: {
    'get-web': {
      handler: 'src/server/handler.serve',
      environment: {
        AWS_REGION: env.region,
      },
      events: [
        {
          http: {
            method: 'get',
            path: '/web-app',
            cors: true,
          },
        },
        {
          http: {
            method: 'get',
            path: '/web-app/{any+}',
            cors: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      webBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: `web-ssr-bucket-${env.name}`,
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET'],
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfig;
