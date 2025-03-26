import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { MaybeNull } from 'src/utils/types/nullable.type';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-email-register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public me(@Req() request): Promise<MaybeNull<UserDto>> {
    return this.service.me(request.user);
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const loginResponse = await this.service.validateUser(loginDto);

    const { accessToken, refreshToken } = loginResponse;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: loginResponse.accessExpires,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: loginResponse.refreshExpires,
    });

    return loginResponse;
  }

  @Post('email/register')
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<UserDto> {
    return await this.service.register(createUserDto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  public refresh(@Req() request): Promise<RefreshResponseDto> {
    const jwtRefreshPayload = request.user as JwtRefreshPayloadType;

    return this.service.refreshToken(jwtRefreshPayload);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    const isLogout = await this.service.logout(request.user.sessionId);

    if (!isLogout) {
      throw new BadRequestException('Logout failed');
    }

    return { message: 'Logout successful' };
  }
}
