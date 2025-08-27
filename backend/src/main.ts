import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { GlobalExceptionFilter } from './common/filters/global.filter';
import { AppModule } from './app.module';
import { CREDENTIALS } from './common/constants/credential';

const port = process.env.PORT ?? 3000;

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
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(port);
}

bootstrap()
  .then(() => console.log(`Application running on http://localhost:${port}`))
  .catch((err) => console.log(err));
