import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [UsersService],
  //   }).compile();

  //   service = module.get<UsersService>(UsersService);
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
