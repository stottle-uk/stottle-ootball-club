import { DynamoDB } from '@aws-sdk/client-dynamodb';
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
  const db = new DynamoDB({ region: 'eu-west-1' });
  const tableName = 'my-first-table';

  const getRecord = (key: string) =>
    db.getItem({
      Key: { primaryKey: { S: key } },
      TableName: tableName,
    });

  const putRecord = <T>(key: string, keyTidy: string, data: T) =>
    db.putItem({
      TableName: tableName,
      Item: {
        primaryKey: { S: key },
        primaryKeyNice: { S: keyTidy },
        createdDate: { S: new Date().toISOString() },
        proxyData: { S: JSON.stringify(data) },
      },
      ReturnValues: 'ALL_OLD',
    });

  return {
    getRecord,
    putRecord,
  };
};

const fetchSerice = () => {
  const fetch = new FetchClient(crossFetch);
  const headers = {
    'X-RapidAPI-Key': '57b972bd34msh9ea405fae2bac9ep13e8dcjsn2007d5fffa4f',
    'X-RapidAPI-Host': 'football-web-pages1.p.rapidapi.com',
  };

  const getData = (url: string) => fetch.get(url, { headers });

  return { getData };
};

export const main: APIGatewayProxyHandler = async (event) => {
  const { url, keyTidy, keyEncoded } = getURLConfig(event);

  const { getRecord, putRecord } = dbService();
  const res = await getRecord(keyEncoded);
  if (res.Item) {
    return httpResponse(JSON.parse(res.Item.proxyData.S));
  }

  const { getData } = fetchSerice();
  const fetchRes = await getData(url.href);

  await putRecord(keyEncoded, keyTidy, fetchRes);

  return httpResponse(fetchRes);
};
