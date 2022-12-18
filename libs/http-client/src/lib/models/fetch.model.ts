export type FetchRequest = Omit<
  RequestInit & {
    responseType?: 'text' | 'json' | 'blob' | 'arraybuffer';
  },
  'body' | 'method'
>;

type FetchTextRequest = FetchRequest & {
  responseType: 'text';
};

type FetchBlobRequest = FetchRequest & {
  responseType: 'blob';
};

type FetchArraybufferRequest = FetchRequest & {
  responseType: 'arraybuffer';
};

interface IFetchGet {
  get(url: string, options: FetchTextRequest): Promise<string>;
  get(url: string, options: FetchBlobRequest): Promise<Blob>;
  get(url: string, options: FetchArraybufferRequest): Promise<ArrayBuffer>;
  get<T>(url: string, options?: FetchRequest): Promise<T>;
}

interface IFetchPost {
  post<T = unknown>(
    url: string,
    body: T,
    options: FetchTextRequest
  ): Promise<string>;
  post<R, T = unknown>(
    url: string,
    body: T,
    options?: FetchRequest
  ): Promise<R>;
}

interface IFetchPut {
  put<T = unknown>(
    url: string,
    body: T,
    options: FetchTextRequest
  ): Promise<string>;
  put<R, T = unknown>(url: string, body: T, options?: FetchRequest): Promise<R>;
}

interface IFetchPatch {
  patch<T = unknown>(
    url: string,
    body: T,
    options: FetchTextRequest
  ): Promise<string>;
  patch<R, T = unknown>(
    url: string,
    body: T,
    options?: FetchRequest
  ): Promise<R>;
}

interface IFetchDelete {
  delete(url: string, options?: FetchRequest): Promise<unknown>;
}

export interface IFetchService
  extends IFetchGet,
    IFetchPost,
    IFetchPut,
    IFetchPatch,
    IFetchDelete {}

export class FetchError extends Error {
  constructor(
    public override readonly message: string,
    public readonly error: unknown,
    public override readonly stack?: string
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
