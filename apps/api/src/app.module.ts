import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { UsersModule } from './users/users.module';
import { InviteCodesModule } from './invite-codes/invite-codes.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LocalRedisModule } from './redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LocalRedisModule,
    AuthModule,
    LinksModule,
    UsersModule,
    InviteCodesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
