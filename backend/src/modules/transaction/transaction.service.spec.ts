import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { TransactionService } from './transaction.service';
import { REPOSITORY } from '~/common/constants/database';
import { mockRepository } from '~/test/common/mock';
import { AuthModule } from '../auth/auth.module';

import jwtConfig, { JwtConfig } from '~/config/jwt.config';
import databaseConfig from '~/config/database.config';
import cookieConfig from '~/config/cookie.config';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
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
        TransactionService,
        {
          provide: REPOSITORY.TRANSACTION,
          useValue: mockRepository,
        },
        {
          provide: REPOSITORY.TRANSACTION_ITEM,
          useValue: mockRepository,
        },
        {
          provide: REPOSITORY.USER,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
