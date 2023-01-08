import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';

global.setImmediate =
  global.setImmediate ||
  ((fn: any, ...args: any[]) => global.setTimeout(fn, 0, ...args));

describe('firsttest', () => {
  it('shoud', (done) => {
    const { pipe } = renderToPipeableStream(<div>hello</div>, {
      onShellReady() {
        const body = new PassThrough();

        // responseHeaders.set("Content-Type", "text/html");

        pipe(body);

        const sdfs = body.read();

        console.log(sdfs.toString('UTF-8'));

        expect(true).toBeTruthy();
        done();
      },
    });
  });
});
