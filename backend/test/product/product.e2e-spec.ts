import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import * as request from 'supertest';
import { App } from 'supertest/types';

import { setupApplication } from '~/test/setup_e2e';
import { ProductDto } from '~/modules/product/dto/product.dto';
import { EProductStatus } from '~/modules/product/product.interface';
import { USER } from '~/test/common/constant';
import { extractHttpOnlyCookie } from '~/test/utils';

describe('Product Module', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  describe('Response Success', () => {
    let access_token: string;
    let refresh_token: string;

    beforeEach(async () => {
      const credentials = {
        email: USER.LOGIN.email,
        password: USER.LOGIN.password,
      };
      const res = await request(app.getHttpServer()).post('/auth/login').send(credentials);

      expect(res.headers['set-cookie']).toBeDefined();
      const cookies = res.headers['set-cookie'];
      access_token = extractHttpOnlyCookie('access_token', cookies) ?? '';
      refresh_token = extractHttpOnlyCookie('refresh_token', cookies) ?? '';
    });

    test('Test Token Cookie for Request', async () => {
      expect(refresh_token).toBeDefined();
      expect(access_token).toBeDefined();

      return await request(app.getHttpServer())
        .get('/products/1')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
    });

    test('GET /products/:id', async () => {
      return request(app.getHttpServer())
        .get('/products/1')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 200,
              data: expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(String),
                stock: expect.any(Number),
              }),
            }),
          );
        });
    });

    test('GET /products', async () => {
      return request(app.getHttpServer())
        .get('/products')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect((res) => {
          const items: ProductDto[] = res.body.data.data as ProductDto[];
          const item: ProductDto = items[0];

          // Check first item structure
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('name');
          expect(item).toHaveProperty('price');
          expect(item).toHaveProperty('stock');

          // Validate data types
          expect(typeof item.id).toBe('number');
          expect(typeof item.name).toBe('string');
          expect(typeof item.price).toBe('string');
          expect(typeof item.stock).toBe('number');

          // Optional: Check specific data if needed
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 200,
              data: {
                data: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(String),
                    stock: expect.any(Number),
                  }),
                ]),
                meta: expect.any(Object),
              },
            }),
          );
        });
    });

    test('POST /products', async () => {
      const product = {
        name: faker.commerce.productName(),
        price: faker.commerce.price({ min: 5000, max: 1000000 }).toString(),
        status: EProductStatus.AVAILABLE,
        stock: faker.number.int({ min: 0, max: 300 }),
        category: faker.commerce.product(),
      };
      return request(app.getHttpServer())
        .post('/products')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .send(product)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: HttpStatus.CREATED,
              data: expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(String),
                stock: expect.any(Number),
              }),
            }),
          );
        });
    });

    test('PATCH /products/:id', async () => {
      const product = {
        name: faker.commerce.productName(),
        price: faker.commerce.price({ min: 5000, max: 1000000 }).toString(),
        status: EProductStatus.AVAILABLE,
        stock: faker.number.int({ min: 0, max: 300 }),
        category: faker.commerce.product(),
      };
      return request(app.getHttpServer())
        .patch('/products/3')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .send(product)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: HttpStatus.OK,
              data: true,
            }),
          );
        });
    });

    test('DELETE /products/:id', async () => {
      let countData = 0;
      await request(app.getHttpServer())
        .get('/products')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect((res) => {
          countData = res.body.data.data.length;
        });

      const id = faker.number.int({ min: 1, max: countData });

      return request(app.getHttpServer())
        .delete(`/products/${id}`)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: expect.any(Number),
              data: expect.any(Boolean),
            }),
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
