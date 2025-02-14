import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as ms from 'ms';
import { AllConfigType, AUTH_CONFIG_REGISTER } from 'src/config/config.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { AuthConfig } from './config/auth.config';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthProvidersEnum } from './enum/auth-providers.enum';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { UsersService } from '../users/users.service';
import { SessionService } from '../session/service/session.service';
import { RoleDto } from '../roles/dto/role.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../status/enum/statuses.enum';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    // private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateUser(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user: {
        id: user.id,
      },
      hash,
    });

    const { accessToken, refreshToken, tokenExpires, refreshExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role,
        sessionId: session.id,
        hash,
      });

    return {
      accessToken,
      refreshToken,
      accessExpires: tokenExpires,
      refreshExpires,
      user,
    };
  }

  async getTokensData(data: {
    id: string;
    role: RoleDto | null | undefined;
    sessionId: number;
    hash: string;
  }) {
    const authConfig = this.configService.get(AUTH_CONFIG_REGISTER as any, {
      infer: true,
    }) as AuthConfig;

    const tokenExpiresIn = authConfig.expires || '15m';
    const refreshExpiresIn = authConfig.refreshExpires || '7d';

    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    const refreshExpires = Date.now() + ms(refreshExpiresIn);

    console.log('====================================');
    console.log(authConfig.expires);
    console.log(authConfig.refreshExpires);
    console.log('====================================');

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: authConfig.secret,
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: authConfig.refreshSecret,
          expiresIn: refreshExpiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenExpires,
      refreshExpires,
    };
  }

  async register(createUserDto: AuthRegisterLoginDto): Promise<UserDto> {
    const createUser = await this.usersService.create({
      ...createUserDto,
      email: createUserDto.email,
      role: {
        id: RoleEnum.REGISTERED,
      } as any,
      status: {
        id: StatusEnum.PENDING_VERIFICATION,
      } as any,
    });

    return createUser;
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = await this.sessionService.findOne(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.findById(session.user.id);

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { accessToken, refreshToken, tokenExpires, refreshExpires } =
      await this.getTokensData({
        id: session.user.id,
        role: {
          id: user.role.id,
        } as any,
        sessionId: session.id,
        hash,
      });

    return {
      accessToken,
      refreshToken,
      accessExpires: tokenExpires,
      refreshExpires,
    };
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<UserDto>> {
    return this.usersService.findById(userJwtPayload.id);
  }

  async logout(sessionId: number): Promise<boolean> {
    return await this.sessionService.remove(Number(sessionId));
  }

  async delete(user: string): Promise<boolean> {
    return await this.usersService.delete(user);
  }
}
