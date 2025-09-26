import { Injectable, NotFoundException } from '@nestjs/common';
import { linkRepo } from '@repo/database';
import {
  Link,
  LinkCreateDto,
  LinkUpdateDto,
  LinkQueryDto,
  createPaginateResponse,
  ApiResponse,
} from '@repo/types';
import { BaseService } from '../common/base.service';

@Injectable()
export class LinksService extends BaseService {
  constructor() {
    super(LinksService.name);
  }

  async create(createLinkDto: LinkCreateDto): Promise<Link> {
    try {
      this.validateRequired(createLinkDto.title, 'title');
      this.validateRequired(createLinkDto.url, 'url');

      const link = await linkRepo.create({
        data: createLinkDto,
      });

      this.logSuccess('Link created', { id: link.id, title: link.title });
      return link;
    } catch (error) {
      this.handleError(error, 'create link');
    }
  }

  async findAll(query: LinkQueryDto): Promise<ApiResponse<any>> {
    try {
      // 构建查询条件
      const where: any = {};
      if (query.title) where.title = { contains: query.title };
      if (query.url) where.url = { contains: query.url };
      if (query.description) where.description = { contains: query.description };

      // 时间范围查询
      if (query.startTime || query.endTime) {
        where.createdAt = {};
        if (query.startTime) where.createdAt.gte = query.startTime;
        if (query.endTime) where.createdAt.lte = query.endTime;
      }

      // 排序参数转换
      const orderBy = {
        [query.sortBy]: query.sortOrder === 'ascend' ? 'asc' : 'desc',
      };

      const pageNo = query.pageNo;
      const pageSize = query.pageSize;

      const [data, total] = await Promise.all([
        linkRepo.findMany({
          where,
          skip: (pageNo - 1) * pageSize,
          take: pageSize,
          orderBy,
        }),
        linkRepo.count({ where }),
      ]);

      this.logSuccess('Links retrieved', { total, pageNo, pageSize });
      return createPaginateResponse(data, total, pageNo, pageSize);
    } catch (error) {
      this.handleError(error, 'fetch links');
    }
  }

  async findOne(id: string): Promise<Link> {
    try {
      this.validateRequired(id, 'id');

      const link = await linkRepo.findById(id);
      if (!link) {
        this.logWarning('Link not found', `ID: ${id}`);
        throw new NotFoundException(`Link with ID ${id} not found`);
      }

      return link;
    } catch (error) {
      this.handleError(error, `find link by ID: ${id}`);
    }
  }

  async update(id: string, updateLinkDto: LinkUpdateDto): Promise<Link> {
    try {
      this.validateRequired(id, 'id');

      // 确保链接存在
      await this.findOne(id);

      const link = await linkRepo.update({
        where: { id },
        data: updateLinkDto,
      });

      this.logSuccess('Link updated', {
        id: link.id,
        updatedFields: Object.keys(updateLinkDto)
      });
      return link;
    } catch (error) {
      this.handleError(error, `update link with ID: ${id}`);
    }
  }

  async remove(id: string): Promise<Link> {
    try {
      this.validateRequired(id, 'id');

      // 确保链接存在
      await this.findOne(id);

      const link = await linkRepo.deleteById(id);
      this.logSuccess('Link deleted', { id: link.id });
      return link;
    } catch (error) {
      this.handleError(error, `delete link with ID: ${id}`);
    }
  }
}
