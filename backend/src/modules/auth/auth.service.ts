import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
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
import { MaybeNull } from 'src/utils/types/nullable.type';
import { RoleEnum } from '../roles/roles.enum';
import { SessionService } from '../session/service/session.service';
import { StatusEnum } from '../status/enum/statuses.enum';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthConfig } from './config/auth.config';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-email-register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthProvidersEnum } from './enum/auth-providers.enum';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private sessionService: SessionService,
    // private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  @InjectMapper() protected readonly mapper: Mapper;

  async register(createUserDto: AuthRegisterLoginDto): Promise<UserDto> {
    const _userEntity = this.mapper.map(createUserDto, UserDto, UserEntity);

    const entity = await this.usersService.create(_userEntity);

    const userDto = this.mapper.map(entity, UserEntity, UserDto);

    return userDto;
  }

  async me(userJwtPayload: JwtPayloadType): Promise<MaybeNull<UserDto>> {
    const entity = await this.usersService.findOneById(userJwtPayload.id);

    const userDto = this.mapper.map(entity, UserEntity, UserDto);

    return userDto;
  }

  async logout(sessionId: number): Promise<boolean> {
    return await this.sessionService.remove(sessionId);
  }

  async validateUser(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const entity = await this.usersService.findOne({
      where: { email },
    });

    if (!entity) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (entity.provider.toString() !== AuthProvidersEnum.EMAIL.toString()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: `needLoginViaProvider:${entity.provider}`,
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      entity.password || '',
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
        id: entity.id,
        email: entity.email,
      },
      hash,
    });

    const { accessToken, refreshToken, accessExpires, refreshExpires } =
      await this.getTokensData({
        id: entity.id,
        role: entity.role.name,
        sessionId: session.id,
        hash,
      });

    const userDto = this.mapper.map(entity, UserEntity, UserDto);

    return {
      accessToken,
      refreshToken,
      accessExpires,
      refreshExpires,
      user: userDto,
    };
  }

  async getTokensData(data: {
    id: string;
    role: string;
    sessionId: number;
    hash: string;
  }) {
    const authConfig = this.configService.get(AUTH_CONFIG_REGISTER as any, {
      infer: true,
    }) as AuthConfig;

    const accessExpiresIn = authConfig.expires || '15m';
    const refreshExpiresIn = authConfig.refreshExpires || '7d';

    const accessExpires = Date.now() + ms(accessExpiresIn);
    const refreshExpires = Date.now() + ms(refreshExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: authConfig.secret,
          expiresIn: accessExpiresIn,
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
      accessExpires,
      refreshExpires,
    };
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = await this.sessionService.findOneById(data.sessionId);

    if (!session || session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(session.user.id);

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.sessionService.update(session.id, { hash });

    const { accessToken, refreshToken, accessExpires, refreshExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role.name,
        sessionId: session.id,
        hash,
      });

    return {
      accessToken,
      refreshToken,
      accessExpires,
      refreshExpires,
    };
  }
}
