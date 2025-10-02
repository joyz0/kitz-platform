import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { UserRole } from '@repo/types';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    const mockContext = createMockContext({ role: UserRole.USER });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should return true if empty roles array', () => {
    const mockContext = createMockContext({ role: UserRole.USER });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should return true if user has required role', () => {
    const mockContext = createMockContext({ role: UserRole.ADMIN });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should return true if user has one of the required roles', () => {
    const mockContext = createMockContext({ role: UserRole.ADMIN });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ]);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user does not have required role', () => {
    const mockContext = createMockContext({ role: UserRole.USER });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user is not present', () => {
    const mockContext = createMockContext(null);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user has no role', () => {
    const mockContext = createMockContext({});
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should call reflector with correct arguments', () => {
    const mockContext = createMockContext({ role: UserRole.ADMIN });
    const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

    guard.canActivate(mockContext);

    expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
      mockContext.getHandler(),
      mockContext.getClass(),
    ]);
  });

  function createMockContext(user: any): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  }
});
