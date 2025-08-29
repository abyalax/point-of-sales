import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { PurchaseController } from './purchase.controller';
import jwtConfig, { JwtConfig } from '~/config/jwt.config';
import databaseConfig from '~/config/database.config';
import { PurchaseService } from './purchase.service';
import cookieConfig from '~/config/cookie.config';
import { REPOSITORY } from '~/common/constants/database';
import { mockRepository } from '~/test/common/mock';

describe('PurchaseController', () => {
  let controller: PurchaseController;

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
      controllers: [PurchaseController],
      providers: [
        PurchaseService,
        {
          provide: REPOSITORY.PURCHASE_ORDER,
          useValue: mockRepository,
        },
        {
          provide: REPOSITORY.PURCHASE_ORDER_ITEM,
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
