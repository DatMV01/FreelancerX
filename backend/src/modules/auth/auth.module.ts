import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/service/session.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    //MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    SessionService,
    UsersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
