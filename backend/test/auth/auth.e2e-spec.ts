import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupApplication } from '~/test/setup_e2e';
import { RoleDto } from '~/modules/auth/dto/role/get-role.dto';
import { validateDto } from '../common/helper';
import { SignUpDto } from '~/modules/auth/dto/sign-up.dto';

const USER = {
  email: 'abyaadmin@gmail.com',
  password: 'password',
};

describe('Module Authentication', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    [app, moduleFixture] = await setupApplication();
  });

  test('POST /auth/login', async () => {
    const credentials = {
      email: USER.email,
      password: USER.password,
    };

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(HttpStatus.ACCEPTED)
      .expect((response) => {
        if (response.status === 500) {
          console.error('❌ Internal server error details:', response.body);
        }
      });

    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: HttpStatus.ACCEPTED,
        data: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          roles: expect.arrayContaining<RoleDto>([]),
          permissions: expect.arrayContaining<string>([]),
        }),
      }),
    );
  });

  test('POST /auth/register', async () => {
    const name = faker.person.fullName();
    const [firstName, lastName] = name.toLowerCase().split(' ');
    const email = faker.internet.email({
      firstName,
      lastName,
    });

    const credentials = {
      name,
      email,
      password: USER.password,
    };

    const validated = await validateDto(SignUpDto, credentials);
    const res = await request(app.getHttpServer()).post('/auth/register').send(validated).expect(HttpStatus.CREATED);

    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: HttpStatus.CREATED,
        data: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          roles: expect.arrayContaining<RoleDto>([]),
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
