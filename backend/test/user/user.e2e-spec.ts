import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { extractHttpOnlyCookie } from '../utils';
import { setupApplication } from '../setup_e2e';

const USER = {
  email: 'abyakasir@gmail.com',
  password: 'password',
};

describe('Module User', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  describe('Response Success', () => {
    let access_token: string;
    let refresh_token: string;
    let userIds: number[] = [];

    beforeEach(async () => {
      const credentials = {
        email: USER.email,
        password: USER.password,
      };
      const res = await request(app.getHttpServer()).post('/auth/login').send(credentials);

      expect(res.headers['set-cookie']).toBeDefined();
      const cookies = res.headers['set-cookie'];
      access_token = extractHttpOnlyCookie('access_token', cookies);
      refresh_token = extractHttpOnlyCookie('refresh_token', cookies);

      expect(refresh_token).toBeDefined();
      expect(access_token).toBeDefined();

      // Get user IDs
      await request(app.getHttpServer())
        .get('/users/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          userIds = res.body.data;
          expect(userIds).toBeDefined();
        });
    });

    test('GET /users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);

      const data = res.body.data;
      if (data.length > 0) {
        const user = data[0];
        expect(user).toBeDefined();
      }
    });

    test('GET /users/:id', async () => {
      if (userIds.length > 0) {
        const userId = userIds[0];
        const res = await request(app.getHttpServer())
          .get(`/users/${userId}`)
          .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
          .expect(200);

        const data = res.body.data;
        expect(data).toBeDefined();
      }
    });

    // test('POST /users', async () => {});

    // test('PUT /users/:id', async () => {});

    // test('DELETE /users/:id', async () => {});

    test('GET /users/ids', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);

      const data = res.body.data;
      expect(Array.isArray(data)).toBe(true);
    });
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
