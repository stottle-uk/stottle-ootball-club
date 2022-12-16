import type { Serverless } from 'serverless/aws';
import { env } from '../../environments/environment.serverless';
import { baseServerlessConfigProvider } from '../../serverless.base';

const serverlessConfig: Partial<Serverless> = {
  provider: baseServerlessConfigProvider,
  service: 'ootball-core',
  resources: {
    Resources: {
      AppApiGW: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
          Name: `${env.name}-AppApiGW`,
        },
      },
    },
    Outputs: {
      ApiGatewayRestApiId: {
        Value: {
          Ref: 'AppApiGW',
        },
        Export: {
          Name: `${env.name}-AppApiGW-restApiId`,
        },
      },
      ApiGatewayRestApiRootResourceId: {
        Value: {
          'Fn::GetAtt': ['AppApiGW', 'RootResourceId'],
        },
        Export: {
          Name: `${env.name}-AppApiGW-rootResourceId`,
        },
      },
    },
  },
};

module.exports = serverlessConfig;
