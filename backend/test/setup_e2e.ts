import { NestExpressApplication } from '@nestjs/platform-express';
import { CREDENTIALS } from '~/common/constants/credential';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '~/app.module';
import { Server } from 'http';
import axios from 'axios';

let cachedApp: NestExpressApplication | null = null;
let cachedModule: TestingModule | null = null;

export const setupApplication = async (): Promise<[NestExpressApplication, TestingModule]> => {
  if (cachedApp && cachedModule) return [cachedApp, cachedModule];

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: NestExpressApplication = moduleFixture.createNestApplication();
  app.use(cookieParser(CREDENTIALS.COOKIE_SECRET));
  await app.init();

  const originalGetHttpServer = app.getHttpServer.bind(app) as () => Server;
  let useLocal = false;
  try {
    await axios.get('http://localhost:3000/health', { timeout: 500 });
    useLocal = true;
  } catch {
    useLocal = false;
  }

  app.getHttpServer = () => {
    if (useLocal) return 'http://localhost:3000' as unknown as Server;
    return originalGetHttpServer();
  };

  cachedApp = app;
  cachedModule = moduleFixture;
  return [app, moduleFixture];
};
