import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { REPOSITORY } from '~/common/constants/database';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @Inject(REPOSITORY.SUPPLIER)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    return await this.supplierRepository.save(createSupplierDto);
  }

  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find();
  }

  async findOne(id: number): Promise<Supplier> {
    const find = await this.supplierRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Supplier not found');
    return find;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return await this.supplierRepository.update(id, updateSupplierDto);
  }

  async remove(id: number) {
    return await this.supplierRepository.delete(id);
  }
}
