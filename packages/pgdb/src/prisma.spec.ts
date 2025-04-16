import { describe, it, expect, beforeEach } from '@jest/globals';
import { prisma } from './prisma';

describe('Prisma', () => {
  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('user create', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'test',
        email: '121@qq.com'
      }
    })
    expect(user).toHaveProperty('name');
  }, 10000);

  it('user findUnique', async () => {
    const user = await prisma.user.findUnique({ where: { email: '121@qq.com' } })
    expect(user).toHaveProperty('name');
  }, 10000);

  it('user delete', async () => {
    const user = await prisma.user.delete({ where: { email: '121@qq.com' } })
    expect(user).toHaveProperty('name');
  }, 10000);
});
