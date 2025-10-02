import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../common/base.service';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '../exceptions/custom.exception';
import { StatusCodeMap, StatusCodeLabels } from '@repo/types/enums/status-code';
import { isJWTError } from '../common/type-guards';
import type { User } from '@repo/types';

@Injectable()
export class AuthService extends BaseService {
  private expiresIn: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {
    super(AuthService.name);
    this.expiresIn = parseInt(
      this.config.get('REFRESH_TOKEN_EXPIRES_IN_DAYS') || '7',
    );
  }

  async validateUser(email: string, pwd: string): Promise<Partial<User>> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (user && (await bcrypt.compare(pwd, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      this.handleError(error, `Validate user with Email failed: ${email}`);
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${this.expiresIn}d`,
    });

    // 将 refreshToken 存入 Redis，有效期 7 天
    await this.redisService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      this.expiresIn * 24 * 60 * 60,
    );
    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // 验证 refreshToken 格式
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new CustomException(
          StatusCodeMap.REFRESH_TOKEN_INVALID,
          StatusCodeLabels[StatusCodeMap.REFRESH_TOKEN_INVALID.toString()],
          StatusCodeMap.BAD_REQUEST
        );
      }

      // 验证 JWT 签名和过期时间
      const decoded = this.jwtService.verify(refreshToken);
      const userId = decoded.sub;

      if (!userId) {
        throw new CustomException(
          StatusCodeMap.REFRESH_TOKEN_INVALID,
          StatusCodeLabels[StatusCodeMap.REFRESH_TOKEN_INVALID.toString()],
          StatusCodeMap.UNAUTHORIZED
        );
      }

      // 验证 Redis 中的 refreshToken 是否匹配
      const storedToken = await this.redisService.get(
        `refresh_token:${userId}`,
      );

      if (!storedToken) {
        throw new CustomException(
          StatusCodeMap.REFRESH_TOKEN_EXPIRED,
          StatusCodeLabels[StatusCodeMap.REFRESH_TOKEN_EXPIRED.toString()],
          StatusCodeMap.UNAUTHORIZED
        );
      }

      if (refreshToken !== storedToken) {
        throw new CustomException(
          StatusCodeMap.REFRESH_TOKEN_INVALID,
          StatusCodeLabels[StatusCodeMap.REFRESH_TOKEN_INVALID.toString()],
          StatusCodeMap.UNAUTHORIZED
        );
      }

      // 生成新 token
      const payload = { sub: userId, email: decoded.email };
      const newAccessToken = this.jwtService.sign(payload);
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: `${this.expiresIn}d`,
      });

      // 更新 Redis 中的 refreshToken
      await this.redisService.set(
        `refresh_token:${userId}`,
        newRefreshToken,
        this.expiresIn * 24 * 60 * 60,
      );

      this.logSuccess('Token refreshed successfully', { userId });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // 如果是自定义异常，直接抛出
      if (error instanceof CustomException) {
        throw error;
      }

      // 处理 JWT 相关错误
      if (isJWTError(error)) {
        if (error.name === 'TokenExpiredError') {
          throw new CustomException(
            StatusCodeMap.REFRESH_TOKEN_EXPIRED,
            StatusCodeLabels[StatusCodeMap.REFRESH_TOKEN_EXPIRED.toString()],
            StatusCodeMap.UNAUTHORIZED
          );
        }

        if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
          throw new CustomException(
            StatusCodeMap.REFRESH_TOKEN_INVALID,
            StatusCodeLabels[StatusCodeMap.REFRESH_TOKEN_INVALID.toString()],
            StatusCodeMap.UNAUTHORIZED
          );
        }
      }

      // 其他未知错误
      this.handleError(error, 'refresh token failed');
    }
  }
}
