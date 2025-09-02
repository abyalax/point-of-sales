import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { TResponse } from '~/common/types/response';
import { Supplier } from './entities/supplier.entity';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto): Promise<TResponse<Supplier>> {
    const data = await this.supplierService.create(createSupplierDto);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<TResponse<Supplier[]>> {
    const data = await this.supplierService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('ids')
  async getIds(): Promise<TResponse<number[]>> {
    const data = await this.supplierService.getIds();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TResponse<Supplier>> {
    const data = await this.supplierService.findOne(Number(id));
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto): Promise<TResponse<boolean>> {
    const data = await this.supplierService.update(Number(id), updateSupplierDto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TResponse<boolean>> {
    const data = await this.supplierService.remove(Number(id));
    return {
      statusCode: HttpStatus.NO_CONTENT,
      data,
    };
  }
}
