import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';

import { GlobalExceptionFilter } from './common/filters/global.filter';
import { AppModule } from './app.module';
import { CookieConfig } from './config/cookie.config';

let port: number;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalException = new GlobalExceptionFilter();

  const configService = app.get(ConfigService);
  const cookie = configService.get<CookieConfig>('cookie')!;
  port = configService.get<number>('port')!;

  app.use(cookieParser(cookie.secret));
  app.useGlobalFilters(globalException);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(port);
}

bootstrap()
  .then(() => console.log(`Application running on http://localhost:${port}`))
  .catch((err) => console.log(err));
