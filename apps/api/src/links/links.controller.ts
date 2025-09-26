import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { LinksService } from './links.service';
import {
  type LinkCreateDto,
  type LinkUpdateDto,
  type LinkQueryDto,
  linkCreateSchema,
  linkUpdateSchema,
  linkQuerySchema,
} from '@repo/types';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller({
  path: 'links',
  version: '1',
})
@UseGuards(AuthGuard('jwt'))
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(linkCreateSchema))
  create(@Body() createLinkDto: LinkCreateDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(linkQuerySchema))
    query: LinkQueryDto,
  ) {
    return this.linksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(linkUpdateSchema))
  update(@Param('id') id: string, @Body() updateLinkDto: LinkUpdateDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
