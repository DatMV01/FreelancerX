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
import { CurrentUser } from 'src/common/decorators';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-email-register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAccessPayloadType } from './strategies/types/jwt-access-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public me(
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<UserDto> {
    return this.service.me(currentUser);
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const tokenResponse = await this.service.validateUser(loginDto);

    return this.handleResponseToken(tokenResponse, res);
  }

  @Post('email/register')
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<UserDto> {
    return await this.service.register(createUserDto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async refresh(
    @Req() request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const jwtRefreshPayload = request.user as JwtRefreshPayloadType;

    const tokenResponse = await this.service.refreshToken(jwtRefreshPayload);

    return this.handleResponseToken(tokenResponse, res);
  }

  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  public forgotPassword(
    @Body() forgotPassword: ForgotPasswordDto,
  ): Promise<any> {
    return this.service.forgotPassword(forgotPassword.email);
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  public resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    return this.service.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
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

  private handleResponseToken = (tokensData: any, res: Response) => {
    const {
      accessToken,
      refreshToken,
      accessMaxage,
      refreshMaxage,
      accessExpires,
      refreshExpires,
      user,
    } = tokensData;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessMaxage,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshMaxage,
    });

    return { accessToken, refreshToken, accessExpires, refreshExpires, user };
  };
}
