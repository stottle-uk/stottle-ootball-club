import {
  FetchClient,
  FetchRequest,
  IFetchService,
} from '@ootball-club/http-client';
import { createContext, useCallback, useContext } from 'react';
import { environment } from '../../environments/environment';

type FetchHeaders = FetchRequest['headers'];
type FetchOptions = Omit<FetchRequest, 'headers'>;

const FetchServiceContext = createContext<IFetchService>(
  new FetchClient(environment.apiUrl)
);

export const useFetch = () => {
  const fetch = useContext(FetchServiceContext);

  const get = useCallback(
    <T>(url: string, headers?: FetchHeaders, opts?: FetchOptions) =>
      fetch.get<T>(url, { headers, ...opts }),
    [fetch]
  );

  const post = useCallback(
    <T>(
      url: string,
      body: unknown,
      headers: FetchHeaders,
      opts?: FetchOptions
    ) => fetch.put<T>(url, body, { headers, ...opts }),
    [fetch]
  );

  const put = useCallback(
    <T>(
      url: string,
      body: unknown,
      headers: FetchHeaders,
      opts?: FetchOptions
    ) => fetch.put<T>(url, body, { headers, ...opts }),
    [fetch]
  );

  const patch = useCallback(
    <T>(
      url: string,
      body: unknown,
      headers: FetchHeaders,
      opts?: FetchOptions
    ) => fetch.patch<T>(url, body, { headers, ...opts }),
    [fetch]
  );

  const del = useCallback(
    (url: string, headers: FetchHeaders, opts?: FetchOptions) =>
      fetch.delete(url, { headers, ...opts }),
    [fetch]
  );

  return { get, post, put, patch, del };
};
