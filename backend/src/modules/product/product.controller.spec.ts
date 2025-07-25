import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { REPOSITORY } from '~/common/constants/database';
import { AuthModule } from '../auth/auth.module';
import { mockRepository } from '~/test/common/mock';

describe('ProductController', () => {
  let controller: ProductController;

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

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
