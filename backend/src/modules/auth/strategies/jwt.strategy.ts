import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MaybeNever } from 'src/utils/types/or-never.type';
import { AuthConfig } from '../config/auth.config';
import { JwtPayloadType } from './types/jwt-payload.type';
import { AUTH_CONFIG_REGISTER } from 'src/config/config.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const authConfig = configService.get(AUTH_CONFIG_REGISTER, {
      infer: true,
    }) as AuthConfig;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token, // get token from Cookie, if not existed
        ExtractJwt.fromAuthHeaderAsBearerToken(), // get token from Authorization Header
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    });
  }
  public validate(payload: JwtPayloadType): MaybeNever<JwtPayloadType> {
    if (!payload || !payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
