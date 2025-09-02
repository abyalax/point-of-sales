import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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

  async getIds(): Promise<number[]> {
    const rows = await this.supplierRepository.query<{ id: string }[]>(`SELECT id FROM suppliers;`);
    return rows.map((row) => Number(row.id));
  }

  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find();
  }

  async findOne(id: number): Promise<Supplier> {
    const find = await this.supplierRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Supplier not found');
    return find;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<boolean> {
    const updated = await this.supplierRepository.update(id, updateSupplierDto);
    if (updated.affected === 0) throw new UnprocessableEntityException('Failed to Update Supplier');
    return true;
  }

  async remove(id: number): Promise<boolean> {
    const deleted = await this.supplierRepository.delete(id);
    if (deleted.affected == 0) throw new UnprocessableEntityException('Failed to Delete Supplier');
    return true;
  }
}
