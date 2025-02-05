import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

import { AuthConfig } from '../config/auth.config';
import { AUTH_CONFIG_REGISTER } from 'src/config/config.type';
import { OrNeverType } from 'src/utils/types/or-never.type';

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.refreshSecret,
    });
  }

  public validate(
    payload: JwtRefreshPayloadType,
  ): OrNeverType<JwtRefreshPayloadType> {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
