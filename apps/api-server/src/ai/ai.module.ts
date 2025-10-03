import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AI_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'ai',
          protoPath: join(
            __dirname,
            '../../../ai-server/proto/ai_service.proto',
          ),
          url: '127.0.0.1:50051',
        },
      },
    ]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
