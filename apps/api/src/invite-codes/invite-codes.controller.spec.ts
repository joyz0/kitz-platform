import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { InviteCodesController } from './invite-codes.controller';
import { InviteCodesService } from './invite-codes.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInviteCodeDto } from '@repo/api/invite-codes/dto/create-invite-code.dto';
import { InviteCodeTypeEnum } from '@repo/api/enums/invite-code-type';
import { PaginateQuery } from '@repo/api/common/request.dto';
import { UpdateInviteCodeDto } from '@repo/api/invite-codes/dto/update-invite-code.dto';

describe('InviteCodesController', () => {
  let controller: InviteCodesController;
  let inviteCodesService: InviteCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InviteCodesController],
      providers: [
        {
          provide: InviteCodesService,
          useValue: {
            create: jest.fn(),
            paginate: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt')) // 绕过认证
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<InviteCodesController>(InviteCodesController);
    inviteCodesService = module.get<InviteCodesService>(InviteCodesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create', async () => {
    const dto: CreateInviteCodeDto = {
      expiresAt: new Date(),
      type: InviteCodeTypeEnum.REGISTER,
    };
    const mockResult = { code: 'ABC123', ...dto };

    jest.spyOn(inviteCodesService, 'create').mockResolvedValue(mockResult);

    expect(await controller.create(dto)).toEqual(mockResult);
    expect(inviteCodesService.create).toHaveBeenCalledWith(dto);
  });

  it('paginate', async () => {
    const query: PaginateQuery = { pageNo: 1, pageSize: 10 };
    const mockResult = {
      ok: true,
      code: 200,
      data: {
        items: [],
        meta: {
          pageNo: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      },
    };

    jest.spyOn(inviteCodesService, 'paginate').mockResolvedValue(mockResult);

    expect(await controller.paginate(query)).toEqual(mockResult);
    expect(inviteCodesService.paginate).toHaveBeenCalledWith(query);
  });

  it('findAll', async () => {
    const mockResult = [
      {
        code: 'TEST1',
        type: InviteCodeTypeEnum.REGISTER,
        expiresAt: new Date(),
      },
      {
        code: 'TEST2',
        type: InviteCodeTypeEnum.REGISTER,
        expiresAt: new Date(),
      },
    ];

    jest.spyOn(inviteCodesService, 'findAll').mockResolvedValue(mockResult);

    expect(await controller.findAll()).toEqual(mockResult);
    expect(inviteCodesService.findAll).toHaveBeenCalled();
  });

  it('findOne', async () => {
    const code = 'TEST123';
    const mockResult = {
      code,
      type: InviteCodeTypeEnum.REGISTER,
      expiresAt: new Date(),
    };

    jest.spyOn(inviteCodesService, 'findOne').mockResolvedValue(mockResult);

    expect(await controller.findOne(code)).toEqual(mockResult);
    expect(inviteCodesService.findOne).toHaveBeenCalledWith(code);
  });

  it('update', async () => {
    const code = 'TEST123';
    const dto: UpdateInviteCodeDto = { expiresAt: new Date() };
    const mockResult = { code, ...dto };

    jest.spyOn(inviteCodesService, 'update').mockResolvedValue(mockResult);

    expect(await controller.update(code, dto)).toEqual(mockResult);
    expect(inviteCodesService.update).toHaveBeenCalledWith(code, dto);
  });

  it('delete', async () => {
    const code = 'TEST123';
    const mockResult = { code };

    jest.spyOn(inviteCodesService, 'remove').mockResolvedValue(mockResult);

    expect(await controller.remove(code)).toEqual(mockResult);
    expect(inviteCodesService.remove).toHaveBeenCalledWith(code);
  });
});
