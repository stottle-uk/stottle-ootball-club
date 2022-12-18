import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { FetchClient } from '@ootball-club/http-client';
import { APIGatewayProxyEvent } from 'aws-lambda';
import crossFetch from 'cross-fetch';
import { renderToString } from 'react-dom/server';
import App from '../app/App';
import { CompetitionRes } from '../app/ootball/competitions/competitions.models';
import { StateProvider } from '../app/ootball/state/ootball.state';
import { environment } from '../environments/environment';

/*
          <link rel="stylesheet" href="${config.app.PUBLIC_URL}/styles.css">

          <script src="${
          config.app.PUBLIC_URL
        }/runtime.js" type="module"></script>
        <script src="${
          config.app.PUBLIC_URL
        }/polyfills.js" type="module"></script>
        <script src="${config.app.PUBLIC_URL}/styles.js" type="module"></script>
        <script src="${config.app.PUBLIC_URL}/vendor.js" type="module"></script>
        <script src="${config.app.PUBLIC_URL}/main.js" type="module"></script>
  */

const html = ({
  content,
  config,
  css = '',
}: {
  content: string;
  config: any;
  css?: string;
}): string => `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="theme-color" content="${config.app.THEME_COLOR}" />
        <title>${config.app.TITLE}</title>
        <link rel="shortcut icon" href="${config.app.PUBLIC_URL}/favicon.ico" />
        ${config.cssFiles}
        <style id="jss-server-side">${css}</style>
      </head>
      <body>
        <div id="root">${content}</div>
        ${config.jsFiles}
        <script id="config-server-side">
          window.__CONFIG__ = ${JSON.stringify(config.defaultState)};
        </script>
      </body>
    </html>`;

const render = async (_e: APIGatewayProxyEvent): Promise<string> => {
  const app = {
    TITLE: 'ootball.club',
    THEME_COLOR: '',
    // PUBLIC_URL: 'http://localhost:4200',
    PUBLIC_URL: 'https://web-ssr-bucket.s3.eu-west-1.amazonaws.com',
  };

  const s3Client = new S3Client({ region: 'eu-west-1' });
  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: 'web-ssr-bucket' })
  );

  const keys: string[] = (data.Contents || []).map((d) => d.Key || '');

  const jsFiles = keys
    .filter((c) => c.endsWith('.js'))
    .map(
      (js) => `<script src="${app.PUBLIC_URL}/${js}" type="module"></script>`
    )
    .join(' ');

  const cssFiles = keys
    .filter((c) => c.endsWith('.css'))
    .map((css) => `<link rel="stylesheet" href="${app.PUBLIC_URL}/${css}">`)
    .join(' ');

  const fetch = new FetchClient(crossFetch);

  const competitions = await fetch.get<CompetitionRes>(
    `${environment.apiUrl}/competitions.json`
  );

  const defaultState = { competitions };

  const config = { defaultState, app, jsFiles, cssFiles };

  const content = renderToString(
    <StateProvider defaultState={defaultState}>
      <App />
    </StateProvider>
  );

  return html({ content, config });
};

export default render;
