/* eslint-disable no-template-curly-in-string */
import { Serverless } from 'serverless/aws';
import { env } from '../../environments/environment.serverless';
import {
  baseServerlessConfig,
  baseServerlessConfigProvider,
} from '../../serverless.base';

const warmup = {
  warmup: { default: { concurrency: 1, enabled: env.name === 'prod' } },
};

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: `ootball-web`,
  provider: {
    ...(baseServerlessConfig.provider || baseServerlessConfigProvider),
    iamRoleStatements: [
      { Effect: 'Allow', Action: ['lambda:InvokeFunction'], Resource: '*' },
    ],
  },
  custom: {
    ...baseServerlessConfig.custom,
    warmup: {
      default: {
        enabled: true,
        role: 'IamRoleLambdaExecution',
        architecture: 'arm64',
        events: [{ schedule: 'cron(0/5 8-23 ? * MON-FRI *)' }],
        prewarm: true,
      },
    },
    'serverless-offline': {
      lambdaPort: 3006,
      httpPort: 3007,
    },
  },
  functions: {
    'get-web': {
      ...warmup,
      handler: 'src/server/handler.serve',
      timeout: 29,
      memorySize: 256,
      environment: {
        OOTBALL_AWS_REGION: env.region,
        OOTBALL_API_URL: env.apiUrl,
        OOTBALL_BUCKET_NAME: env.bucketName,
        OOTBALL_BUCKET_URL: env.bucketUrl,
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
