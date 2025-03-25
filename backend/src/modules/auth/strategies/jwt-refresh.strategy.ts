import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

import { AuthConfig } from '../config/auth.config';
import { AUTH_CONFIG_REGISTER } from 'src/config/config.type';
import { MaybeNever } from 'src/utils/types/or-never.type';
import { Request } from 'express';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    const authConfig = configService.get(AUTH_CONFIG_REGISTER, {
      infer: true,
    }) as AuthConfig;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh_token, // get token from Cookie, if not existed
        ExtractJwt.fromAuthHeaderAsBearerToken(), // get token from Authorization Header
      ]),
      ignoreExpiration: false,

      secretOrKey: authConfig.refreshSecret,
    });
  }

  public validate(
    payload: JwtRefreshPayloadType,
  ): MaybeNever<JwtRefreshPayloadType> {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
