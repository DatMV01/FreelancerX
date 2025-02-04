import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appConfig, { AppConfig, Environment } from 'src/config/app.config';
import {
  APP_CONFIG_REGISTER,
  DATABASE_CONFIG_REGISTER,
} from 'src/config/config.type';
import { getMetadataArgsStorage } from 'typeorm';
import typeormConfig, { TypeORMConfig } from './typeorm.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [appConfig, typeormConfig] })], // Ensure ConfigModule has been already loadded .env file
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get(DATABASE_CONFIG_REGISTER, {
          infer: true,
        }) as TypeORMConfig;

        const appConfig = configService.get(APP_CONFIG_REGISTER, {
          infer: true,
        }) as AppConfig;

        const options: TypeOrmModuleOptions = {
          type: databaseConfig.type as any,
          url: databaseConfig.url,
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.name,
          synchronize: databaseConfig.synchronize,
          dropSchema: databaseConfig.dropSchema,
          logging: appConfig.apiPrefix !== Environment.Production,
          logger: 'advanced-console',
          // autoLoadEntities: true,
          // entities: [RoleEntity],
          // entities: [join(process.cwd(), 'src', '**', '*.entity.{.ts,.js}')],
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          poolSize: databaseConfig.maxConnections,
          extra: {
            // based on https://node-postgres.com/apis/pool
            // max postgres connection pool size
            // max: databaseConfig.maxConnections,

            // max mysql connection pool size
            // connectionLimit: databaseConfig.maxConnections,
            ssl: databaseConfig.sslEnabled
              ? {
                  rejectUnauthorized: databaseConfig.rejectUnauthorized,
                  ca: databaseConfig.ca ?? undefined,
                  key: databaseConfig.key ?? undefined,
                  cert: databaseConfig.cert ?? undefined,
                }
              : undefined,
          },
        };

        console.log('====================================');
        console.log(`DatabaseConfig:`);
        console.log(databaseConfig);

        console.log(`AppConfig:`);
        console.log(appConfig);

        console.log(`Migrations:`);
        console.log(options.migrations);

        console.log(`Entites:`);
        console.log(options.entities);
        console.log('====================================');

        return options;
      },
    }),
  ],
})
export class TypeORMModule {}
