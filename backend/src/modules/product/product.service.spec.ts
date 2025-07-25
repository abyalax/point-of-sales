import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { REPOSITORY } from '~/common/constants/database';
import { AuthModule } from '../auth/auth.module';
import { mockRepository } from '~/test/common/mock';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: REPOSITORY.PRODUCT,
          useValue: mockRepository,
        },
        {
          provide: REPOSITORY.CATEGORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
