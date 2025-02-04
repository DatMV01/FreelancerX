import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeORMModule } from './modules/database/typeorm/typeorm.module';
import typeormConfig from './modules/database/typeorm/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    TypeORMModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
