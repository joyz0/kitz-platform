import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../common/base.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '@repo/api/users/entities/user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService extends BaseService {
  private readonly expiresIn = parseInt(
    process.env.REFRESH_TOKEN_EXPIRES_IN || '7',
  );
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    super(AuthService.name);
  }

  async validateUser(email: string, pwd: string): Promise<Partial<UserEntity>> {
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
      const decoded = this.jwtService.verify(refreshToken);
      const userId = decoded.sub;

      // 验证 Redis 中的 refreshToken 是否匹配
      const storedToken = await this.redisService.get(
        `refresh_token:${userId}`,
      );
      if (refreshToken !== storedToken) {
        throw new Error('Invalid refresh token');
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

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
