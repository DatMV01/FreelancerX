import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt-access.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AutoMapper } from '../base/mapper/mapper';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UserModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    SessionService,
    UserService,
    AutoMapper,
  ],
  exports: [AuthService],
})
export class AuthModule {}
