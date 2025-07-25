import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { GlobalExceptionFilter } from './common/filters/global';
import { AppModule } from './app.module';
import { CREDENTIALS } from './common/constants/credential';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalException = new GlobalExceptionFilter();

  app.use(cookieParser(CREDENTIALS.COOKIE_SECRET));
  app.useGlobalFilters(globalException);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        excludeExtraneousValues: true,
      },
    }),
  );
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => console.log('Server started'))
  .catch((err) => console.log(err));
