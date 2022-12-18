import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const serve: APIGatewayProxyHandler = async (event, _context) => {
  try {
    // We use asynchronous import here so we can better catch server-side errors during development
    const render = (await import('./render')).default;
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: await render(event),
    };
  } catch (error) {
    // Custom error handling for server-side errors
    // TODO: Prettify the output, include the callstack, e.g. by using `youch` to generate beautiful error pages
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
