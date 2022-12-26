/* eslint-disable no-template-curly-in-string */
import { Serverless } from 'serverless/aws';
import { env } from '../../environments/environment.serverless';
import { baseServerlessConfig } from '../../serverless.base';

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: `ootball-web`,
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
      timeout: 29,
      memorySize: 256,
      reservedConcurrency: 2,
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
