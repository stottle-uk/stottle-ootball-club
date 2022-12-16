import {
  FetchClient,
  FetchRequest,
  IFetchService,
} from '@ootball-club/http-client';
import { createContext, useCallback, useContext } from 'react';

type FetchHeaders = FetchRequest['headers'];
type FetchOptions = Omit<FetchRequest, 'headers'>;

const FetchServiceContext = createContext<IFetchService>(new FetchClient());

export const useFetch = (baseUrl = '') => {
  const fetch = useContext(FetchServiceContext);

  const get = useCallback(
    <T>(url: string, headers?: FetchHeaders, opts?: FetchOptions) =>
      fetch.get<T>(`${baseUrl}${url}`, { headers, ...opts }),
    [baseUrl, fetch]
  );

  const post = useCallback(
    <T>(
      url: string,
      body: unknown,
      headers: FetchHeaders,
      opts?: FetchOptions
    ) => fetch.put<T>(`${baseUrl}${url}`, body, { headers, ...opts }),
    [baseUrl, fetch]
  );

  const put = useCallback(
    <T>(
      url: string,
      body: unknown,
      headers: FetchHeaders,
      opts?: FetchOptions
    ) => fetch.put<T>(`${baseUrl}${url}`, body, { headers, ...opts }),
    [baseUrl, fetch]
  );

  const patch = useCallback(
    <T>(
      url: string,
      body: unknown,
      headers: FetchHeaders,
      opts?: FetchOptions
    ) => fetch.patch<T>(`${baseUrl}${url}`, body, { headers, ...opts }),
    [baseUrl, fetch]
  );

  const del = useCallback(
    (url: string, headers: FetchHeaders, opts?: FetchOptions) =>
      fetch.delete(`${baseUrl}${url}`, { headers, ...opts }),
    [baseUrl, fetch]
  );

  return { get, post, put, patch, del };
};
