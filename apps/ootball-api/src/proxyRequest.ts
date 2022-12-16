import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { FetchClient } from '@ootball-club/http-client';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import nodeFetch from 'node-fetch';

if (!globalThis.fetch) {
  globalThis.fetch = nodeFetch as unknown as typeof fetch;
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
): APIGatewayProxyResult => ({
  body: JSON.stringify(data),
  statusCode,
  ...rest,
  headers: {
    ...rest.headers,
    ...corsHeaders,
  },
});

const getURLConfig = (event: APIGatewayProxyEvent) => {
  const params = new URLSearchParams(event.queryStringParameters);
  const urlProxy = `${event.path}?${params}`;

  const url = new URL(`https://football-web-pages1.p.rapidapi.com${urlProxy}`);
  const keyTidy = `${url.pathname}${url.search}`;
  const keyEncoded = Buffer.from(keyTidy).toString('base64');
  return { keyEncoded, url, keyTidy };
};

const tableName = 'my-first-table';
const getRecord = (db: DynamoDB, key: string) =>
  db.getItem({
    Key: { primaryKey: { S: key } },
    TableName: tableName,
  });

const putRecord = <T>(db: DynamoDB, key: string, keyTidy: string, data: T) =>
  db.putItem({
    TableName: tableName,
    Item: {
      primaryKey: { S: key },
      primaryKeyNice: { S: keyTidy },
      otherData: { S: JSON.stringify(data) },
    },
    ReturnValues: 'ALL_OLD',
  });

const getProxyRequest = (url: URL) =>
  new FetchClient().get(url.href, {
    headers,
  });

export const main: APIGatewayProxyHandler = async (event) => {
  const { url, keyTidy, keyEncoded } = getURLConfig(event);
  const db = new DynamoDB({ region: 'eu-west-1' });

  const res = await getRecord(db, keyEncoded);
  if (res.Item) {
    return httpResponse(JSON.parse(res.Item.otherData.S));
  }

  const fetchRes = await getProxyRequest(url);

  await putRecord(db, keyEncoded, keyTidy, fetchRes);

  return httpResponse(fetchRes);
};
