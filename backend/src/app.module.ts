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
import { RoleModule } from './modules/role/role.module';
import { StatusModule } from './modules/status/status.module';
import { FileModule } from './modules/files/file.module';
import { AuthModule } from './modules/auth/auth.module';
import fileConfig from './modules/files/config/file.config';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';
import { GigModule } from './modules/gig/gig.module';
import { ReviewModule } from './modules/review/review.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderdetailModule } from './modules/orderdetail/orderdetail.module';
import { OrderModule } from './modules/order/order.module';
import { CategoryModule } from './modules/category/category.module';
import { NotificationModule } from './modules/notification/notification.module';
import authConfig from './modules/auth/config/auth.config';
import { RatingModule } from './modules/rating/rating.module';
import { SellerModule } from './modules/seller/seller.module';

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
    RoleModule,
    StatusModule,
    FileModule,
    AuthModule,
    SessionModule,
    UserModule,
    AuthModule,
    GigModule,
    OrderModule,
    OrderdetailModule,
    PaymentModule,
    ReviewModule,
    CategoryModule,
    NotificationModule,
    RatingModule,
    SellerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
