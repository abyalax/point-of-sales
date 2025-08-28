import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { REPOSITORY } from '~/common/constants/database';
import { mockRepository } from '~/test/common/mock';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

import jwtConfig, { JwtConfig } from '~/config/jwt.config';
import databaseConfig from '~/config/database.config';
import cookieConfig from '~/config/cookie.config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig, jwtConfig, cookieConfig],
        }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const jwt = configService.get<JwtConfig>('jwt')!;
            return {
              secret: jwt.secret,
              privateKey: jwt.private_key,
              publicKey: jwt.public_key,
            };
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: REPOSITORY.USER,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
