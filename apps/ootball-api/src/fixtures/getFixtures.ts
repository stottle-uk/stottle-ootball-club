import {
  DynamoDB,
  DynamoDBClient,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const corsHeaders = {
  // Change this to your domains
  'Access-Control-Allow-Origin': '*',
  // Change this to your headers
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': 86400,
};

export function httpResponse(
  data: Record<string, unknown>,
  { statusCode = 200, ...rest }: Omit<APIGatewayProxyResult, 'body'> = {
    statusCode: 200,
  }
): APIGatewayProxyResult {
  return {
    body: JSON.stringify({ data }),
    statusCode,
    ...rest,
    headers: {
      ...rest.headers,
      ...corsHeaders,
    },
  };
}

export const main: APIGatewayProxyHandler = async (event, context) => {
  const client = new DynamoDBClient({ region: 'eu-west-1' });
  const db = new DynamoDB({ region: 'eu-west-1' });
  const command = new ListTablesCommand({});
  try {
    const results = await client.send(command);

    const res = await db.putItem({
      TableName: 'my-first-table',
      Item: {
        primaryKey: {
          S: '1234',
        },
        otherData: {
          M: {
            data1: {
              S: 'data1_val',
            },
            data2: {
              S: 'data2_val',
            },
          },
        },
      },
      ReturnValues: 'ALL_OLD',
    });
    console.log(res.Attributes);

    console.log(results.TableNames.join('\n'));
  } catch (err) {
    console.error(err);
  }

  return httpResponse({
    todo: [],
  });
};
