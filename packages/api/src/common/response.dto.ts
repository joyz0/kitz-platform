export class Response<T> {
  readonly ok: boolean;
  readonly code: number;
  readonly message?: string;
  readonly data?: T;
  readonly timestamp: number;

  constructor(
    options: { ok?: boolean; code?: number; message?: string; data?: T } = {},
  ) {
    this.ok = Boolean(options.ok);
    this.code = options.code || 200;
    this.message = options.message || 'Success';
    this.data = options.data || undefined;
    this.timestamp = Date.now();
  }

  static success<T>(data?: T): Response<T> {
    return new Response({ ok: true, data });
  }

  static error(message: string, code: number = 500): Response<never> {
    return new Response({ ok: false, code, message });
  }

  static paginate<T>(
    items: T[],
    total: number,
    pageNo: number,
    pageSize: number,
  ): Response<{
    items: T[];
    meta: {
      total: number;
      pageNo: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    return new Response({
      ok: true,
      data: {
        items,
        meta: {
          total,
          pageNo,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  }
}
