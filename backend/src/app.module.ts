import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { DataBaseModule } from './database/database.module';
import typeormConfig from './database/typeorm/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import authConfig from './modules/auth/config/auth.config';
import { CategoryModule } from './modules/category/category.module';
import fileConfig from './modules/files/config/file.config';
import { FileModule } from './modules/files/file.module';
import { FreelancerModule } from './modules/freelancer/freelancer.module';
import { GigModule } from './modules/gig/gig.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { RoleModule } from './modules/role/role.module';
import { SessionModule } from './modules/session/session.module';
import { StatusModule } from './modules/status/status.module';
import { UserModule } from './modules/user/user.module';
import { MailModule } from './modules/mail/mail.module';
import { StripeModule } from './stripe/stripe.module';
import mailConfig from './modules/mail/config/mail.config';
import { ScheduleModule } from '@nestjs/schedule';
import { GigReviewModule } from './modules/gigreview/gigreview.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { SupportModule } from './modules/support/support.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig, fileConfig, authConfig, mailConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/public',
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug', // hoặc 'trace'
        transport: {
          target: 'pino-pretty', // giúp dễ đọc
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: true,
          },
        },
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              headers: req.headers,
              query: req.query,
              params: req.params,
              body: req.body,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
              // res.body không có sẵn trừ khi custom lại
            };
          },
        },
        customLogLevel(req, res, err) {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
        customSuccessMessage(req, res) {
          return `${req.method} ${req.url} - ${res.statusCode}`;
        },
        customErrorMessage(req, res, err) {
          return `Request errored: ${req.method} ${req.url} - ${err?.message}`;
        },
        genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
      },
    }),
    ScheduleModule.forRoot(),
    DataBaseModule,
    RoleModule,
    StatusModule,
    FileModule,
    AuthModule,
    SessionModule,
    UserModule,
    AuthModule,
    GigModule,
    OrderModule,
    WalletModule,
    CategoryModule,
    NotificationModule,
    FreelancerModule,
    MailModule,
    StripeModule,
    GigReviewModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
