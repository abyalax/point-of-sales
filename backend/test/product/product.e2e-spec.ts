import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';
import { App } from 'supertest/types';
import * as request from 'supertest';

import type { PayloadProductDto } from '~/modules/product/dto/payload-product.dto';
import { EProductStatus } from '~/modules/product/product.schema';
import { ProductDto } from '~/modules/product/dto/product.dto';
import { extractHttpOnlyCookie } from '~/test/utils';
import { setupApplication } from '~/test/setup_e2e';
import { validateDto } from '../common/helper';

const USER = {
  email: 'abyaadmin@gmail.com',
  password: 'password',
};

describe('Module Product', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  describe('Response Success', () => {
    let access_token: string;
    let refresh_token: string;
    let ids: number[] = [];
    let newProduct: ProductDto | undefined = undefined;

    beforeEach(async () => {
      const credentials = {
        email: USER.email,
        password: USER.password,
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

    test('POST Test Token Cookie for Request', async () => {
      expect(refresh_token).toBeDefined();
      expect(access_token).toBeDefined();

      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];

      await request(app.getHttpServer())
        .get('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
    });

    test('GET /products/:id', async () => {
      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];
      const res = await request(app.getHttpServer())
        .get('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);

      const validData = await res.body.data;
      const result = await validateDto(ProductDto, validData);
      expect(result).toBeInstanceOf(ProductDto);
    });

    test('GET /products/search', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/search/?page=1&per_page=2&engine=server_side')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`);

      const body = await res.body;
      const data = body.data.data[0];
      const result = await validateDto(ProductDto, data);
      expect(result).toBeInstanceOf(ProductDto);

      const meta = await res.body.data.meta;
      expect(meta).toEqual(
        expect.objectContaining({
          page: expect.anything(),
          per_page: expect.anything(),
          total_count: expect.anything(),
          total_pages: expect.anything(),
        }),
      );
    });

    test('POST /products', async () => {
      let category: string = '';
      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];
      const fetchProductByID = await request(app.getHttpServer())
        .get('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);

      category = fetchProductByID.body.data.category.name;

      const price = parseInt(faker.commerce.price({ min: 5000, max: 1000000 }));
      const product: PayloadProductDto = {
        name: faker.commerce.productName(),
        barcode: `89910011012${faker.number.int({ min: 64, max: 99 })}`,
        price: price.toString(),
        cost_price: faker.commerce.price({ min: price - 5000, max: price }).toString(),
        tax_rate: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }).toString(),
        discount: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }).toString(),
        status: EProductStatus.AVAILABLE,
        stock: faker.number.int({ min: 1, max: 300 }),
        category,
      };
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .send(product);

      const validData = await res.body.data;
      const result = await validateDto(ProductDto, validData);
      expect(result).toBeInstanceOf(ProductDto);
      newProduct = await res.body.data;
    });

    test('PATCH /products/:id', async () => {
      let category: string = '';
      console.log('PATCH product id: ', newProduct?.id);
      const id = newProduct?.id;
      if (!id) {
        console.log('ID Product not found');
        return;
      }
      const fetchProductByID = await request(app.getHttpServer())
        .get('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
      category = fetchProductByID.body.data.category.name;

      const product = {
        id,
        name: faker.commerce.productName(),
        price: faker.commerce.price({ min: 5000, max: 1000000 }).toString(),
        status: EProductStatus.AVAILABLE,
        stock: faker.number.int({ min: 0, max: 300 }),
        category,
      };
      await request(app.getHttpServer())
        .patch('/products/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .send(product)
        .expect(HttpStatus.NO_CONTENT);
    });

    test('DELETE /products/:id', async () => {
      console.log('DELETE product id: ', newProduct?.id);
      const id = newProduct?.id;
      if (!id) {
        console.log('ID Product not found');
        return;
      }
      await request(app.getHttpServer())
        .delete(`/products/${id}`)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
