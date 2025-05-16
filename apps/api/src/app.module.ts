import { Module } from '@nestjs/common';
import { AuthModule } from './auth/jwt.module';
import { LinksModule } from './links/links.module';
import { UsersModule } from './users/users.module';
import { InviteCodesModule } from './invite-codes/invite-codes.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    LinksModule,
    UsersModule,
    InviteCodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
