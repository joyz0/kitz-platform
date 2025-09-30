import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CustomException } from '../exceptions/custom.exception';
import { StatusCodeMap, StatusCodeLabels } from '@repo/types/enums/status-code';
import { User } from '@repo/types';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: Pick<User, 'email' | 'password'>) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new CustomException(
        StatusCodeMap.UNAUTHORIZED,
        StatusCodeLabels[StatusCodeMap.UNAUTHORIZED.toString()],
        StatusCodeMap.UNAUTHORIZED
      );
    }
    return this.authService.login(user);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
