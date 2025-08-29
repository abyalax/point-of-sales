import { Inject, Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { REPOSITORY } from '~/common/constants/database';

@Injectable()
export class PurchaseService {
  constructor(
    @Inject(REPOSITORY.PURCHASE_ORDER)
    private readonly purchaseRepository: Repository<PurchaseOrder>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    return await this.purchaseRepository.save(createPurchaseDto);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return await this.purchaseRepository.find();
  }

  async findOne(id: number) {
    return await this.purchaseRepository.findOneBy({ id });
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return await this.purchaseRepository.update(id, updatePurchaseDto);
  }

  async remove(id: number) {
    return await this.purchaseRepository.delete(id);
  }
}
