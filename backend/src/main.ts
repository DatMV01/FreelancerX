import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { AllConfigType, APP_CONFIG_REGISTER } from './config/config.type';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<AllConfigType>);

  const appConfig = configService.get(APP_CONFIG_REGISTER as any, {
    infer: true,
  }) as AppConfig;

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.setGlobalPrefix(appConfig.apiPrefix, { exclude: ['/'] });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // const httpAdapterHost = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FreelancerX')
    .setDescription('FreelancerX Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();

  app.use(express.json({ limit: '10mb' })); // Handle large JSON bodies
  app.use(express.urlencoded({ limit: '10mb', extended: true })); // Handle large form data

  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
