import { PaginateQueryDto } from './paginate-query.dto';

export class PaginateResultDto<T> {
    constructor(
      public data: T[],
      public total: number,
      public pageNo: number,
      public pageSize: number,
      public totalPages: number,
    ) {}
  
    static from<T>(data: T[], total: number, query: PaginateQueryDto): PaginateResultDto<T> {
      return new PaginateResultDto(
        data,
        total,
        query.pageNo,
        query.pageSize,
        Math.ceil(total / query.pageSize),
      );
    }
  }