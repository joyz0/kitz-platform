import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { User } from '@repo/types';

class ChatDto {
  message: string;
  sessionId?: string;
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@CurrentUser() user: User, @Body() dto: ChatDto) {
    return this.aiService.processChat(user.id, dto.message, dto.sessionId);
  }

  @Post('match')
  async match(@Body() dto: { message: string }) {
    return this.aiService.matchKeyword(dto.message);
  }
}
