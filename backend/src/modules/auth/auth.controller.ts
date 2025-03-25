import {
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
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  public async logout(
    @Req() request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return await this.service.logout(request.user.sessionId);
  }
}
