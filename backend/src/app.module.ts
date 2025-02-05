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
import fileConfig from './modules/files/config/file.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig, fileConfig],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
