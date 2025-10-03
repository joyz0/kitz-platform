import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BaseService } from '../common/base.service';
import type { IAIService, ChatRequest, ChatResponse, KeywordResponse } from './ai.interface';

@Injectable()
export class AiService extends BaseService implements OnModuleInit {
  private aiService: IAIService;

  constructor(@Inject('AI_SERVICE') private client: ClientGrpc) {
    super(AiService.name);
  }

  onModuleInit() {
    this.aiService = this.client.getService<IAIService>('AIService');
    this.logInfo('AI gRPC client initialized');
  }

  async processChat(
    userId: string,
    message: string,
    sessionId?: string,
  ): Promise<ChatResponse> {
    try {
      const request: ChatRequest = {
        user_id: userId,
        message,
        session_id: sessionId,
      };

      const response = (await firstValueFrom(
        this.aiService.ProcessChat(request) as any,
      )) as ChatResponse;

      this.logSuccess('Chat processed successfully', {
        userId,
        intent: response.intent,
      });

      return response;
    } catch (error) {
      this.logWarning('Failed to process chat', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async matchKeyword(message: string): Promise<KeywordResponse> {
    try {
      const response = (await firstValueFrom(
        this.aiService.MatchKeyword({ message }) as any,
      )) as KeywordResponse;

      this.logSuccess('Keyword matched', { intent: response.intent });

      return response;
    } catch (error) {
      this.logWarning('Failed to match keyword', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}
