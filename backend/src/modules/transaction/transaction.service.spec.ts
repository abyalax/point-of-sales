import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { AuthModule } from '../auth/auth.module';
import { REPOSITORY } from '~/common/constants/database';
import { mockRepository } from '~/test/common/mock';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
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
