import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import jwtConfig, { JwtConfig } from '~/config/jwt.config';
import { REPOSITORY } from '~/common/constants/database';
import databaseConfig from '~/config/database.config';
import { PurchaseService } from './purchase.service';
import { mockRepository } from '~/test/common/mock';
import cookieConfig from '~/config/cookie.config';

describe('PurchaseService', () => {
  let service: PurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
      providers: [
        PurchaseService,
        {
          provide: REPOSITORY.PURCHASE_ORDER,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
