import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { FetchClient } from '@ootball-club/http-client';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import nodeFetch from 'node-fetch';

if (!globalThis.fetch) {
  (globalThis as any).fetch = nodeFetch;
}

const corsHeaders = {
  // Change this to your domains
  'Access-Control-Allow-Origin': '*',
  // Change this to your headers
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': 86400,
};

const headers = {
  'X-RapidAPI-Key': '57b972bd34msh9ea405fae2bac9ep13e8dcjsn2007d5fffa4f',
  'X-RapidAPI-Host': 'football-web-pages1.p.rapidapi.com',
};

const httpResponse = <T>(
  data: T,
  { statusCode = 200, ...rest }: Omit<APIGatewayProxyResult, 'body'> = {
    statusCode: 200,
  }
): APIGatewayProxyResult => {
  return {
    body: JSON.stringify(data),
    statusCode,
    ...rest,
    headers: {
      ...rest.headers,
      ...corsHeaders,
    },
  };
};

const getURLConfig = (event) => {
  const params = new URLSearchParams(event.queryStringParameters);
  const urlProxy = `${event.path}?${params}`;

  const url = new URL(`https://football-web-pages1.p.rapidapi.com${urlProxy}`);
  const keyTidy = `${url.pathname}${url.search}`;
  const keyEncoded = Buffer.from(keyTidy).toString('base64');
  return { keyEncoded, url, keyTidy };
};

export const main: APIGatewayProxyHandler = async (event, context) => {
  const { url, keyTidy, keyEncoded } = getURLConfig(event);
  const db = new DynamoDB({ region: 'eu-west-1' });
  const tableName = 'my-first-table';
  const res = await db.getItem({
    Key: {
      primaryKey: { S: keyEncoded },
    },
    TableName: tableName,
  });
  if (res.Item) {
    return httpResponse(JSON.parse(res.Item.otherData.S));
  }

  try {
    const fetch = new FetchClient();

    const fetchRes = await fetch.get(url.href, {
      headers,
    });

    await db.putItem({
      TableName: tableName,
      Item: {
        primaryKey: { S: keyEncoded },
        primaryKeyNice: { S: keyTidy },
        otherData: { S: JSON.stringify(fetchRes) },
      },
      ReturnValues: 'ALL_OLD',
    });

    return httpResponse(fetchRes);
  } catch (error) {
    console.log(error);
  }

  return httpResponse([]);
};
