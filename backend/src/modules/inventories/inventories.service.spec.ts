import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import jwtConfig, { JwtConfig } from '~/infrastructure/config/jwt.config';
import { InventoriesService } from './inventories.service';
import { REPOSITORY } from '~/common/constants/database';
import databaseConfig from '~/infrastructure/config/database.config';
import { mockRepository } from '~/test/common/mock';
import cookieConfig from '~/infrastructure/config/cookie.config';

describe('InventoriesService', () => {
  let service: InventoriesService;

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
        InventoriesService,
        {
          provide: REPOSITORY.INVENTORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InventoriesService>(InventoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
