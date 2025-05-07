import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as ms from 'ms';
import {
  AllConfigType,
  AUTH_CONFIG_REGISTER
} from 'src/config/config.type';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { RoleKey } from '../role/enum/role.enum';
import { SessionService } from '../session/session.service';
import { StatusEnum } from '../status/enum/statuses.enum';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthConfig } from './config/auth.config';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-email-register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthProvidersEnum } from './enum/auth-providers.enum';
import { JwtAccessPayloadType } from './strategies/types/jwt-access-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  @InjectMapper() protected readonly mapper: Mapper;

  authConfig = this.configService.get(AUTH_CONFIG_REGISTER as any, {
    infer: true,
  }) as AuthConfig;

  async register(createUserDto: AuthRegisterLoginDto): Promise<UserDto> {
    const _userEntity = this.mapper.map(
      createUserDto,
      AuthRegisterLoginDto,
      UserEntity,
    );

    const entity = await this.usersService.create(_userEntity);

    const userDto = this.mapper.map(entity, UserEntity, UserDto);

    return userDto;
  }

  async me(currentUser: JwtAccessPayloadType): Promise<UserDto> {
    const entity = await this.usersService.getUserBriefInfo({
      id: currentUser.id,
    });

    const userDto = this.mapper.map(entity, UserEntity, UserDto);

    return userDto;
  }

  async logout(sessionId: string): Promise<boolean> {
    return await this.sessionService.removeOneById(sessionId);
  }

  async validateUser(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const entity = await this.usersService.getUserBriefInfo({ email });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    if (entity.provider !== AuthProvidersEnum.EMAIL) {
      throw new BadRequestException('Please login using your social account');
    }

    if (!entity.roleId) {
      throw new ForbiddenException('Account role is not assigned');
    }

    if (entity.statusId === StatusEnum.LOCKED) {
      throw new ForbiddenException('Account is locked');
    }

    const isValidPassword = await bcrypt.compare(password, entity.password);

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        password: 'incorrectPassword',
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
      } as any,
      hash,
    });

    const userDto = this.mapper.map(entity, UserEntity, UserDto);

    const tokensData = await this.getTokensData({
      id: entity.id,
      role: entity.role.name as RoleKey,
      email: entity.email,
      sessionId: session.id,
      freelancerId: entity.freelancer?.id,
      hash,
    });

    return {
      ...tokensData,
      user: userDto,
    };
  }

  async refreshToken(
    jwtRefreshPayload: JwtRefreshPayloadType,
  ): Promise<LoginResponseDto> {
    const queryBuilder = this.sessionService.getQueryBuilder();

    const session = await queryBuilder
      .leftJoinAndSelect(`${queryBuilder.alias}.user`, 'user')
      .select([
        `${queryBuilder.alias}.id`,
        `${queryBuilder.alias}.hash`,
        'user.id',
        'user.email',
      ])
      .where(`${queryBuilder.alias}.id = :id`, {
        id: String(jwtRefreshPayload.sessionId),
      })
      .getOne();

    if (!session || session.hash !== jwtRefreshPayload.hash) {
      throw new UnauthorizedException();
    }

    const entity = await this.usersService.getUserBriefInfo({
      id: session.user.id,
    });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    if (entity.provider !== AuthProvidersEnum.EMAIL) {
      throw new BadRequestException('Please login using your social account');
    }

    if (!entity.roleId) {
      throw new ForbiddenException('Account role is not assigned');
    }

    if (entity.statusId === StatusEnum.LOCKED) {
      throw new ForbiddenException('Account is locked');
    }

    const newHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.sessionService.update(session.id, { hash: newHash });

    const tokensData = await this.getTokensData({
      id: entity.id,
      role: entity.role.name as RoleKey,
      email: entity.email,
      sessionId: session.id,
      freelancerId: entity?.freelancer?.id,
      hash: newHash,
    });

    const userDto = this.mapper.map(entity, UserEntity, UserDto);

    return {
      ...tokensData,
      user: userDto,
    };
  }

  async getTokensData({
    id,
    role,
    email,
    sessionId,
    freelancerId,
    hash,
  }: {
    id: string;
    role: RoleKey;
    email: string;
    sessionId: string;
    freelancerId?: string;
    hash: string;
  }) {
    const authConfig = this.configService.get(AUTH_CONFIG_REGISTER as any, {
      infer: true,
    }) as AuthConfig;

    const accessExpiresIn = authConfig.expires || '15m';
    const refreshExpiresIn = authConfig.refreshExpires || '7d';

    const accessExpires = Date.now() + ms(accessExpiresIn);
    const refreshExpires = Date.now() + ms(refreshExpiresIn);

    const accessPayload: Partial<JwtAccessPayloadType> = {
      id,
      email,
      role,
      sessionId,
      freelancerId,
    };

    const refreshPayload: Partial<JwtRefreshPayloadType> = {
      sessionId,
      hash,
    };

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(accessPayload, {
        secret: authConfig.secret,
        expiresIn: accessExpiresIn,
      }),

      await this.jwtService.signAsync(refreshPayload, {
        secret: authConfig.refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,

      accessExpires,
      refreshExpires,

      accessMaxage: ms(accessExpiresIn),
      refreshMaxage: ms(refreshExpiresIn),
    };
  }

  async forgotPassword(email: string) {
    const expiresIn = this.authConfig.forgotExpires || '15m';
    const secret = this.authConfig.forgotSecret || 'forgotSecret';
    const sessionId = uuidv4();
    const user = await this.usersService.findOne({ where: { email } });

    const resetToken = await this.jwtService.signAsync(
      { sessionId, userId: user.id, email: user.email },
      {
        expiresIn,
        secret,
      },
    );

    await this.sessionService.create({
      id: sessionId,
      hash: resetToken,
      user,
    });

    await this.mailService.forgotPassword({
      data: {
        hash: resetToken,
        tokenExpires: new Date(Date.now() + ms(expiresIn)).getTime() || 0,
      },
      to: email,
    });

    return {
      message: 'Password reset request has been sent to your email !',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const secret = this.authConfig.forgotSecret || 'forgotSecret';

    try {
      const { sessionId, userId, email, exp } = this.jwtService.verify(token, {
        secret,
      });

      const session = await this.sessionService.findOne({
        where: { id: sessionId, userId: userId },
      });

      if (!session || Date.now() > Number(exp * 1000)) {
        throw new BadRequestException('Invalid token');
      }

      await this.sessionService.removeOneById(sessionId);

      await this.usersService.update(userId, {
        password: await bcrypt.hash(newPassword, 10),
      });

      return { message: 'Password reset successfully! You can now log in.' };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    currentUser: JwtAccessPayloadType,
  ) {
    const userId = currentUser.id;

    const entity = await this.usersService.findOne({ where: { id: userId } });

    const { currentPassword, newPassword } = changePasswordDto;

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      entity.password,
    );
    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        password: 'incorrectPassword',
      });
    }

    await this.usersService.update(userId, {
      password: await bcrypt.hash(newPassword, 10),
    });

    return { message: 'Password change successfully! You can now log in.' };
  }
}
