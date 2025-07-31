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
import { PayloadProductDto } from '~/modules/product/dto/payload-product.dto';

describe('Product Module', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  describe('Response Success', () => {
    let access_token: string;
    let refresh_token: string;
    let ids: number[] = [];

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

      await request(app.getHttpServer())
        .get('/products/ids')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          ids = res.body.data;
        });
    });

    test('Test Token Cookie for Request', async () => {
      expect(refresh_token).toBeDefined();
      expect(access_token).toBeDefined();

      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];

      return await request(app.getHttpServer())
        .get('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
    });

    test('GET /products/:id', async () => {
      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];
      return request(app.getHttpServer())
        .get('/products/' + id)
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
                barcode: expect.any(String),
                cost_price: expect.any(String),
                discount: expect.any(String),
                status: expect.any(String),
                tax_rate: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              } as ProductDto),
            }),
          );
        });
    });

    test('GET /products', async () => {
      return request(app.getHttpServer())
        .get('/products')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 200,
              data: expect.arrayContaining([
                expect.objectContaining({
                  barcode: expect.any(String),
                  id: expect.any(Number),
                  name: expect.any(String),
                  price: expect.any(String),
                  stock: expect.any(Number),
                  cost_price: expect.any(String),
                  discount: expect.any(String),
                  status: expect.any(String),
                  tax_rate: expect.any(String),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  category: expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                } as ProductDto),
              ]),
            }),
          );
        });
    });

    test('GET /products/search', async () => {
      return request(app.getHttpServer())
        .get('/products/search')
        .query({ page: 1, per_page: 10, engine: 'server_side' })
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 200,
              data: expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    barcode: expect.any(String),
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(String),
                    stock: expect.any(Number),
                    cost_price: expect.any(String),
                    discount: expect.any(String),
                    status: expect.any(String),
                    tax_rate: expect.any(String),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    category: expect.objectContaining({
                      id: expect.any(Number),
                      name: expect.any(String),
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                    }),
                  } as ProductDto),
                ]),
                meta: expect.objectContaining({
                  page: expect.any(String),
                  per_page: expect.any(String),
                  total_count: expect.any(Number),
                  total_pages: expect.any(Number),
                }),
              }),
            }),
          );
        });
    });

    test('POST /products', async () => {
      let category: string = '';
      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];
      await request(app.getHttpServer())
        .get('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          category = res.body.data.category.name;
          return res;
        });
      const price = parseInt(faker.commerce.price({ min: 5000, max: 1000000 }));
      const product: PayloadProductDto = {
        name: faker.commerce.productName(),
        barcode: `89910011012${faker.number.int({ min: 64, max: 99 })}`,
        price: price.toString(),
        cost_price: faker.commerce.price({ min: price - 50000, max: price }).toString(),
        tax_rate: faker.number.float({ min: 0, max: 10 }).toString(),
        discount: faker.number.float({ min: 0, max: 10 }).toString(),
        status: EProductStatus.AVAILABLE,
        stock: faker.number.int({ min: 1, max: 300 }),
        category,
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
                barcode: expect.any(String),
                cost_price: expect.any(String),
                discount: expect.any(String),
                status: expect.any(String),
                tax_rate: expect.any(String),
                category: expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String),
                }),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              } as ProductDto),
            }),
          );
        });
    });

    test('PATCH /products/:id', async () => {
      let category: string = '';
      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];
      await request(app.getHttpServer())
        .get('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200)
        .expect((res) => {
          category = res.body.data.category.name;
          return res;
        });

      const product = {
        id,
        name: faker.commerce.productName(),
        price: faker.commerce.price({ min: 5000, max: 1000000 }).toString(),
        status: EProductStatus.AVAILABLE,
        stock: faker.number.int({ min: 0, max: 300 }),
        category,
      };
      return request(app.getHttpServer())
        .patch('/products/' + id)
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
      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];

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
