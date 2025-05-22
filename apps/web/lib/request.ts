import { EventType, TOKEN_STORAGE_KEY } from './constants';
import { CustomEventBus } from './event';
import { storage } from './storage';

type QueryParam = string | number | boolean | null | undefined;

interface QueryParams {
  [key: string]: QueryParam | QueryParam[];
}

const whiteList = ['/auth/login'];

async function ResponseInterceptor(response: Response) {
  const json = await response.json();
  if (!json.ok) {
    CustomEventBus.emit(EventType.REQUEST_ERROR, json.message);
    throw new Error(json.message);
  }
  return json;
}

export async function get<
  Q extends QueryParams = QueryParams,
  R = any,
  O extends RequestInit = RequestInit,
>(url: string, queryData?: Q, options?: O): Promise<R> {
  const token =
    typeof window === undefined ? null : storage.get(TOKEN_STORAGE_KEY);
  const urlObj = new URL(url, undefined);
  const params = queryData || {};

  const defaultHeaders: HeadersInit = {};
  const isPublic = whiteList.some((path) => url.indexOf(path) > -1);
  if (!isPublic && token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  const headers = new Headers(defaultHeaders);

  Object.entries(params).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach((item) => {
        if (item !== null && item !== undefined) {
          urlObj.searchParams.append(key, String(item));
        }
      });
    } else if (val !== null && val !== undefined) {
      urlObj.searchParams.append(key, String(val));
    }
  });

  const response = await fetch(urlObj.href, {
    ...options,
    method: 'GET',
    headers,
  });

  return ResponseInterceptor(response);
}

type PostBody = Record<string, any> | FormData | BodyInit;

export async function post<
  B = PostBody,
  R = any,
  O extends RequestInit = RequestInit,
>(url: string, body?: B, options?: O): Promise<R> {
  const token =
    typeof window === undefined ? null : storage.get(TOKEN_STORAGE_KEY);
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const isPublic = whiteList.some((path) => url.indexOf(path) > -1);
  if (!isPublic && token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Create a headers object combining defaults and options
  const headers = new Headers(defaultHeaders);
  if (options?.headers) {
    const incomingHeaders = new Headers(options.headers);
    incomingHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  // Remove Content-Type if body is FormData
  if (body instanceof FormData) {
    headers.delete('Content-Type');
  }

  // Stringify body only if it's a plain object and not FormData
  let processedBody: BodyInit | undefined;
  if (
    typeof body === 'object' &&
    body !== null &&
    !(body instanceof FormData)
  ) {
    processedBody = JSON.stringify(body);
  } else {
    processedBody = body as BodyInit;
  }

  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers,
    body: processedBody,
  });

  return ResponseInterceptor(response);
}
