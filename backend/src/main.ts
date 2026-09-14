import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser = require('cookie-parser');
import { NestFactory } from '@nestjs/core';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

import { GlobalExceptionFilter } from './common/filters/global.filter';
import { AppModule } from './app.module';
import { CookieConfig } from './infrastructure/config/cookie.config';
import { configDotenv } from 'dotenv';
import { HttpConfig } from './infrastructure/config/http.config';

configDotenv();
let port: number;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupGracefulShutdown({ app });

  const configService = app.get(ConfigService);
  const cookieConfig = configService.get<CookieConfig>('cookie')!;
  const httpConfig = configService.get<HttpConfig>('http')!;
  const envPort = Number(process.env.PORT);

  port = configService.get<number>('port') ?? envPort;

  app.use(cookieParser(cookieConfig.secret));
  app.useGlobalFilters(app.get(GlobalExceptionFilter));
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
    origin: httpConfig.cors.split(',').map((o) => o.trim()),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.enableShutdownHooks();

  await app.listen(port);
}

bootstrap()
  .then(() => {
    const logger = new Logger('Bootstrap');
    logger.log(`Application running on http://localhost:${port}`);
  })
  .catch((err) => {
    const logger = new Logger('Bootstrap');
    logger.error(err);
  });
