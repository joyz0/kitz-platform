import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import type { User } from '@repo/types';
import type { ChatResponse, KeywordResponse } from './ai.interface';

describe('AiController', () => {
  let controller: AiController;
  let aiService: AiService;

  const mockUser: Partial<User> = {
    id: 'user123',
    email: 'test@example.com',
  };

  const mockChatResponse: ChatResponse = {
    reply: '✅ 已为您查询，结果：订单已发货',
    intent: 'query_order_status',
    mcp_command: 'order_service.get_status',
    parameters: { order_id: '123456' },
    matched: true,
  };

  const mockKeywordResponse: KeywordResponse = {
    intent: 'query_order_status',
    matched_keywords: ['订单', '状态'],
    parameters: { order_id: '123456' },
    matched: true,
    user_guide: '您想查询订单状态吗？',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: {
            processChat: jest.fn(),
            matchKeyword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    aiService = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('chat', () => {
    it('should process chat successfully with sessionId', async () => {
      const chatDto = {
        message: '我的订单123456状态怎么样？',
        sessionId: 'session123',
      };

      jest.spyOn(aiService, 'processChat').mockResolvedValue(mockChatResponse);

      const result = await controller.chat(mockUser as User, chatDto);

      expect(aiService.processChat).toHaveBeenCalledWith(
        mockUser.id,
        chatDto.message,
        chatDto.sessionId,
      );
      expect(result).toEqual(mockChatResponse);
      expect(result.intent).toBe('query_order_status');
      expect(result.matched).toBe(true);
    });

    it('should process chat successfully without sessionId', async () => {
      const chatDto = {
        message: '我想退货',
      };

      const refundResponse: ChatResponse = {
        reply: '正在为您办理退货...',
        intent: 'query_return_policy',
        mcp_command: 'policy_service.get_return_policy',
        parameters: {},
        matched: true,
      };

      jest.spyOn(aiService, 'processChat').mockResolvedValue(refundResponse);

      const result = await controller.chat(mockUser as User, chatDto);

      expect(aiService.processChat).toHaveBeenCalledWith(
        mockUser.id,
        chatDto.message,
        undefined,
      );
      expect(result).toEqual(refundResponse);
      expect(result.intent).toBe('query_return_policy');
    });

    it('should handle unmatched intent', async () => {
      const chatDto = {
        message: '今天天气真好',
      };

      const unmatchedResponse: ChatResponse = {
        reply: '抱歉，我暂时无法处理这个问题。',
        intent: '',
        parameters: {},
        matched: false,
      };

      jest.spyOn(aiService, 'processChat').mockResolvedValue(unmatchedResponse);

      const result = await controller.chat(mockUser as User, chatDto);

      expect(result.matched).toBe(false);
      expect(result.reply).toContain('抱歉');
    });

    it('should propagate errors from service', async () => {
      const chatDto = {
        message: '我的订单123456状态怎么样？',
      };

      const error = new Error('gRPC service unavailable');
      jest.spyOn(aiService, 'processChat').mockRejectedValue(error);

      await expect(controller.chat(mockUser as User, chatDto)).rejects.toThrow(
        'gRPC service unavailable',
      );
    });
  });

  describe('match', () => {
    it('should match keyword successfully', async () => {
      const dto = {
        message: '订单123456',
      };

      jest.spyOn(aiService, 'matchKeyword').mockResolvedValue(mockKeywordResponse);

      const result = await controller.match(dto);

      expect(aiService.matchKeyword).toHaveBeenCalledWith(dto.message);
      expect(result).toEqual(mockKeywordResponse);
      expect(result.intent).toBe('query_order_status');
      expect(result.matched_keywords).toContain('订单');
    });

    it('should handle unmatched keywords', async () => {
      const dto = {
        message: '随便说点什么',
      };

      const unmatchedResponse: KeywordResponse = {
        intent: '',
        matched_keywords: [],
        parameters: {},
        matched: false,
        user_guide: '抱歉，我暂时无法处理这个问题。',
      };

      jest.spyOn(aiService, 'matchKeyword').mockResolvedValue(unmatchedResponse);

      const result = await controller.match(dto);

      expect(result.matched).toBe(false);
      expect(result.matched_keywords).toHaveLength(0);
    });

    it('should propagate errors from service', async () => {
      const dto = {
        message: '订单123456',
      };

      const error = new Error('Service error');
      jest.spyOn(aiService, 'matchKeyword').mockRejectedValue(error);

      await expect(controller.match(dto)).rejects.toThrow('Service error');
    });
  });
});
