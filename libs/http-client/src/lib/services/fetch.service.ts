import { FetchError, FetchRequest, IFetchService } from '../models/fetch.model';

type FetchFn = typeof fetch;

const defaultFetch: FetchFn = (...args) => fetch(...args);

export class FetchClient implements IFetchService {
  constructor(private baseUrl?: string, private fetch = defaultFetch) {}

  get<R>(url: string, options?: FetchRequest): Promise<R> {
    return this.doFetch(url, {
      ...options,
      method: 'GET',
    });
  }

  post<R, T = unknown>(
    url: string,
    body: T,
    options?: FetchRequest
  ): Promise<R> {
    return this.doFetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<R, T = unknown>(
    url: string,
    body: T,
    options?: FetchRequest
  ): Promise<R> {
    return this.doFetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<R, T = unknown>(
    url: string,
    body: T,
    options?: FetchRequest | undefined
  ): Promise<R> {
    return this.doFetch(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(url: string, options?: FetchRequest | undefined): Promise<unknown> {
    return this.doFetch(url, {
      ...options,
      method: 'DELETE',
    });
  }

  private async doFetch(path: string, options: FetchRequest & RequestInit) {
    try {
      const url = this.baseUrl ? `${this.baseUrl}/${path}` : path;
      const res = await this.fetch(url, options);

      if (!res.ok) {
        const errorRes = await this.getBody(res, options.responseType);
        throw new FetchError(res.statusText, errorRes);
      }

      return this.getBody(res, options.responseType);
    } catch (error) {
      if (error instanceof FetchError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new FetchError(error.message, error.name, error.stack);
      }
      throw error;
    }
  }

  private async getBody(
    res: Response,
    options: FetchRequest['responseType'] = 'json'
  ) {
    switch (options) {
      case 'json': {
        const body = await res.text();
        return body !== '' ? JSON.parse(body) : null;
      }
      case 'blob':
        return res.blob();
      case 'arraybuffer':
        return res.arrayBuffer();
      default:
        return res.text();
    }
  }
}
