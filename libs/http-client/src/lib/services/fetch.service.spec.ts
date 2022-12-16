import { FetchError, IFetchService } from '../models/fetch.model';
import { FetchClient } from './fetch.service';

const urlMock = 'http://mock.example';
const reqBodyMock = { req: 'reqPayload' };
const resBodyMock = { res: 'resPayload' };
const blockMock = new Blob();
const arrayBufferMock = new Uint16Array([1, 2, 3]).buffer;

describe('FetchClient', () => {
  let fetchClient: IFetchService;
  let textMock: jest.Mock<Promise<string>, []>;
  let responseMock: jest.Mock;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    textMock = jest.fn(() => Promise.resolve('{}'));
    responseMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => textMock(),
        blob: () => blockMock,
        arrayBuffer: () => arrayBufferMock,
      })
    );
    fetchMock = jest.fn(() => responseMock());
    fetchClient = new FetchClient(fetchMock);
  });

  describe('get()', () => {
    it('should make get request', async () => {
      textMock.mockResolvedValue(JSON.stringify(resBodyMock));

      const res = await fetchClient.get(urlMock);

      expect(fetchMock).toBeCalledWith(urlMock, { method: 'GET' });
      expect(res).toEqual(resBodyMock);
    });

    it('should make get request and handle no body', async () => {
      textMock.mockResolvedValue('');

      const res = await fetchClient.get(urlMock);

      expect(fetchMock).toBeCalledWith(urlMock, { method: 'GET' });
      expect(res).toEqual(null);
    });

    it('should make get request for text', async () => {
      const res = await fetchClient.get(urlMock, {
        responseType: 'text',
        headers: {},
      });

      expect(fetchMock).toBeCalledWith(urlMock, {
        method: 'GET',
        responseType: 'text',
        headers: {},
      });
      expect(res).toEqual('{}');
    });

    it('should make get request for blob', async () => {
      const res = await fetchClient.get(urlMock, { responseType: 'blob' });

      expect(fetchMock).toBeCalledWith(urlMock, {
        method: 'GET',
        responseType: 'blob',
      });
      expect(res).toEqual(blockMock);
    });

    it('should make get request for arraybuffer', async () => {
      const res = await fetchClient.get(urlMock, {
        responseType: 'arraybuffer',
      });

      expect(fetchMock).toBeCalledWith(urlMock, {
        method: 'GET',
        responseType: 'arraybuffer',
      });
      expect(res).toEqual(arrayBufferMock);
    });

    it('should handle get request error', async () => {
      textMock.mockResolvedValue(JSON.stringify({ error: 'ERROR_MESSAGE' }));
      responseMock.mockResolvedValue({
        ok: false,
        text: () => textMock(),
        statusText: 'http-error',
      });

      expect.assertions(2);

      try {
        await fetchClient.get(urlMock);
      } catch (error) {
        if (error instanceof FetchError) {
          expect(error.message).toEqual('http-error');
          expect(error.error).toEqual({ error: 'ERROR_MESSAGE' });
        }
      }
    });

    it('should handle body parse error', async () => {
      textMock.mockResolvedValue('fail parse');
      responseMock.mockResolvedValue({
        ok: false,
        text: () => textMock(),
        statusText: 'http-error',
      });

      expect.assertions(2);

      try {
        await fetchClient.get(urlMock);
      } catch (error) {
        if (error instanceof FetchError) {
          expect(error.message).toEqual(
            'Unexpected token i in JSON at position 2'
          );
          expect(error.error).toEqual('SyntaxError');
        }
      }
    });
  });

  describe('post()', () => {
    it('should make post request', async () => {
      textMock.mockResolvedValue(JSON.stringify(resBodyMock));

      const res = await fetchClient.post(urlMock, reqBodyMock);

      expect(fetchMock).toBeCalledWith(urlMock, {
        body: JSON.stringify(reqBodyMock),
        method: 'POST',
      });
      expect(res).toEqual(resBodyMock);
    });
  });

  describe('put()', () => {
    it('should make put request', async () => {
      textMock.mockResolvedValue(JSON.stringify(resBodyMock));

      const res = await fetchClient.put(urlMock, reqBodyMock);

      expect(fetchMock).toBeCalledWith(urlMock, {
        body: JSON.stringify(reqBodyMock),
        method: 'PUT',
      });
      expect(res).toEqual(resBodyMock);
    });
  });

  describe('patch()', () => {
    it('should make patch request', async () => {
      textMock.mockResolvedValue(JSON.stringify(resBodyMock));

      const res = await fetchClient.patch(urlMock, reqBodyMock);

      expect(fetchMock).toBeCalledWith(urlMock, {
        body: JSON.stringify(reqBodyMock),
        method: 'PATCH',
      });
      expect(res).toEqual(resBodyMock);
    });
  });

  describe('delete()', () => {
    it('should make delete request', async () => {
      await fetchClient.delete(urlMock);

      expect(fetchMock).toBeCalledWith(urlMock, {
        method: 'DELETE',
      });
    });
  });
});
