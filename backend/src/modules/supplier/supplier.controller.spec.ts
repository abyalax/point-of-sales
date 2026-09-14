import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { SupplierController } from './supplier.controller';
import jwtConfig, { JwtConfig } from '~/infrastructure/config/jwt.config';
import { REPOSITORY } from '~/common/constants/database';
import databaseConfig from '~/infrastructure/config/database.config';
import { SupplierService } from './supplier.service';
import { mockRepository } from '~/test/common/mock';
import cookieConfig from '~/infrastructure/config/cookie.config';

describe('SupplierController', () => {
  let controller: SupplierController;

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
      controllers: [SupplierController],
      providers: [
        SupplierService,
        {
          provide: REPOSITORY.SUPPLIER,
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
