import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AiService } from './ai.service';
import { ClientGrpc } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import type { IAIService, ChatRequest, ChatResponse, KeywordRequest, KeywordResponse } from './ai.interface';

describe('AiService', () => {
  let service: AiService;
  let mockAiServiceClient: jest.Mocked<IAIService>;
  let mockClientGrpc: jest.Mocked<ClientGrpc>;

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
    mockAiServiceClient = {
      ProcessChat: jest.fn(),
      MatchKeyword: jest.fn(),
    } as any;

    mockClientGrpc = {
      getService: jest.fn().mockReturnValue(mockAiServiceClient),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: 'AI_SERVICE',
          useValue: mockClientGrpc,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize AI gRPC client', () => {
      expect(mockClientGrpc.getService).toHaveBeenCalledWith('AIService');
    });
  });

  describe('processChat', () => {
    it('should process chat successfully', async () => {
      const userId = 'user123';
      const message = '我的订单123456状态怎么样？';
      const sessionId = 'session123';

      const expectedRequest: ChatRequest = {
        user_id: userId,
        message,
        session_id: sessionId,
      };

      jest.spyOn(mockAiServiceClient, 'ProcessChat').mockReturnValue(of(mockChatResponse) as any);

      const result = await service.processChat(userId, message, sessionId);

      expect(mockAiServiceClient.ProcessChat).toHaveBeenCalledWith(expectedRequest);
      expect(result).toEqual(mockChatResponse);
      expect(result.intent).toBe('query_order_status');
      expect(result.matched).toBe(true);
    });

    it('should process chat without sessionId', async () => {
      const userId = 'user123';
      const message = '我想退货';

      const expectedRequest: ChatRequest = {
        user_id: userId,
        message,
        session_id: undefined,
      };

      jest.spyOn(mockAiServiceClient, 'ProcessChat').mockReturnValue(of(mockChatResponse) as any);

      const result = await service.processChat(userId, message);

      expect(mockAiServiceClient.ProcessChat).toHaveBeenCalledWith(expectedRequest);
      expect(result).toEqual(mockChatResponse);
    });

    it('should throw error when gRPC call fails', async () => {
      const userId = 'user123';
      const message = '我的订单123456状态怎么样？';
      const error = new Error('gRPC connection failed');

      jest.spyOn(mockAiServiceClient, 'ProcessChat').mockReturnValue(throwError(() => error) as any);

      await expect(service.processChat(userId, message)).rejects.toThrow('gRPC connection failed');
    });
  });

  describe('matchKeyword', () => {
    it('should match keyword successfully', async () => {
      const message = '订单123456';

      const expectedRequest: KeywordRequest = {
        message,
      };

      jest.spyOn(mockAiServiceClient, 'MatchKeyword').mockReturnValue(of(mockKeywordResponse) as any);

      const result = await service.matchKeyword(message);

      expect(mockAiServiceClient.MatchKeyword).toHaveBeenCalledWith(expectedRequest);
      expect(result).toEqual(mockKeywordResponse);
      expect(result.intent).toBe('query_order_status');
      expect(result.matched).toBe(true);
      expect(result.matched_keywords).toContain('订单');
    });

    it('should handle unmatched keywords', async () => {
      const message = '今天天气真好';

      const unmatchedResponse: KeywordResponse = {
        intent: '',
        matched_keywords: [],
        parameters: {},
        matched: false,
        user_guide: '抱歉，我暂时无法处理这个问题。',
      };

      jest.spyOn(mockAiServiceClient, 'MatchKeyword').mockReturnValue(of(unmatchedResponse) as any);

      const result = await service.matchKeyword(message);

      expect(result.matched).toBe(false);
      expect(result.matched_keywords).toHaveLength(0);
    });

    it('should throw error when keyword matching fails', async () => {
      const message = '订单123456';
      const error = new Error('Service unavailable');

      jest.spyOn(mockAiServiceClient, 'MatchKeyword').mockReturnValue(throwError(() => error) as any);

      await expect(service.matchKeyword(message)).rejects.toThrow('Service unavailable');
    });
  });
});
