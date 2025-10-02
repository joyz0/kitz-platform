import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalRedisModule } from '../redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LocalRedisModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const expiresIn = parseInt(config.get('TOKEN_EXPIRES_IN_HOURS') || '1');
        return {
          secret: config.get('AUTH_SECRET'),
          signOptions: {
            expiresIn: `${expiresIn}h`,
            algorithm: 'HS256',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
