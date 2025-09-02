import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { extractHttpOnlyCookie } from '../utils';
import { setupApplication } from '../setup_e2e';

const USER = {
  email: 'abyaadmin@gmail.com',
  password: 'password',
};

describe('Module Purchase', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  describe('Response Success', () => {
    let access_token: string;
    let refresh_token: string;
    let supplierIds: number[] = [];
    let productIds: number[] = [];

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

      await request(app.getHttpServer())
        .get('/suppliers/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          supplierIds = res.body.data;
          expect(supplierIds).toBeDefined();
        });

      await request(app.getHttpServer())
        .get('/products/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          productIds = res.body.data;
          expect(productIds).toBeDefined();
        });
    });

    test('GET /purchases', () => {
      console.log("test purchase doe'snt finished yet");
    });

    // test('GET /purchases/:id', async () => {});

    // test('POST /purchases', async () => {});

    // test('PUT /purchases/:id', async () => {});

    // test('DELETE /purchases/:id', async () => {});

    // test('GET /purchases/ids', async () => {});
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
