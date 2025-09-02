import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { extractHttpOnlyCookie } from '../utils';
import { setupApplication } from '../setup_e2e';
import { QueryInventoryDto } from '~/modules/inventories/dto/query-inventory.dto';
import { validateSchema } from '~/common/helpers/validation';
import { BaseInventorySchema, InventorySchema } from '~/modules/inventories/inventories.schema';
import { CreateInventoryDto } from '~/modules/inventories/dto/create-inventory.dto';
import { UpdateInventoryDto } from '~/modules/inventories/dto/update-inventory.dto';

const USER = {
  email: 'abyaadmin@gmail.com',
  password: 'password',
};

describe('Module Inventories', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  describe('Response Success', () => {
    let access_token: string;
    let refresh_token: string;
    let inventoryIds: number[] = [];
    let productIds: number[] = [];
    let supplierIds: number[] = [];

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
        .get('/products/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          productIds = res.body.data[0];
          expect(productIds).toBeDefined();
        });

      await request(app.getHttpServer())
        .get('/inventories/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          inventoryIds = res.body.data[0];
          expect(inventoryIds).toBeDefined();
        });

      await request(app.getHttpServer())
        .get('/suppliers/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          supplierIds = res.body.data[0];
          expect(supplierIds).toBeDefined();
        });
    });

    test('GET /inventories + QueryInventoryDto', async () => {
      const query: QueryInventoryDto = { page: 1, per_page: 2, min_stock: 20, max_stock: 100 };
      const res = await request(app.getHttpServer())
        .get('/inventories')
        .query(query)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);

      const data = await res.body.data.data[0];
      const validated = await validateSchema(InventorySchema, data);
      expect(validated).toBeDefined();
    });

    test('GET /inventories/:id', async () => {
      if (inventoryIds.length > 0) {
        const inventoryId = inventoryIds[0];
        const res = await request(app.getHttpServer())
          .get(`/inventories/${inventoryId}`)
          .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
          .expect(200);

        const data = await res.body.data;
        expect(data).toBeDefined();
      }
    });

    test('POST /inventories', async () => {
      const payload: CreateInventoryDto = {
        product_id: productIds[Math.floor(Math.random() * productIds.length)] ?? 1,
        min_stock: 20,
        max_stock: 100,
        stock: 30,
        barcode: '889012380123',
        supplier_id: supplierIds[Math.floor(Math.random() * supplierIds.length)] ?? 1,
      };
      const res = await request(app.getHttpServer())
        .post('/inventories')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .send(payload)
        .expect(201);

      const data = await res.body.data;
      const validated = await validateSchema(BaseInventorySchema, data);
      expect(validated).toBeDefined();
    });

    test('PATCH /inventories/:id', async () => {
      if (inventoryIds.length > 0) {
        const inventoryId = inventoryIds.at(-1);
        const payload: UpdateInventoryDto = {
          min_stock: Math.floor(Math.random() * (50 - 10 + 1) + 10),
          max_stock: Math.floor(Math.random() * (100 - 50 + 1) + 50),
          stock: Math.floor(Math.random() * (100 - 50 + 1) + 50),
        };
        await request(app.getHttpServer())
          .patch(`/inventories/${inventoryId}`)
          .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
          .send(payload)
          .expect(200);
      }
    });

    test('DELETE /inventories/:id', async () => {
      if (inventoryIds.length > 0) {
        const inventoryId = inventoryIds.at(-1);
        await request(app.getHttpServer())
          .delete(`/inventories/${inventoryId}`)
          .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
          .expect(204);
      }
    });
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
