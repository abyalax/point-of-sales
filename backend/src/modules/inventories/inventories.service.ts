import { Inject, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { REPOSITORY } from '~/common/constants/database';

@Injectable()
export class InventoriesService {
  constructor(
    @Inject(REPOSITORY.INVENTORY)
    private readonly inventoriesRepository: Repository<Inventory>,
  ) {}
  create(createInventoryDto: CreateInventoryDto) {
    return this.inventoriesRepository.save(createInventoryDto);
  }

  async findAll(): Promise<Inventory[]> {
    return await this.inventoriesRepository.find();
  }

  findOne(id: number) {
    return this.inventoriesRepository.findOneBy({ id });
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return this.inventoriesRepository.update(id, updateInventoryDto);
  }

  remove(id: number) {
    return this.inventoriesRepository.delete(id);
  }
}
