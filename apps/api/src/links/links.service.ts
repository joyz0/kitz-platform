import { Injectable } from '@nestjs/common';

import { Link, LinkCreateDto, LinkUpdateDto } from '@repo/types';

@Injectable()
export class LinksService {
  private readonly _links: Link[] = [
    {
      id: 0,
      title: 'Docs',
      url: 'https://turbo.build/docs',
      description:
        'Find in-depth information about Turborepo features and API.',
    },
    {
      id: 1,
      title: 'Learn',
      url: 'https://turbo.build/docs/handbook',
      description: 'Learn more about monorepos with our handbook.',
    },
    {
      id: 2,
      title: 'Templates',
      url: 'https://turbo.build/docs/getting-started/from-example',
      description:
        'Choose from over 15 examples and deploy with a single click.',
    },
    {
      id: 3,
      title: 'Deploy',
      url: 'https://vercel.com/new',
      description:
        'Instantly deploy your Turborepo to a shareable URL with Vercel.',
    },
  ];

  create(createLinkDto: LinkCreateDto) {
    return `This action adds a new link ${createLinkDto}`;
  }

  findAll() {
    return this._links;
  }

  findOne(id: number) {
    return `This action returns a #${id} link`;
  }

  update(id: number, updateLinkDto: LinkUpdateDto) {
    return `This action updates a #${id} link ${updateLinkDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} link`;
  }
}
