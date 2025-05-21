export enum StatusCode {
  SUCCESS = 200, // 成功
  BAD_REQUEST = 400, // 请求错误
  UNAUTHORIZED = 401, // 未授权
  FORBIDDEN = 403, // 禁止访问
  NOT_FOUND = 404, // 资源不存在
  INTERNAL_ERROR = 500, // 服务器错误

  // 扩展业务状态码（6位数字，前3位代表模块）
  DB_ERROR = 101001,
  DB_UNIQUE_CONSTRAINT_FAILED = 101002,
  DB_RECORD_NOT_FOUND = 101003,
  USER_NOT_EXIST = 200001,
  ORDER_EXPIRED = 300001,
}
