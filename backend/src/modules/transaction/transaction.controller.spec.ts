import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { REPOSITORY } from '~/common/constants/database';
import { mockRepository } from '~/test/common/mock';
import { AuthModule } from '../auth/auth.module';

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [TransactionController],
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

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
