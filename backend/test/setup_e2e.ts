import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { App } from 'supertest/types';
import { AppModule } from '~/app.module';
import { CREDENTIALS } from '~/common/constants/credential';

export const setupApplication = async (): Promise<[INestApplication, TestingModule]> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app: INestApplication<App> = moduleFixture.createNestApplication();
  app.use(cookieParser(CREDENTIALS.COOKIE_SECRET));
  await app.init();
  return [app, moduleFixture];
};
