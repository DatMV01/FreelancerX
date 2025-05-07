import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_CONFIG_REGISTER } from 'src/config/config.type';
import { MaybeNull } from 'src/utils/types/nullable.type';
import { AuthConfig } from '../config/auth.config';
import { JwtAccessPayloadType } from './types/jwt-access-payload.type';

@Injectable()
export class JwtStrategyOptional extends PassportStrategy(Strategy, 'jwt-optinal') {
  constructor(private readonly configService: ConfigService) {
    const authConfig = configService.get<AuthConfig>(AUTH_CONFIG_REGISTER, {
      infer: true,
    });

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return (
            req?.cookies?.access_token ??
            ExtractJwt.fromAuthHeaderAsBearerToken()(req)
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfig?.secret,
      passReqToCallback: true,
    });
  }

  public validate(
    req: Request,
    payload: JwtAccessPayloadType,
  ): MaybeNull<JwtAccessPayloadType> {
    // Không ném lỗi nếu không có payload (token không tồn tại hoặc sai)
    if (!payload) {
      return null;
    }

    // Trả ra payload (nếu có)

    return payload;
  }
}
