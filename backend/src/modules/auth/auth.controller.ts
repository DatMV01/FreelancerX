import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NullableType } from 'src/utils/types/nullable.type';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { UserDto } from '../users/dto/user.dto';
import { Response, Request } from 'express';
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('email/login')
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const loginResponse = await this.service.validateUser(loginDto);

    const { accessToken, refreshToken } = loginResponse;
    const userAgent = req.headers['user-agent'];
    if (userAgent && userAgent.includes('Mozilla')) {
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

    return loginResponse;
  }

  @Post('email/login-api')
  @UseGuards(AuthGuard('local'))
  public loginAPI(@Req() req, @Body() loginDto: AuthEmailLoginDto) {
    return req.user;
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public me(@Req() request): Promise<NullableType<UserDto>> {
    return this.service.me(request.user);
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

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  public async delete(@Req() request): Promise<boolean> {
    return this.service.delete(request.user.id);
  }
}
