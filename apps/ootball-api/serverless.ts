import type { Serverless } from 'serverless/aws';
import { env, envName } from '../../environments/environment.serverless';

const myFirstTableName = `my-first-table`;

const serverlessConfig: Partial<Serverless> = {
  frameworkVersion: '3',
  service: 'ootball-api',
  package: {
    exclude: ['./**'],
    include: ['./bin/**'],
  },
  provider: {
    name: 'aws',
    runtime: 'go1.x',
    profile: env.profile,
    stage: env.name,
    region: env.region,
    environment: {
      NODE_ENV: envName,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    deploymentBucket: { blockPublicAccess: true },
    apiGateway: {
      minimumCompressionSize: 1024,
    },
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
    'serverless-offline': {
      lambdaPort: 3004,
      httpPort: 3005,
    },
  },
  functions: {
    'get-fixtures': {
      handler: 'bin/proxyGo',
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
