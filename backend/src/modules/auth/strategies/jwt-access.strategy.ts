import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MaybeNever } from 'src/utils/types/or-never.type';
import { AuthConfig } from '../config/auth.config';
import { JwtAccessPayloadType } from './types/jwt-access-payload.type';
import { AUTH_CONFIG_REGISTER } from 'src/config/config.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const authConfig = configService.get<AuthConfig>(AUTH_CONFIG_REGISTER, {
      infer: true,
    });

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const accessToken =
            req?.cookies?.access_token ??
            ExtractJwt.fromAuthHeaderAsBearerToken()(req);

          if (!accessToken) {
            console.warn(
              '⚠️ No access token found in cookies or Authorization header',
            );
          }

          return accessToken;
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
      passReqToCallback: true, // Allow req access in validate()
    });
  }

  public validate(
    req: Request,
    payload: JwtAccessPayloadType,
  ): MaybeNever<JwtAccessPayloadType> {
    if (!payload?.sessionId) {
      console.error('❌ Invalid access token: missing sessionId');
      throw new UnauthorizedException('Invalid session');
    }

    return payload;
  }
}
