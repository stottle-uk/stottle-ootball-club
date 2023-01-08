import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { FetchClient } from '@ootball-club/http-client';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import crossFetch from 'cross-fetch';

const corsHeaders = {
  // Change this to your domains
  'Access-Control-Allow-Origin': '*',
  // Change this to your headers
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': 86400,
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
  const urlProxy = `${event.path}?${params}`.toLowerCase().trim();

  const url = new URL(`https://football-web-pages1.p.rapidapi.com${urlProxy}`);
  const keyTidy = `${url.pathname}${url.search}`.toLowerCase().trim();
  const keyEncoded = Buffer.from(keyTidy).toString('base64');
  return { url, keyTidy, keyEncoded };
};

const dbService = () => {
  const db = new DynamoDB({ region: process.env.OOTBALL_AWS_REGION });
  const tableName = 'my-first-table';

  const getRecord = (primaryKey: string) =>
    db.getItem({
      Key: marshall({ primaryKey }),
      TableName: tableName,
    });

  const putRecord = <T>(primaryKey: string, primaryKeyClean: string, data: T) =>
    db.putItem({
      TableName: tableName,
      Item: marshall({
        ...data,
        primaryKey,
        primaryKeyClean,
        createdDate: new Date().toISOString(),
      }),
      ReturnValues: 'ALL_OLD',
    });

  return {
    getRecord,
    putRecord,
  };
};

const fetchService = () => {
  const fetch = new FetchClient('', crossFetch);
  const headers = {
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': 'football-web-pages1.p.rapidapi.com',
  };

  const getData = (url: string) => fetch.get(url, { headers });

  return { getData };
};

const mainHandler = async (event: APIGatewayProxyEvent) => {
  const { url, keyTidy, keyEncoded } = getURLConfig(event);

  const { getRecord, putRecord } = dbService();
  const res = await getRecord(keyEncoded);

  if (res.Item) {
    const item = unmarshall(res.Item);
    const createdTime = new Date(item.createdDate).getTime();
    const checkTime = new Date().getTime() - 86400000;
    if (createdTime > checkTime) {
      return item;
    }
  }

  const { getData } = fetchService();
  const fetchRes = await getData(url.href);

  await putRecord(keyEncoded, keyTidy, fetchRes);

  return fetchRes;
};

export const main: APIGatewayProxyHandler = async (event) => {
  try {
    const res = await mainHandler(event);
    return httpResponse(res);
  } catch (error) {
    console.error(error);
    return httpResponse({ error }, { statusCode: 500 });
  }
};
