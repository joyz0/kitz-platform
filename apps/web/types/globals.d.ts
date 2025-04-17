interface ResponseMeta {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    rowCount: number;
  }
  
  declare interface KitResponse<D = any> {
    success?: boolean;
    data?: D;
    message?: string;
    meta?: ResponseMeta;
  }
  
  declare interface KitSelectItem {
    label: string;
    value: string;
  }
  