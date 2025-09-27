import { EventType } from './constants';
import { CustomEventBus } from './event';

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

export class Request {
  static token: string | null = null;

  private static buildHeaders(
    url: string,
    options?: RequestInit,
    defaultHeaders: Record<string, string> = {},
  ): Headers {
    const headers = new Headers();

    // 设置默认 headers
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    const isPublic = whiteList.some((path) => url.indexOf(path) > -1);

    // 检查是否已有手动传入的 Authorization
    let hasAuthHeader = false;
    if (options?.headers) {
      const incomingHeaders = new Headers(options.headers);
      hasAuthHeader =
        incomingHeaders.has('Authorization') ||
        incomingHeaders.has('authorization');
    }

    // 如果不是公开接口且没有手动传入 Authorization，使用 Request.token
    if (!isPublic && !hasAuthHeader && Request.token) {
      headers.set('Authorization', `Bearer ${Request.token}`);
    }

    // 然后添加传入的 headers，会覆盖同名的默认值
    if (options?.headers) {
      const incomingHeaders = new Headers(options.headers);
      incomingHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  static async get<
    Q extends QueryParams = QueryParams,
    R = any,
    O extends RequestInit = RequestInit,
  >(url: string, queryData?: Q, options?: O): Promise<R> {
    const urlObj = new URL(url, undefined);
    const params = queryData || {};

    const headers = Request.buildHeaders(url, options);

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

  static async post<B = PostBody, R = any, O extends RequestInit = RequestInit>(
    url: string,
    body?: B,
    options?: O,
  ): Promise<R> {
    const headers = Request.buildHeaders(url, options, {
      'Content-Type': 'application/json',
    });

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
}

export async function get<
  Q extends QueryParams = QueryParams,
  R = any,
  O extends RequestInit = RequestInit,
>(url: string, queryData?: Q, options?: O): Promise<R> {
  return Request.get(url, queryData, options);
}

type PostBody = Record<string, any> | FormData | BodyInit;

export async function post<
  B = PostBody,
  R = any,
  O extends RequestInit = RequestInit,
>(url: string, body?: B, options?: O): Promise<R> {
  return Request.post(url, body, options);
}
