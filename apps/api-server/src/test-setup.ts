import { jest } from '@jest/globals';

jest.mock('@repo/prisma', () => ({
  prisma: {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}));

jest.mock('@repo/database');
