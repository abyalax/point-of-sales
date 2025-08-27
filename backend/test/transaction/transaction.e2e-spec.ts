import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { ReportSalesSchema, SalesByCategorySchema } from '~/modules/transaction/transaction.schema';
import { generateMockCart } from '~/infrastructure/database/mock/transactions/carts.mock';
import { TransactionDto } from '~/modules/transaction/dto/transaction.dto';
import { ProductService } from '~/modules/product/product.service';
import { validateDto, validateSchema } from '../common/helper';
import { extractHttpOnlyCookie } from '~/test/utils';
import { setupApplication } from '~/test/setup_e2e';

const USER = {
  email: 'abyakasir@gmail.com',
  password: 'password',
};

describe('Module Transaction', () => {
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
        email: USER.email,
        password: USER.password,
      };
      const res = await request(app.getHttpServer()).post('/auth/login').send(credentials);

      expect(res.headers['set-cookie']).toBeDefined();
      const cookies = res.headers['set-cookie'];
      access_token = extractHttpOnlyCookie('access_token', cookies) ?? '';
      refresh_token = extractHttpOnlyCookie('refresh_token', cookies) ?? '';

      await request(app.getHttpServer())
        .get('/transaction/ids')
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
        .get('/transaction/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
    });

    test('GET /transaction/:id', async () => {
      const max = ids.length;
      const id = ids[Math.floor(Math.random() * max)];
      const res = await request(app.getHttpServer())
        .get('/transaction/' + id)
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
      const validData = await res.body.data;
      const result = await validateDto(TransactionDto, validData);
      expect(result).toBeInstanceOf(TransactionDto);
    });

    test('GET /transaction', async () => {
      const res = await request(app.getHttpServer())
        .get('/transaction')
        .query({ page: 1, per_page: 10, engine: 'server_side' })
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
      const data = await res.body.data.data;
      const transaction = data[0];
      const result = await validateDto(TransactionDto, transaction);
      expect(result).toBeInstanceOf(TransactionDto);
    });

    test('POST /transaction', async () => {
      const productService = app.get(ProductService);
      const products = await productService.getAll();
      const params = generateMockCart(products, 1, 5);
      const res = await request(app.getHttpServer())
        .post('/transaction')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .send(params)
        .expect(201);
      const validData = await res.body.data;
      const result = await validateDto(TransactionDto, validData);
      expect(result).toBeInstanceOf(TransactionDto);
    });

    test('GET /transaction/sales', async () => {
      const res = await request(app.getHttpServer())
        .get('/transaction/sales')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
      const data = await res.body.data;
      const validate = validateSchema(ReportSalesSchema, data);
      expect(validate).toBeDefined();
    });

    test('GET /transaction/sales with params', async () => {
      const res = await request(app.getHttpServer())
        .get('/transaction/sales?year=2024&month=5')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
      const data = await res.body.data;
      const validate = validateSchema(ReportSalesSchema, data);
      expect(validate).toBeDefined();
    });

    test('GET /transaction/sales/month/:year', async () => {
      const res = await request(app.getHttpServer())
        .get('/transaction/sales/month/2024')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
      const data = await res.body.data[0];
      const validate = validateSchema(ReportSalesSchema, data);
      expect(validate).toBeDefined();
    });

    test('GET /transaction/sales/category/:year', async () => {
      const res = await request(app.getHttpServer())
        .get('/transaction/sales/category/2024')
        .set('Cookie', `access_token=s%3A${encodeURIComponent(access_token)}`)
        .expect(200);
      const data = await res.body.data[0];
      const validate = validateSchema(SalesByCategorySchema, data);
      expect(validate).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
