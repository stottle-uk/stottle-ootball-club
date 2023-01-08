import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import createEmotionServer from '@emotion/server/create-instance';
import { FetchClient } from '@ootball-club/http-client';
import { APIGatewayProxyEvent } from 'aws-lambda';
import crossFetch from 'cross-fetch';
import { renderToString } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import App from '../app/App';
import Competitions from '../app/ootball/competitions/Competitions';
import { CompetitionRes } from '../app/ootball/competitions/competitions.models';
import Fixtures from '../app/ootball/games/Fixtures';
import { GamesRes } from '../app/ootball/games/games.models';
import Leaguetable from '../app/ootball/leagueTables/LeagueTable';
import { LeagueTableRes } from '../app/ootball/leagueTables/leagueTable.models';
import { AppState } from '../app/ootball/state/ootball.state';
import Root from '../root/Root';
import { createEmotionCache } from '../root/themes';

interface SsrConfig {
  defaultState: AppState;
  cssFiles: string;
  jsFiles: string;
  css: string;
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
const {
  OOTBALL_AWS_REGION,
  OOTBALL_BUCKET_NAME,
  OOTBALL_BUCKET_URL,
  OOTBALL_API_URL,
  OOTBALL_ENV_NAME,
} = process.env;

const getFiles = async (publicUrl: string) => {
  const s3Client = new S3Client({ region: OOTBALL_AWS_REGION });
  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: OOTBALL_BUCKET_NAME })
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

const getState = async (path: string) => {
  const fetch = new FetchClient(OOTBALL_API_URL, crossFetch);
  const params = path
    .split('/')
    .map((d) => d.trim().toLocaleLowerCase())
    .filter(Boolean)
    .filter((d) => d !== 'web-app');

  const leagueTableProm = params.includes('competition')
    ? fetch.get<LeagueTableRes>(`/league-table.json?comp=${params[1]}`)
    : Promise.resolve(undefined);

  const fixturesProm = params.includes('fixtures')
    ? fetch.get<GamesRes>(`/fixtures-results.json?team=${params[1]}`)
    : Promise.resolve(undefined);

  const [competitions, leagueTable, games] = await Promise.all([
    fetch.get<CompetitionRes>(`/competitions.json`),
    leagueTableProm,
    fixturesProm,
  ]);

  return { competitions, leagueTable, games };
};

const html: HtmlFn = ({ content, config }) => `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>${config.app.TITLE}</title>
        <base href="/" />
        <link rel="icon" href="${config.app.PUBLIC_URL}/favicon.ico" />
        ${config.css}
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

const app = {
  TITLE: 'ootball.club',
  PUBLIC_URL: OOTBALL_BUCKET_URL || 'http://localhost:4200',
};

const render: RenderFn = async (_e) => {
  const [files, defaultState] = await Promise.all([
    getFiles(app.PUBLIC_URL),
    getState(_e.path),
  ]);

  const cache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);

  const content = renderToString(
    <Root cache={cache} defaultState={defaultState}>
      <StaticRouter
        location={`/${OOTBALL_ENV_NAME}${_e.path}`}
        basename={`${OOTBALL_ENV_NAME}/web-app`}
      >
        <Routes>
          <Route path="" element={<App />}>
            <Route path="" element={<Competitions />} />
            <Route
              path="competition/:competitionId"
              element={<Leaguetable />}
            />
            <Route path="fixtures/:teamId" element={<Fixtures />} />
          </Route>
        </Routes>
      </StaticRouter>
    </Root>
  );

  const emotionChunks = extractCriticalToChunks(content);
  const css = constructStyleTagsFromChunks(emotionChunks);

  return html({ content, config: { defaultState, app, css, ...files } });
};

export const ping: RenderFn = async (e) => {
  await getFiles(app.PUBLIC_URL);
  return JSON.stringify({ ping: 'pong' });
};

export default render;
