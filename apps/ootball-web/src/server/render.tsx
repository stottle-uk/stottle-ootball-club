import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { EmotionCache } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { FetchClient } from '@ootball-club/http-client';
import { APIGatewayProxyEvent } from 'aws-lambda';
import crossFetch from 'cross-fetch';
import { renderToPipeableStream } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { PassThrough } from 'stream';
import App from '../app/App';
import Competitions from '../app/ootball/competitions/Competitions';
import { CompetitionRes } from '../app/ootball/competitions/competitions.models';
import { GamesRes } from '../app/ootball/games/games.models';
import Leaguetable from '../app/ootball/leagueTables/LeagueTable';
import { LeagueTableRes } from '../app/ootball/leagueTables/leagueTable.models';
import Match from '../app/ootball/matches/Match';
import { MatchRes } from '../app/ootball/matches/matches.models';
import { AppState } from '../app/ootball/state/ootball.state';
import Team from '../app/ootball/teams/Team';
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

  const matchProm = params.includes('match')
    ? fetch.get<MatchRes>(`/match.json?match=${params[1]}`)
    : Promise.resolve(undefined);

  const leagueTableProm = params.includes('competition')
    ? fetch.get<LeagueTableRes>(`/league-table.json?comp=${params[1]}`)
    : Promise.resolve(undefined);

  const fixturesProm = params.includes('fixtures')
    ? fetch.get<GamesRes>(`/fixtures-results.json?team=${params[1]}`)
    : Promise.resolve(undefined);

  const [competitions, leagueTable, games, match] = await Promise.all([
    fetch.get<CompetitionRes>(`/competitions.json`),
    leagueTableProm,
    fixturesProm,
    matchProm,
  ]);

  return { competitions, leagueTable, games, match };
};

const onShellReady = (
  pipe: <Writable extends NodeJS.WritableStream>(
    destination: Writable
  ) => Writable
) => {
  const streamToString = (stream: PassThrough) => {
    const chunks: Buffer[] = [];
    return new Promise<string>((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  };

  const body = new PassThrough();
  pipe(body);
  return streamToString(body);
};

const renderContent = (
  cache: EmotionCache,
  defaultState: AppState,
  path: string
) => {
  return new Promise<string>((resolve) => {
    const { pipe } = renderToPipeableStream(
      <Root cache={cache} defaultState={defaultState}>
        <StaticRouter
          location={`/${OOTBALL_ENV_NAME}${path}`}
          basename={`${OOTBALL_ENV_NAME}/web-app`}
        >
          <Routes>
            <Route path="" element={<App />}>
              <Route path="" element={<Competitions />} />
              <Route
                path="competition/:competitionId"
                element={<Leaguetable />}
              />
              <Route path="fixtures/:teamId" element={<Team />} />
              <Route path="match/:matchId" element={<Match />} />
            </Route>
          </Routes>
        </StaticRouter>
      </Root>,
      {
        onShellReady: () => onShellReady(pipe).then(resolve),
      }
    );
  });
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

  const content = await renderContent(cache, defaultState, _e.path);

  const emotionChunks = extractCriticalToChunks(content);
  const css = constructStyleTagsFromChunks(emotionChunks);

  return html({ content, config: { defaultState, app, css, ...files } });
};

export const ping: RenderFn = async (e) => {
  await getFiles(app.PUBLIC_URL);
  return JSON.stringify({ ping: 'pong' });
};

export default render;
