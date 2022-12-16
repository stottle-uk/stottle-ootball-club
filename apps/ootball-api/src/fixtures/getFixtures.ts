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
  console.log('event', event);
  console.log('context');

  return httpResponse({
    todo: [],
  });
};
