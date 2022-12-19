import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import 'source-map-support/register';

type APIGatewayProxyHandler = Handler<
  APIGatewayProxyEvent & { source: string },
  APIGatewayProxyResult
>;

export const serve: APIGatewayProxyHandler = async (event, _context) => {
  if (event.source === 'serverless-plugin-warmup') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<html><body>Lambda is warm!</body></html>`,
    };
  }

  try {
    const render = (await import('./render')).default;
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: await render(event),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `<html><body>${error}</body></html>`,
    };
  }
};
