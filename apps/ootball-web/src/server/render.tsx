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

interface SsrConfig {
  defaultState: Record<string, unknown>;
  cssFiles: string;
  jsFiles: string;
  app: {
    TITLE: string;
    PUBLIC_URL: string;
  };
}

interface HtmlOps {
  config: SsrConfig;
  content: string;
}

type HtmlFn = (opst: HtmlOps) => string;
type RenderFn = (e: APIGatewayProxyEvent) => Promise<string>;

const getFiles = async (publicUrl: string) => {
  const s3Client = new S3Client({ region: 'eu-west-1' });
  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: environment.bucketName })
  );

  const getFiles = (ext: string): string =>
    (data.Contents || [])
      .map((d) => d.Key || '')
      .filter(Boolean)
      .filter((c) => c.endsWith(ext))
      .map(
        (fileName) =>
          ({
            js: `<script src="${publicUrl}/${fileName}" type="module"></script>`,
            css: `<link rel="stylesheet" href="${publicUrl}/${fileName}">`,
          }[fileName.split('.').at(-1) || ''])
      )
      .join(' ');

  const jsFiles = getFiles('.js');
  const cssFiles = getFiles('.css');

  return { jsFiles, cssFiles };
};

const getState = async () => {
  const fetch = new FetchClient(crossFetch);
  const competitions = await fetch.get<CompetitionRes>(
    `${environment.apiUrl}/competitions.json`
  );

  return { competitions };
};

const html: HtmlFn = ({ content, config }) => `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>${config.app.TITLE}</title>
        <base href="/" />
        <link rel="icon" href="${config.app.PUBLIC_URL}/favicon.ico" />
        ${config.cssFiles}
      </head>
      <body>
        <div id="root">${content}</div>
        ${config.jsFiles}
        <script id="config-server-side">
          window.__CONFIG__ = ${JSON.stringify(config.defaultState)};
        </script>
      </body>
    </html>`;

const render: RenderFn = async (_e) => {
  const app = {
    TITLE: 'ootball.club',
    // PUBLIC_URL: 'http://localhost:4200',
    PUBLIC_URL: environment.bucketUrl,
  };

  const [files, defaultState] = await Promise.all([
    getFiles(app.PUBLIC_URL),
    getState(),
  ]);

  const content = renderToString(
    <StateProvider defaultState={defaultState}>
      <App />
    </StateProvider>
  );

  return html({ content, config: { defaultState, app, ...files } });
};

export default render;
