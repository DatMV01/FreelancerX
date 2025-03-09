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
import { RolesModule } from './modules/roles/roles.module';
import { StatusModule } from './modules/status/status.module';
import { FilesModule } from './modules/files/files.module';
import { AuthModule } from './modules/auth/auth.module';
import fileConfig from './modules/files/config/file.config';
import { SessionModule } from './modules/session/session.module';
import { UsersModule } from './modules/users/users.module';
import { GigModule } from './modules/gig/gig.module';
import { ReviewModule } from './modules/review/review.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderdetailModule } from './modules/orderdetail/orderdetail.module';
import { OrderModule } from './modules/order/order.module';
import { CategoryModule } from './modules/category/category.module';
import { NotificationModule } from './modules/notification/notification.module';
import authConfig from './modules/auth/config/auth.config';
import { RatingModule } from './modules/rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig, fileConfig, authConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    DataBaseModule,
    RolesModule,
    StatusModule,
    FilesModule,
    AuthModule,
    SessionModule,
    UsersModule,
    AuthModule,
    GigModule,
    OrderModule,
    OrderdetailModule,
    PaymentModule,
    ReviewModule,
    CategoryModule,
    NotificationModule,
    RatingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
