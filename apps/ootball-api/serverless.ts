import type { Serverless } from 'serverless/aws';
import { env } from '../../environments/environment.serverless';
import {
  baseServerlessConfig,
  baseServerlessConfigProvider,
} from '../../serverless.base';

const myFirstTableName = `my-first-table`;

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: `ootball-api`,
  provider: {
    ...(baseServerlessConfig.provider || baseServerlessConfigProvider),
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
            ],
            Resource: `arn:aws:dynamodb:${env.region}:*:table/${myFirstTableName}`,
          },
        ],
      },
    },
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
      handler: 'src/proxyRequest.main',
      provisionedConcurrency: 2,
      environment: {
        OOTBALL_AWS_REGION: env.region,
      },
      events: [
        {
          http: {
            method: 'get',
            path: '/{newPath}',
            cors: true,
            request: { parameters: { paths: { newPath: true } } },
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      AppTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: myFirstTableName,
          AttributeDefinitions: [
            {
              AttributeName: 'primaryKey',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'primaryKey',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfig;
