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
import * as mysql from 'mysql2/promise';
import { consoleSuccess } from 'src/utils/common';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [appConfig, typeormConfig] })], // Ensure ConfigModule has been already loadded .env file
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = (await configService.get(
          DATABASE_CONFIG_REGISTER,
          {
            infer: true,
          },
        )) as TypeORMConfig;

        const appConfig = (await configService.get(APP_CONFIG_REGISTER, {
          infer: true,
        })) as AppConfig;

        if (!databaseConfig) {
          throw new Error('Database configuration is missing!');
        }

        await ensureDatabaseExists(databaseConfig);

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
        consoleSuccess('Database Configuration:', databaseConfig);
        consoleSuccess('App Configuration:', appConfig);
        consoleSuccess('Entities:', options.entities);
        consoleSuccess('Migrations:', options.migrations);

        return options;
      },
    }),
  ],
})
export class TypeORMModule {}

async function ensureDatabaseExists(databaseConfig: TypeORMConfig) {
  const connection = await mysql.createConnection({
    host: databaseConfig.host || 'localhost',
    port: Number(databaseConfig.port) || 3306,
    user: databaseConfig.username || 'root',
    password: databaseConfig.password || 'admin',
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${databaseConfig.name || 'freelancerx'}\``,
  );

  await connection.end();

  consoleSuccess(
    'Connection status',
    `Database "${databaseConfig.name || 'freelancerx'}" is ready.`,
  );
}
